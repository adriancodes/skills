#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "skill-router-"));
for (const [name, description] of [
  ["code-review", 'Use when the user asks to "review this PR" or inspect a branch for defects.'],
  ["diagnose", 'Use when the user asks to "diagnose this bug" or find the root cause of a failure.'],
]) {
  const dir = path.join(root, "skills", name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "SKILL.md"), `---\nname: ${name}\ndescription: ${description}\n---\n`);
}

fs.writeFileSync(path.join(root, "skills", "diagnose", "SKILL.md"), `---
name: diagnose
description: >
  Use when the user asks to "diagnose this bug" or find the root cause of a failure.
metadata:
  summary: Review pull requests, inspect branches, and find defects.
---
`);

const cases = path.join(root, "evals", "cases");
fs.mkdirSync(cases, { recursive: true });
fs.writeFileSync(path.join(cases, "code-review.json"), JSON.stringify({
  skill: "code-review",
  positive: ["Review this pull request for defects", "Check my branch before merge", "Inspect this diff"],
  behavior: { prompt: "Review this changed authorization path", expect: "Report only evidence-backed defects" },
  negative: [
    { prompt: "Find the root cause of this failing test", owner: "diagnose" },
    { prompt: "Debug this production failure", owner: "diagnose" },
  ],
}));
fs.writeFileSync(path.join(cases, "diagnose.json"), JSON.stringify({
  skill: "diagnose",
  positive: ["Diagnose this failing test", "Find the root cause", "Debug this production failure"],
  behavior: { prompt: "Diagnose this failing checkout", expect: "Prove one root cause before proposing a fix" },
  negative: [
    { prompt: "Review this pull request", owner: "code-review" },
    { prompt: "Inspect my branch before merge", owner: "code-review" },
  ],
}));

const run = () => spawnSync(process.execPath, ["scripts/route-skills.mjs", "--root", root], {
  cwd: path.resolve("."),
  encoding: "utf8",
});

const valid = run();
assert.equal(valid.status, 0, valid.stdout + valid.stderr);
assert.match(valid.stdout, /6\/6 positive prompts rank first/);

const diagnoseCase = JSON.parse(fs.readFileSync(path.join(cases, "diagnose.json"), "utf8"));
for (const field of ["positive", "negative"]) {
  for (const value of [undefined, null, {}, "invalid", []]) {
    fs.writeFileSync(path.join(cases, "diagnose.json"), JSON.stringify({ ...diagnoseCase, [field]: value }));
    const malformed = run();
    assert.equal(malformed.status, 1, `${field}=${JSON.stringify(value)} should fail`);
    assert.match(malformed.stderr, new RegExp(`needs at least \\d ${field} prompts`));
  }
}
fs.writeFileSync(path.join(cases, "diagnose.json"), JSON.stringify(diagnoseCase));

const diagnoseFile = path.join(root, "skills", "diagnose", "SKILL.md");
const originalSkill = fs.readFileSync(diagnoseFile, "utf8");
fs.writeFileSync(diagnoseFile, originalSkill.replace(/description: >[\s\S]*?metadata:/, "description: Review pull requests and inspect branches for defects.\nmetadata:"));
const brokenDescription = run();
assert.equal(brokenDescription.status, 1, "a broken description with unchanged cases should fail");
assert.match(brokenDescription.stderr, /expected diagnose/);
fs.writeFileSync(diagnoseFile, originalSkill);

delete diagnoseCase.behavior;
fs.writeFileSync(path.join(cases, "diagnose.json"), JSON.stringify(diagnoseCase));
const missingBehavior = run();
assert.notEqual(missingBehavior.status, 0, "a missing behavior declaration should fail");
assert.match(missingBehavior.stderr, /declared behavior case/);

fs.writeFileSync(path.join(cases, "diagnose.json"), JSON.stringify({
  skill: "diagnose",
  positive: ["Review this pull request", "Review this branch", "Inspect this diff"],
  behavior: { prompt: "Diagnose this failing checkout", expect: "Prove one root cause before proposing a fix" },
  negative: [
    { prompt: "Review this pull request", owner: "code-review" },
    { prompt: "Inspect my branch", owner: "code-review" },
  ],
}));

const invalid = run();
assert.notEqual(invalid.status, 0, "misrouted positive prompts should fail");
assert.match(invalid.stderr, /expected diagnose/);

const verifyDir = path.join(root, "skills", "verify-work");
fs.mkdirSync(verifyDir, { recursive: true });
fs.writeFileSync(path.join(verifyDir, "SKILL.md"), `---\nname: verify-work\ndescription: Use when the user asks to "verify this artifact" or attack finished work with hostile inputs.\n---\n`);
fs.writeFileSync(path.join(cases, "verify-work.json"), JSON.stringify({
  skill: "verify-work",
  positive: ["Verify this finished artifact", "Attack this parser with hostile inputs", "Verify the finished work before release"],
  behavior: { prompt: "Verify this finished parser", expect: "Execute hostile cases and report failures" },
  negative: [
    { prompt: "Review this pull request", owner: "code-review" },
    { prompt: "Diagnose this bug", owner: "diagnose" },
  ],
}));
fs.writeFileSync(path.join(cases, "diagnose.json"), JSON.stringify({
  skill: "diagnose",
  positive: ["Diagnose this failing test", "Find the root cause", "Debug this production failure"],
  behavior: { prompt: "Diagnose this failing checkout", expect: "Prove one root cause before proposing a fix" },
  negative: [
    { prompt: "Review this pull request", owner: "code-review" },
    { prompt: "Verify this finished artifact against hostile inputs", owner: "code-review" },
  ],
}));
const weakOwner = run();
assert.equal(weakOwner.status, 1, "a negative whose owner does not rank first should fail");
assert.match(weakOwner.stderr, /must rank first/);
assert.doesNotMatch(weakOwner.stderr, /expected /);

console.log("routing preflight tests pass");
