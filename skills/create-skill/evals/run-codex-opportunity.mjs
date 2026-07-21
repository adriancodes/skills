#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(root, "../../..");
const resultsRoot = path.join(root, "results", "opportunity");
const codexHome = process.env.CODEX_HOME ?? path.join(os.homedir(), ".codex");
const model = "gpt-5.6-sol";
const strongPrompt =
  "First prove a reusable skill would materially outperform a strong reusable prompt. If it would, create the smallest production-ready skill and test it; otherwise recommend the cheaper mechanism.";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) args.set(process.argv[index], process.argv[index + 1]);
const caseId = args.get("--case");
const arm = args.get("--arm");
if (!caseId || !new Set(["none", "prompt"]).has(arm)) {
  console.error("Usage: node run-codex-opportunity.mjs --case <discovery-id> --arm <none|prompt>");
  process.exit(1);
}

const cases = fs
  .readFileSync(path.join(root, "cases.jsonl"), "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line));
const testCase = cases.find((item) => item.id === caseId && item.split === "discovery");
if (!testCase) throw new Error(`Unknown discovery case: ${caseId}`);

const runDir = path.join(resultsRoot, caseId, arm, "run-1");
const resumeJudge = fs.existsSync(path.join(runDir, "actor-trace.jsonl")) && !fs.existsSync(path.join(runDir, "manifest-entry.json"));
if (fs.existsSync(runDir) && !resumeJudge) throw new Error(`Refusing to overwrite preserved run: ${runDir}`);
fs.mkdirSync(runDir, { recursive: true });
const isolatedHome = fs.mkdtempSync(path.join(os.tmpdir(), `create-skill-${caseId}-${arm}-home-`));
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), `create-skill-${caseId}-${arm}-work-`));

const task = [
  `Environment: ${testCase.setup}`,
  `Request: ${testCase.request}`,
  arm === "prompt" ? `Additional instruction: ${strongPrompt}` : "",
  "Perform the request in the current workspace. Preserve useful artifacts there and summarize the outcome.",
]
  .filter(Boolean)
  .join("\n\n");
if (!resumeJudge) fs.writeFileSync(path.join(runDir, "actor-prompt.md"), task);

const codexArgs = [
  "exec",
  "-",
  "--ephemeral",
  "--ignore-user-config",
  "--json",
  "-m",
  model,
  "-c",
  'model_reasoning_effort="medium"',
  "-s",
  "workspace-write",
  "--skip-git-repo-check",
  "-C",
  workspace,
];
const startedAt = resumeJudge
  ? fs.statSync(path.join(runDir, "actor-trace.jsonl")).birthtime.toISOString()
  : new Date().toISOString();
const actor = resumeJudge
  ? { status: 0, stdout: fs.readFileSync(path.join(runDir, "actor-trace.jsonl"), "utf8"), stderr: "" }
  : spawnSync("codex", codexArgs, {
      cwd: workspace,
      env: { ...process.env, HOME: isolatedHome, CODEX_HOME: codexHome },
      input: task,
      encoding: "utf8",
      maxBuffer: 50 * 1024 * 1024,
    });
if (!resumeJudge) {
  fs.writeFileSync(path.join(runDir, "actor-trace.jsonl"), actor.stdout ?? "");
  fs.writeFileSync(path.join(runDir, "actor-stderr.txt"), actor.stderr ?? "");
}
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
const usage = events.findLast((event) => event.type === "turn.completed")?.usage ?? {};
if (!resumeJudge) fs.writeFileSync(path.join(runDir, "actor-output.md"), output);

const artifactsDir = path.join(runDir, "artifacts");
fs.mkdirSync(artifactsDir, { recursive: true });
if (!resumeJudge) fs.cpSync(workspace, artifactsDir, { recursive: true });

const artifactFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else artifactFiles.push(target);
  }
}
walk(artifactsDir);

const artifactText = artifactFiles
  .map((file) => `\n--- ${path.relative(artifactsDir, file)} ---\n${fs.readFileSync(file, "utf8")}`)
  .join("");
