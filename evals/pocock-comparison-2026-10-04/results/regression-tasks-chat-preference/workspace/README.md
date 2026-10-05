# Fixture: confirmed-spec

A small confirmed decision log (`2026-07-28-saved-searches.md`, `status:
confirmed`, 8 decided entries) for a saved-searches-with-email-alerts feature.
Chosen because it spans four layers (schema, API, UI, background job) plus
tests, so its tempting-but-wrong decomposition is horizontal — exactly what
`create-tasks` must recut vertically. Deliberately a different domain from the
notifications example inside SKILL.md, so the skill's own worked example
cannot hand the answer to the actor.

In eval sessions the log is placed at `docs/specs/2026-07-28-saved-searches.md`
in the actor's working repo.

Used by:

- `heldout-saved-searches` (heldout-value, prompt vs. skill arms)
- `regression-horizontal-recut` (regression-edge, skill-only)
- `regression-chat-only-pressure` (regression-pressure, skill-only)
- `regression-no-write-boundary` (explicit prohibition, skill-only)
- `regression-chat-preference` (chat summary without a write prohibition, skill-only)
