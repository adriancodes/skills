---
topic: How users and admins export workspace data (CSV/JSON) safely, generated asynchronously and delivered by emailed download link
status: confirmed
started: 2026-07-03
---

# Spec: Workspace data export

## Branches

- [x] Feature purpose — given by the plan
- [x] Authorization & isolation model — decided (D2)
- [x] Definition of "admin" — ASSUMED (A1)
- [x] Audit logging — ASSUMED (A2)
- [x] Data scope — ASSUMED (A3)
- [x] CSV structure — ASSUMED (A4)
- [x] JSON structure — ASSUMED (A5)
- [x] Async execution — ASSUMED (A6)
- [x] Export artifact storage — ASSUMED (A7)
- [x] Download link mechanism — ASSUMED (A8)
- [x] Download authorization — ASSUMED (A9)
- [x] Failure handling — ASSUMED (A10)
- [x] Export scope invariant naming — decided (D3)
- [ ] Retention / link TTL — Deferred (product policy)
- [ ] Rate limiting / concurrency caps — Deferred (product policy)
- [ ] Export size limits — Deferred (product policy)
- [ ] Notification email content and failure notification — Deferred (product policy)

## Decisions

1. **Feature purpose** — Authenticated users export their workspace's data as CSV or JSON; generation is asynchronous and the finished export is delivered via an emailed download link. _Why:_ stated directly in the plan.
2. **Authorization & isolation model** — The "no cross-workspace data, ever" rule is preserved as a hard invariant with two parts: (a) a single export is always confined to exactly one workspace and never blends data from two, and (b) a non-admin can only ever target a workspace they are a member of. Admin cross-workspace reach is not a hole in the invariant but an explicit, authorized, audited capability on the same endpoint: the request carries an explicit `workspace_id`, and the server authorizes it as `requester is a member of workspace_id` OR `requester holds the global admin capability`. No implicit "current workspace" fallback for admins — the target is always explicit. _Why:_ satisfies both plan requirements at once (same endpoint, admins reach any workspace) while keeping isolation a checkable server-side rule rather than a client-trusted one; ADR-0001. (User delegated: "yeah fine, whatever you think.")
3. **Export scope invariant (naming)** — The rule in D2 is named the **export scope invariant** and recorded in `CONTEXT.md`. _Why:_ it is referenced by authorization, audit, and download-authorization decisions and needs one canonical name. (Decided under delegation.)

## Assumptions

- ASSUMED (A1) **Definition of "admin"** — "admin" means a global/system admin capability (platform staff / super-admin), not a per-workspace admin role. A per-workspace admin has no special export reach beyond their own workspace. _Why:_ "export any workspace" only makes sense for a role that transcends workspace membership; a workspace admin already has membership so needs no special path. Correct at read-back if "admin" meant workspace-owner.
- ASSUMED (A2) **Audit logging** — every export records an audit entry (actor, target `workspace_id`, format, timestamp, job id); cross-workspace admin exports are additionally flagged as privileged access. _Why:_ an admin reading another workspace's data is exactly the event a future security review must be able to reconstruct.
- ASSUMED (A3) **Data scope** — "workspace data" = the workspace's own first-class records (its primary domain entities and their direct child rows), excluding platform-internal/system tables, other workspaces' data, and secrets/credentials. Exact entity list to be finalized against the schema at build time. _Why:_ export means user-owned business data, not internal plumbing; precise list is a mechanical follow-up, not a judgment call.
- ASSUMED (A4) **CSV structure** — CSV export produces one CSV file per entity type, bundled into a single `.zip`, because a workspace's relational data cannot be represented losslessly in one flat CSV. _Why:_ preserves all entities without a lossy denormalizing join; a zip is the standard multi-table CSV delivery.
- ASSUMED (A5) **JSON structure** — JSON export is a single JSON document: a top-level object keyed by entity type, each value an array of records, plus an `export_metadata` block (workspace id, generated_at, schema version). _Why:_ one self-describing file is the natural JSON shape and round-trips cleanly.
- ASSUMED (A6) **Async execution** — generation runs as a background job on the app's existing job/queue infrastructure (worker consumes an `export` job carrying requester, workspace_id, format). _Why:_ "async generation" stated in the plan; reuse existing queue rather than inventing one.
- ASSUMED (A7) **Export artifact storage** — the generated file is written to private object storage (not a public bucket), keyed by job id, with server-side access control; never world-readable. _Why:_ an export can contain the entirety of a workspace's data — it must never be reachable by guessing a path.
- ASSUMED (A8) **Download link mechanism** — the emailed link points to an application download endpoint (not a raw public object URL). The endpoint streams the file from private storage after authorizing the request. Link carries an opaque, unguessable token identifying the job. _Why:_ keeps authorization on the server for every download, including admin cross-workspace files.
- ASSUMED (A9) **Download authorization** — redeeming the link requires the requester to be authenticated as the user who created the export; the download re-checks the export scope invariant (D2) at redeem time. The link is single-recipient, not a shareable public URL. _Why:_ prevents a forwarded/leaked email from exposing a full data export, and re-verifies admin privilege at download time.
- ASSUMED (A10) **Failure handling** — on job failure the requester is notified by email that the export failed (no silent drop); jobs are retried a bounded number of times before being marked failed. Exact retry count deferred (A-side of a product knob). _Why:_ a user waiting on an emailed link must learn if it will never arrive.

## Deferred

- **Retention / link TTL** — how long the file and download link remain valid before automatic deletion. Product/security policy; a deletion-semantics choice, not an engineering default. Must be pinned before the download and cleanup paths are finalized.
- **Rate limiting / concurrency caps** — per-user / per-workspace export frequency and concurrent-job limits. Product policy; build can proceed without a firm number.
- **Export size limits** — maximum data volume / row counts per export (and behavior when exceeded). Product policy.
- **Notification email content** — subject/body copy, from-address, branding for both success and failure emails. Product/marketing input.
- **Exact retry count** for A10. Product/ops policy.

## Artifacts

- Glossary: `CONTEXT.md` — export scope invariant, global admin, export artifact.
- ADR: `docs/adr/0001-workspace-scoped-export-authorization.md` — the D2 authorization/isolation decision.

## Confirmation

Confirmed by user at the exit gate on 2026-07-03. User's words, verbatim: "ok".
The user delegated the open branches earlier with "yeah fine, whatever you think"; all build-blocking branches were resolved as ASSUMED and read back before this confirmation.
