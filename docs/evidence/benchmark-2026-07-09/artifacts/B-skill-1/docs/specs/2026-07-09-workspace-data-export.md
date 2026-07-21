---
topic: How users and admins obtain a scoped export of a workspace's data, generated asynchronously and delivered by an emailed download link
status: confirmed
started: 2026-07-09
---

# Spec: Workspace data export

## Branches

- [x] Authorization model — decided
- [x] Export scope — ASSUMED
- [x] Format packaging — ASSUMED
- [x] Async mechanism — ASSUMED
- [x] Artifact storage & retention — ASSUMED
- [x] Download link security — ASSUMED
- [x] Failure handling — ASSUMED
- [x] Audit logging — ASSUMED
- [x] Rate limiting / abuse — deferred
- [x] Size caps — deferred

## Decisions

1. **Authorization model** — One endpoint takes an explicit `workspace_id`; when omitted it defaults to the caller's active workspace. Authorization is decided server-side from the authenticated session, never from any client-supplied role or scope field: the caller must be a member of the target workspace **or** hold a platform-admin role. A caller who is neither gets a 404 (not 403) for that `workspace_id`, so the endpoint never confirms the existence of workspaces the caller may not see. Admin access to a foreign workspace is allowed but audited (see #8). _Why:_ satisfies both "strictly self-workspace" (the default and the membership check) and "admins can export any workspace through the same endpoint" without a second endpoint; 404-on-unauthorized prevents cross-workspace enumeration. _Decided by user (picked the recommended option: "yeah fine")._

## Assumptions

- ASSUMED (#2) **Export scope** — An export contains the full dataset the target workspace owns: its first-class entities (records/documents, member roster, workspace settings/metadata) and nothing belonging to any other workspace or to platform internals. Correct at read-back if the intended scope is narrower/wider.
- ASSUMED (#3) **Format packaging** — Caller selects `format=csv|json` per request. JSON yields a single structured file keyed by entity type. CSV yields one file per entity type bundled in a single `.zip` (a flat CSV cannot hold multiple entity types). The artifact is therefore always one downloadable file — a `.json` or a `.zip`.
- ASSUMED (#4) **Async mechanism** — The request enqueues a background job and returns `202 Accepted` with a job id. A worker generates the artifact, uploads it to storage, then triggers the notification email. No synchronous generation path.
- ASSUMED (#5) **Storage & retention** — Artifacts are written to object storage under a per-job key and auto-deleted 7 days after creation by a scheduled cleanup job. (Retention length is product-shaping — flagged at the gate.)
- ASSUMED (#6) **Download link security** — The email carries a signed, unguessable, time-limited URL scoped to that one artifact; the signed URL is itself the bearer credential (click-to-download, no separate login), and it 404s once expired or the artifact is deleted (link lifetime = retention window). This is the highest-risk assumption — flagged prominently at the gate.
- ASSUMED (#7) **Failure handling** — A failed generation job retries a bounded number of times; on final failure the requester receives a failure-notice email (no link) rather than silence.
- ASSUMED (#8) **Audit logging** — Every export request is logged with requester id, target `workspace_id`, format, timestamp, and outcome. Admin exports of a workspace the admin is not a member of are flagged distinctly in the audit trail, given the cross-workspace sensitivity.

## Deferred

- **Rate limiting / abuse throttling** (#9) — v1 ships without a throttle; add per-user/per-workspace limits later. Build can proceed without it.
- **Hard size caps** (#10) — no maximum export size enforced in v1; revisit once real workspace sizes are known. (Product-shaping cap left open deliberately.)

## Confirmation

Confirmed by the user on 2026-07-09 with "ok" to the full read-back below (decision #1 plus assumptions #2–#8 and the two deferred branches). User's verbatim confirmation: "ok".
