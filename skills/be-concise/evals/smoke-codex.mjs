#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(root, "../../..");
const skillFile = path.resolve(root, "../SKILL.md");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "smoke-manifest.json"), "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
if (hash(skillFile) !== manifest.subject_sha256) throw new Error("Current SKILL.md does not match smoke-manifest.json");

const caseId = process.argv[process.argv.indexOf("--case") + 1];
const cases = fs.readFileSync(path.join(root, "smoke-cases.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
const testCase = cases.find((item) => item.id === caseId);
if (!testCase) throw new Error("Usage: node smoke-codex.mjs --case <smoke-case-id>");

const runDir = path.join(root, "smoke-results", manifest.subject_sha256.slice(0, 12), caseId);
if (fs.existsSync(runDir)) throw new Error(`Refusing to overwrite smoke evidence: ${runDir}`);
fs.mkdirSync(runDir, { recursive: true });
const isolatedHome = fs.mkdtempSync(path.join(os.tmpdir(), `be-concise-smoke-${caseId}-home-`));
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), `be-concise-smoke-${caseId}-work-`));
if (testCase.kind === "trigger") {
  const targetRoot = path.join(isolatedHome, ".agents", "skills");
  fs.mkdirSync(targetRoot, { recursive: true });
  for (const name of fs.readdirSync(path.join(repoRoot, "skills"))) {
    const source = path.join(repoRoot, "skills", name);
    if (fs.existsSync(path.join(source, "SKILL.md"))) fs.cpSync(source, path.join(targetRoot, name), { recursive: true });
  }
  fs.cpSync(path.join(root, "fixtures", "caveman"), path.join(targetRoot, "caveman"), { recursive: true });
}
const task = testCase.kind === "trigger"
  ? testCase.request
  : `Binding skill instructions follow. Apply them to the user request.\n\n${fs.readFileSync(skillFile, "utf8")}\n\nUser request:\n${testCase.request}`;
fs.writeFileSync(path.join(runDir, "prompt.md"), `${task}\n`);

const actor = spawnSync(
  "codex",
  ["exec", "-", "--ephemeral", "--ignore-user-config", "--json", "-m", manifest.model, "-c", 'model_reasoning_effort="medium"', "-s", "read-only", "--skip-git-repo-check", "-C", workspace],
  {
    cwd: workspace,
    env: { ...process.env, HOME: isolatedHome, CODEX_HOME: process.env.CODEX_HOME ?? path.join(os.homedir(), ".codex") },
    input: task,
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
    timeout: 300000,
  },
);
fs.writeFileSync(path.join(runDir, "trace.jsonl"), actor.stdout ?? "");
fs.writeFileSync(path.join(runDir, "stderr.txt"), actor.stderr ?? "");
if (actor.status !== 0) throw new Error(`Smoke actor failed with status ${actor.status}; evidence preserved in ${runDir}`);
const events = (actor.stdout ?? "").trim().split("\n").filter(Boolean).map(JSON.parse);
const output = events.filter((event) => event.type === "item.completed" && event.item?.type === "agent_message").map((event) => event.item.text).join("\n\n");
const usage = events.findLast((event) => event.type === "turn.completed")?.usage ?? {};
const commandText = events.filter((event) => event.item?.type === "command_execution").map((event) => event.item.command ?? "").join("\n");
const observedTrigger = testCase.kind === "trigger" ? /(?:^|[/\\])be-concise[/\\]SKILL\.md/.test(commandText) : null;
fs.writeFileSync(path.join(runDir, "output.md"), `${output}\n`);
const evidence = (name) => ({ path: path.relative(root, path.join(runDir, name)), sha256: hash(path.join(runDir, name)) });
fs.writeFileSync(
  path.join(runDir, "result.json"),
  `${JSON.stringify({
    schema_version: 1,
    case_id: caseId,
    kind: testCase.kind,
    subject_sha256: manifest.subject_sha256,
    harness: "codex",
    harness_version: manifest.harness_version,
    model: manifest.model,
    output: evidence("output.md"),
    trace: evidence("trace.jsonl"),
    observed_trigger: observedTrigger,
    total_tokens: (usage.input_tokens ?? 0) + (usage.output_tokens ?? 0)
  }, null, 2)}\n`,
);
console.log(path.relative(repoRoot, path.join(runDir, "result.json")));
