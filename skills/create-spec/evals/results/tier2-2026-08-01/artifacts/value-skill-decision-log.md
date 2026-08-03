---
topic: How assignees learn about activity on their tasks without opening the app
status: confirmed
started: 2026-08-01
---

# Spec: Email notifications for task activity

## Branches

- [x] Trigger events — which activities generate a notification
- [x] Recipient rules — who gets notified, incl. actor's own actions
- [x] Email address source — ASSUMED under delegation
- [x] Delivery mode — immediate vs digest, and how the "digest option" works (product-shaping: must be decided)
- [x] Digest details — send time and grouping (split from Delivery mode)
- [x] User preferences — opt-in/opt-out model and defaults (product-shaping: must be decided)
- [x] Email content — ASSUMED under delegation
- [x] Delivery mechanism — ASSUMED under delegation
- [x] Failure handling — retries, bounces (retry policy is product-shaping: must be decided)

## Decisions

_(Facts found in repo, recorded, not asked:)_

- **Fact:** Tasks carry only `id`, `title`, `assigneeId`, `comments[]` (`src/tasks.js`). There is no user model, so no email addresses exist anywhere yet — the "email address source" branch is a real design question, not a lookup.

1. **Trigger events** — Assignment and new comments only. _Why:_ user: "Just assignment and comments for now, like the plan says" — smallest set covering "needs my attention"; more events can be added later.
2. **Recipient rules** — Only the assignee is emailed; self-notifications suppressed (own comments/self-assignment send nothing; non-assignee commenters get nothing). _Why:_ user confirmed ("yeah fine") the scenario: Alice assigned to T comments on T → no email to anyone. Matches universal expectations; avoids spam complaints.
3. **Delivery mode** — Immediate emails by default; each user can switch to a daily digest that batches their pending notifications into one email. _Why:_ user picked "Option 2 — immediate by default, per-user switch to a daily digest." Implies a persisted notification queue + daily scheduled job.
4. **Digest details** — Daily digest sends at a fixed 8:00 in the app's timezone for all digest users; empty digests are skipped (no email on a no-activity day). Digest mode fully replaces immediate sends. _Why:_ user picked option 1 and confirmed the scenario: 8 events between runs → exactly one 8:00 email listing all 8, zero immediate emails. One scheduler run; no per-user timezone storage; empty digests drive unsubscribes.
5. **User preferences** — Per-user three-state setting: immediate (default for new users) / daily digest / off. "Off" discards events entirely: they are never queued and never appear in a later digest after switching back. _Why:_ user picked option 1 and confirmed "off means gone, not queued for later." Full opt-out is table stakes; immediate default matches #3.
6. **Failure handling** — Transient send failures retry a few times with backoff, then drop and log (at-most-once: no duplicates, rare missed emails acceptable). Hard bounces stop sends to that address and set a flag on the user record. _Why:_ user picked option 1 and approved the bounce flag ("Option 1, and the bounce flag is fine"); the app remains the source of truth, so a lost email is not lost data.

## Assumptions

_User delegated with "whatever you think" (2026-08-01); per delegation rules these are reversible implementation defaults, recorded ASSUMED, to be ratified at the read-back:_

- ASSUMED: **Email address source** — add a minimal user record (`id`, `email`, later notification prefs); `assigneeId` references it. The prefs branch needs a per-user home anyway.
- ASSUMED: **Email content** — plain transactional email: subject names the task; body carries event summary (who assigned / who commented + comment body) and a link to the task. Outbound-only; replies not ingested.
- ASSUMED: **Delivery mechanism** — sends go through a small provider adapter (SMTP/API-agnostic) and are dispatched asynchronously so the triggering action never blocks on email.

## Deferred

## Confirmation

2026-08-01 — full read-back of decisions 1–6 and assumptions 7–9 presented; user replied: "Confirmed, go ahead."
