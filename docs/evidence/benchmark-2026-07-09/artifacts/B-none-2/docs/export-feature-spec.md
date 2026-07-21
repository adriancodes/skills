# Workspace Data Export — Feature Spec

Status: Ready to build
Owner: Platform
Last updated: 2026-07-09

## 1. Summary

Users can export their workspace data as CSV or JSON. Generation is
asynchronous: the user requests an export, we generate it in the background,
and email them a download link when it is ready.

Exports are **strictly scoped to a single workspace**. A normal user can only
export a workspace they are a member of. Admins can export any workspace
through the same endpoint. There is **no cross-workspace export** — every
export produces data for exactly one workspace, never a blend.

## 2. Goals / Non-goals

### Goals
- Self-service export of a workspace's data in CSV or JSON.
- Async generation with email notification containing a download link.
- Hard workspace isolation, enforced at request time AND at download time.
- Admin ability to export any workspace via the same endpoint + same flow.
- Auditability of who exported what, especially admin cross-workspace exports.

### Non-goals (v1)
- Scheduled / recurring exports.
- Partial or filtered exports (date ranges, specific record types). v1 exports
  the full workspace dataset.
- Multi-workspace / org-wide "export everything" in one file.
- Import / round-trip. This is export only.
- In-browser streaming download of a synchronously generated file.

## 3. Core requirement: workspace scoping (the security spine)

This is the requirement that everything else bends around, so it is stated
first and explicitly.

**Every export is bound to exactly one `workspace_id`, and that binding is
authorized twice:**

1. **At request time** — when the export job is created, we check the caller is
   allowed to export that workspace (member, or admin).
2. **At download time** — when the link is followed, we re-check the caller is
   still allowed to access that export. The download link is **not** a bare
   capability URL that grants access to anyone who holds it.

Why both: async generation means the download happens later, possibly from a
forwarded email, after the requester lost access, or after the file URL leaked.
A link that grants data purely by being possessed would be a cross-workspace
leak waiting to happen, which directly violates "no cross-workspace data,
ever." So the download endpoint authenticates the caller and authorizes them
against the export's `workspace_id` every time.

### The "same endpoint" admin path — resolved explicitly

The plan says admins export "through the same endpoint." We keep one endpoint,
but the authorization is a branch, not a bypass:

- Request carries a target `workspace_id`.
- If the caller is a **member** of that workspace → allowed.
- Else if the caller is a **platform admin** → allowed, and the job is flagged
  `admin_export = true` and written to the audit log with actor, target
  workspace, and reason (if supplied).
- Else → `403`.

The endpoint never infers workspace from the data; it is always an explicit
input that is authorized. An admin cannot accidentally widen scope, because the
job still generates exactly one workspace's data.

## 4. API

### `POST /api/v1/exports`
Create an export job.

Request body:
```json
{
  "workspace_id": "ws_123",
  "format": "csv" | "json"
}
```

Behavior:
- Authorize caller against `workspace_id` (see §3).
- Create an export job in state `pending`, return `202 Accepted`.
- Idempotency: accept an `Idempotency-Key` header; a repeat with the same key
  and body returns the same job rather than creating a second one.

Response `202`:
```json
{
  "export_id": "exp_456",
  "workspace_id": "ws_123",
  "format": "csv",
  "status": "pending",
  "created_at": "2026-07-09T12:00:00Z"
}
```

Errors: `400` (bad format / missing workspace_id), `403` (not authorized for
workspace), `429` (rate limit, see §8).

### `GET /api/v1/exports/{export_id}`
Poll job status. Authorized against the export's `workspace_id`. Returns status
in `pending | processing | ready | failed | expired`. When `ready`, includes a
download URL (which is itself still auth-gated).

### `GET /api/v1/exports/{export_id}/download`
Download the file.
- Authenticated request required (session or token).
- Re-authorize caller against the export's `workspace_id`.
- If `ready` → stream the file (or `302` to a short-lived signed storage URL,
  see §6).
- If `expired` / `failed` / not ready → appropriate `4xx`.

### `GET /api/v1/exports`
List the caller's exports (optionally filter by `workspace_id`). Admins listing
another workspace's exports is an admin action and is audit-logged.

## 5. Async generation flow

1. `POST /exports` validates + authorizes, persists job `pending`, enqueues a
   background job, returns `202`.
2. Worker picks up job → `processing`. Streams the workspace's data out of the
   primary store, serializes to the requested format, writes to object storage
   under a key namespaced by `workspace_id` and `export_id`.
