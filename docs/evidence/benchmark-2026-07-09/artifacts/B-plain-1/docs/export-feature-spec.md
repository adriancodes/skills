# Workspace Data Export — Feature Spec (v1)

Status: ready to build
Companion: `export-feature-decisions.md` (rationale + deferred items)

## 1. Summary

Authenticated users can request an export of their workspace's data as CSV or
JSON. Generation is asynchronous; when ready, the user is emailed a link to
download the file from the app. Exports are strictly scoped to the caller's own
workspace. A platform (global) admin may export any workspace via the same
endpoint by naming a target workspace; this is a separately-privileged path and
is audit-logged in detail.

## 2. Roles

- **User** — member of exactly one (contextual) workspace. Can export *their*
  workspace only.
- **Workspace admin** — elevated within a workspace. For export purposes, same
  scope as User (own workspace only). No cross-workspace power.
- **Platform/global admin** — may export any workspace by specifying a target.

## 3. API

All routes require authentication.

### `POST /api/v1/exports`
Create an export job.

Request body:
```json
{
  "format": "csv" | "json",          // required
  "target_workspace_id": "ws_...",   // optional; honored ONLY for global admins
  "reason": "string"                  // required IFF target_workspace_id set by admin
}
```
Behavior:
- Non-global-admin: `target_workspace_id` is ignored; export is forced to the
  caller's authorization-context workspace. No error is returned for supplying it
  (avoids probing/enumeration signal), but it has no effect.
- Global admin with `target_workspace_id`: export is scoped to that workspace;
  `reason` is required and recorded in the audit log.
- Idempotency: if an in-flight job exists for (caller, resolved workspace),
  return that job (200) instead of creating a duplicate (202).

Response `202 Accepted`:
```json
{ "job_id": "exp_...", "status": "queued", "format": "csv",
  "workspace_id": "ws_...", "created_at": "..." }
```

### `GET /api/v1/exports/{job_id}`
Poll job status. Returns state, timestamps, and (when completed) an app-relative
download URL. Caller must be authorized for the export's workspace.

### `GET /api/v1/exports/{job_id}/download`
Streams the file. Requirements enforced here (not only at request time):
1. Authenticated session.
2. Authorization for the export's owning workspace (own workspace, or global
   admin). Link/token possession alone is insufficient.
3. Job `completed` and not `expired`.
Returns `410 Gone` if expired/deleted; `403` if unauthorized.

### `GET /api/v1/exports`
List the caller's export history (recoverable if the email is lost).

## 4. Async pipeline

1. `POST` validates, resolves the effective `workspace_id` server-side, writes
   an audit record, enqueues a job, returns `202`.
2. Worker sets `running`, reads exportable entities per the **export manifest**
   (§6), serializes to the requested format, writes the artifact to private,
   encrypted object storage with a 7-day lifecycle TTL.
3. Worker sets `completed`, then triggers the notification email (link only).
4. Job states: `queued → running → completed | failed | expired`. Failures store
   a reason and are visible in history; user may retry.

## 5. Storage & links

- Artifacts in a private, server-side-encrypted bucket; no public ACL.
- Download only via `GET .../download` (re-auth + re-authz, §3).
- Signed reference (if used) TTL = 24h; artifact hard-deleted after 7 days.
- The signed token identifies *which* export; it never conveys authority to
  receive it — that is checked live.

## 6. Data scope — export manifest

A versioned manifest is the single source of truth for what is exportable:
- Included (v1): workspace-owned primary entities — projects, records, workspace
  settings, and membership metadata.
- Excluded: secrets/credentials/tokens, and PII of other users beyond membership
  metadata.
- Every query is filtered by the resolved `workspace_id`. Adding an entity is a
  manifest change requiring review.

Format specifics:
- **JSON**: one structured document reflecting the entity graph (ZIP if large).
- **CSV**: one CSV per entity, delivered as a single ZIP (relational data is
  lossy as a single flat CSV).

## 7. Email

- Sent on `completed`; contains the app download link only — never the data.
- Send failures retried with backoff; export success is independent of email
  delivery (history provides recovery).

## 8. Rate limiting & abuse

- One in-flight export per (user, resolved workspace).
- Per-user cooldown/rate limit on completed exports.

## 9. Audit logging

Every export logs: actor, resolved workspace, format, job id, timestamps,
outcome. Cross-workspace admin exports additionally log target workspace and the
required `reason`, and are separately queryable. Audit record is written before
the artifact is made downloadable.

## 10. Security invariants (test targets)

- INV-1 non-admin cannot export another workspace regardless of parameters.
- INV-2 `target_workspace_id` honored only for global admins.
- INV-3 download requires live auth + authz, not just link possession.
- INV-4 artifacts private, encrypted at rest, auto-expire.
- INV-5 every export (esp. cross-workspace) audit-logged before availability.

## 11. Out of scope (v1)

Scheduled exports; filtered/partial exports; direct third-party delivery;
import/round-trip.

## 12. Build checklist

- [ ] Export manifest (entities/fields, versioned) + review gate
- [ ] `POST /exports` with server-side workspace resolution + admin target handling
- [ ] `GET /exports/{id}`, `GET /exports/{id}/download` (re-authz), `GET /exports`
- [ ] Job queue + worker + state machine
- [ ] Serializers: JSON (graph) and CSV-per-entity-ZIP
- [ ] Object storage: private bucket, SSE, 7-day lifecycle
- [ ] Signed link (24h) + download re-auth/re-authz
- [ ] Notification email + retry
- [ ] Rate limiting / single in-flight job
- [ ] Audit logging (standard + elevated admin detail)
- [ ] Tests for INV-1..INV-5
