Done. I did not write the implementation first — a first-run-green test proves nothing, and running red first cost about a minute. Evidence:

**Cycle 1 — threshold (README: true at >= 5,000 cents)**
- Red: `node --test test/shipping.test.js` against the pre-existing stub failed on the behavioral assertion:
  name: 'AssertionError' / expected: true / actual: false / operator: 'strictEqual'
- Green: after implementing the comparator, same command: `# pass 1 / # fail 0`.

**Cycle 2 — input validation (README: TypeError for negative or non-integer)**
- Red: same command failed with `error: 'Missing expected exception (TypeError).'` (`# pass 1 / # fail 1`).
- Green: after adding the integer/negative guard: `# pass 2 / # fail 0`.

**Full suite:** `npm test` — `# tests 2 / # pass 2 / # fail 0`. The repo has only this suite, so focused, affected, and full runs are the same command.

**Files changed** (all inside the workspace):
- `src/shipping.js` — threshold plus TypeError guard (pre-existing stub, not reverted; only its new expectations were tested)
- `test/shipping.test.js` — new, 2 tests covering the boundary pair (4,999/5,000), zero, and three invalid inputs

No assertions weakened, no skips, no snapshot updates. Pure function, so no persistence boundary to prove.
