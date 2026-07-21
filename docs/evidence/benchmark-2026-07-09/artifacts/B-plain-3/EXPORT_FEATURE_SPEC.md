# Workspace Data Export — Feature Spec & Decisions

Status: Settled (ready to build)
Date: 2026-07-09
Owner: admin@pertinent.ai

---

## 1. Summary

Users can export their workspace data as CSV or JSON. Generation is asynchronous;
when the file is ready the requester receives an email with a download link.
Exports are strictly scoped to a single workspace. Regular users may export only
their own workspace(s); admins may export any workspace through the same endpoint.

---

## 2. Requirements (confirmed)

### 2.1 Functional
- Formats: CSV and JSON, selectable per request.
- Scope: exactly one workspace per export job.
- Async generation via background job queue; no synchronous large downloads.
- Email notification with a download link on completion.
- Same endpoint serves both normal-user and admin exports.

### 2.2 Non-negotiable security invariant
- **An export job's data is scoped to exactly one workspace, resolved server-side.
  No export ever mixes data from more than one workspace.**
- The admin capability does NOT relax this invariant. Admins do not get
  "cross-workspace" exports; they get the ability to target a *different single*
  workspace than one they belong to. Every job is still one-workspace-scoped.

---

## 3. Authorization model (the load-bearing decision)

This is where "no cross-workspace, ever" and "admins can export any workspace"
have to be reconciled precisely, because a naive implementation is exactly how
cross-tenant data leaks happen.

### 3.1 The request shape
`POST /api/exports`
```
{
  "workspaceId": "<uuid>",     // REQUIRED, explicit. Never inferred from a default.
  "format": "csv" | "json",
  "datasets": [...]            // optional; default = all exportable datasets
}
```

### 3.2 Authorization decision (single choke point)
On every request, server-side, before any data is read:

1. Resolve the caller (session/token) to a user id. Never trust a
   workspace/user id supplied in the body for identity.
2. Compute authorization for `workspaceId`:
   - If caller is a **member** of `workspaceId` with export permission → allow.
   - Else if caller has the **platform-admin** role → allow, and flag the job
     `adminOverride = true`.
   - Else → `403`. (Return 403, not 404-that-leaks; but do not confirm existence
     of workspaces the caller can't see — return an identical 403 for
     "not a member" and "workspace does not exist".)
3. The resolved `workspaceId` is the ONLY tenant key passed downstream. Every
   query in the generation job is filtered by this id. There is no code path in
   the generator that can widen scope.

### 3.3 Guardrails against the classic leaks
- Admin authorization is a **role check**, not "email domain" or "is staff" heuristics.
- `adminOverride` jobs are always audit-logged (see §7) with actor, target
  workspace, datasets, and timestamp — non-repudiable record of an admin reading
  another tenant's data.
- Generation queries use a tenant-scoped data accessor that *requires* a
  workspace id; a missing/empty id fails closed (error), never "return everything".
- Defense in depth: the download endpoint re-checks authorization at fetch time
  against the job's stored `workspaceId` + requester, so a leaked/forwarded link
  can't be used by someone who lost (or never had) access.

---

## 4. Async generation

- Request validated + authorized synchronously → job row created (status `queued`)
  → `202 Accepted` with a `jobId`. No data read in the request path.
- Worker picks up job: status `running` → streams datasets to a file in the
  chosen format → uploads to object storage → status `ready` (or `failed`).
- Idempotency: optional `Idempotency-Key` header; a repeat within the TTL returns
  the existing job instead of creating a duplicate.
- Concurrency/abuse: per-user rate limit on job creation, and a cap on concurrent
  in-flight jobs per workspace. (Exact numbers: default, tune later.)
- Failure handling: bounded retries with backoff; terminal failure sets `failed`
  and sends a "your export failed, try again" email (no link).

### 4.1 Data shape
- CSV: one file per dataset, bundled as a single `.zip` (CSV can't represent
  multiple tables well). Header row per file. UTF-8 with BOM for spreadsheet apps.
- JSON: single `.json` document, top-level keyed by dataset name. Streamed
  (newline-delimited internally if size warrants) to bound memory.

---

## 5. Download link

- Link points to a download endpoint (`GET /api/exports/:jobId/download`), NOT
  a raw public object-storage URL.
- Access control at download time:
  - Requires an authenticated session; re-runs the §3.2 authorization check
    against the job's `workspaceId`.
  - Link/job is single-workspace and tied to the requesting user.
- Expiry: download availability expires (default **7 days**); after that the
  stored artifact is deleted by a reaper job and the link 410s.
- The artifact in object storage is private (no public ACL); the app streams it
  after auth, or issues a short-lived signed URL (minutes) minted only after the
  auth check passes.

---

## 6. Email

- Sent to the requester's verified account email (not an address from the request body).
- Contents: workspace name, format, requested-at, a link to the download
  endpoint, and the expiry time. No data in the email itself.
- Admin-override exports: the notification still goes to the admin requester;
  we do NOT silently email the target workspace's owners (out of scope; revisit
  if product wants tenant-visible notice of admin access).

---

## 7. Audit & observability

- Every job logged: actor user id, workspaceId, format, datasets, adminOverride flag,
  created/started/finished timestamps, status, byte size, requester IP/user-agent.
- Admin-override reads are surfaced to a security/audit stream, retained per the
  org's audit-retention policy.
- Metrics: queue depth, job duration, failure rate, artifact size distribution.

---

## 8. Explicitly out of scope (v1)

- Scheduled/recurring exports.
- Multi-workspace / org-wide "export everything" in one job (violates the invariant).
- Direct-to-cloud (Drive/S3) delivery.
- User-selectable columns / transforms beyond dataset choice.
- Tenant-visible notice when an admin exports their workspace (flagged for product).

---

## 9. Open questions parked for build time (non-blocking)

- Exact rate-limit numbers and per-workspace concurrency cap.
- Precise list of "exportable datasets" and their canonical CSV/JSON schemas.
- Retention window if legal/compliance wants shorter than 7 days.
- Whether admin-override should require a typed reason (compliance ask).

---

## 10. Acceptance criteria (security-critical)

1. A request with a `workspaceId` the caller is not a member of, and who is not a
   platform admin, returns 403 and creates no job and reads no data.
2. No generated artifact ever contains rows from a workspace other than the job's
   `workspaceId` — verified by test with two seeded workspaces.
3. A download link cannot be used by a user who fails the authorization re-check
   at download time.
4. Every admin-override export produces an audit record before the artifact is
   readable.
5. Expired links 410 and their artifacts are deleted.
