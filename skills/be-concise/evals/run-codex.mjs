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
const matrix = JSON.parse(fs.readFileSync(path.join(root, "matrix.json"), "utf8"));
const strongPrompt =
  "Answer first in plain language, with no preamble, headings, filler, or closing offer. Keep a simple answer to four sentences, preserve any decision-changing caveat, and give full detail when the user explicitly asks for depth.";

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i], process.argv[i + 1]);
const caseId = args.get("--case");
const arm = args.get("--arm");
if (!caseId || !arm) {
  console.error("Usage: node run-codex.mjs --case <id> --arm <prompt|skill|installed>");
  process.exit(1);
}

const cases = fs
  .readFileSync(path.join(root, "cases.jsonl"), "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line));
const testCase = cases.find((item) => item.id === caseId);
if (!testCase) throw new Error(`Unknown case: ${caseId}`);
const allowedArms = testCase.kind === "behavior" ? new Set(["prompt", "skill"]) : new Set(["installed"]);
if (!allowedArms.has(arm)) throw new Error(`Arm ${arm} is invalid for ${testCase.kind} case ${caseId}`);

const runDir = path.join(root, "results", caseId, arm, "run-1");
if (fs.existsSync(runDir)) throw new Error(`Refusing to overwrite preserved run: ${runDir}`);
fs.mkdirSync(runDir, { recursive: true });
const isolatedHome = fs.mkdtempSync(path.join(os.tmpdir(), `be-concise-${caseId}-${arm}-home-`));
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), `be-concise-${caseId}-${arm}-work-`));

if (arm === "installed") {
  const targetRoot = path.join(isolatedHome, ".agents", "skills");
  fs.mkdirSync(targetRoot, { recursive: true });
  for (const name of fs.readdirSync(path.join(repoRoot, "skills"))) {
    const source = path.join(repoRoot, "skills", name);
    if (fs.existsSync(path.join(source, "SKILL.md"))) fs.cpSync(source, path.join(targetRoot, name), { recursive: true });
  }
}

const task =
  arm === "prompt"
    ? `${testCase.request}\n\nAdditional binding instruction: ${strongPrompt}`
    : arm === "skill"
      ? `Binding skill instructions follow. Apply them to the request.\n\n${fs.readFileSync(skillFile, "utf8")}\n\nUser request:\n${testCase.request}`
      : testCase.request;
fs.writeFileSync(path.join(runDir, "actor-prompt.md"), `${task}\n`);

const startedAt = new Date().toISOString();
const actor = spawnSync(
  "codex",
  [
    "exec",
    "-",
    "--ephemeral",
    "--ignore-user-config",
    "--json",
    "-m",
    matrix.model,
    "-c",
    `model_reasoning_effort=\"${matrix.model_settings.model_reasoning_effort}\"`,
    "-s",
    "read-only",
    "--skip-git-repo-check",
    "-C",
    workspace,
  ],
  {
    cwd: workspace,
    env: { ...process.env, HOME: isolatedHome, CODEX_HOME: process.env.CODEX_HOME ?? path.join(os.homedir(), ".codex") },
    input: task,
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
    timeout: 300000,
  },
);
fs.writeFileSync(path.join(runDir, "actor-trace.jsonl"), actor.stdout ?? "");
fs.writeFileSync(path.join(runDir, "actor-stderr.txt"), actor.stderr ?? "");
if (actor.status !== 0) throw new Error(`Actor failed with status ${actor.status}; evidence preserved in ${runDir}`);

const events = (actor.stdout ?? "")
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const output = events
  .filter((event) => event.type === "item.completed" && event.item?.type === "agent_message")
  .map((event) => event.item.text)
  .join("\n\n");
fs.writeFileSync(path.join(runDir, "actor-output.md"), `${output}\n`);
const usage = events.findLast((event) => event.type === "turn.completed")?.usage ?? {};
const commandText = events
  .filter((event) => event.item?.type === "command_execution")
  .map((event) => event.item.command ?? "")
  .join("\n");
const observedTrigger = testCase.kind === "trigger" ? /(?:^|[/\\])be-concise[/\\]SKILL\.md/.test(commandText) : null;

const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const evidence = (name) => ({ path: path.relative(root, path.join(runDir, name)), sha256: hash(path.join(runDir, name)) });
const result = {
  schema_version: 1,
  suite_version: matrix.suite_version,
  case_id: caseId,
  kind: testCase.kind,
  split: testCase.split,
  arm,
  started_at: startedAt,
  harness: matrix.harness,
  harness_version: matrix.harness_version,
  model: matrix.model,
  model_snapshot: matrix.model_snapshot,
  output: evidence("actor-output.md"),
  tool_trace: evidence("actor-trace.jsonl"),
  observed_trigger: observedTrigger,
  usage: {
    input_tokens: usage.input_tokens ?? 0,
    cached_input_tokens: usage.cached_input_tokens ?? 0,
    output_tokens: usage.output_tokens ?? 0,
    total_tokens: (usage.input_tokens ?? 0) + (usage.output_tokens ?? 0)
  }
};
fs.writeFileSync(path.join(runDir, "result.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(path.relative(repoRoot, path.join(runDir, "result.json")));
