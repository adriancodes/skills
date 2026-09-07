#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const skill = read("SKILL.md");
const rules = read("references/rules.md");
const checklist = read("references/validation-checklist.md");

const interview = skill.indexOf("### Phase 0: Interview and Confirm Intent");
const opportunity = skill.indexOf("### Phase 1: Scope and Test the Opportunity");
assert.ok(interview >= 0 && opportunity > interview, "intent confirmation must precede opportunity testing");

const expectations = [
  [skill, /post-invocation, adaptive, decision-changing question/i, "skill requires an adaptive question"],
  [skill, /brief confirmation is a separate gate and never counts/i, "brief confirmation is separate"],
  [skill, /Ask one question per turn/i, "questions are one per turn"],
  [skill, /2–4 concrete, mutually exclusive choices plus an Other\/free-form option/i, "question choices are bounded"],
  [skill, /does not waive it/i, "speed does not waive the interview"],
  [skill, /user separately confirms the Skill Brief/i, "brief needs separate confirmation"],
  [skill, /confirmed brief is the source of truth/i, "brief remains authoritative"],
  [skill, /evaluate → explain → recommend → revise/i, "iteration loop is explicit"],
  [skill, /user explicitly accepts the skill/i, "acceptance gate is explicit"],
  [skill, /user satisfaction as evidence that a failing skill works/i, "satisfaction cannot override evidence"],
  [skill, /total repeated-use utility/i, "utility includes recurring cost"],
  [skill, /delivery opportunity/i, "delivery residual is considered"],
  [rules, /## Confirmed Skill Brief/, "registry owns the brief rules"],
  [rules, /brief confirmation does not count as that answer/i, "registry separates the gates"],
  [rules, /obtain explicit user confirmation or correction/i, "registry requires confirmation"],
  [rules, /satisfaction never overrides failing evidence/i, "registry protects evidence"],
  [rules, /delivery residual/i, "registry defines delivery residual"],
  [checklist, /## Intent and Skill Brief/, "checklist covers intent"],
  [checklist, /post-invocation, decision-changing answer preceded the Skill Brief/i, "checklist checks the adaptive answer"],
  [checklist, /explicit interview waiver/i, "checklist checks waiver evidence"],
  [checklist, /SHIP includes explicit user acceptance/i, "checklist checks acceptance"],
];

for (const [source, pattern, message] of expectations) assert.match(source, pattern, message);

console.log("create-skill workflow contract passes");
