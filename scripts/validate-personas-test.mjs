#!/usr/bin/env node

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "persona-validator-"));
const agents = path.join(root, "agents");
fs.mkdirSync(agents);

const run = () => spawnSync(process.execPath, ["scripts/validate-personas.mjs", "--root", root], {
  cwd: path.resolve("."),
  encoding: "utf8",
});

fs.writeFileSync(path.join(agents, "reviewer.md"), `---
name: reviewer
description: Reviews changes with evidence.
---
# Reviewer
You are an evidence-led reviewer.
## Output Contract
Report findings first.
## Rules
Use the review skill.
## Composition
Do not invoke from another persona.
`);

assert.equal(run().status, 0, "a complete single-role persona should pass");

fs.writeFileSync(path.join(agents, "reviewer.md"), `---
name: reviewer
description: Reviews changes.
---
# Reviewer
You are a reviewer and implementer.
## Rules
Do everything.
`);

const invalid = run();
assert.notEqual(invalid.status, 0, "a persona without output and composition contracts should fail");
assert.match(invalid.stderr, /Output Contract/);
assert.match(invalid.stderr, /Composition/);

const complete = (description) => `---
name: reviewer
${description}
---
# Reviewer
You are an evidence-led reviewer.
## Output Contract
Report findings first.
## Rules
Use the review skill.
## Composition
Do not invoke from another persona.
`;

fs.writeFileSync(path.join(agents, "reviewer.md"), complete("description: >"));
const emptyFolded = run();
assert.notEqual(emptyFolded.status, 0, "an empty folded description should fail");
assert.match(emptyFolded.stderr, /missing description/);

fs.writeFileSync(path.join(agents, "reviewer.md"), complete("description: >\n  Reviews changes with evidence."));
assert.equal(run().status, 0, "a populated folded description should pass");

console.log("persona validator tests pass");
