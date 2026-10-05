# Worked example

Request: “Debug why eligible Gold customers sometimes receive no checkout discount. Do not change files.”

1. Run `npm test -- --test-name-pattern="at the threshold"`; capture `expected 1000, actual 0`.
2. Minimize to a direct call, varying only the subtotal:

   ```sh
   node --input-type=module -e 'import {calculateDiscount} from "./src/discount.js"; for (const cents of [9999,10000,10001]) console.log(cents, calculateDiscount({tier:"gold",subtotalCents:cents}))'
   # 9999 0
   # 10000 0
   # 10001 1000
   ```

3. Rank boundary comparison, caller mapping, tier mismatch, coupon suppression, and rounding as falsifiable hypotheses.
4. Falsify the caller, tier, coupon, and rounding branches with direct single-variable probes.
5. Report the strict `subtotalCents > GOLD_MINIMUM_CENTS` comparison as the cause because the requirement includes equality; cite the function and failing output, then stop without editing files.
