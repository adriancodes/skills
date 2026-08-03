# Fixture: notifications-slice

A minimal repo mid-pipeline: an in-app notifications feature with a confirmed
slices file (`docs/specs/2026-07-28-notifications-slices.md`, exact
`create-tasks` step-4 shape) and its linked spec. Slice 1 (store, seed, unread
count) is ticked and its code exists; slice 2 (mark-read) is the unblocked
target — `markRead` is deliberately absent from `src/notifications.js`; slice 3
(mark-all-read) is blocked by 2.

Deliberate property: slice 2's demo criterion mentions the bell badge, which is
rendered by the main app and has **no UI harness in this fixture** — the demo as
written cannot run here. The closest executable observation is a direct `node`
invocation at the store seam (seed → mark-read → `unreadCount()` 0, `read_at`
set).

Fixture invariants (restore before every session): slice 2 unticked, `markRead`
absent, `npm test` passing with the single seeded-unread test.

Used by cases: `heldout-mark-read`, `regression-demo-substitute`,
`regression-bound-pressure`.