3. On success → job `ready`, record storage key, file size, checksum, and
   `expires_at`. Enqueue notification email.
4. On failure → job `failed` with an error class; enqueue a failure email (or
   in-app notice). Failures are retried up to N times with backoff before being
   marked terminally `failed`.
5. Email contains a link to the app's download route (which requires login),
   **not** a raw storage URL.

Large workspaces: serialization streams rather than buffering the whole dataset
in memory. CSV is emitted per record type (a zip of CSVs when there are
multiple record types; a single JSON document for JSON).

## 6. Storage & the download link

- Files live in object storage, keyed `exports/{workspace_id}/{export_id}.{ext}`.
- The link in the email points at `GET /exports/{id}/download` on our app —
  authenticated + authorized on every hit.
- If we hand off to storage directly, we mint a **short-lived signed URL**
  (minutes, not the file's whole lifetime) at download time, only after
  authorizing the caller. We never email a long-lived signed URL.
- Retention: files expire and are deleted after **7 days** (`expires_at`).
  After that the job is `expired` and the download route returns a clear
  "expired, please re-export" response. A cleanup job purges storage.
- Encryption at rest via the storage layer's default encryption.

## 7. Notifications

- On `ready`: email the requester with a link to the download route, the
  workspace name, format, and expiry date.
- On `failed`: email the requester that it failed and they can retry.
- Admin cross-workspace exports notify the **admin who requested it**, not the
  target workspace's members (it is an admin action, not a workspace event).
  Whether to also notify workspace owners is an open policy question — flagged,
  not blocking (§10).

## 8. Abuse / limits

- Rate limit export creation per user and per workspace (e.g. small N per hour).
  Prevents using export as a data-exfiltration firehose or a DoS on the worker.
- Optionally collapse duplicate in-flight requests: if a `pending`/`processing`
  export for the same workspace+format exists, return it instead of creating a
  new one.

## 9. Audit logging

Every export creation and every download is logged with: actor user id, target
`workspace_id`, `export_id`, format, `admin_export` flag, timestamp, and source
IP. Admin cross-workspace exports are the high-value audit events — they must be
queryable ("show every admin export of workspace X", "every workspace admin Y
exported").

## 10. Open questions (non-blocking — defaults chosen)

Per direction from product, sensible defaults are chosen for all of these so
the team is unblocked; revisit if any turn out wrong:

1. **File retention window** — defaulted to 7 days.
2. **Notify workspace owners on admin export?** — defaulted to NO for v1
   (admin action, logged in audit trail). Revisit for compliance.
3. **Rate limits exact numbers** — placeholder small-N/hour; tune from load.
4. **What "workspace data" includes** — v1 = the full record set the workspace
   owns; PII/secret fields follow existing field-level export rules (secrets
   are never exported). Needs a concrete field inventory before build.
5. **CSV shape for multiple record types** — defaulted to a zip of per-type
   CSVs.

## 11. Data model (sketch)

`exports` table:
| column | notes |
|---|---|
| id | `exp_...` |
| workspace_id | scope; every read is filtered by this |
| requested_by | actor user id |
| admin_export | bool |
| format | `csv` \| `json` |
| status | `pending`\|`processing`\|`ready`\|`failed`\|`expired` |
| storage_key | null until ready |
| file_size, checksum | null until ready |
| error_class | null unless failed |
| created_at, ready_at, expires_at | timestamps |

## 12. Build order

1. Data model + `exports` table + migration.
2. `POST /exports` with double-checked authorization (member/admin branch).
3. Background worker: query → serialize → store → mark ready.
4. Download route with re-authorization + expiry handling.
5. Email notifications (ready / failed).
6. Audit logging + admin export flag.
7. Rate limiting + duplicate collapsing.
8. Retention cleanup job.

## 13. Test cases that must pass (security-first)

- Member exports own workspace → success.
- Non-member, non-admin requests another workspace → `403`.
- Admin exports another workspace → success, `admin_export=true`, audit row.
- Download link followed by a user who is NOT authorized for that export's
  workspace → `403` (the leaked-link / forwarded-email case).
- Download after the requester lost workspace membership → `403`.
- Download after expiry → clear expired response, no file served.
- Export payload for workspace A contains zero rows belonging to workspace B
  (fuzz across a multi-tenant fixture) — the "no cross-workspace data, ever"
  invariant, tested directly.
