# Slices file contract

Write the plan beside its spec. Name it after the spec file with `-slices` before `.md`: `2026-07-28-saved-searches.md` gives `2026-07-28-saved-searches-slices.md`. Repository instructions may override the path.

Each entry under `## Slices` is one task.

```md
---
spec: docs/specs/<date>-<slug>.md
status: open
---
## Slices
- [ ] 1. <title>
  - Layers: <actual layers or refactor surfaces · tests>
  - Bound: <included files, surfaces, or cases>
  - Demo: <runnable behavior or preservation check>
  - Blocked by: none
- [ ] 2. <title>
  - Layers: <actual layers or refactor surfaces · tests>
  - Bound: <included files, surfaces, or cases>
  - Demo: <runnable behavior or preservation check>
  - Blocked by: 1

## Verification

## Confirmation
```

Use unique task IDs and only existing blocker IDs. Keep `status: open` until the breakdown is approved. Record the user's confirmation words and date under `## Confirmation`, then set `status: confirmed`.

Use `[x]` only after a task's demo and checks pass. Append `Done: <date>: <one-line outcome>` inside each completed task.

Leave `## Verification` empty until whole-feature verification. Record failed or unproven attempts as `Status: incomplete`; use `Status: complete` only for supported completion. Clear or supersede stale verification evidence when the feature changes.

Under an explicit write prohibition, the chat copy includes frontmatter and both trailing sections. Name the expected saved path.
