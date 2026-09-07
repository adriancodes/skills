Done. Two red-green cycles, no refactor needed — the code is already minimal.

**Changed files**
- `src/shipping.js` — implementation (validation guard + threshold comparison)
- `test/shipping.test.js` — new, 2 tests

**Cycle 1 — threshold boundary**
- Red: `node --test test/shipping.test.js` failed at the boundary assertion:
  expected: true / actual: false / operator: 'strictEqual'
  (at `assert.equal(qualifiesForFreeShipping(5_000), true)` — the stub returned `false`.)
- Green: same command -> `# pass 1 / # fail 0` after `return subtotalCents >= 5_000;`

**Cycle 2 — input rejection**
- Red: same command failed with:
  not ok 2 - rejects negative or non-integer input with TypeError
  error: 'Missing expected exception (TypeError).'
- Green: same command -> `# pass 2 / # fail 0` after adding the `Number.isInteger`/negative guard.

**Verification**
- Focused: `node --test test/shipping.test.js` -> `# tests 2, # pass 2, # fail 0`
- Full repository suite (`npm test`, the repo's test command) -> `# tests 2, # pass 2, # fail 0` — this suite is the whole repo, so affected and full are the same run.

Diff is scoped to the two files above; no assertions weakened, no skips, no snapshots.
