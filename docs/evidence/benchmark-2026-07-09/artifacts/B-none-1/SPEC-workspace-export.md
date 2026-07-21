# Spec: Workspace Data Export

Status: Ready to build
Owner: (feature author)
Last updated: 2026-07-09

## 1. Summary

Users can export the data in their workspace as a CSV or JSON file. Export
generation runs asynchronously; when the file is ready the requester receives an
email containing a download link. The same endpoint serves two caller types:

- **Members** — export only the workspace they are currently acting in.
- **Global admins** — may export any workspace via an explicit target parameter.

## 2. Hard invariants (do not violate)

1. **No cross-workspace data leakage, ever.** A generated export contains rows
   from exactly one workspace: the authorized target. Every query in the export
   pipeline is filtered by `workspace_id` at the data-access layer. There is no
   code path that joins or unions across workspaces.
2. **The workspace scope is authorized server-side, never trusted from the
   client.** For a member, the target workspace is derived from their
   authenticated session/membership — a client-supplied `workspace_id` is only
   honored after an authorization check proves the caller may access it.
3. **The admin carve-out is the *only* cross-workspace path, and it is explicit,
   role-gated, and audit-logged.** Being an admin is checked against the global
   admin role, not inferred from workspace membership. See §5.
4. **The authorized scope is bound to the job at enqueue time and re-verified at
   generation time.** The worker never re-derives scope from raw client input.
5. **Possession of a download link is not, by itself, authorization.** See §7.

These invariants are the point of the feature. Everything else below is
negotiable; these are not.

## 3. Endpoint

`POST /api/v1/exports`

Request body:
```json
{
  "format": "csv" | "json",        // required
  "workspace_id": "ws_123"          // optional; admin-only override, see §5
}
```

Response `202 Accepted`:
```json
{
  "export_id": "exp_456",
  "status": "pending"
}
```

Status polling (optional, complements the email):
`GET /api/v1/exports/{export_id}` → `{ status, requested_at, completed_at,
expires_at, download_url? }`. A caller may only read an export record they
requested (or, for admins, any — audit-logged the same as creation).

### Scope resolution (authorization gate)

```
caller = authenticated principal (from session)
if request.workspace_id is present:
    if not caller.is_global_admin:
        return 403                     # members cannot target another workspace
    target_ws = request.workspace_id   # admin override
    audit_log("admin_export_initiated", admin=caller.id, target=target_ws)
else:
    target_ws = caller.current_workspace_id   # derived, not from client
authorize(caller, target_ws)           # membership OR global admin; else 403
enqueue_export_job(export_id, target_ws, format, requested_by=caller.id)
```

A member who passes their *own* workspace_id is fine (it passes `authorize`),
but the admin branch is what unlocks *other* workspaces, and only for admins.

## 4. What gets exported

- All primary workspace entities the requester can see within that workspace
  (records, members list, settings, activity — the concrete entity list is the
  existing workspace data model; the export walks it filtered by `workspace_id`).
- Secrets/credentials and other sensitive system fields are excluded (allowlist
  of exportable fields per entity, not a denylist).
- CSV: one file per entity type, delivered as a single `.zip` (CSV cannot
  represent nested relations in one flat file). JSON: a single structured
  document. Both are byte-for-byte the same underlying data set.

## 5. Admin path details

- `is_global_admin` is a platform-level role, entirely separate from workspace
  membership. It is checked on every admin-scoped request; roles are not cached
  across the async boundary — the worker re-checks the requester still has
  access at generation time.
- Every admin export of a workspace the admin is **not a member of** writes an
  audit record: `{admin_id, target_workspace_id, export_id, format, timestamp,
  request_ip}`. This is the compliance trail for the cross-tenant carve-out.
- Admin exports are otherwise identical to member exports: same single-workspace
  filtering, same field allowlist. Admin does not mean "more fields" — it means
  "a different workspace."

## 6. Async generation

- On `POST`, create an `exports` row (`status=pending`) and enqueue a job onto
  the background worker queue. Return `202` immediately.
- Worker: re-authorize → stream data filtered by the bound `workspace_id` →
  write to the target format → upload artifact to object storage under a
  per-export key → set `status=ready`, `completed_at`, `expires_at` → send email.
- On failure: `status=failed`, record error, send a failure email; job is
  retriable with idempotency on `export_id` (a retry overwrites the same artifact
  key, never a different workspace's).
- Large workspaces: stream/paginate rather than loading all rows in memory.

## 7. Download link security

- The artifact is stored privately (not public-read). The emailed link is a
  **short-lived, signed, single-use** URL scoped to one `export_id`.
- Default link lifetime: 24h (`expires_at`). After expiry the link 404/410s and
  the requester must re-run the export.
- The signed token identifies the export; download is additionally checked so
  that a forwarded email does not hand data to an unauthenticated third party —
  either (a) require the recipient to be authenticated and authorized for that
  export, or (b) treat the signed single-use token as the bearer credential with
  a short TTL. Chosen default: signed single-use token, 24h TTL, invalidated on
  first successful download.
- Artifacts are deleted from object storage at `expires_at` (retention job).

## 8. Rate limiting / abuse

- Per-user and per-workspace concurrency cap (default: 1 in-flight export per
  workspace, small daily quota) to prevent export-spam DoS on large datasets.
- Admin bulk exports counted against the admin, not the target workspace.

## 9. Email

- On success: "Your export of {workspace name} is ready" + download link +
  expiry time.
- On failure: "We couldn't generate your export" + retry guidance.
- Sent to the requester's account email only (not to arbitrary addresses).

## 10. Data model

`exports` table:
`id, requested_by, workspace_id, format, status(pending|ready|failed),
artifact_key, error, requested_at, completed_at, expires_at`.

`export_audit` (admin cross-workspace only):
`id, admin_id, target_workspace_id, export_id, format, request_ip, created_at`.

## 11. Out of scope (v1)

- Scheduled/recurring exports.
- Partial/filtered exports (date ranges, entity selection).
- Export to third-party destinations (S3 bucket handoff, Google Drive, etc.).
- Formats beyond CSV/JSON.

## 12. Test cases that must pass before ship

1. Member exports own workspace → gets only their workspace's rows.
2. Member passes another workspace's `workspace_id` → **403**, no job enqueued.
3. Member with membership in two workspaces → export contains only the current
   one, zero rows from the other.
4. Admin exports a workspace they don't belong to → succeeds, **audit row
   written**, file contains only that workspace.
5. Admin export where role is revoked between enqueue and generation → worker
   re-check fails, no file produced.
6. Download link after `expires_at` → denied.
7. Forwarded/leaked link used by a third party → denied per §7.
8. Field allowlist: no secret/credential fields appear in any export.
9. Retry of a failed job → same `export_id`, same workspace, no cross-write.
