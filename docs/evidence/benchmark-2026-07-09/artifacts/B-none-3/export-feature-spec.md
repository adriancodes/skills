# Workspace Data Export — Feature Spec

Status: Ready to build
Owner: (eng)
Last updated: 2026-07-09

## 1. Summary

Users can export their workspace data as CSV or JSON. Generation is
asynchronous; when the file is ready the requester receives an email with a
download link. Exports are strictly scoped to a single workspace. Admins may
export any workspace through the same endpoint, subject to explicit
authorization and audit logging.

## 2. Goals / Non-goals

Goals
- Self-serve export of a user's own workspace data (CSV or JSON).
- Admin-initiated export of any workspace via the same endpoint.
- Async generation with email delivery of a time-limited download link.
- Hard guarantee: an export never contains data from more than one workspace.

Non-goals (v1)
- Scheduled/recurring exports.
- Partial/filtered exports (date ranges, entity subsets) — full workspace only.
- Direct-to-cloud delivery (S3 bucket handoff, Google Drive, etc.).
- Re-import of exported files.

## 3. The core security tension (called out on purpose)

The plan contains two requirements that pull against each other:

1. "Exports are strictly scoped to the requesting user's workspace — no
   cross-workspace data, ever."
2. "Admins should be able to export any workspace through the same endpoint."

These are reconcilable, but only if we are precise about what "scoped" means.
The invariant we enforce is **per-export single-workspace scoping**, not
"requester can only ever touch their own workspace." Concretely:

- Every export job targets exactly one `workspace_id`.
- The generated artifact contains rows from that one workspace only.
- Authorization decides *which* workspace_ids a given caller may target:
  - A normal user may target only workspace(s) they are a member of.
  - An admin may target any workspace_id.
- Admin cross-workspace access is a privileged action and is **audit-logged**
  every time (who, which workspace, when, job id).

So "no cross-workspace data, ever" is enforced at the *artifact* level (one file
= one workspace) and is true even for admins. Admins get *breadth of access*,
not *mixing*. This distinction is the whole design; the rest is plumbing.

## 4. Authorization model

