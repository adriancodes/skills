# Workspace Data Export — Build Spec (v1)

Derived from DECISIONS.md. This is the build-ready specification.

## 1. Summary

Authenticated users can export a single workspace's data as CSV (zip of
per-entity CSVs) or JSON (full-fidelity). Generation is asynchronous; the user
receives an email with a secure, authenticated, expiring download link when the
export is ready. Exports are strictly scoped to one workspace. Platform admins
may target any workspace through the same endpoint; every cross-workspace admin
export is audit-logged.

## 2. Non-negotiable invariant

An export artifact contains data from exactly ONE workspace and never any data
belonging to another workspace. All other requirements are subordinate to this.

## 3. API

### POST /v1/exports
Request an export. Body:
```
{
  "workspace_id": "ws_...",   // target workspace
  "format": "csv" | "json"
}
```
Behavior:
1. AuthN: request must be from an authenticated user.
2. AuthZ (enqueue): allow if
   - requester is admin/owner OF `workspace_id`, OR
   - requester holds the global platform-admin role.
   Otherwise 403. Do not reveal workspace existence to unauthorized callers.
3. Idempotency: if a `queued`/`running` job already exists for
   (requester, workspace_id, format), return it (200) instead of creating a new
   one.
4. Enqueue a job with a SERVER-DERIVED, immutable `workspace_id`. Respond 202:
```
{ "job_id": "exp_...", "state": "queued" }
```
5. If the requester is a platform admin exporting a workspace they are not a
   member of, write a cross-workspace audit record now.

### GET /v1/exports/{job_id}
Return job status for the owner of the job (or a platform admin). Never expose
another user's jobs.
```
{ "job_id", "state", "format", "workspace_id",
  "created_at", "completed_at", "expires_at", "error?" }
```

### GET /v1/exports/{job_id}/download
Deliver the artifact. Requires:
1. Authenticated session.
2. The caller is the job's owner (or platform admin) AND still passes the
   enqueue-time authorization re-check (D7). A revoked user gets 403 even with a
   valid link.
3. Job state is `succeeded` and not expired.
Streams the artifact (or 302s to a short-lived, single-use signed storage URL
minted at request time — never the durable storage URL).

## 4. Job record

```
export_jobs(
  id, requester_user_id, workspace_id, format,
  state ENUM(queued,running,succeeded,failed,expired),
  attempts, artifact_key, artifact_size_bytes,
  created_at, started_at, completed_at, expires_at, error
)
```
- `workspace_id` set once at enqueue, never mutated.
- `artifact_key` is an unguessable, job-id-keyed object-storage path.

## 5. Worker

1. Claim `queued` job, set `running`.
2. Build the export using a SINGLE workspace scope:
   every query filters `WHERE workspace_id = job.workspace_id`. No code path
   loops over multiple workspaces.
3. JSON: emit structured, nested full-fidelity document of exportable entities.
   CSV: emit one CSV per entity type, zipped.
4. Exclude secrets/credentials/system-internal fields. Include only data the
   requester could already read in-product.
5. Stream output to object storage (encrypted at rest) under `artifact_key`.
   Do not build large exports in memory.
6. On success: set `succeeded`, `completed_at`, `expires_at = now + 7d`, send
   completion email. On unrecoverable failure after N retries: set `failed`,
   send failure email.

## 6. Retention & cleanup

- Artifacts and their download links expire 7 days after completion.
- A sweeper transitions expired jobs to `expired` and deletes artifacts.

## 7. Email

- To: the requester's verified account email only (never a client-supplied
  address).
- Success: link to `GET /v1/exports/{job_id}/download` (the app endpoint).
- Failure: neutral failure notice with a retry pointer.

## 8. Limits, audit, metrics

- Per-user export rate limit (numbers TBD by ops) to bound bulk egress.
- Audit log: actor, target workspace, format, job id, timestamp, delivery;
  cross-workspace admin exports flagged.
- Metrics: jobs by state, duration, artifact size, cross-workspace admin count.

## 9. Edge cases

- Empty workspace -> valid empty-but-well-formed artifact + normal email.
- Duplicate request while running -> returns existing job (idempotency).
- Requester loses access between request and download -> 403 at download.
- Expired link -> 410 Gone.

## 10. Out of scope (v1)

Scheduled/recurring exports; entity/date-range subsetting; formats beyond
CSV/JSON; multi-workspace single-file exports; non-email delivery channels.

## 11. Acceptance tests (security-critical)

- T1. Member of W1 (owner) can export W1; cannot export W2 (403).
- T2. Regular non-admin member of W1 cannot export W1 (403).
- T3. Platform admin can export W2 they don't belong to; audit record written.
- T4. Generated W1 artifact contains zero rows/keys from any other workspace
  (assert on a seeded multi-workspace fixture).
- T5. Download link fails (403) for a user whose access was revoked after
  enqueue.
- T6. Download link fails (410) after expiry; artifact deleted.
- T7. Email is sent only to the requester's verified address.
