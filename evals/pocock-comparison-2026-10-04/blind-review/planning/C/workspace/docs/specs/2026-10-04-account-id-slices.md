---
spec: docs/specs/2026-10-04-account-id.md
status: open
---

# Account identifier migration

Preserve existing consumer behavior while replacing the public `accountId` identifier with `customerId` across billing, exports, notifications, and analytics. Use expand–migrate–contract so every task can land with green CI. No database migration, new behavior, or UI work is included.

## Repository grounding

The confirmed spec identifies the shared public type and four independently released consumers. The visible consumer surfaces are `packages/billing`, `packages/exports`, `packages/notifications`, and `packages/analytics`; each README describes package compatibility checks against the public type.

This checkout contains documentation only. The shared type's source path, consumer source files, test commands, CI configuration, and release configuration are unavailable. At the start of task 1, locate those surfaces in the implementation checkout and record the exact baseline and validation commands here before changing code. The compatibility representation and source paths are implementation choices; preserving old consumers and supporting migrated consumers are required behavior. Do not substitute invented commands or treat this planning checkout as evidence that CI passes.

## Slices

- [ ] 1. Expand the shared public identifier compatibly
  - Layers: shared public type and identifier handling · public compatibility tests · four consumer compatibility checks
  - Bound: One agent session covering only the shared identifier definition, the handling needed to support `customerId` alongside `accountId`, and focused compatibility coverage. Locate and record the actual source/check surfaces first. Keep all four packages' callers on `accountId`; avoid unrelated shared API changes.
  - Demo: Run the recorded shared checks and all four package compatibility suites. Existing `accountId` consumers must still compile and behave as before; a `customerId` consumer must compile and preserve the same identifier semantics. Run required repository CI checks, including unchanged consumers, and require green results before completion. For independently released packages, make the compatible shared version available through the repository's normal dependency/release process before any migrated consumer relies on it.
  - Blocked by: none

- [ ] 2. Migrate billing to customerId
  - Layers: billing identifier callers and dependency reference · billing tests · shared compatibility checks
  - Bound: One fresh agent session limited to identifier references in `packages/billing`, its package-owned tests/fixtures, and its dependency on the compatible shared form. Preserve billing behavior and leave the other packages' callers unchanged.
  - Demo: Run the recorded billing compatibility and behavior checks using `customerId`; compare existing billing outcomes with the baseline. Run required repository CI checks to prove remaining `accountId` consumers still work. Verify billing no longer consumes the legacy identifier before marking complete.
  - Blocked by: 1

- [ ] 3. Migrate exports to customerId
  - Layers: exports identifier callers and dependency reference · exports tests · shared compatibility checks
  - Bound: One fresh agent session limited to identifier references in `packages/exports`, its package-owned tests/fixtures, and its dependency on the compatible shared form. Preserve export behavior and avoid changing other packages' callers.
  - Demo: Run the recorded exports compatibility and behavior checks using `customerId`; compare existing export outcomes with the baseline. Run required repository CI checks to prove both migrated and legacy consumers remain compatible. Verify exports no longer consumes the legacy identifier before marking complete.
  - Blocked by: 1

- [ ] 4. Migrate notifications to customerId
  - Layers: notifications identifier callers and dependency reference · notifications tests · shared compatibility checks
  - Bound: One fresh agent session limited to identifier references in `packages/notifications`, its package-owned tests/fixtures, and its dependency on the compatible shared form. Preserve notification behavior and avoid changing other packages' callers.
  - Demo: Run the recorded notifications compatibility and behavior checks using `customerId`; compare existing notification outcomes with the baseline. Run required repository CI checks to prove both migrated and legacy consumers remain compatible. Verify notifications no longer consumes the legacy identifier before marking complete.
  - Blocked by: 1

- [ ] 5. Migrate analytics to customerId
  - Layers: analytics identifier callers and dependency reference · analytics tests · shared compatibility checks
  - Bound: One fresh agent session limited to identifier references in `packages/analytics`, its package-owned tests/fixtures, and its dependency on the compatible shared form. Preserve analytics behavior and avoid changing other packages' callers.
  - Demo: Run the recorded analytics compatibility and behavior checks using `customerId`; compare existing analytics outcomes with the baseline. Run required repository CI checks to prove both migrated and legacy consumers remain compatible. Verify analytics no longer consumes the legacy identifier before marking complete.
  - Blocked by: 1

- [ ] 6. Contract the shared public identifier to customerId
  - Layers: shared public type and legacy handling · shared API tests · all four consumer compatibility suites
  - Bound: One agent session limited to removing the shared `accountId` form and obsolete compatibility handling, updating focused shared tests, and validating the final consumer dependency versions. Do not absorb unfinished consumer migrations into this task.
  - Demo: Confirm tasks 2–5 passed and their migrated consumer versions are available for the independent release flow. Search the shared API and all four consumer source/test surfaces for legacy identifier use; account for any historical documentation references separately. Remove the legacy form only when no active consumer remains. Run shared checks, all four package compatibility and behavior suites against the contracted type, and every required repository CI check. Require unchanged behavior and green results before completion.
  - Blocked by: 2, 3, 4, 5

## Execution gates

Task 1 can start immediately after breakdown approval. Tasks 2–5 have no prerequisite on one another: each consumes the compatible shared form and fits a separate fresh session. They may land in any order, with CI run on the current integrated revision after each task. Task 6 is necessarily serial after all four consumer migrations and their compatibility checks succeed.

Each completed task must leave CI green; include its tests within the task. If implementation discovery shows a bound cannot fit one session or a batch cannot land independently with green CI, stop and recut this open contract for review before implementation proceeds. Do not silently combine package batches or waive the per-task CI requirement.

Use `[x]` only after the task's demo and required checks pass, and append `Done: <date>: <one-line outcome>` inside that task. Keep whole-migration verification separate from task-level evidence.

## Verification

## Confirmation

The spec records requirements approval on 2026-10-04. Approval of this six-task breakdown is pending; no breakdown confirmation has been received. Keep `status: open` until the user approves it, then record their actual confirmation words and date here before setting `status: confirmed`.
