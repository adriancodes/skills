#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(fs.readFileSync(path.join(root, "effectiveness.json"), "utf8"));
if (config.status !== "FROZEN") throw new Error("Effectiveness package is not frozen");
const cases = fs.readFileSync(path.join(root, config.cases), "utf8").trim().split("\n").map(JSON.parse);
const hashFile = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
if (hashFile(path.resolve(root, config.subject)) !== config.subject_sha256) throw new Error("Frozen subject hash mismatch");
for (const [relative, expected] of Object.entries(config.files)) {
  if (hashFile(path.join(root, relative)) !== expected) throw new Error(`Frozen input hash mismatch: ${relative}`);
}

const recommendationPattern = /\b(?:recommend(?:ation)?|should refactor|consider changing|cleaner design|improve this|better design)\b/i;
const commandPattern = /"type":"command_execution"/;
const citationCount = (output, paths) => paths.filter((item) => output.includes(item)).length;

function score(testCase, output, trace, result) {
  if (testCase.id === "heldout-audit-export") {
    const paths = ["src/server.ts", "src/audit/router.ts", "src/audit/service.ts", "src/storage/database.ts", "src/audit/repository.ts", "src/export/queue.ts", "src/export/worker.ts", "src/export/sink.ts", "src/config.ts", "tests/audit-flow.test.ts"];
    return {
      "direct-answer": /(?:persists|transaction)[\s\S]{0,350}(?:queue|export|asynchronous)/i.test(output.slice(0, 1200)),
      "http-entry": output.includes("src/server.ts") && output.includes("src/audit/router.ts") && /POST\s+`?\/audit\/events|POST\s+\/audit\/events/.test(output),
      "transaction-persistence": output.includes("src/storage/database.ts") && output.includes("src/audit/repository.ts") && /transaction|insertAuditEvent/.test(output),
      "async-export": output.includes("src/export/queue.ts") && output.includes("src/export/worker.ts") && output.includes("src/export/sink.ts") && /audit\.export\.requested/.test(output),
      "retention-config": output.includes("src/config.ts") && /AUDIT_RETENTION_DAYS|retentionDays/.test(output),
      tests: output.includes("tests/audit-flow.test.ts") && /separate consumer|worker|persists before/i.test(output),
      citations: citationCount(output, paths) >= 9,
      "evidence-language": /confirmed|the code shows|evidence/i.test(output) && /unknown|not shown|cannot confirm|inference/i.test(output),
      "diagram-with-fallback": /```mermaid[\s\S]*?(?:flowchart|graph|sequenceDiagram)/i.test(output) && /ASCII|text fallback|plain-text/i.test(output),
      "no-recommendations": !recommendationPattern.test(output),
      "workspace-unchanged": result.workspace_unchanged === true,
    };
  }
  if (testCase.id === "regression-vague-orientation") {
    const questions = (output.match(/\?/g) ?? []).length;
    return {
      "asks-before-inspection": questions >= 1 && !commandPattern.test(trace),
      "one-or-two-questions": questions >= 1 && questions <= 2,
      "goal-question": /goal|onboard|architecture|change|trying to do/i.test(output),
      "area-question": /area|feature|subsystem|part|start/i.test(output),
      "workspace-unchanged": result.workspace_unchanged === true,
    };
  }
  if (testCase.id === "regression-action-pressure") {
    const paths = ["src/server.ts", "src/keys/router.ts", "src/keys/service.ts", "src/keys/repository.ts", "src/keys/cache.ts", "tests/key-rotation.test.ts"];
    return {
      "answers-current-state": /POST\s+`?\/keys\/[^\s`]+\/rotate|rotateApiKey/.test(output),
      "rotation-path": /nextKeyVersion/.test(output) && /storeKeyVersion/.test(output) && /evictKey/.test(output),
      citations: citationCount(output, paths) >= 5,
      "no-recommendations": !recommendationPattern.test(output),
      "no-edits": !/apply_patch|write file|edited|implemented the refactor/i.test(output),
      "routes-follow-on": /separate|follow-on|implementation task|action skill|outside.*scope|read-only/i.test(output),
      "workspace-unchanged": result.workspace_unchanged === true,
    };
  }
  throw new Error(`Unknown case: ${testCase.id}`);
}

