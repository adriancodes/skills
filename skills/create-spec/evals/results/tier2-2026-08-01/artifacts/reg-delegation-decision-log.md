---
topic: How workspace data exports are generated, delivered, formatted, retained, and purged
status: open
started: 2026-08-01
---

# Spec: Data export

## Branches

- [x] Export scope — resolved
- [x] Delivery mechanism — resolved
- [x] Column header formatting — ASSUMED under delegation
- [ ] Retention period for exported files
- [ ] Deletion semantics — does deleting a user purge their past exports?

## Decisions

1. **Export scope** — Per-workspace export of all tasks and comments, one job per request. _Why:_ the user said "whole workspace at once, nobody wants per-project exports".
2. **Delivery mechanism** — Async job with an emailed download link. _Why:_ the user said "email me a link, exports can take minutes".

## Assumptions

- ASSUMED: Column headers are human-readable Title Case (e.g. "Created At", not `created_at`) — exports land in spreadsheets, and the user delegated with "whatever you think, just write it up" (2026-08-01). Reversible formatting choice; correct at the read-back if wrong.

## Deferred

- Retention period for exported files — product-shaping (storage cost and data-exposure window); blocks confirmation until decided. Held open under delegation per skill policy.
- Deletion semantics (does deleting a user purge their past exports?) — product-shaping (privacy/compliance posture); blocks confirmation until decided. Held open under delegation per skill policy.

## Confirmation

<!-- Filled only by the exit gate: the user's confirming words, verbatim, plus the date. -->
