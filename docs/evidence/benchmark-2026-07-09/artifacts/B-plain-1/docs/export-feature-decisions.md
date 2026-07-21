# Export Feature — Requirements & Decisions Log

Status: settled (ready to build)
Date: 2026-07-09
Owner: admin@pertinent.ai

This file records the decisions made while spec'ing the workspace-data export
feature, and the reasoning behind the security-sensitive ones. The full spec is
in `export-feature-spec.md`. Where the requester deferred ("your call"), the
chosen default is recorded here so it can be revisited.

---

## 1. What we were asked to build (verbatim intent)

- Users can export their workspace data as CSV or JSON.
- Exports are **strictly scoped to the requesting user's workspace — no
  cross-workspace data, ever.**
- Admins can export **any** workspace through the **same endpoint**.
- Async generation; email a download link when the export is ready.

## 2. The core tension (called out explicitly)

Requirements #2 and #3 pull against each other: "no cross-workspace data, ever"
vs. "admins can export any workspace." If handled carelessly this becomes the
feature's main vulnerability — an authorization check that is easy to get wrong
and, if wrong, leaks another tenant's entire dataset.

**Decision — resolve the tension by construction, not by a flag:**

- The default data path is workspace-scoped at the query layer. Every export
  query is filtered by `workspace_id` derived from server-side authorization
  context, **never** from a client-supplied parameter for normal users.
- Cross-workspace access is a *separate, explicit* privilege, not a relaxation
  of the default. A normal user (including a workspace-level "admin") can only
  ever export their own workspace. "Any workspace" is reserved for a distinct
  **platform/global admin** role.
- "Same endpoint" is honored: one endpoint, but the target-workspace parameter
  is only accepted from — and only honored for — a caller who holds the global
  admin privilege. For everyone else the parameter is ignored (export is forced
  to the caller's own workspace); supplying it does not error-leak.
- Authorization is re-checked at **download time**, not only at request time.
  A signed link is not, by itself, sufficient authority to receive the bytes.

Decisions below flow from this.

## 3. Open questions raised → resolution

Requester response to all clarifying questions was "your call." Defaults chosen:

| # | Question | Decision (default) |
|---|----------|--------------------|
| Q1 | What is "workspace data"? Which entities? | A **versioned export manifest** listing exactly which entities/fields are exportable. v1 covers the primary workspace-owned entities (projects, records, members-metadata, settings). Secrets/credentials and other users' PII beyond membership metadata are excluded. Manifest is the single source of truth; adding an entity later is a manifest change + review. |
| Q2 | Is "admin" a workspace admin or a global admin? | **Global/platform admin** for cross-workspace. Workspace admins get no cross-workspace power. (See §2.) |
| Q3 | Does the emailed link require auth to download? | **Yes.** Link points at the app; download endpoint requires an authenticated session AND re-runs authorization against the export's owning workspace. The signed token scopes *which* export, not *whether you may have it*. |
| Q4 | Link TTL / file retention? | Signed link valid **24h**. Generated file retained **7 days** then hard-deleted from object storage. Expired/deleted → re-request required. |
| Q5 | Where are generated files stored? | Object storage (S3-compatible), **server-side encrypted at rest**, private bucket, no public ACL. Access only via the app's download endpoint. |
| Q6 | CSV shape for relational data? | CSV export = **one CSV per entity, delivered as a single ZIP** (workspace data is relational; a single flat CSV would be lossy). JSON export = one structured JSON document (or ZIP if large). |
| Q7 | Concurrency / abuse limits? | **One in-flight export per (user, workspace)**; requesting again while one is queued/running returns the existing job. Per-user rate limit + cooldown on completed exports. |
| Q8 | Audit logging? | **Every** export is audit-logged (actor, workspace, format, timestamp, job id, outcome). **Cross-workspace admin exports are logged with elevated detail** (actor, target workspace, reason/justification captured at request time) and are separately queryable. |
| Q9 | Email failure handling? | Email send is retried with backoff. Export success is not contingent on email — the export also appears in the app's export history so a lost email is recoverable. Email contains only the link, never the data. |
| Q10 | Job/state model? | States: `queued → running → completed | failed | expired`. Failures are surfaced in export history with a reason; user may retry. |

## 4. Non-goals for v1 (explicitly out of scope)

- Scheduled/recurring exports.
- Partial/filtered exports (date ranges, entity subsets) — full-workspace only in v1.
- Direct-to-third-party delivery (Drive, S3 handoff) — download link only.
- Import / round-trip.

## 5. Security invariants (must hold; candidates for tests)

- INV-1: A non-global-admin request can never produce data for a workspace other
  than the caller's own, regardless of request parameters.
- INV-2: The target-workspace parameter is honored **only** for global admins.
- INV-3: Download is denied unless the caller is authenticated and authorized for
  the export's owning workspace at download time (link possession is insufficient).
- INV-4: Generated files are private, encrypted at rest, and auto-expire.
- INV-5: Every export — and especially every cross-workspace admin export — is
  audit-logged before the file is made available.

## 6. Deferred / revisit later

- Whether workspace admins should get a scoped "export own workspace on behalf of
  a member" capability (not needed for v1).
- Whether to add a justification/approval workflow for admin cross-workspace
  exports beyond logging (v1 logs; approval flow deferred).