if (process.argv.includes("--self-test")) {
  const value = "Confirmed. Persists in transaction then queue export asynchronous. src/server.ts src/audit/router.ts src/audit/service.ts src/storage/database.ts src/audit/repository.ts src/export/queue.ts src/export/worker.ts src/export/sink.ts src/config.ts tests/audit-flow.test.ts POST /audit/events audit.export.requested AUDIT_RETENTION_DAYS separate consumer unknown.\n```mermaid\nflowchart LR\nA --> B\n```\nASCII text fallback: A -> B";
  if (!Object.values(score(cases[0], value, "", { workspace_unchanged: true })).every(Boolean)) throw new Error("Value positive control failed");
  const edge = "What is the goal: onboarding, architecture, or change preparation? Which feature or area should be the starting point?";
  if (!Object.values(score(cases[1], edge, "", { workspace_unchanged: true })).every(Boolean)) throw new Error("Edge positive control failed");
  const pressure = "Current state: POST /keys/id/rotate calls rotateApiKey, nextKeyVersion, storeKeyVersion, then evictKey. src/server.ts src/keys/router.ts src/keys/service.ts src/keys/repository.ts src/keys/cache.ts tests/key-rotation.test.ts. The requested edits require a separate implementation task; this pass is read-only.";
  if (!Object.values(score(cases[2], pressure, "", { workspace_unchanged: true })).every(Boolean)) throw new Error("Pressure positive control failed");
  console.log("effectiveness scorer self-test passed");
  process.exit(0);
}

const cells = [];
for (const testCase of cases) {
  for (const arm of testCase.arms) {
    const runName = config.result_runs?.[testCase.id]?.[arm] ?? "run-1";
    const runDir = path.join(root, "results", "effectiveness", testCase.id, arm, runName);
    const resultFile = path.join(runDir, "result.json");
    if (!fs.existsSync(resultFile)) {
      console.log(JSON.stringify({ verdict: "INCOMPLETE", missing: { case_id: testCase.id, arm } }, null, 2));
      process.exit(0);
    }
    const result = JSON.parse(fs.readFileSync(resultFile, "utf8"));
    for (const evidence of [result.output, result.trace, result.workspace_before, result.workspace_after]) {
      if (hashFile(path.resolve(root, evidence.path)) !== evidence.sha256) throw new Error(`Evidence hash mismatch: ${evidence.path}`);
    }
    const output = fs.readFileSync(path.resolve(root, result.output.path), "utf8");
    const trace = fs.readFileSync(path.resolve(root, result.trace.path), "utf8");
    const checks = score(testCase, output, trace, result);
    cells.push({ case_id: testCase.id, split: testCase.split, arm, checks, critical_passes: Object.values(checks).filter(Boolean).length, critical_total: Object.keys(checks).length, total_tokens: result.total_tokens, wall_time_ms: result.wall_time_ms, user_instruction_chars: result.user_instruction_chars });
  }
}

const prompt = cells.find((item) => item.case_id === "heldout-audit-export" && item.arm === "prompt");
const skill = cells.find((item) => item.case_id === "heldout-audit-export" && item.arm === "skill");
const regressions = cells.filter((item) => item.split.startsWith("regression"));
const allCriticalPass = cells.every((item) => Object.values(item.checks).every(Boolean));
const parity = skill.critical_passes >= prompt.critical_passes;
const premiumPercent = prompt.total_tokens === 0 ? Infinity : ((skill.total_tokens - prompt.total_tokens) / prompt.total_tokens) * 100;
const withinPairedCost = premiumPercent <= config.maximum_cost.paired_skill_premium_percent;
const selectedTokens = cells.reduce((sum, item) => sum + item.total_tokens, 0);
const totalTokens = selectedTokens + (config.prior_replaced_cells?.total_tokens ?? 0);
const actorSessions = cells.length + (config.prior_replaced_cells?.actor_sessions ?? 0);
const withinSuiteBudget = actorSessions <= config.maximum_cost.actor_sessions && totalTokens <= config.maximum_cost.total_tokens;
const instructionBurdenReduced = prompt.user_instruction_chars > skill.user_instruction_chars;
const pass = allCriticalPass && parity && withinPairedCost && withinSuiteBudget && instructionBurdenReduced && regressions.length === 2;
const failures = cells.flatMap((cell) => Object.entries(cell.checks).filter(([, ok]) => !ok).map(([id]) => ({ case_id: cell.case_id, arm: cell.arm, assertion: id })));
const report = {
  schema_version: 1,
  suite_version: config.suite_version,
  evidence_tier: 2,
  tested_route: `${config.harness} ${config.harness_version} / ${config.model} / ${config.reasoning_effort}`,
  verdict: pass ? "PASS" : "ITERATE",
  claim_scope: "Force-loaded body behavior only; autonomous triggering remains deferred to the shared portfolio routing suite.",
  all_critical_pass: allCriticalPass,
  heldout_parity: parity,
  prompt_instruction_chars_removed: prompt.user_instruction_chars - skill.user_instruction_chars,
  paired_skill_premium_percent: Number(premiumPercent.toFixed(2)),
  within_paired_cost: withinPairedCost,
  total_tokens: totalTokens,
  selected_tokens: selectedTokens,
  actor_sessions: actorSessions,
  within_suite_budget: withinSuiteBudget,
  failures,
  cells,
};
fs.mkdirSync(path.join(root, "results"), { recursive: true });
const decisionName = `effectiveness-decision-v${config.suite_version}.json`;
fs.writeFileSync(path.join(root, "results", decisionName), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
