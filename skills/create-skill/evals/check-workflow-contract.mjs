#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const skill = read("SKILL.md");
const rules = read("references/rules.md");
const checklist = read("references/validation-checklist.md");
const failures = [];

function requireText(source, name, text) {
  if (!source.includes(text)) failures.push(`${name} is missing: ${text}`);
}

const interview = skill.indexOf("### Phase 0: Interview and Confirm Intent");
const opportunity = skill.indexOf("### Phase 1: Scope and Test the Opportunity");
if (interview === -1 || opportunity === -1 || interview > opportunity) {
  failures.push("intent confirmation must precede opportunity testing");
}

for (const text of [
  "Begin every creation or behavior-changing update with at least one post-invocation, adaptive, decision-changing question",
  "Brief confirmation is a separate gate and never counts as the interview question",
  "Ask one adaptive question per turn",
  "2–4 concrete, mutually exclusive choices plus an Other/free-form choice",
  "recommended choice first",
  "they do not waive it",
  "the user separately confirms the Skill Brief",
  "Confirmation-only is incomplete",
  "Use the confirmed brief as the source of truth",
  "evaluate → explain → recommend → revise",
  "user explicitly accepts the skill",
  "user satisfaction as evidence that a failing skill works",
  "total repeated-use utility",
  "delivery opportunity",
]) {
  requireText(skill, "SKILL.md", text);
}

for (const text of [
  "## Confirmed Skill Brief",
  "brief confirmation does not count as that answer",
  "only necessary questions as constraints on question quality",
  "obtain explicit user confirmation or correction",
  "apply the user's selection",
  "satisfaction never overrides failing evidence",
  "delivery residual",
]) {
  requireText(rules, "references/rules.md", text);
}

for (const text of [
  "## Intent and Skill Brief",
  "At least one post-invocation, decision-changing answer preceded the Skill Brief",
  "Any zero-question path records an explicit interview waiver",
  "Scope and eval cases trace to confirmed use cases",
  "SHIP includes explicit user acceptance",
]) {
  requireText(checklist, "references/validation-checklist.md", text);
}

if (failures.length) {
  for (const failure of failures) console.error(`✗ ${failure}`);
  process.exit(1);
}

console.log("create-skill workflow contract passes");
