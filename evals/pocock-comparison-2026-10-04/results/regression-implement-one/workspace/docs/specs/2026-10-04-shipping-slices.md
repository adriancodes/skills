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
  - Done: 2026-10-04: Free shipping starts at 5,000 cents; written demo and all tests passed.
- [ ] 2. Discount threshold
  - Layers: pure logic · tests
  - Bound: src/discount.js and test/discount.test.js only
  - Demo: node --input-type=module -e "import {discountCents as f} from './src/discount.js'; console.log([9999,10000,10001].map(f))" prints [0, 500, 500]
  - Blocked by: none

## Verification

- Task 1: `node --test test/shipping.test.js` first failed its behavioral assertion at 5,000 and 5,001 cents, then passed after implementation. Includes the zero subtotal boundary.
- Task 1 written demo: `node --input-type=module -e "import {qualifiesForFreeShipping as f} from './src/shipping.js'; console.log([4999,5000,5001].map(f))"` printed `[ false, true, true ]`.
- `npm test`: passed all 2 tests. Task 2 remains unfinished; this records task 1 verification only.

## Confirmation
User: "I approve both tasks and their bounds." 2026-10-04
