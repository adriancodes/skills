// Proves the clean-diff fixture's premise: the candidate changes no behavior, and the input mutation predates it.
// Kept outside the fixture so an actor session never sees the expected answer.
import assert from "node:assert/strict";
import fs from "node:fs";

const load = async (name) =>
  (await import(`data:text/javascript,${encodeURIComponent(fs.readFileSync(new URL(`fixtures/clean-diff/${name}`, import.meta.url), "utf8"))}`)).formatReport;
const base = await load("base-report.js");
const candidate = await load("candidate-report.js");

for (const rows of [[], [{ name: "b", total: 1 }], [{ name: "b", total: 2.5 }, { name: "a", total: 10 }]]) {
  const forBase = structuredClone(rows);
  const forCandidate = structuredClone(rows);
  assert.equal(candidate(forCandidate), base(forBase));
  assert.deepEqual(forCandidate, forBase);
}
const rows = [{ name: "b", total: 1 }, { name: "a", total: 2 }];
base(rows);
assert.equal(rows[0].name, "a", "base already sorts the caller's array in place");
console.log("clean-diff fixture: outputs identical; input mutation is pre-existing");
