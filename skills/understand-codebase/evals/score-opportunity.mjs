#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(fs.readFileSync(path.join(root, "opportunity.json"), "utf8"));
if (config.status !== "FROZEN") throw new Error("Opportunity package is not frozen");
const cases = fs.readFileSync(path.join(root, "cases.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
const testCase = cases.find((item) => item.id === config.case_id);
const hashFile = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
for (const [relative, expected] of Object.entries(config.files)) {
  if (hashFile(path.join(root, relative)) !== expected) throw new Error(`Frozen input hash mismatch: ${relative}`);
}

const paths = ["src/server.ts", "src/http/router.ts", "src/reports/service.ts", "src/reports/repository.ts", "src/storage/database.ts", "src/jobs/queue.ts", "src/worker.ts", "src/notifications/email.ts", "tests/report-flow.test.ts"];
const recommendationPattern = /\b(?:recommend|should refactor|consider changing|improve this|better design)\b/i;

function score(first, second, result, firstTrace) {
  const questionCount = (first.match(/\?/g) ?? []).length;
  const mentionedPaths = paths.filter((item) => second.includes(item));
  const inspectedBeforeAnswer = firstTrace.includes('"type":"command_execution"');
  return {
    "orientation-first": questionCount >= 1 && /(?:goal|onboard|area|part|feature|understand|question)/i.test(first) && !inspectedBeforeAnswer,
    "question-limit": questionCount >= 1 && questionCount <= 2,
    entrypoint: second.includes("src/server.ts") && /startServer|handleRequest/.test(second),
    "request-route": second.includes("src/http/router.ts") && /POST\s+\/reports/.test(second),
    service: second.includes("src/reports/service.ts") && /createReport/.test(second),
    storage: second.includes("src/reports/repository.ts") && second.includes("src/storage/database.ts") && /insertReport|database\.insert/.test(second),
    queue: second.includes("src/jobs/queue.ts") && /report\.created/.test(second),
    "worker-side-effect": second.includes("src/worker.ts") && second.includes("src/notifications/email.ts") && /sendReportReady/.test(second),
    "sync-async-boundary": /(?:synchronous|before (?:the )?response|202)/i.test(second) && /(?:asynchronous|after (?:the )?response|worker)/i.test(second),
    tests: second.includes("tests/report-flow.test.ts") && /test|tested|coverage/i.test(second),
    "file-citations": mentionedPaths.length >= 8,
    "evidence-language": /(?:confirmed|evidence|the code shows)/i.test(second) && /(?:unknown|not shown|cannot confirm|inference)/i.test(second),
    diagram: /```mermaid[\s\S]*?(?:flowchart|graph|sequenceDiagram)/i.test(second),
    "no-recommendations": !recommendationPattern.test(second),
    "workspace-unchanged": result.workspace_unchanged === true
  };
}

if (process.argv.includes("--self-test")) {
  const first = "What is your goal, and which area should I focus on?";
  const second = `${paths.join(" ")} startServer handleRequest POST /reports createReport insertReport database.insert report.created sendReportReady synchronous 202 asynchronous worker tested confirmed unknown\n\`\`\`mermaid\nflowchart LR\nA --> B\n\`\`\``;
  const checks = score(first, second, { workspace_unchanged: true }, "");
  if (!Object.values(checks).every(Boolean)) throw new Error(`Positive control failed: ${JSON.stringify(checks)}`);
  if (score(first, `${second}\nI recommend a refactor.`, { workspace_unchanged: true }, "")["no-recommendations"]) throw new Error("Recommendation control failed");
  console.log("opportunity scorer self-test passed");
  process.exit(0);
}

const arms = [];
for (const arm of testCase.arms) {
  const runDir = path.join(root, "results", "opportunity", testCase.id, arm, "run-1");
  const resultFile = path.join(runDir, "result.json");
  if (!fs.existsSync(resultFile)) {
    console.log(JSON.stringify({ verdict: "INCOMPLETE", missing: arm }, null, 2));
    process.exit(0);
  }
  const result = JSON.parse(fs.readFileSync(resultFile, "utf8"));
  if (result.suite_version !== config.suite_version) throw new Error(`${arm}: suite version mismatch`);
  for (const evidence of [result.turn_1_output, result.turn_2_output, result.turn_1_trace, result.turn_2_trace, result.workspace_before, result.workspace_after]) {
    if (hashFile(path.resolve(root, evidence.path)) !== evidence.sha256) throw new Error(`Evidence hash mismatch: ${evidence.path}`);
  }
  const first = fs.readFileSync(path.resolve(root, result.turn_1_output.path), "utf8");
  const second = fs.readFileSync(path.resolve(root, result.turn_2_output.path), "utf8");
  const firstTrace = fs.readFileSync(path.resolve(root, result.turn_1_trace.path), "utf8");
  const checks = score(first, second, result, firstTrace);
  arms.push({ arm, checks, critical_passes: Object.values(checks).filter(Boolean).length, critical_total: Object.keys(checks).length, total_tokens: result.total_tokens, wall_time_ms: result.wall_time_ms, user_instruction_chars: result.user_instruction_chars });
}

const none = arms.find((item) => item.arm === "none");
const prompt = arms.find((item) => item.arm === "prompt");
const promptFailures = Object.entries(prompt.checks).filter(([, pass]) => !pass).map(([id]) => id);
const noneFailures = Object.entries(none.checks).filter(([, pass]) => !pass).map(([id]) => id);
const totalTokens = arms.reduce((sum, item) => sum + item.total_tokens, 0);
const withinBudget = arms.length <= config.maximum_cost.actor_sessions && totalTokens <= config.maximum_cost.total_tokens;
let verdict;
let opportunityType;
let rationale;
if (!withinBudget) {
  verdict = "ITERATE";
  opportunityType = null;
  rationale = "The discovery run exceeded its frozen budget; reduce the case or authorize a bounded extension before deciding.";
} else if (promptFailures.length > 0) {
  verdict = "PROTOTYPE";
  opportunityType = "behavioral";
  rationale = "The strongest prompt left confirmed behavioral failures that a reusable mechanism may address.";
} else if (noneFailures.length > 0) {
  verdict = "PROTOTYPE";
  opportunityType = "delivery";
  rationale = "The strongest prompt met the behavior target, while the natural request did not. The confirmed brief values automatic recall, so normally installed triggering may provide repeated-use value.";
} else {
  verdict = "ABANDON";
  opportunityType = null;
  rationale = "The natural request already met the confirmed behavior target; neither a behavioral nor delivery opportunity was demonstrated.";
}
const report = { schema_version: 2, suite_version: config.suite_version, evidence_tier: 2, verdict, opportunity_type: opportunityType, rationale, prompt_failures: promptFailures, none_failures: noneFailures, total_tokens: totalTokens, actor_sessions: arms.length, turns: arms.length * 2, within_budget: withinBudget, arms };
fs.mkdirSync(path.join(root, "results"), { recursive: true });
fs.writeFileSync(path.join(root, "results", "opportunity-decision-v2.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
