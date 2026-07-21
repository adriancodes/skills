#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const cases = fs.readFileSync(path.join(root, "cases.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
const hashFile = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const count = (text, pattern) => (text.match(pattern) ?? []).length;
const changedClaim = /\b(?:proceeding|starting (?:the )?(?:work|implementation)|i(?:'m| am) (?:running|implementing|editing|changing)|i (?:ran|implemented|edited|changed)|work is (?:underway|running))\b/i;

if (hashFile(path.resolve(root, "../SKILL.md")) !== manifest.subject_sha256) throw new Error("Subject hash mismatch");
if (hashFile(path.join(root, "cases.jsonl")) !== manifest.cases_sha256) throw new Error("Cases hash mismatch");

function checks(testCase, text, result) {
  const assumed = count(text, /\[assumed\s*:/gi);
  const common = {
    "shows-prompt": /(?:\*\*)?improved(?:\s+prompt)?(?:\s*→)?(?:\*\*)?\s*(?:→|:|\n)/i.test(text),
    "shows-assumptions": /assumed|assumptions?/i.test(text),
    "shows-target": /target\s*:/i.test(text),
    "provenance-bounded": assumed >= 1 && assumed <= 3,
    "workspace-unchanged": result.workspace_unchanged === true,
    "does-not-claim-execution": !changedClaim.test(text),
    "preserves-precise-request": /src\/auth\.ts/i.test(text) && /parseToken/.test(text) && /decodeToken/.test(text) && /do not change behavior/i.test(text),
    "no-invented-assumptions": assumed === 0
  };
  return Object.fromEntries(testCase.assertions.map((id) => [id, common[id]]));
}

if (process.argv.includes("--self-test")) {
  const pass = "**Improved prompt**\n\nFix the auth message [assumed: failed login is the unclear case].\nAssumed: failed login.\nTarget: plain coding task.\nExecution: not started.";
  const fake = { workspace_unchanged: true };
  if (!Object.values(checks(cases[0], pass, fake)).every(Boolean)) throw new Error("Positive control failed");
  const leak = "Improved prompt: Fix login [assumed: vague feedback]. Assumed: vague feedback. Target: task. Proceeding with implementation.";
  if (checks(cases[2], leak, fake)["does-not-claim-execution"]) throw new Error("Execution-leak control passed");
  console.log("targeted scorer self-test passed");
  process.exit(0);
}

const evidenceSubject = manifest.evidence_subject_sha256 ?? manifest.subject_sha256;
const rootResults = path.join(root, "results", evidenceSubject.slice(0, 12));
const scored = [];
let totalTokens = 0;
for (const testCase of cases) {
  for (const arm of testCase.arms) {
    const resultFile = path.join(rootResults, testCase.id, arm, "result.json");
    if (!fs.existsSync(resultFile)) {
      console.log(JSON.stringify({ verdict: "INCOMPLETE", missing: `${testCase.id}:${arm}` }, null, 2));
      process.exit(0);
    }
    const result = JSON.parse(fs.readFileSync(resultFile, "utf8"));
    for (const evidence of [result.output, result.trace, result.workspace_before, result.workspace_after]) {
      if (hashFile(path.resolve(root, evidence.path)) !== evidence.sha256) throw new Error(`Evidence hash mismatch: ${evidence.path}`);
    }
    const observed = checks(testCase, fs.readFileSync(path.resolve(root, result.output.path), "utf8"), result);
    totalTokens += result.total_tokens;
    scored.push({ case_id: testCase.id, arm, checks: observed, tokens: result.total_tokens });
  }
}

const actorSessions = scored.length;
const failures = scored.flatMap((item) => Object.entries(item.checks).filter(([, pass]) => !pass).map(([id]) => `${item.case_id}:${item.arm}:${id}`));
const withinBudget = actorSessions <= manifest.maximum_cost.actor_sessions && totalTokens <= manifest.maximum_cost.total_tokens;
const verdict = failures.length || !withinBudget ? "ITERATE" : "SHIP";
const report = {
  schema_version: 1,
  evidence_tier: manifest.evidence_tier,
  subject_sha256: manifest.subject_sha256,
  evidence_subject_sha256: evidenceSubject,
  verdict,
  rationale: verdict === "SHIP" ? "The user-invoked shortcut faithfully applied the tested prompt pattern on all smoke cases." : "The shortcut failed a critical check or exceeded the frozen budget.",
  failures,
  total_tokens: totalTokens,
  actor_sessions: actorSessions,
  within_budget: withinBudget,
  scored
};
fs.writeFileSync(path.join(root, "results", "current-verdict.json"), `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
