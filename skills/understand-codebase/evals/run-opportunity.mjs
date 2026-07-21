#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(fs.readFileSync(path.join(root, "opportunity.json"), "utf8"));
if (config.status !== "FROZEN") throw new Error("Opportunity package is not frozen");
const cases = fs.readFileSync(path.join(root, "cases.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
const testCase = cases.find((item) => item.id === config.case_id);
const armIndex = process.argv.indexOf("--arm");
const arm = armIndex === -1 ? null : process.argv[armIndex + 1];
if (!testCase || !testCase.arms.includes(arm)) throw new Error("Usage: node run-opportunity.mjs --arm <none|prompt>");

const hashFile = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
for (const [relative, expected] of Object.entries(config.files)) {
  if (hashFile(path.join(root, relative)) !== expected) throw new Error(`Frozen input hash mismatch: ${relative}`);
}

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

const parseEvents = (stdout) => stdout.trim().split("\n").filter(Boolean).map(JSON.parse);
const agentOutput = (events) => events
  .filter((event) => event.type === "item.completed" && event.item?.type === "agent_message")
  .map((event) => event.item.text)
  .join("\n\n");
const totalTokens = (events) => events
  .filter((event) => event.type === "turn.completed")
  .reduce((sum, event) => sum + (event.usage?.input_tokens ?? 0) + (event.usage?.output_tokens ?? 0), 0);

const resultDir = path.join(root, "results", "opportunity", testCase.id, arm, "run-1");
if (fs.existsSync(resultDir)) throw new Error(`Refusing to overwrite evidence: ${resultDir}`);
fs.mkdirSync(resultDir, { recursive: true });

const workspace = fs.mkdtempSync(path.join(os.tmpdir(), `understand-codebase-${arm}-work-`));
const isolatedHome = fs.mkdtempSync(path.join(os.tmpdir(), `understand-codebase-${arm}-home-`));
const isolatedCodexHome = path.join(isolatedHome, ".codex");
fs.mkdirSync(isolatedCodexHome, { recursive: true });
fs.copyFileSync(path.join(process.env.CODEX_HOME ?? path.join(os.homedir(), ".codex"), "auth.json"), path.join(isolatedCodexHome, "auth.json"));
fs.cpSync(path.join(root, testCase.fixture), workspace, { recursive: true });
const before = hashTree(workspace);
const instruction = arm === "prompt" ? `${config.strongest_prompt}\n\n` : "";
const firstPrompt = `${instruction}User request:\n${testCase.initial_request}`;
fs.writeFileSync(path.join(resultDir, "turn-1-prompt.md"), `${firstPrompt}\n`);
fs.writeFileSync(path.join(resultDir, "turn-2-prompt.md"), `${testCase.scripted_answer}\n`);
fs.writeFileSync(path.join(resultDir, "workspace-before.json"), `${JSON.stringify(before, null, 2)}\n`);

const common = ["--ignore-user-config", "--ignore-rules", "--json", "-m", config.model, "-c", `model_reasoning_effort=\"${config.reasoning_effort}\"`, "--skip-git-repo-check"];
const env = { ...process.env, HOME: isolatedHome, CODEX_HOME: isolatedCodexHome };
const started = Date.now();
const first = spawnSync("codex", ["exec", "-", ...common, "-s", "read-only", "-C", workspace], {
  cwd: workspace,
  env,
  input: firstPrompt,
  encoding: "utf8",
  maxBuffer: 50 * 1024 * 1024,
  timeout: 300000,
});
fs.writeFileSync(path.join(resultDir, "turn-1-trace.jsonl"), first.stdout ?? "");
fs.writeFileSync(path.join(resultDir, "turn-1-stderr.txt"), first.stderr ?? "");
if (first.status !== 0) throw new Error(`Turn 1 failed with status ${first.status}; evidence preserved in ${resultDir}`);
const firstEvents = parseEvents(first.stdout ?? "");
const threadId = firstEvents.find((event) => event.type === "thread.started")?.thread_id;
if (!threadId) throw new Error("Turn 1 did not return a thread id");
fs.writeFileSync(path.join(resultDir, "turn-1-output.md"), `${agentOutput(firstEvents)}\n`);

const second = spawnSync("codex", ["exec", "resume", threadId, "-", ...common], {
  cwd: workspace,
  env,
  input: testCase.scripted_answer,
  encoding: "utf8",
  maxBuffer: 50 * 1024 * 1024,
  timeout: 300000,
});
fs.writeFileSync(path.join(resultDir, "turn-2-trace.jsonl"), second.stdout ?? "");
fs.writeFileSync(path.join(resultDir, "turn-2-stderr.txt"), second.stderr ?? "");
if (second.status !== 0) throw new Error(`Turn 2 failed with status ${second.status}; evidence preserved in ${resultDir}`);
const secondEvents = parseEvents(second.stdout ?? "");
fs.writeFileSync(path.join(resultDir, "turn-2-output.md"), `${agentOutput(secondEvents)}\n`);

const after = hashTree(workspace);
fs.writeFileSync(path.join(resultDir, "workspace-after.json"), `${JSON.stringify(after, null, 2)}\n`);
const evidence = (name) => ({ path: path.relative(root, path.join(resultDir, name)), sha256: hashFile(path.join(resultDir, name)) });
const result = {
  schema_version: 2,
  suite_version: config.suite_version,
  case_id: testCase.id,
  split: testCase.split,
  arm,
  harness: config.harness,
  harness_version: config.harness_version,
  model: config.model,
  model_snapshot: config.model_snapshot,
  snapshot_policy: config.snapshot_policy,
  reasoning_effort: config.reasoning_effort,
  observed_at: new Date().toISOString(),
  wall_time_ms: Date.now() - started,
  total_tokens: totalTokens(firstEvents) + totalTokens(secondEvents),
  turns: 2,
  user_instruction_chars: arm === "prompt" ? config.strongest_prompt.length : 0,
  workspace_unchanged: JSON.stringify(before) === JSON.stringify(after),
  turn_1_output: evidence("turn-1-output.md"),
  turn_2_output: evidence("turn-2-output.md"),
  turn_1_trace: evidence("turn-1-trace.jsonl"),
  turn_2_trace: evidence("turn-2-trace.jsonl"),
  workspace_before: evidence("workspace-before.json"),
  workspace_after: evidence("workspace-after.json")
};
fs.writeFileSync(path.join(resultDir, "result.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(path.relative(root, path.join(resultDir, "result.json")));
