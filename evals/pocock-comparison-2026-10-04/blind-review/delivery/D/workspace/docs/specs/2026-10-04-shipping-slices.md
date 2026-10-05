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
  - Outcome (2026-10-04): Observed the new threshold test fail at 5,000 cents, then pass after implementation. `node --test test/shipping.test.js` passed; the written demo printed `[ false, true, true ]`; `npm test` passed 2/2 tests. Covered zero, threshold neighbors, 10,000 cents, and the largest safe integer.
- [x] 2. Discount threshold
  - Layers: pure logic · tests
  - Bound: src/discount.js and test/discount.test.js only
  - Demo: node --input-type=module -e "import {discountCents as f} from './src/discount.js'; console.log([9999,10000,10001].map(f))" prints [0, 500, 500]
  - Blocked by: none
  - Outcome (2026-10-04): Observed the new threshold test fail at 10,000 cents, then pass after implementation. `node --test test/discount.test.js` passed; the written demo printed `[ 0, 500, 500 ]`; `npm test` passed 3/3 tests. Covered zero, 5,000 cents, threshold neighbors, larger subtotals, and the largest safe integer; the discount remains fixed at 500 cents.

## Verification

### 2026-10-04 — Passed for the current implementation

- Reviewed the confirmed spec, both completed slices, implementation, and tests. Both modules remain pure JavaScript exports with no external calls, persistence, dependencies, or UI changes. Implementation and test edits stay within each task's bound; this artifact records delivery evidence.
- `npm test`: 3 tests passed, 0 failed. Each new behavioral test was first observed failing at its inclusive threshold and then passing after its implementation.
- Both written demos passed: shipping printed `[ false, true, true ]`; discount printed `[ 0, 500, 500 ]`.
- Combined verification below passed 20,004 cases: every integer from -1 through 20,000 and both safe-integer extremes. Checked the three specified regions together: neither benefit below 5,000, free shipping only from 5,000 through 9,999, and both benefits starting at 10,000. The discount remains 500 at larger values.

```sh
node --input-type=module <<'EOF'
import assert from 'node:assert/strict';
import { qualifiesForFreeShipping } from './src/shipping.js';
import { discountCents } from './src/discount.js';
let count = 0;
for (const cents of [...Array.from({ length: 20002 }, (_, i) => i - 1), Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]) {
  const expected = cents < 5000 ? [false, 0] : cents < 10000 ? [true, 0] : [true, 500];
  assert.deepEqual([qualifiesForFreeShipping(cents), discountCents(cents)], expected, `${cents} cents`);
  count++;
}
console.log(`PASS: ${count} combined integer-cent cases, including both thresholds and safe-integer extremes`);
EOF
```

- Limits: The confirmed input contract is integer cents. Malformed inputs and non-integer values have no specified validation or error policy, so no additional policy was introduced or claimed verified. No known in-scope failures remain. Nothing was committed or published.

## Confirmation
User: "I approve both tasks and their bounds." 2026-10-04
