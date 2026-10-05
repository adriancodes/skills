---
spec: docs/specs/2026-10-04-account-id.md
status: open
---
## Slices
- [ ] 1. Add the compatible customerId public form
  - Layers: shared public identifier contract · compatibility behavior · test
  - Bound: The shared identifier's public type and the compatibility handling needed to accept customerId alongside accountId; focused shared-contract checks and the four existing consumer compatibility suites. Preserve accountId support and all existing consumer behavior. No consumer migration, database, UI, or new behavior. Locate the shared implementation and check commands within this session; this workspace provides only documentation.
  - Demo: Exercise the shared contract with the existing accountId form and the added customerId form, showing equivalent identifier behavior; all four unchanged consumers still pass their compatibility checks and repository CI is green. Use executable compatibility checks because this change has no specified screen or request surface.
  - Blocked by: none
- [ ] 2. Migrate billing to customerId
  - Layers: billing callers · shared identifier integration · billing compatibility test
  - Bound: Identifier reads, writes, and public-type call sites within packages/billing, plus billing's related fixtures and compatibility assertions. One fresh agent session, including exploration. Retain shared accountId support; no edits to exports, notifications, or analytics callers.
  - Demo: Run billing's existing compatibility scenarios through customerId and show their outcomes are preserved; billing's checks, all other consumer compatibility checks, and repository CI pass with the additive shared contract.
  - Blocked by: 1
- [ ] 3. Migrate exports to customerId
  - Layers: exports callers · shared identifier integration · exports compatibility test
  - Bound: Identifier reads, writes, and public-type call sites within packages/exports, plus exports' related fixtures and compatibility assertions. One fresh agent session, including exploration. Retain shared accountId support; no edits to billing, notifications, or analytics callers.
  - Demo: Run exports' existing compatibility scenarios through customerId and show their outcomes are preserved; exports' checks, all other consumer compatibility checks, and repository CI pass with the additive shared contract.
  - Blocked by: 1
- [ ] 4. Migrate notifications to customerId
  - Layers: notifications callers · shared identifier integration · notifications compatibility test
  - Bound: Identifier reads, writes, and public-type call sites within packages/notifications, plus notifications' related fixtures and compatibility assertions. One fresh agent session, including exploration. Retain shared accountId support; no edits to billing, exports, or analytics callers.
  - Demo: Run notifications' existing compatibility scenarios through customerId and show their outcomes are preserved; notifications' checks, all other consumer compatibility checks, and repository CI pass with the additive shared contract.
  - Blocked by: 1
- [ ] 5. Migrate analytics to customerId
  - Layers: analytics callers · shared identifier integration · analytics compatibility test
  - Bound: Identifier reads, writes, and public-type call sites within packages/analytics, plus analytics' related fixtures and compatibility assertions. One fresh agent session, including exploration. Retain shared accountId support; no edits to billing, exports, or notifications callers.
  - Demo: Run analytics' existing compatibility scenarios through customerId and show their outcomes are preserved; analytics' checks, all other consumer compatibility checks, and repository CI pass with the additive shared contract.
  - Blocked by: 1
- [ ] 6. Remove accountId after all four consumers migrate
  - Layers: shared public identifier contract · four-package compatibility integration · test
  - Bound: Remove the shared accountId public form and its temporary compatibility handling; update only shared-contract checks and legacy compatibility assertions made obsolete by removal. Audit billing, exports, notifications, and analytics for remaining dependencies on the old form and verify their independently released package compatibility before removal. No bulk caller migration in this session; any remaining callers return to their package slice. One fresh agent session, including exploration and the four-package verification pass.
  - Demo: The public contract exposes customerId without accountId; all four migrated packages pass their existing behavior and compatibility checks against that contract, and repository CI is green. Confirm the removal does not leave any of the four independently released consumers dependent on accountId.
  - Blocked by: 2, 3, 4, 5

## Verification
<!-- written by the whole-feature verification pass when it runs; empty until then -->

## Confirmation
<!-- user confirmation words and date; empty while status is open -->
