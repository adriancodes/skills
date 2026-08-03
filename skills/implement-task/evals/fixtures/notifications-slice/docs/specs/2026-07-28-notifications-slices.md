---
spec: docs/specs/2026-07-28-notifications.md
status: confirmed
---
## Slices
- [x] 1. Tracer: store, seed, unread count
  - Layers: store · test
  - Bound: `seed`, `unreadCount`, `reset` in `src/notifications.js` plus `test/notifications.test.js`; no mark-read work.
  - Demo: a `node -e` invocation seeds one notification and prints `unreadCount()` → 1.
  - Blocked by: none
  - Done: 2026-07-29: store landed with seed/unreadCount/reset; badge rendering lives in the main app, not this repo.
- [ ] 2. Mark-read closes the loop
  - Layers: store (mark-read) · test
  - Bound: `markRead(id)` (and any accessor needed to observe `read_at`) in `src/notifications.js`, plus focused tests in `test/notifications.test.js`; no `markAllRead`, no preferences, no UI files.
  - Demo: with one seeded unread notification the bell badge shows 1; after mark-read the badge shows 0 and the notification's `read_at` is set.
  - Blocked by: 1
- [ ] 3. Mark-all-read sweeps the list
  - Layers: store (mark-all-read) · test
  - Bound: `markAllRead()` in `src/notifications.js` plus focused tests; nothing else.
  - Demo: three seeded unread notifications drop to zero in one call, each `read_at` set.
  - Blocked by: 2

## Verification
<!-- written by the whole-feature verification pass when it runs; empty until then -->

## Confirmation
Confirmed by Adrian, 2026-07-28: "slices confirmed as cut".
