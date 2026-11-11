#!/usr/bin/env node
// Self-check for scripts/retrieve-guidance.mjs. Run: node check-retrieval.mjs
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { formatMarkdown, retrieveGuidance } from "../scripts/retrieve-guidance.mjs";

const ids = (packet) => packet.matches.map((match) => match.id);

// A task that matches nothing returns nothing, for every intent.
for (const intent of ["design", "implement", "review", "refactor", "simplify", "test", "operate"]) {
  const packet = retrieveGuidance({ task: "zzzz", intent });
  assert.deepEqual(ids(packet), [], `${intent}: nonsense task must not match`);
  assert.match(formatMarkdown(packet), /No relevant principles found/);
}

// The five query field labels are structure, not search terms.
const empty = retrieveGuidance({
  intent: "refactor",
  task: "Invariant: not applicable. Concurrency/distribution scope: not applicable. Atomicity/consistency mechanism: not applicable. State owner: not applicable. Failure/recovery: not applicable.",
});
assert.deepEqual(ids(empty), [], "an all-not-applicable query must not match");

const plain = "extract a long method that formats invoice totals";
const labelled = `Invariant: ${plain}. Concurrency/distribution scope: not applicable. Atomicity/consistency mechanism: not applicable. State owner: not applicable. Failure/recovery: not applicable.`;
assert.deepEqual(
  ids(retrieveGuidance({ intent: "refactor", task: labelled })),
  ids(retrieveGuidance({ intent: "refactor", task: plain })),
  "labels and not-applicable fields must not change the result",
);

// Field content still searches normally.
const real = retrieveGuidance({ intent: "implement", task: "Invariant: two workers must never claim the same job. Failure/recovery: retry after timeout." });
assert.ok(real.matches.length > 0, "a real query still matches");

// The command line explains itself and rejects values it would otherwise ignore.
const script = fileURLToPath(new URL("../scripts/retrieve-guidance.mjs", import.meta.url));
const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: "utf8" });
assert.equal(run("--help").status, 0);
assert.match(run("--help").stdout, /^Usage:/);
assert.equal(run("--intent", "review", "--task", "retry", "--max", "abc").status, 1);
assert.equal(run("--intent", "review", "--task", "retry", "--format", "xml").status, 1);
assert.doesNotMatch(run("--intent", "review", "--task", "retry after timeout").stdout, /\.mini\.md/);

console.log("retrieve-guidance: ok");
