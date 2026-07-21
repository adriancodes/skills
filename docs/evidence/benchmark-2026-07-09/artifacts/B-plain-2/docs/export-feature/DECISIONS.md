# Export Feature — Decisions Log

Status: settled (spec-ready, pre-build)
Owner: admin@pertinent.ai
Last updated: 2026-07-09

This file records the requirement decisions made while speccing the workspace
export feature. Each entry is a decision, not a discussion. Open questions that
were resolved by "use your judgment" are marked (defaulted).

## 1. Purpose & scope

- D1. Users can export the data of a workspace as **CSV** or **JSON**.
- D2. **Hard isolation invariant:** an export MUST contain data from exactly one
  workspace — the target workspace — and never join, leak, or reference data
  from any other workspace. This is the top-priority correctness/security
  property. No feature convenience overrides it.
- D3. Generation is **asynchronous**: request returns immediately with a job;
  the file is produced by a background worker; the user is emailed a link when
  it is ready.

## 2. Authorization model

- D4. Two ways to be authorized to export workspace W:
  - (a) **Member path:** the requester is a member of W with export permission
    (see D6). They may export only workspaces they belong to.
  - (b) **Admin path:** the requester holds the **global/platform admin** role.
    They may export **any** workspace through the same endpoint.
- D5. The admin override is the ONLY sanctioned path to cross-workspace data,
  and it is per-target and explicit — an admin exports one named workspace at a
  time, never "all workspaces" in one call. (defaulted)
- D6. Member export permission: gated on a workspace role of **admin/owner of
  that workspace** by default, not every member, since an export is a bulk
  egress of all workspace data. Regular members cannot export. (defaulted)
- D7. Authorization is checked **twice**: at request time (can you enqueue this
  job?) and again at delivery/download time (are you still allowed?). A
  revoked user must not be able to use a previously emailed link. (defaulted)

## 3. Security of the isolation invariant

- D8. The workspace scope is bound to the **job record** at enqueue time as a
  server-derived `workspace_id`. The worker queries strictly with
  `WHERE workspace_id = :job.workspace_id`. The workspace id is never taken
  from client input at generation time. (defaulted)
- D9. Every query the worker runs is scoped by that single workspace id; there
  is no code path that iterates multiple workspaces in one job. (defaulted)
- D10. Cross-workspace admin exports are **audit-logged**: actor, target
  workspace, time, format, job id, and delivery. Member self-exports are also
  logged but flagged as in-scope. (defaulted)

## 4. Async job lifecycle

- D11. States: `queued -> running -> succeeded | failed | expired`. (defaulted)
- D12. One in-flight export per (user, workspace) at a time; a duplicate
  request while one is running returns the existing job rather than starting a
  second. (defaulted)
- D13. Jobs that fail are retryable a small number of times by the worker;
  after that the job is `failed` and the user is emailed a failure notice.
  (defaulted)
- D14. A status endpoint lets the UI poll job progress; email is the primary
  completion signal, polling is the secondary one. (defaulted)

## 5. Output format

- D15. **JSON**: full-fidelity, structured dump of the workspace's exportable
  entities (nested where natural). This is the loss-less format. (defaulted)
- D16. **CSV**: one file per entity type, delivered as a **zip of CSVs**, since
  a workspace is not a single flat table. Flattened/tabular view. (defaulted)
- D17. Exact entity list to include is deferred to the data-model owner but the
  default is "everything the workspace owns that the requester could already
  read in-product" — no hidden/system-internal fields, no secrets/credentials,
  no other workspaces' data. (defaulted)
- D18. Large exports are streamed to object storage, not built in memory.
  (defaulted)

## 6. Delivery & link security

- D19. Completion email contains a link to a **download endpoint**, not a raw
  public object-storage URL. (defaulted)
- D20. The download requires the recipient to be **authenticated** and to still
  pass the D7 authorization re-check. The link is **not** a bearer capability
  that works for anyone who holds it. (defaulted)
- D21. Download links **expire** (default 7 days) and the underlying export
  artifact is deleted at expiry. (defaulted)
- D22. Export artifacts are stored **encrypted at rest** and in a location
  keyed by job id (unguessable), never enumerable. (defaulted)
- D23. Email goes to the **requesting user's** verified account address, not to
  an arbitrary address supplied in the request. (defaulted)

## 7. Abuse / limits / ops

- D24. Rate limit: a per-user cap on exports per hour/day to prevent bulk
  egress abuse (exact numbers deferred to ops). (defaulted)
- D25. Metrics: job counts by state, generation duration, artifact size, and
  cross-workspace admin export count are emitted for monitoring. (defaulted)
- D26. Empty workspace still produces a valid (empty-but-well-formed) export
  and a normal completion email. (defaulted)

## 8. Explicitly out of scope (v1)

- O1. Scheduled/recurring exports.
- O2. Selecting a subset of entities or a date range to export.
- O3. Formats other than CSV and JSON.
- O4. Exporting multiple workspaces in a single job/file (even for admins).
- O5. Delivery channels other than email link (e.g. direct push to S3/Drive).
