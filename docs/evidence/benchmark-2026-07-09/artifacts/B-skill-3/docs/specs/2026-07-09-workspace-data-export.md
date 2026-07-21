---
topic: How a workspace's data gets exported on demand — who may trigger it, what it contains, and how the file reaches the requester
status: confirmed
started: 2026-07-09
---

# Spec: Workspace data export

## Branches

- [x] User export authorization — resolved (ASSUMED)
- [x] Admin cross-workspace export — resolved (ASSUMED, ADR 0001)
- [x] Data in scope — resolved (ASSUMED; entity enumeration Deferred)
- [x] Sensitive / PII redaction — resolved (ASSUMED)
- [x] Format structure — resolved (ASSUMED)
- [x] Async job mechanism — resolved (ASSUMED)
- [x] File storage & download authorization — resolved (ASSUMED)
- [x] Link TTL & file retention — resolved (ASSUMED)
- [x] Email delivery & recipient — resolved (ASSUMED)
- [x] Failure notification — resolved (ASSUMED)
- [x] Rate limiting & size caps — resolved (ASSUMED; hard caps Deferred)
- [x] Audit logging — resolved (ASSUMED)
- [x] Endpoint / API contract — resolved (ASSUMED)

_Session resolved under blanket delegation ("whatever you think"). Every
build-blocking branch is decided as ASSUMED and read back at the exit gate;
only genuinely-optional items are Deferred._

## Decisions

1. **User export authorization** — Only a workspace **Owner or Admin** may
   request an export of that workspace; the job runs against exactly the
   requester's own workspace, never another. _Why:_ a full-workspace dump is
   high-sensitivity exfiltration; gating it to owner/admin is the safe default.
   _(Plan said "users"; flagged at gate — cheapest place to widen to any member.)_
2. **Admin cross-workspace export** — "Admin" means a **global platform admin**,
   not a workspace-level admin. Cross-workspace export is a single, deliberate,
   audited **exception** to the "no cross-workspace data, ever" invariant: allowed
   only for the global-admin role, only by passing an explicit target workspace id,
   and always audit-logged. For every non-admin path the invariant holds absolutely.
   _Why:_ reconciles the two stated requirements without weakening the default.
   → ADR 0001.
3. **Data in scope** — Export covers an **allowlist** of user-facing business
   entities (records/items, member roster, workspace settings/metadata) — never
   "every table." Soft-deleted / archived records are **excluded** by default.
   _Why:_ an allowlist prevents accidental leakage of internal/system tables; live
   data matches user expectation. Concrete entity list → Deferred (needs the schema).
4. **Sensitive / PII redaction** — Exports **exclude** credentials, secrets,
   password hashes, API tokens, and internal system fields; member PII (names,
   emails, roles) is **included** as it is the workspace's own data. _Why:_ secrets
   must never leave; a workspace legitimately owns its members' basic profile data.
5. **Format structure** — One **`.zip` archive** containing one file per entity
   type; the user picks **CSV or JSON** as the per-file format at request time.
   CSV = one flattened row per record; JSON = an array of objects per entity plus a
   top-level `manifest.json`. _Why:_ multiple entity types don't fit one flat file;
   a zip keeps it a single download; the manifest aids re-import and debugging.
6. **Async job mechanism** — Requesting enqueues an **export job** (returns a job
   id); a background worker builds the archive. Failed jobs **retry with bounded
   backoff (3 attempts)** then mark failed. **One in-flight export per user.**
   _Why:_ standard async pattern; bounded retries avoid poison jobs; single
   in-flight curbs resource abuse.
7. **File storage & download authorization** — Archive stored in **object storage**
   under a non-guessable key. Download is served by an **authenticated endpoint that
   re-verifies** the caller is the original requester (or a global admin) before
   streaming — the emailed link points at this endpoint, never a raw/public object
   URL. _Why:_ re-checking auth at download closes the "forwarded link exfiltrates
   data" hole, preserving the invariant even for admin exports.
8. **Link TTL & file retention** — Download link valid **7 days**; the stored
   archive **auto-deletes after 7 days**; the link is reusable within that window by
   the authorized user. _Why:_ a week covers realistic download delay; time-bounded
   retention limits exposure of a sensitive data dump.
9. **Email delivery & recipient** — Completion email goes **only to the requester's
   account email** (never a user-supplied address), containing the authenticated
   download link and an export summary. _Why:_ pinning to the account email prevents
   redirecting sensitive data to an attacker-chosen inbox.
10. **Failure notification** — On terminal failure the user gets an **email that
    generation failed** with a prompt to retry; a partial or corrupt archive is
    **never** linked. _Why:_ silent failure is worse than a failure notice; partial
    data risks inconsistency.
11. **Rate limiting & size caps** — **One in-flight export per user** (see #6) plus
    a **daily cap (5/user/day)**; large workspaces are **streamed to storage** rather
    than buffered in memory. _Why:_ basic abuse protection now. Hard row/byte caps →
    Deferred (needs production volume data).
12. **Audit logging** — **Every** export is audit-logged (actor, target workspace,
    format, timestamp, outcome); admin cross-workspace exports are logged with
    elevated visibility. _Why:_ the admin exception is only acceptable if
    accountable.
13. **Endpoint / API contract** — Single authenticated **`POST /exports`** taking
    `{ format: "csv" | "json", workspace_id? }`; `workspace_id` is honored **only for
    global admins** and otherwise defaults to the caller's own workspace. Returns
    `{ job_id, status }`. Companion **`GET /exports/:id`** returns status;
    **`GET /exports/:id/download`** streams the archive (auth re-checked per #7).
    _Why:_ one endpoint as required; an explicit target only for admins keeps normal
    users pinned to their own workspace.

## Assumptions

All decisions above are ASSUMED under blanket delegation. The highest-value
corrections at the gate:

- ASSUMED: export gated to **workspace Owner/Admin**, not any member (plan said
  "users") — widen here if any member should be able to export.
- ASSUMED: **global-admin-only** cross-workspace export as an audited exception —
  the only sanctioned breach of the "no cross-workspace, ever" invariant.
- ASSUMED: **7-day** link/retention window; **5/user/day**; **3** retry attempts —
  round numbers, easily retuned.
- ASSUMED: soft-deleted/archived records **excluded**; secrets/tokens **redacted**,
  member PII **included**.

## Deferred

- Concrete enumeration of in-scope entities — a question of fact against a data
  model / schema that does not yet exist in this repo; settle during build.
- Hard row/byte size caps and rate-limit tuning — needs real production volumes.
- Scheduled / recurring exports and per-entity selective export — out of stated
  scope; candidate v2.

## Confirmation

Read back all 13 decisions, the four flagged assumptions, and the three deferred
items at the exit gate. User confirmed on 2026-07-09: "ok".

Recorded verbatim; `status: confirmed`.
