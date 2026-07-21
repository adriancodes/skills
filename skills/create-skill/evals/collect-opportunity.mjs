#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const resultRoot = path.join(root, "results", "opportunity");
const manifestFile = path.join(root, "suite-manifest.json");
const cases = fs
  .readFileSync(path.join(root, "cases.jsonl"), "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line))
  .filter((item) => item.split === "discovery");

const entries = [];
for (const testCase of cases) {
  for (const arm of ["none", "prompt"]) {
    const file = path.join(resultRoot, testCase.id, arm, "run-1", "manifest-entry.json");
    if (!fs.existsSync(file)) throw new Error(`Missing opportunity evidence: ${file}`);
    entries.push(JSON.parse(fs.readFileSync(file, "utf8")));
  }
}

const residuals = entries
  .filter((entry) => entry.arm === "prompt")
  .flatMap((entry) =>
    Object.entries(entry.assertions)
      .filter(([, result]) => result.score === 0)
      .map(([id]) => id),
  );
if (residuals.length === 0) throw new Error("Strong prompt has no scored residual failure; abandon the skill instead of freezing effectiveness evals.");

const rationaleFile = path.join(resultRoot, "opportunity-decision.json");
const rationale = {
  decision: "PROTOTYPE",
  strongest_prompt_residual_assertion_ids: [...new Set(residuals)].sort(),
  reason: "The strongest realistic prompt recovered cheaper-mechanism selection but still failed behavioral opportunity testing, reusable-mechanism quality, and evidence-appropriate verdict recording.",
};
fs.writeFileSync(rationaleFile, `${JSON.stringify(rationale, null, 2)}\n`);
const sha256 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
manifest.opportunity_evidence = entries;
manifest.opportunity_decision = {
  decision: "PROTOTYPE",
  residual_assertion_ids: rationale.strongest_prompt_residual_assertion_ids,
  rationale: { path: path.relative(root, rationaleFile), sha256: sha256(rationaleFile) },
};
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(rationale, null, 2));
