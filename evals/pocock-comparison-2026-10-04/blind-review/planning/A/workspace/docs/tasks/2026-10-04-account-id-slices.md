---
status: proposed
spec: ../specs/2026-10-04-account-id.md
---
# Account identifier migration slices contract

Review and confirmation are required before implementation. This document plans
local work only; it creates no external tickets.

## Scope and invariants

The confirmed spec renames the shared public `accountId` identifier to
`customerId` across billing, exports, notifications, and analytics. Preserve
identifier values and every consumer's behavior. No database, UI, or new product
behavior is included.

Use expand → migrate → contract. Every task must finish in one fresh agent
session, leave a independently reviewable change, and pass the complete existing
CI suite plus its scoped compatibility checks. Keep both forms available through
all four consumer migrations. Never pair a consumer migration with removal of
the old shared form.

## Evidence and readiness blocker

This checkout contains the confirmed spec and four package READMEs. It does not
contain the shared implementation, consumer source, manifests, CI configuration,
or compatibility check commands. Consequently, code paths, release versions,
and existing test invocations cannot yet be named truthfully. All implementation
slices are blocked on task 0. A passing documentation check is not evidence of
passing migration CI.

The commands below define a **proposed future local check interface**, not an
existing tool. Task 0 must bind it to real repository commands before task 1.
From the implementation checkout root:

```sh
./scripts/check-account-id-migration shared
./scripts/check-account-id-migration billing
./scripts/check-account-id-migration exports
./scripts/check-account-id-migration notifications
./scripts/check-account-id-migration analytics
./scripts/check-account-id-migration all
```

Each command must execute real checks and return nonzero on failure, absent
source, absent checks, or an unknown scope. `all` runs the complete existing CI
suite and all four consumer compatibility checks. Scoped checks include the
relevant shared-type compatibility cases. No skipped checks or unconditional
success fallbacks count as acceptance. These commands are unavailable in this
documentation-only checkout and must not be reported as passed.

## Task 0 — Establish executable migration gates

- **Boundary:** one session; repository discovery, check wiring, and updating this
  contract with concrete paths and release mechanics only. No identifier changes.
- **Blocker:** access to the actual shared package, all four consumers, and their
  CI and compatibility checks.
- **Work:** identify the public type and its entry points, supported consumer and
  shared versions, dependency constraints, and package release process. Bind the
  proposed check interface to existing checks. Record exact underlying commands
  here and the files each later task owns. Run the unchanged baseline. Resolve
  baseline failures before proceeding.
- **Demo:** all existing packages pass against the unchanged shared public type;
  each scoped command actually invokes its package's compatibility checks.
- **Runnable acceptance check:** `./scripts/check-account-id-migration all`.
- **Exit:** real paths and checks recorded, baseline green, and the compatibility
  strategy supported by source evidence. If alias conflict semantics or public
  wire-format changes require a decision beyond the confirmed rename, stop and
  request that decision before task 1.

## Task 1 — Expand the shared public identifier

- **Boundary:** one session; shared type, shared compatibility implementation,
  exports, documentation, and focused compatibility checks only.
- **Blockers:** task 0 passes; confirmed compatibility semantics; baseline green.
- **Work:** expose a usable `customerId` form alongside the supported `accountId`
  form, preserving the identifier value. Keep existing callers valid without
  requiring them to supply a second field. Cover the supported old and new forms
  and any agreed behavior when both are supplied. Preserve existing public
  payload behavior where required by the compatibility contract.
- **Demo:** an unchanged old consumer and a new-form consumer both compile and
  behave correctly against the expanded shared package.
- **Runnable checks:** `./scripts/check-account-id-migration shared` and
  `./scripts/check-account-id-migration all`.
- **Exit:** additive change passes CI; record the compatible shared release and
  make it available through the normal release process before independently
  released consumers depend on it. Publishing is a separate authorized action.

## Task 2 — Migrate billing end to end

- **Boundary:** one fresh session; billing callers, its dependency constraints,
  public-boundary adapters if required, fixtures, and compatibility checks only.
- **Blockers:** task 1 passes; expanded shared version available; billing source
  and checks identified; working baseline green.
- **Work:** migrate billing's internal use to `customerId` across the complete
  identifier path. Preserve supported external inputs and outputs through the
  agreed compatibility boundary. Require a shared version supplying the new form.
