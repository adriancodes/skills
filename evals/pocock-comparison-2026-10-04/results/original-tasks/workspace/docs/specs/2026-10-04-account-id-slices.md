---
spec: docs/specs/2026-10-04-account-id.md
status: open
---
## Slices
- [ ] 1. Add the compatible customerId form
  - Layers: shared public type · identifier compatibility behavior · test
  - Bound: The shared identifier's public definition and compatibility handling, focused checks for legacy accountId and new customerId forms, and the four packages' existing compatibility suites. Preserve legacy caller behavior without migrating package callers. Fit exploration and changes into one fresh agent session.
  - Demo: Run focused compatibility checks showing that legacy accountId consumers and customerId consumers retain the same identifier behavior. Run billing, exports, notifications, and analytics compatibility checks and required repository CI checks; all must pass before this slice is done.
  - Blocked by: none
- [ ] 2. Migrate billing callers
  - Layers: billing callers · shared public type integration · test
  - Bound: Identifier consumption and associated compatibility fixtures and assertions inside packages/billing only. Use the compatible shared customerId form from slice 1. Keep both shared forms available. Include exploration and migration in one fresh agent session.
  - Demo: Run billing compatibility checks demonstrating unchanged billing behavior with customerId and no remaining billing dependence on accountId. Run all four packages' compatibility checks and required repository CI checks; all must pass before this slice is done.
  - Blocked by: 1
- [ ] 3. Migrate exports callers
  - Layers: exports callers · shared public type integration · test
  - Bound: Identifier consumption and associated compatibility fixtures and assertions inside packages/exports only. Use the compatible shared customerId form from slice 1. Keep both shared forms available. Include exploration and migration in one fresh agent session.
  - Demo: Run exports compatibility checks demonstrating unchanged export behavior with customerId and no remaining exports dependence on accountId. Run all four packages' compatibility checks and required repository CI checks; all must pass before this slice is done.
  - Blocked by: 1
- [ ] 4. Migrate notifications callers
  - Layers: notifications callers · shared public type integration · test
  - Bound: Identifier consumption and associated compatibility fixtures and assertions inside packages/notifications only. Use the compatible shared customerId form from slice 1. Keep both shared forms available. Include exploration and migration in one fresh agent session.
  - Demo: Run notifications compatibility checks demonstrating unchanged notification behavior with customerId and no remaining notifications dependence on accountId. Run all four packages' compatibility checks and required repository CI checks; all must pass before this slice is done.
  - Blocked by: 1
- [ ] 5. Migrate analytics callers
  - Layers: analytics callers · shared public type integration · test
  - Bound: Identifier consumption and associated compatibility fixtures and assertions inside packages/analytics only. Use the compatible shared customerId form from slice 1. Keep both shared forms available. Include exploration and migration in one fresh agent session.
  - Demo: Run analytics compatibility checks demonstrating unchanged analytics behavior with customerId and no remaining analytics dependence on accountId. Run all four packages' compatibility checks and required repository CI checks; all must pass before this slice is done.
  - Blocked by: 1
- [ ] 6. Remove the legacy accountId form
  - Layers: shared public type · four-package integration · test
  - Bound: Remove accountId from the shared public identifier and its temporary compatibility handling and legacy-only checks. Inspect identifier consumption in packages/billing, packages/exports, packages/notifications, and packages/analytics to verify completion; their caller migrations belong to slices 2–5. Keep customerId compatibility coverage. Fit exploration and removal into one fresh agent session. Begin only after all four consumer migrations are integrated and their required independently released customerId-compatible versions are available.
  - Demo: Confirm the shared public type no longer exposes accountId and none of the four packages requires it. Run customerId checks, all four packages' compatibility suites, and required repository CI checks against the final shared type; all must pass before this slice is done.
  - Blocked by: 2, 3, 4, 5

## Verification
<!-- written by the whole-feature verification pass when it runs; empty until then -->

## Confirmation
<!-- user confirmation words and date; empty while status is open -->
