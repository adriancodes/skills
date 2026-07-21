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

const workspace = fs.mkdtempSync(path.join(os.tmpdir(), `diagnose-${arm}-work-`));
const isolatedHome = fs.mkdtempSync(path.join(os.tmpdir(), `diagnose-${arm}-home-`));
const isolatedCodexHome = path.join(isolatedHome, ".codex");
fs.mkdirSync(isolatedCodexHome, { recursive: true });
fs.copyFileSync(path.join(process.env.CODEX_HOME ?? path.join(os.homedir(), ".codex"), "auth.json"), path.join(isolatedCodexHome, "auth.json"));
fs.cpSync(path.join(root, testCase.fixture), workspace, { recursive: true });
const before = hashTree(workspace);
const instruction = arm === "prompt" ? `${config.strongest_prompt}\n\n` : "";
const prompt = `${instruction}User request:\n${testCase.request}`;
fs.writeFileSync(path.join(resultDir, "prompt.md"), `${prompt}\n`);
fs.writeFileSync(path.join(resultDir, "workspace-before.json"), `${JSON.stringify(before, null, 2)}\n`);

const args = [
  "exec", "-", "--ignore-user-config", "--ignore-rules", "--json",
  "-m", config.model, "-c", `model_reasoning_effort=\"${config.reasoning_effort}\"`,
  "--skip-git-repo-check", "-s", "read-only", "-C", workspace,
];
const started = Date.now();
const run = spawnSync("codex", args, {
  cwd: workspace,
  env: { ...process.env, HOME: isolatedHome, CODEX_HOME: isolatedCodexHome },
  input: prompt,
  encoding: "utf8",
  maxBuffer: 50 * 1024 * 1024,
  timeout: 300000,
});
fs.writeFileSync(path.join(resultDir, "trace.jsonl"), run.stdout ?? "");
fs.writeFileSync(path.join(resultDir, "stderr.txt"), run.stderr ?? "");
if (run.status !== 0) throw new Error(`Run failed with status ${run.status}; evidence preserved in ${resultDir}`);
const events = parseEvents(run.stdout ?? "");
fs.writeFileSync(path.join(resultDir, "output.md"), `${agentOutput(events)}\n`);

const after = hashTree(workspace);
fs.writeFileSync(path.join(resultDir, "workspace-after.json"), `${JSON.stringify(after, null, 2)}\n`);
const evidence = (name) => ({ path: path.relative(root, path.join(resultDir, name)), sha256: hashFile(path.join(resultDir, name)) });
const result = {
  schema_version: 1,
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
  total_tokens: totalTokens(events),
  turns: 1,
  user_instruction_chars: arm === "prompt" ? config.strongest_prompt.length : 0,
  workspace_unchanged: JSON.stringify(before) === JSON.stringify(after),
  output: evidence("output.md"),
  trace: evidence("trace.jsonl"),
  workspace_before: evidence("workspace-before.json"),
  workspace_after: evidence("workspace-after.json"),
};
fs.writeFileSync(path.join(resultDir, "result.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(path.relative(root, path.join(resultDir, "result.json")));
