# Spec: Email Notifications for Task App

**Date started:** 2026-08-01
**Status:** Confirmed by Adrian on 2026-08-01 (all ten decisions read back and
approved). Implementation may proceed.

## Context

The task app is minimal today (`src/tasks.js`): tasks have `id`, `title`,
`assigneeId`, `comments[]`. There is no user model, no email infrastructure,
and no persistence layer visible in the repo.

**Rough plan from Adrian:** when a task is assigned or commented on, the
assignee gets an email. Probably some kind of digest option too. Nothing else
is decided.

## Decisions

1. **Recipients (2026-08-01):** Assignee only for v1 — for both assignment and
   comment notifications. No creator/watcher/participant notifications; those
   are additive later and the schema has no `creatorId`/watchers today.
2. **Self-action suppression (2026-08-01):** No email when the actor is the
   recipient (self-assign, commenting on your own assigned task). Events must
   carry the acting user's ID so this check is possible.
3. **Digest (2026-08-01):** Deferred to v2. V1 ships immediate emails only.
   To keep the digest cheap later, v1 records a notification *event* and
   flushes it immediately, rather than calling the mailer inline — v2 changes
   when events flush, not the pipeline. (Adrian delegated this call to
   Claude's recommendation.)
4. **Preferences (2026-08-01):** Single global email-notifications on/off
   toggle per user, default on. No per-event-type granularity in v1. The
   unsubscribe path flips this same toggle.
5. **User model (2026-08-01):** No users store exists yet. This feature
   introduces a minimal one: `id`, `email`, `name`,
   `emailNotificationsEnabled` (default true). Emails come from signup and
   are treated as deliverable — no verification flow in v1.
6. **Delivery mechanism (2026-08-01):** Thin `Mailer` interface with two v1
   implementations: a console/dev mailer (logs instead of sending; used by
   tests and local dev) and an SMTP mailer via Nodemailer, configured entirely
   by env vars. Provider-agnostic — any transactional provider's SMTP creds
   plug in; native SDK adapters can be added later for bounce webhooks.
7. **Delivery timing (2026-08-01):** Asynchronous in-process — the user action
   never blocks on SMTP. Notification event is written with status `pending`,
   sent off the request path, then marked `sent`/`failed`. No external queue
   in v1; a crash loses at most the in-flight send. Upgrading to a real queue
   later means swapping the dispatcher only.
8. **Content & format (2026-08-01):** Plain text in v1 (no HTML templates).
   Subjects: `You were assigned: <task title>` / `New comment on: <task
   title>`. Body: actor's name, comment text (or assignment note), and a link
   to the task page built from an `APP_BASE_URL` env var (web UI has task
   URLs). HTML is an additive upgrade later.
9. **Failure handling (2026-08-01):** One retry after ~30s backoff, then mark
   the event `failed` and log. No dead-letter queue or bounce handling in v1
   (SMTP can't report bounces; comes later with a provider SDK adapter).
   Failed events remain queryable via their status — nothing vanishes
   silently.
10. **Unsubscribe (2026-08-01):** Internal team tool — no tokenized one-click
    unsubscribe or `List-Unsubscribe` header in v1. Email footer carries a
    plain pointer to the in-app settings page where the global toggle
    (decision 4) lives.

## Open questions

_All resolved as of 2026-08-01. See Decisions above._

## Implementation (v1, 2026-08-01)

- `src/users.js` — minimal user store (decision 5) with the global toggle.
- `src/mailer.js` — console/dev mailer, capture mailer for tests, SMTP mailer
  via lazily-imported Nodemailer (decision 6).
- `src/emails.js` — plain-text templates + task link from `APP_BASE_URL`,
  settings-page footer (decisions 8, 10).
- `src/notifications.js` — event records (`pending`/`sent`/`failed`, plus
  `skipped` with a reason for suppressed sends), async dispatch off the
  request path, one retry then failed (decisions 2, 3, 4, 7, 9).
- `src/tasks.js` — `assignTask(task, assigneeId, actorId)` (signature gained
  `actorId` for self-action suppression) and `addComment` now emit
  notification events.
- `test/notifications.test.js` — covers send content, self-suppression,
  toggle-off, retry-then-success, and retry-then-failure.

Env vars: `APP_BASE_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`,
`SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`. Without `SMTP_HOST`, the console
mailer is used, and Nodemailer need not be installed.
