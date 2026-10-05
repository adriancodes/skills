# Slices file contract

Write `docs/specs/<date>-<slug>-slices.md` unless repository instructions override the path.

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

Leave `## Verification` empty until whole-feature verification. Clear or supersede stale verification evidence when the feature changes.

Under an explicit write prohibition, return this entire contract in chat, including frontmatter and both trailing sections. Name the expected saved path and offer to save it later. Do not create, edit, or delete files.
