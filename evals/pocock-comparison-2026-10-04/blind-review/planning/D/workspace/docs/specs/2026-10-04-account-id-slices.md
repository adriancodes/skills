---
status: draft-for-review
source: 2026-10-04-account-id.md
---
# Account identifier migration slices contract

This proposed breakdown implements the confirmed rename from `accountId` to `customerId` across billing, exports, notifications, and analytics. It awaits approval of task granularity and blocking edges before publication as individual local tickets. No migration implementation is included.

This is a wide shared-type refactor, sequenced as expand–contract. Keep both forms compatible while consumers migrate, so every task can land with CI green. Each package migration is bounded to one fresh agent session. No database migration, new behavior, or UI work is included.

## Proposed tasks

1. **Title: Expand the shared identifier with compatible customerId support**
   - **Blocked by:** None (can start immediately).
   - **What it delivers:** Consumers can adopt `customerId` while existing `accountId` consumers continue to behave as before.
   - **Acceptance criteria:**
     - The shared public type supports the new form alongside the old form, with unchanged identifier meaning and behavior.
     - Existing consumers remain compatible without having to migrate in this task.
     - Compatibility checks for all four packages and the project's CI pass with both forms supported.

2. **Title: Migrate billing to customerId**
   - **Blocked by:** 1 — Expand the shared identifier with compatible customerId support.
   - **What it delivers:** Billing uses `customerId` throughout its consumption of the shared identifier, preserving billing behavior.
   - **Acceptance criteria:**
     - All billing callers of the shared identifier use the new form and no longer require `accountId` support.
     - Billing compatibility checks verify preserved behavior with the expanded public type.
     - Other packages can still use either supported form, and CI passes after this task lands.
     - The migration is scoped to billing and fits one fresh agent session.

3. **Title: Migrate exports to customerId**
   - **Blocked by:** 1 — Expand the shared identifier with compatible customerId support.
   - **What it delivers:** Exports uses `customerId` throughout its consumption of the shared identifier, preserving export behavior.
   - **Acceptance criteria:**
     - All exports callers of the shared identifier use the new form and no longer require `accountId` support.
     - Exports compatibility checks verify preserved behavior with the expanded public type.
     - Other packages can still use either supported form, and CI passes after this task lands.
     - The migration is scoped to exports and fits one fresh agent session.

4. **Title: Migrate notifications to customerId**
   - **Blocked by:** 1 — Expand the shared identifier with compatible customerId support.
   - **What it delivers:** Notifications uses `customerId` throughout its consumption of the shared identifier, preserving notification behavior.
   - **Acceptance criteria:**
     - All notifications callers of the shared identifier use the new form and no longer require `accountId` support.
     - Notifications compatibility checks verify preserved behavior with the expanded public type.
     - Other packages can still use either supported form, and CI passes after this task lands.
     - The migration is scoped to notifications and fits one fresh agent session.

5. **Title: Migrate analytics to customerId**
   - **Blocked by:** 1 — Expand the shared identifier with compatible customerId support.
   - **What it delivers:** Analytics uses `customerId` throughout its consumption of the shared identifier, preserving analytics behavior.
   - **Acceptance criteria:**
     - All analytics callers of the shared identifier use the new form and no longer require `accountId` support.
     - Analytics compatibility checks verify preserved behavior with the expanded public type.
     - Other packages can still use either supported form, and CI passes after this task lands.
     - The migration is scoped to analytics and fits one fresh agent session.

6. **Title: Contract the shared identifier to customerId**
   - **Blocked by:** 2 — Migrate billing; 3 — Migrate exports; 4 — Migrate notifications; 5 — Migrate analytics.
   - **What it delivers:** The shared public identifier exposes only `customerId`, with all four consumers retaining their existing behavior.
   - **Acceptance criteria:**
     - Confirm no consumer still depends on the old form before removing `accountId` and temporary compatibility support.
     - Because the packages release independently, verify that the supported consumer releases are migrated before the shared removal can reach them; a merged migration alone is insufficient evidence.
     - All four packages' compatibility checks pass against the contracted public type.
     - CI passes after removal, with no database, UI, or behavior changes.

## Execution and verification contract

Task 1 must land first. Tasks 2–5 may then land in any order; none is gated by another package migration. Task 6 can start only after all four migrations are complete and the supported release combinations no longer need `accountId`.

Every task must pass the project's applicable CI checks before completion. The expansion and contraction additionally require all four package compatibility checks. Each migration must verify its own package compatibility and leave every other consumer working with the shared type. Discover the actual check commands in the implementation checkout; this fixture supplies no executable checks or source implementation.

## Review requested

- Does the granularity feel right, or are any tasks too coarse or too fine?
- Do the blocking edges represent genuine gates, including readiness of independently released consumers before contraction?
- Should any tasks be merged or split further?

After approval, publish one Markdown file per task in dependency order using the local ticket template and `ready-for-agent` status. This draft does not mark tasks as approved or ready for implementation.