- **Demo:** existing billing scenarios return the same results for the same
  identifier; supported legacy boundaries still work.
- **Runnable checks:** `./scripts/check-account-id-migration billing` and
  `./scripts/check-account-id-migration all`.
- **Exit:** green CI, no billing dependency on the old shared member, and a
  documented compatible billing release or release-ready artifact.

## Task 3 — Migrate exports end to end

- **Boundary:** one fresh session; exports callers, dependency constraints,
  boundary adapters if required, fixtures, and compatibility checks only.
- **Blockers:** task 2 passes for this serial plan; expanded shared version
  available; exports source and checks identified; working baseline green.
- **Work:** migrate exports' complete identifier path to `customerId`, preserving
  supported export inputs, outputs, and identifier values. Require the expanded
  shared version. Keep the shared legacy form available.
- **Demo:** existing export scenarios produce equivalent supported output and
  accept supported legacy boundary inputs.
- **Runnable checks:** `./scripts/check-account-id-migration exports` and
  `./scripts/check-account-id-migration all`.
- **Exit:** green CI, no exports dependency on the old shared member, and a
  documented compatible exports release or release-ready artifact.

## Task 4 — Migrate notifications end to end

- **Boundary:** one fresh session; notifications callers, dependency constraints,
  boundary adapters if required, fixtures, and compatibility checks only.
- **Blockers:** task 3 passes; expanded shared version available; notifications
  source and checks identified; working baseline green.
- **Work:** migrate notifications' complete identifier path to `customerId` while
  preserving supported inputs, outputs, and notification behavior. Require the
  expanded shared version. Keep the shared legacy form available.
- **Demo:** existing notification scenarios preserve identifier association and
  outcomes, including supported legacy boundary inputs.
- **Runnable checks:** `./scripts/check-account-id-migration notifications` and
  `./scripts/check-account-id-migration all`.
- **Exit:** green CI, no notifications dependency on the old shared member, and
  a documented compatible notifications release or release-ready artifact.

## Task 5 — Migrate analytics end to end

- **Boundary:** one fresh session; analytics callers, dependency constraints,
  boundary adapters if required, fixtures, and compatibility checks only.
- **Blockers:** task 4 passes; expanded shared version available; analytics source
  and checks identified; working baseline green.
- **Work:** migrate analytics' complete identifier path to `customerId` while
  preserving supported inputs, outputs, and analytics behavior. Require the
  expanded shared version. Keep the shared legacy form available.
- **Demo:** existing analytics scenarios preserve identifier association and
  results, including supported legacy boundary inputs.
- **Runnable checks:** `./scripts/check-account-id-migration analytics` and
  `./scripts/check-account-id-migration all`.
- **Exit:** green CI, no analytics dependency on the old shared member, and a
  documented compatible analytics release or release-ready artifact.

## Task 6 — Contract the shared public identifier

- **Boundary:** one session; removal of the shared legacy form, obsolete shared
  compatibility code and checks, and shared release documentation only.
- **Blockers:** tasks 1–5 pass; all four consumers migrated; compatible consumer
  releases available; dependency constraints prevent older unmigrated consumers
  from resolving the contracted shared release. Task 0 must establish the
  required version boundary and release policy. Removal stays blocked until the
  supported version matrix has no consumer requiring the old shared member.
- **Work:** remove `accountId` from the shared public type and implementation.
  Retain any independently supported consumer boundary adapters. Verify all
  public entry points expose the contracted form and all four consumers work
  against it. Record the release boundary required for public compatibility.
- **Demo:** all four migrated packages run against the contracted shared package;
  obsolete shared-member use fails the intended type/API check, and dependency
  compatibility checks exclude unmigrated package versions.
- **Runnable checks:** `./scripts/check-account-id-migration shared` and
  `./scripts/check-account-id-migration all`.
- **Exit:** full CI green, supported version matrix verified, and shared removal
  ready for the established release process.

## Handoff and session budget

Execute tasks serially in the order above. For each handoff, record touched files,
check commands and results, dependency/release evidence, remaining blockers, and
the next task. A task is complete only after its scoped checks and full CI pass.
If source discovery shows a listed task cannot fit one session, stop and revise
this contract into smaller compatibility-preserving batches before coding;
never hand off a broken CI state or combine package migrations to save sessions.

Review requested: confirm this task sequence and acceptance contract before any
implementation begins. Confirmation of the spec does not count as confirmation
of this proposed task plan.
