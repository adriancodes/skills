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
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const hashFile = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const hashTree = (directory) => {
  const entries = [];
  const visit = (current) => {
    for (const name of fs.readdirSync(current).sort()) {
      const absolute = path.join(current, name);
      const relative = path.relative(directory, absolute);
      const stat = fs.statSync(absolute);
      if (stat.isDirectory()) visit(absolute);
      else entries.push({ path: relative, sha256: hashFile(absolute) });
    }
  };
  visit(directory);
  return entries;
};

if (hashFile(skillFile) !== manifest.subject_sha256) throw new Error("Current SKILL.md does not match manifest.json");
if (hashFile(path.join(root, "cases.jsonl")) !== manifest.cases_sha256) throw new Error("cases.jsonl does not match manifest.json");

const caseId = process.argv[process.argv.indexOf("--case") + 1];
const arm = process.argv[process.argv.indexOf("--arm") + 1];
const cases = fs.readFileSync(path.join(root, "cases.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
const testCase = cases.find((item) => item.id === caseId);
if (!testCase || !testCase.arms.includes(arm)) throw new Error("Usage: node run-codex.mjs --case <id> --arm <skill>");

const runDir = path.join(root, "results", manifest.subject_sha256.slice(0, 12), caseId, arm);
if (fs.existsSync(runDir)) throw new Error(`Refusing to overwrite evidence: ${runDir}`);
fs.mkdirSync(runDir, { recursive: true });
const isolatedHome = fs.mkdtempSync(path.join(os.tmpdir(), `improve-prompt-${caseId}-${arm}-home-`));
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), `improve-prompt-${caseId}-${arm}-work-`));
fs.mkdirSync(path.join(workspace, "src"), { recursive: true });
fs.writeFileSync(path.join(workspace, "README.md"), "Fixture repository. Do not edit unless the user asks for implementation.\n");
fs.writeFileSync(path.join(workspace, "src", "auth.ts"), "export function parseToken(token: string) { return token; }\n");
const before = hashTree(workspace);

const instruction = arm === "prompt"
  ? manifest.core_instruction
  : `Binding skill instructions follow. Apply them to the user request.\n\n${fs.readFileSync(skillFile, "utf8")}`;
const task = `${instruction}\n\nUser request:\n${testCase.request}`;
fs.writeFileSync(path.join(runDir, "prompt.md"), `${task}\n`);
fs.writeFileSync(path.join(runDir, "workspace-before.json"), `${JSON.stringify(before, null, 2)}\n`);

const actor = spawnSync(
  "codex",
  ["exec", "-", "--ephemeral", "--ignore-user-config", "--json", "-m", manifest.model, "-c", `model_reasoning_effort="${manifest.reasoning_effort}"`, "-s", "workspace-write", "--skip-git-repo-check", "-C", workspace],
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
const after = hashTree(workspace);
fs.writeFileSync(path.join(runDir, "workspace-after.json"), `${JSON.stringify(after, null, 2)}\n`);
if (actor.status !== 0) throw new Error(`Actor failed with status ${actor.status}; evidence preserved in ${runDir}`);

const events = (actor.stdout ?? "").trim().split("\n").filter(Boolean).map(JSON.parse);
const output = events.filter((event) => event.type === "item.completed" && event.item?.type === "agent_message").map((event) => event.item.text).join("\n\n");
const usage = events.findLast((event) => event.type === "turn.completed")?.usage ?? {};
fs.writeFileSync(path.join(runDir, "output.md"), `${output}\n`);
const evidence = (name) => ({ path: path.relative(root, path.join(runDir, name)), sha256: hashFile(path.join(runDir, name)) });
const result = {
  schema_version: 1,
  case_id: caseId,
  kind: testCase.kind,
  arm,
  subject_sha256: manifest.subject_sha256,
  harness: manifest.harness,
  harness_version: manifest.harness_version,
  model: manifest.model,
  observed_at: new Date().toISOString(),
  output: evidence("output.md"),
  trace: evidence("trace.jsonl"),
  workspace_before: evidence("workspace-before.json"),
  workspace_after: evidence("workspace-after.json"),
  workspace_unchanged: JSON.stringify(before) === JSON.stringify(after),
  total_tokens: (usage.input_tokens ?? 0) + (usage.output_tokens ?? 0)
};
fs.writeFileSync(path.join(runDir, "result.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(path.relative(repoRoot, path.join(runDir, "result.json")));
