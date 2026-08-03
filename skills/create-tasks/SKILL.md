---
name: create-tasks
description: >
  Use when a confirmed spec or plan needs breaking into executable work —
  the user asks to "create tasks", "break this into tickets", or
  "turn the spec into tasks". Also when implementation tasks keep
  overflowing an agent's context window, or a task list reads
  layer-by-layer: schema, then API, then UI.
license: MIT
metadata:
  category: Planning
  summary: Creates demoable implementation tasks from a confirmed spec, sized to one agent session with explicit blocking edges.
---

# Create Tasks

## Overview

Break a confirmed spec into small vertical tasks: each crosses the layers it needs, produces something demonstrable, fits one fresh agent session, and names its blockers. Horizontal plans (schema, then API, then UI, then tests) postpone usable behavior until the end.

## When to Use

- A confirmed spec, plan, or decision log needs to become executable work: "slice this spec", "break it into tickets", "make tasks from this"
- Implementation keeps overflowing a session's context mid-task
- An existing task list reads schema → API → UI → tests

## Do Not Use When

- The plan isn't confirmed yet (`status: open`): pin requirements first via `create-spec` if installed (interview or zero-question capture), otherwise get explicit confirmation. `confirmed` and `confirmed-by-override` both count.
- Executing the slices: this skill plans; each slice is its own implementation session
- The work fits one session: one slice is no slices; build directly (with `verify-work` at the end, if installed)
- The user wants issues in a tracker: use a tracker-ticket skill when installed; this skill owns the local `*-slices.md` execution contract

## Required Context

- The confirmed spec: a decision log under `docs/specs/`, a document the user names, or this conversation's confirmed decisions
- The repo explored enough to name the layers a slice must cross, and any prefactoring worth doing first

## Workflow

1. **Anchor.** Read the spec end to end. Check repo instruction files (`AGENTS.md`, `CLAUDE.md`) for re-homed artifact paths. List the layers this feature touches (schema, API, UI, jobs, tests: whatever the repo actually has). Done when the layer list is written.

2. **Draft slices.** Every slice passes all three tests; prefactoring becomes its own first slice ("make the change easy, then make the easy change"):
   - **Vertical**: it crosses every layer its demo needs. A one-layer slice is a layer; merge or recut it.
   - **Demoable**: done means a human can watch it work: a request returns, a screen shows, or: only when nothing is human-visible: a state change a test proves. Never "the model exists".
   - **Sized**: it fits one fresh agent session, exploration included. "Every call site" or "test everything" is unbounded: write the bounding list into the slice, or split it.
   Done when each slice is checked against all three, one by one.

3. **Draw the edges.** Each slice names the slices that must land first: `blocked by: none` counts and is written. Fewest edges wins: an edge exists because the code demands it, never because numbering implies it. A fully serial chain is a smell: recut once for parallelism before accepting it. Done when at least one slice is unblocked.

4. **Write the file.** `docs/specs/<date>-<slug>-slices.md` in exactly this shape: downstream skills parse it:

   ```md
   ---
   spec: docs/specs/<date>-<slug>.md
   status: open   # open | confirmed
   ---
   ## Slices
   - [ ] 1. <title>
     - Layers: <a · b · test>
     - Bound: <explicit files, surfaces, or cases included>
     - Demo: <runnable criterion>
     - Blocked by: none
   - [ ] 2. <title>
     - Layers: <…>
     - Bound: <…>
     - Demo: <…>
     - Blocked by: 1

   ## Verification
   <!-- written by the whole-feature verification pass when it runs; empty until then -->

   ## Confirmation
   <!-- user confirmation words and date; empty while status is open -->
   ```

   Ticks are `[x]`; a ticked slice appends `Done: <date>: <one-line outcome>` inside it. The write is unconditional: when the user asks for chat only, acknowledge in one line, write the file anyway, and read back from it — the request moves where the summary goes, never whether the file exists. Done when every slice has Layers, Bound, Demo, and Blocked by fields and the file exists before the read-back begins.

5. **Read back.** Present the slices, bounds, and edges as a numbered summary and ask for confirmation. Recut on objection; on confirmation, record the user's words and date under `## Confirmation`, then flip `status: confirmed`. Done only when both the confirmation record and confirmed status exist.

## Example: one slice

> ### 2. Mark-read closes the loop
> **Layers:** API (mark-read endpoints) · UI (mark-read interaction on the bell list) · test
> **Bound:** `POST /notifications/:id/read`, `POST /notifications/read-all`, bell-list interaction, and their focused tests; no emitter or preferences work.
> **Demo:** badge at "1" → click mark-read → badge drops to 0, `read_at` set.
> **Blocked by:** 1 (the tracer slice: table, first emitter, badge: rides in slice 1, never as its own schema slice).

## Common Rationalizations

Every excuse below appeared verbatim in baseline tests without this skill loaded.

| Excuse | Reality |
|--------|---------|
| "Schema first: everything depends on the data model" | The first vertical slice carries only the schema *it* needs; the model earns its columns slice by slice. |
| "I'll batch all the endpoints: they share a controller" | Shared code is not a shared slice; each endpoint ships in the slice that demos it. |
| "One pass over all the source sites keeps the context" | "All sites" is unbounded by definition; bound the list in the slice or split per site class. |
| "Tests as their own task at the end, once things stabilize" | A slice without its tests can't demo as done; tests ride in every slice. |
| "UI is a separate concern, cleaner as its own task" | Separate concern, same slice: the UI is how the slice demos. |

## Success Criteria

- Zero horizontal slices: every slice crosses all layers its demo needs; a one-layer slice is legitimate only when the work has one layer (a retention job with no UI), never because splitting was inconvenient
- Every slice carries a runnable demo criterion and a written size bound
- Edges written for every slice; at least one slice unblocked
- The slices file exists in the repo and ends with the user's confirmation

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Numbering as a secret dependency order | Edges are written per slice, or the slice says `blocked by: none` |
| "Wire A to B" as its own slice | Wiring belongs to the slice whose demo needs it |
| Slices delivered in chat only | Step 4 writes the file before the read-back |
| Recutting silently during implementation | New knowledge edits the slices file first, then the code |

## Failure Modes

- **A slice can't get a demo criterion:** an open decision hides in the spec: send it back there (or to `create-spec`); never settle it inside a slice.
- **Everything blocks everything after a recut:** the work may genuinely be serial: say so explicitly and proceed; never leave it implied.
- **More than ~10 slices:** the scope is program-sized; split the spec itself before slicing further.

## Summary

Write a repo work plan of small, demonstrable vertical tasks with explicit blockers; never leave it only in chat.