const judgePrompt = [
  "Blindly score the candidate outcome. The arm identity is intentionally absent.",
  `Environment: ${testCase.setup}`,
  `Request: ${testCase.request}`,
  `Assertions:\n${testCase.assertions.map((item) => `- ${item.id}: ${item.criterion}`).join("\n")}`,
  `Candidate response:\n${output}`,
  `Candidate artifacts:${artifactText || "\n(none)"}`,
  "Return one 0-or-1 score and a concise reason for every assertion ID. Score only observable behavior.",
].join("\n\n");
fs.writeFileSync(path.join(runDir, "judge-prompt.md"), judgePrompt);
const judgeSchema = {
  type: "object",
  properties: {
    scores: {
      type: "object",
      properties: Object.fromEntries(testCase.assertions.map((item) => [item.id, { enum: [0, 1] }])),
      required: testCase.assertions.map((item) => item.id),
      additionalProperties: false,
    },
    reasons: {
      type: "object",
      properties: Object.fromEntries(testCase.assertions.map((item) => [item.id, { type: "string" }])),
      required: testCase.assertions.map((item) => item.id),
      additionalProperties: false,
    },
  },
  required: ["scores", "reasons"],
  additionalProperties: false,
};
fs.writeFileSync(path.join(runDir, "judge-schema.json"), `${JSON.stringify(judgeSchema, null, 2)}\n`);
const judge = spawnSync(
  "codex",
  [
    "exec",
    "-",
    "--ephemeral",
    "--ignore-user-config",
    "--json",
    "--output-schema",
    path.join(runDir, "judge-schema.json"),
    "-m",
    model,
    "-c",
    'model_reasoning_effort="medium"',
    "-s",
    "read-only",
    "--skip-git-repo-check",
    "-C",
    workspace,
  ],
  {
    cwd: workspace,
    env: { ...process.env, HOME: isolatedHome, CODEX_HOME: codexHome },
    input: judgePrompt,
    encoding: "utf8",
    maxBuffer: 50 * 1024 * 1024,
  },
);
fs.writeFileSync(path.join(runDir, "judge-trace.jsonl"), judge.stdout ?? "");
fs.writeFileSync(path.join(runDir, "judge-stderr.txt"), judge.stderr ?? "");
if (judge.status !== 0) throw new Error(`Judge failed with status ${judge.status}; evidence preserved in ${runDir}`);
const judgeEvents = (judge.stdout ?? "")
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const judgeText = judgeEvents
  .filter((event) => event.type === "item.completed" && event.item?.type === "agent_message")
  .map((event) => event.item.text)
  .at(-1);
const judgment = JSON.parse(judgeText);
fs.writeFileSync(path.join(runDir, "judge-output.json"), `${JSON.stringify(judgment, null, 2)}\n`);

const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const evidence = (file) => ({ path: path.relative(root, file), sha256: hash(file) });
const outputEvidence = evidence(path.join(runDir, "actor-output.md"));
const traceEvidence = evidence(path.join(runDir, "actor-trace.jsonl"));
const judgePromptEvidence = evidence(path.join(runDir, "judge-prompt.md"));
const judgeOutputEvidence = evidence(path.join(runDir, "judge-output.json"));
const artifacts = artifactFiles.map(evidence);
const entry = {
  case_id: caseId,
  arm,
  started_at: startedAt,
  harness: "codex",
  harness_version: "codex-cli 0.144.1",
  model,
  model_snapshot: null,
  output: outputEvidence,
  tool_trace: traceEvidence,
  artifacts,
  assertions: Object.fromEntries(
    testCase.assertions.map((assertion) => [
      assertion.id,
      {
        score: judgment.scores[assertion.id],
        method: "blinded-judge",
        evidence: [outputEvidence, ...artifacts],
        judge_prompt: judgePromptEvidence,
        judge_output: judgeOutputEvidence,
      },
    ]),
  ),
  tokens:
    (usage.input_tokens ?? 0) +
    (usage.output_tokens ?? 0) +
    (judgeEvents.findLast((event) => event.type === "turn.completed")?.usage?.input_tokens ?? 0) +
    (judgeEvents.findLast((event) => event.type === "turn.completed")?.usage?.output_tokens ?? 0),
  actor_sessions: 2,
};
fs.writeFileSync(path.join(runDir, "manifest-entry.json"), `${JSON.stringify(entry, null, 2)}\n`);
console.log(path.relative(repoRoot, path.join(runDir, "manifest-entry.json")));
