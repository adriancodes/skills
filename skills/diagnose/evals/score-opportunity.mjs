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

function score(output, trace, result) {
  const combined = `${output}\n${trace}`;
  const hypothesisSignals = output.match(/(?:hypothes|alternative|possibilit|candidate cause)/gi) ?? [];
  const numberedHypotheses = [/(?:^|\s)[(]?1[).:-]/m, /(?:^|\s)[(]?2[).:-]/m, /(?:^|\s)[(]?3[).:-]/m]
    .every((pattern) => pattern.test(output));
  return {
    "exact-reproduction": /(?:npm test|node --test)/i.test(combined) && /(?:fail|ERR_ASSERTION|not ok)/i.test(combined),
    "minimal-boundary-probe": /9[,_]?999/.test(combined) && /10[,_]?000/.test(combined) && /10[,_]?001/.test(combined),
    "ranked-falsifiable-hypotheses": hypothesisSignals.length >= 1 && numberedHypotheses && /(?:rank|prediction|would expect|falsif|if .* then)/i.test(output),
    "alternatives-tested": /(?:coupon|tier|round|unit|cents|wrapper|mapping)/i.test(output) && /(?:ruled out|falsif|not the cause|confirmed|disproved|eliminated)/i.test(output),
    "root-cause": /(?:strict|exclusive|off[- ]by[- ]one|boundary)/i.test(output) && />/.test(output) && />=|≥/.test(output),
    "source-citation": /src\/discount\.js(?::\d+|#L\d+)?/i.test(output) && /calculateDiscount/.test(output),
    "no-fix": !/(?:I (?:fixed|changed|updated|patched)|implemented the fix|files? (?:were|was) modified)/i.test(output),
    "workspace-unchanged": result.workspace_unchanged === true,
  };
}

if (process.argv.includes("--self-test")) {
  const output = "npm test reproduces FAIL. Ranked hypotheses: (1) boundary comparator; prediction: 9999 fails, 10000 fails, 10001 passes. (2) coupon precedence, ruled out. (3) tier mapping, falsified. Root cause: calculateDiscount in src/discount.js:9 uses strict > rather than >=, an off-by-one boundary error.";
  const trace = "node --test 9999 10000 10001 ERR_ASSERTION not ok";
  const checks = score(output, trace, { workspace_unchanged: true });
  if (!Object.values(checks).every(Boolean)) throw new Error(`Positive control failed: ${JSON.stringify(checks)}`);
  if (score(output.replace("rather than >=", "as intended"), trace, { workspace_unchanged: true })["root-cause"]) throw new Error("Root-cause negative control failed");
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
  for (const evidence of [result.output, result.trace, result.workspace_before, result.workspace_after]) {
    if (hashFile(path.resolve(root, evidence.path)) !== evidence.sha256) throw new Error(`Evidence hash mismatch: ${evidence.path}`);
  }
  const output = fs.readFileSync(path.resolve(root, result.output.path), "utf8");
  const trace = fs.readFileSync(path.resolve(root, result.trace.path), "utf8");
  const checks = score(output, trace, result);
  arms.push({
    arm,
    checks,
    critical_passes: Object.values(checks).filter(Boolean).length,
    critical_total: Object.keys(checks).length,
    total_tokens: result.total_tokens,
    wall_time_ms: result.wall_time_ms,
    user_instruction_chars: result.user_instruction_chars,
  });
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
  rationale = "The frozen discovery budget was exceeded.";
} else if (promptFailures.length > 0) {
  verdict = "PROTOTYPE";
  opportunityType = "behavioral";
  rationale = "The strongest prompt left behavioral failures that a reusable discipline may address.";
} else if (noneFailures.length > 0) {
  verdict = "PROTOTYPE";
  opportunityType = "delivery";
  rationale = "The strongest prompt met the target while the natural request did not; automatic recall can provide repeated-use value.";
} else {
  verdict = "ABANDON";
  opportunityType = null;
  rationale = "The natural request already met every target behavior, so no reusable-skill opportunity was demonstrated.";
}
const report = {
  schema_version: 1,
  suite_version: config.suite_version,
  evidence_tier: 2,
  verdict,
  opportunity_type: opportunityType,
  rationale,
  prompt_failures: promptFailures,
  none_failures: noneFailures,
  total_tokens: totalTokens,
  actor_sessions: arms.length,
  turns: arms.length,
  within_budget: withinBudget,
  arms,
};
fs.mkdirSync(path.join(root, "results"), { recursive: true });
fs.writeFileSync(path.join(root, "results", "opportunity-decision.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