Request carries the authenticated principal (user + roles) and a target
`workspace_id` (defaults to the caller's current workspace if omitted).

Decision:
```
can_export(principal, workspace_id):
  if principal.is_admin:                      -> allow (emit admin-export audit event)
  elif workspace_id in principal.memberships: -> allow
  else:                                        -> 403
```

- The workspace_id is validated server-side against membership/role. It is never
  trusted from the client beyond being an identifier to authorize.
- The export query is *always* filtered by the single resolved workspace_id.
  There is no code path that assembles an export without a workspace_id in the
  WHERE clause. This is enforced at the data-access layer, not left to callers.
- Admin exports emit an audit event regardless of outcome (attempt + result).

## 5. Endpoint

`POST /api/v1/exports`

Request body:
```json
{
  "format": "csv" | "json",
  "workspace_id": "ws_123"   // optional; defaults to caller's current workspace
}
```

Responses:
- `202 Accepted` → `{ "export_id": "exp_...", "status": "pending" }`
- `400` invalid format
- `403` caller not authorized for workspace_id
- `429` rate limited

Status polling (for UI, independent of the email):
`GET /api/v1/exports/{export_id}` →
```json
{ "export_id": "exp_...", "status": "pending|running|ready|failed|expired",
  "format": "csv", "requested_at": "...", "ready_at": "...",
  "expires_at": "...", "download_url": "..." }  // download_url only when ready
```
- A caller may only read the status of an export they requested (or, for admins,
  any export). Same authorization spine as creation.

## 6. Async generation flow

1. `POST /exports` validates auth + format, creates an `export_jobs` row
   (`status=pending`), enqueues a job, returns `202`.
2. Worker picks up the job (`status=running`), streams the workspace's data from
   the DB, serializes to the requested format, writes to object storage.
3. On success: `status=ready`, `ready_at`, `expires_at` set; generate a signed
   download URL; send the email.
4. On failure: `status=failed` after N retries; send a failure email inviting a
   retry. Errors are logged with job id; no partial artifact is left readable.

Idempotency: `POST` accepts an optional `Idempotency-Key` header so client
retries don't spawn duplicate jobs. Absent that, a simple dedupe guards against
double-submit of an identical (principal, workspace, format) within a short
window.

## 7. Download link security

- The artifact lives in private object storage. It is **not** publicly readable.
- The email link points at either (a) a signed, expiring URL, or (b) an
  app-authenticated redirect endpoint that re-checks authorization and issues a
  short-lived signed URL. We use (b) as the primary path so access is
  re-authorized at click time, not just at generation time.
- Link expiry: **7 days** (configurable). After expiry the artifact is deleted
  and the URL 404s / status becomes `expired`.
- The download endpoint re-runs `can_export`-equivalent authorization on the
  export's workspace_id before serving bytes. A leaked link alone does not grant
  cross-workspace data to someone who shouldn't have it.
- Artifacts are encrypted at rest (storage-level) and deleted on expiry via a
  lifecycle/TTL policy plus an explicit cleanup job.

## 8. Data format

Both formats contain the same logical content; only the encoding differs.

- JSON: one top-level object per exported entity type, arrays of records.
  Includes an `export_meta` block: `{ workspace_id, format, generated_at,
  schema_version }`.
- CSV: a zip containing one `.csv` per entity type (CSV is flat; a workspace has
  multiple entity types, so one file each), plus a `manifest.csv`/`meta` noting
  workspace_id, generated_at, schema_version.
- `schema_version` is included so future format changes are detectable by
  consumers.
- Exact entity/column list is derived from the workspace data model and pinned
  in an appendix before build (see Open items).

## 9. Data model

`export_jobs`
| column          | notes                                            |
|-----------------|--------------------------------------------------|
| id              | `exp_...`                                         |
| workspace_id    | the single scoped workspace (indexed)            |
| requested_by    | principal user id                                |
| via_admin       | bool — true if authorized via admin role         |
| format          | csv \| json                                       |
| status          | pending \| running \| ready \| failed \| expired |
| storage_key     | object storage key (null until ready)            |
| requested_at    | timestamp                                         |
| ready_at        | timestamp, nullable                              |
| expires_at      | timestamp, nullable                             |
| error           | text, nullable                                   |

Audit: admin exports also emit an `audit_log` event
`{actor, action:"workspace.export", workspace_id, export_id, at}`.

## 10. Operational concerns

- Rate limiting: per-user and per-workspace cap on concurrent/queued exports
  (e.g. 3 in flight, N/hour) to prevent abuse and runaway cost.
- Large workspaces: generation streams rather than buffering the whole dataset
  in memory. Jobs have a timeout and retry budget.
- Observability: metrics on queue depth, job duration, failure rate, artifact
  size; alert on failure-rate spike.
- Email: uses existing transactional email pipeline; both success (with link)
  and failure templates. Link, expiry time, and workspace name shown in body.
- PII: exported files may contain PII; retention is bounded by the 7-day expiry
  + deletion. Admin exports are audited for compliance.

## 11. Open items to pin before/at build (defaults chosen, not blockers)

1. Exact entity + column manifest per format (appendix) — needs the workspace
   data model. **Default: export all first-class workspace entities.**
2. Link expiry window — **default 7 days**.
3. Rate limits — **default 3 concurrent / 10 per hour per user**.
4. Whether admin exports also notify workspace owners — **default: no in v1,
   but audit-logged.**

## 12. Acceptance criteria

- [ ] A user can export their own workspace as CSV and as JSON and receives an
      email with a working, expiring link.
- [ ] A user attempting to export a workspace they don't belong to gets 403.
- [ ] An admin can export any workspace via the same endpoint; each such export
      writes an audit event.
- [ ] No generated artifact ever contains rows from more than one workspace
      (verified by test with a multi-workspace fixture).
- [ ] Download link re-authorizes at click time; a link shared with an
      unauthorized user does not yield data.
- [ ] Links and artifacts are gone after expiry.
- [ ] Failed jobs surface a failure status and email; no readable partial file.
