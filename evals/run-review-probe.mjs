#!/usr/bin/env node
// Run one frozen review regression; preserve raw output before manual scoring.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [skill, id, label] = process.argv.slice(2);
assert(["create-skill", "create-spec", "create-tasks"].includes(skill), "Choose an affected skill");
assert(/^[a-z0-9-]+$/.test(label ?? ""), "Provide a unique run label");
const skillDir = path.join(repo, "skills", skill);
const evalDir = path.join(skillDir, "evals");
const casesFile = path.join(evalDir, skill === "create-skill" ? "scope-cases.jsonl" : "cases.jsonl");
const testCase = fs.readFileSync(casesFile, "utf8").trim().split("\n").map(JSON.parse).find((item) => item.id === id);
assert(testCase?.assertions && !testCase.kind?.startsWith("trigger"), "Choose a behavior case");
const resultDir = path.join(evalDir, "results", "review-2026-09-04", label);
assert(!fs.existsSync(resultDir), "Refusing to overwrite evidence");
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "skill-review-probe-"));
fs.mkdirSync(resultDir, { recursive: true });
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const subjects = {};
const readSubject = (relative) => {
  const text = fs.readFileSync(path.join(skillDir, relative), "utf8");
  subjects[relative] = hash(text);
  return text;
};
let instruction = readSubject("SKILL.md");
if (skill === "create-skill") {
  instruction += `\n${readSubject("references/rules.md")}\n${readSubject("references/validation-checklist.md")}`;
  let candidate = fs.readFileSync(path.join(evalDir, testCase.fixture), "utf8");
  if (testCase.omit_boundary) candidate = candidate.replace(/^Do not use for active incident diagnosis\..*\n/m, "");
  instruction += `\n\nCandidate document:\n${candidate}`;
} else {
  if (fs.existsSync(path.join(skillDir, "references/artifacts.md"))) instruction += `\n${readSubject("references/artifacts.md")}`;
  if (skill === "create-tasks") {
    const target = path.join(workspace, "docs/specs");
    fs.mkdirSync(target, { recursive: true });
    fs.copyFileSync(path.join(evalDir, "fixtures/confirmed-spec/2026-07-28-saved-searches.md"), path.join(target, "2026-07-28-saved-searches.md"));
  } else if (testCase.fixture) fs.cpSync(path.join(evalDir, testCase.fixture), workspace, { recursive: true });
}
const task = `Apply the supplied skill to the request. Work only inside the current workspace. Do not use external services or other agents. Stop at the next user-input gate; do not invent user replies.\n\n${instruction}\n\nScenario:\n${testCase.setup ?? "Use the supplied fixture."}\n\nUser request:\n${testCase.request}`;
const snapshot = (destination) => fs.cpSync(workspace, destination, { recursive: true });
const save = (name, data) => fs.writeFileSync(path.join(resultDir, name), typeof data === "string" ? data : `${JSON.stringify(data, null, 2)}\n`);
save("prompt.md", task);
save("case.json", testCase);
snapshot(path.join(resultDir, "workspace-before"));
const args = ["exec", "-", "--ephemeral", "--ignore-user-config", "--json", "-m", "gpt-5.6-sol", "-c", 'model_reasoning_effort="medium"', "-s", "workspace-write", "--skip-git-repo-check", "-C", workspace];
save("manifest.json", { skill, case_id: id, subjects, cases_sha256: hash(fs.readFileSync(casesFile)), prompt_sha256: hash(task), runner_sha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))), harness_version: spawnSync("codex", ["--version"], { encoding: "utf8" }).stdout.trim(), args, observed_at: new Date().toISOString(), timeout_ms: 120000, claim: "One explicit-load regression on this route; no full-tier or autonomous-trigger claim. User config ignored; globally installed harness instructions may still load." });
const actor = spawnSync("codex", args, { cwd: workspace, input: task, encoding: "utf8", maxBuffer: 50 * 1024 * 1024, timeout: 120000 });
save("trace.jsonl", actor.stdout ?? "");
save("stderr.txt", actor.stderr ?? "");
snapshot(path.join(resultDir, "workspace-after"));
const events = (actor.stdout ?? "").split("\n").filter(Boolean).map((line) => JSON.parse(line));
const completed = events.findLast((event) => event.type === "turn.completed");
const output = events.filter((event) => event.type === "item.completed" && event.item?.type === "agent_message").map((event) => event.item.text).join("\n\n");
save("output.md", output);
save("result.json", { exit_code: actor.status, error: actor.error?.message ?? null, completed: Boolean(completed), usage: completed?.usage ?? null, output_sha256: hash(output), trace_sha256: hash(actor.stdout ?? ""), scoring: "UNSCORED" });
fs.rmSync(workspace, { recursive: true, force: true });
assert.equal(actor.status, 0, `Actor failed; evidence: ${resultDir}`);
assert(completed && output, `Incomplete actor; evidence: ${resultDir}`);
console.log(path.relative(repo, resultDir));
