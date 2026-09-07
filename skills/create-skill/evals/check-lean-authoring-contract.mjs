#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

const rules = read("skills/create-skill/references/rules.md");
const checklist = read("skills/create-skill/references/validation-checklist.md");
const template = read("skills/create-skill/references/body-template.md");
const personaTemplate = read("skills/create-skill/references/persona-template.md");
const validator = read("scripts/skills.mjs");

assert.match(rules, /No minimum length/);
assert.match(rules, /one behavioral decision per sentence or bullet/i);
assert.match(rules, /Put each `Done when …` criterion on its own line/);
assert.match(rules, /Required core.*Scope.*action.*verification/is);
assert.doesNotMatch(rules, /Simple technique \| 500–800 words/);

assert.match(checklist, /Second person is reserved for personas and always-on identity text/);
assert.match(checklist, /Optional sections appear only when they change behavior/);
assert.doesNotMatch(checklist, /No second person \("you", "your"\) anywhere/);
assert.doesNotMatch(checklist, /Error messages and symptoms in "When to Use" section/);
assert.doesNotMatch(checklist, /"Do Not Use When" section is present and specific/);
assert.doesNotMatch(rules, /collisions with existing skills explicitly addressed in "Do Not Use When"/);

assert.match(template, /Smallest valid body/);
assert.match(personaTemplate, /You are a \[concrete senior role\]/);
assert.match(personaTemplate, /## Output Contract/);
assert.match(personaTemplate, /## Composition/);
assert.match(personaTemplate, /Do not invoke from another persona/);
assert.match(validator, /function styleMetrics/);
assert.match(validator, /style warning/);

console.log("lean authoring contract passes");
