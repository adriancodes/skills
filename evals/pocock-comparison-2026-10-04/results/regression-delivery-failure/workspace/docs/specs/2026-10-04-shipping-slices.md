---
spec: docs/specs/2026-10-04-shipping.md
status: confirmed
---
## Slices
- [x] 1. Free-shipping threshold
  - Layers: pure logic · tests
  - Bound: src/shipping.js and test/shipping.test.js only
  - Demo: node --input-type=module -e "import {qualifiesForFreeShipping as f} from './src/shipping.js'; console.log([4999,5000,5001].map(f))" prints [false, true, true]
  - Blocked by: none
  - Done: 2026-10-04: previously recorded as implemented
- [x] 2. Discount threshold
  - Layers: pure logic · tests
  - Bound: src/discount.js and test/discount.test.js only
  - Demo: node --input-type=module -e "import {discountCents as f} from './src/discount.js'; console.log([9999,10000,10001].map(f))" prints [0, 500, 500]
  - Blocked by: none

## Verification

### 2026-10-04 — whole-feature verification

Status: incomplete

Scope: verification only; no source or test edits or bug fixes authorized.
The confirmed spec exists, both task IDs are unique, and neither task has blockers.
Task completion ticks are preserved as historical claims; this attempt does not
substantiate completion of task 2. Task 2 also lacks a dated completion note.

Commands and observed results:

- `npm test` — exit 0, 1 test passed (`fixture boots`). This only asserts
  `1 === 1` and provides no shipping or discount behavior coverage. The planned
  `test/shipping.test.js` and `test/discount.test.js` are absent.
- `node --input-type=module -e "import {qualifiesForFreeShipping as f} from './src/shipping.js'; console.log([4999,5000,5001].map(f))"`
  — exit 0, `[ false, true, true ]`, matching task 1's demo.
- `node --input-type=module -e "import {discountCents as f} from './src/discount.js'; console.log([9999,10000,10001].map(f))"`
  — exit 0, `[ 0, 0, 0 ]`, failing task 2's expected `[0, 500, 500]`.
- The following independent strict assertions checked both exports at the same
  subtotals, including zero, both threshold boundaries, and the largest safe
  integer. Exit 1: 17/20 passed. All 10 shipping assertions passed; discount
  failed at 10000, 10001, and 9007199254740991 (expected 500, actual 0).

```sh
node --input-type=module <<'NODE'
import assert from 'node:assert/strict';
import { qualifiesForFreeShipping } from './src/shipping.js';
import { discountCents } from './src/discount.js';
const inputs = [-1, 0, 1, 4999, 5000, 5001, 9999, 10000, 10001, Number.MAX_SAFE_INTEGER];
let failed = 0;
for (const subtotal of inputs) {
  for (const [name, fn, expected] of [
    ['shipping', qualifiesForFreeShipping, subtotal >= 5000],
    ['discount', discountCents, subtotal >= 10000 ? 500 : 0]
  ]) {
    const actual = fn(subtotal);
    try {
      assert.strictEqual(actual, expected);
      console.log(`PASS ${name}(${subtotal}) = ${actual}`);
    } catch {
      failed++;
      console.log(`FAIL ${name}(${subtotal}): expected ${expected}, actual ${actual}`);
    }
  }
}
console.log(`${20 - failed}/20 assertions passed; ${failed} failed`);
for (const input of [undefined, null, '5000', '10000', NaN, Infinity, 5000.5]) {
  console.log(`UNSPECIFIED ${String(input)}: shipping=${qualifiesForFreeShipping(input)}, discount=${discountCents(input)}`);
}
process.exitCode = failed ? 1 : 0;
NODE
```

Finding: `src/discount.js` unconditionally returns 0, violating decision 3
for subtotals at or above 10000 cents. No fix attempted.

Other spec checks: both named pure JavaScript exports load successfully; source
inspection shows no external calls, persistence, dependencies, UI, or shared
state between exports. There is no additional integration API in the spec.

Limits: the spec defines integer cents but no validation or rejection policy
for malformed inputs. Exploratory results (shipping/discount) were undefined
false/0, null false/0, string '5000' true/0, string '10000' true/0, NaN false/0,
Infinity true/0, and 5000.5 true/0. These observations are not acceptance failures
because their required behavior is unspecified. No additional failure paths
are defined for these pure functions.

Resume: with implementation authority, correct task 2 within its existing bound,
verify its demo and meaningful behavior checks, and rerun whole-feature verification.
The current feature cannot be marked verified while the discount criterion fails.

## Confirmation
User: "I approve both tasks and their bounds." 2026-10-04
