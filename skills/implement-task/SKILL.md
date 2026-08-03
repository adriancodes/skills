---
name: implement-task
description: >
  Use when a task — a slice from a slices file — needs building. The user
  asks to "implement task 3", "implement slice 3", "build the next task",
  or "work through the slices". Also when implementation keeps wandering
  past its slice's bound, or slices get coded but the slices file never
  reflects it.
license: MIT
metadata:
  category: Building
  summary: Implements one slice to its demo criterion, starting with a failing test and ticking the slices file before reporting completion.
---

# Implement Task

## Overview

Implement one slice from the slices file within its recorded bound, one per session so the next starts with fresh context. Completion means a successful demo, a ticked slices file, and no changes outside the bound — green tests alone are not enough.

## When to Use

- "implement slice N", "build the next slice", "keep working through the slices"
- A slices file exists (from `create-tasks` or hand-written) with an unblocked, unticked slice
- Slices keep getting coded while the slices file silently rots

## Do Not Use When

- No slices file exists: create one (`create-tasks` if installed; otherwise split the work into demoable, session-sized pieces and write the file), or just build genuinely one-session work
- More than one slice is wanted: one invocation, one slice; the next gets a fresh session
- The slice needs re-planning, not building: slice changes go through the slices file first; reopened spec decisions go through the spec's supersede rule (a new numbered entry with the user's say-so; history intact)

## Required Context

- The slices file (format defined by `create-tasks`, step 4: checkbox entries with Layers, Bound, Demo, and Blocked by fields plus `status:`, `## Confirmation`, and `## Verification`) and its linked spec, both read in full before any code
- The target slice: the one named, else the first unblocked unticked slice
- The repo's test and build commands

## Workflow

1. **Anchor.** Read the slices file and linked spec. Confirm every blocker is ticked — checked, not assumed; if one is open, stop and say which. Restate the slice's layers, demo criterion, and bound in one breath. Done when the restatement is in the conversation.

2. **Encode the demo as a failing check first.** Before any implementation code, write the test (or executable check) expressing the slice's demo criterion, run it, and watch it fail. **REQUIRED BACKGROUND when installed:** a TDD skill (e.g. `tdd`): follow it at this seam. Without one: red first, then code, no exceptions — a test written after the code passes immediately and proves nothing. Done when the check fails for the right reason.

3. **Build inside the bound.** `Bound` is authoritative; `Layers` names architectural coverage, not permission to touch every file in a layer. Fixing adjacent code, adding the "basically the same" extra endpoint, or wiring the next slice's parts is a bound violation, not a bonus: note it for the next slice. **When reality contradicts the bound** (a genuinely needed third endpoint, a hidden dependency): stop, edit the slices file first, then continue — the amendment only *shrinks or corrects* this slice's bound; new scope becomes a new slice for a fresh session. If the demo cannot run without the new scope, correct the demo downward in the file or stop at a clean seam (Failure Modes); user urgency never expands the active slice. Done when the failing check passes with every changed file or surface inside `Bound`.

4. **Run the demo literally.** Execute the demo criterion as written: seed the state, hit the endpoint, watch the badge drop. Then the relevant test files, then the full suite once. Done when all three ran and the demo was observed.

5. **Verify hostile surfaces before reporting.** If the slice produced a script, config, parser, prompt, or other artifact facing hostile inputs, run `verify-work` if installed: the original request authorizes fixes inside the slice's recorded bound — pass that authority explicitly and stop on any fix that would expand it. Without `verify-work`, execute at least 3 applicable hostile cases (empty, malformed, boundary). Done when the verification result is recorded and every scope-bound fix passes re-attack, or the slice is explicitly left unticked with residual findings.

6. **Tick before telling.** Only after steps 4 and 5 pass, tick the slice in the slices file with a one-line outcome note (date, anything the next slice should know). Report: slice, demo result, full-suite result, hostile-input result or why inapplicable, files touched, and notes for later slices. Commit if the repo's flow commits per unit of work. Done when the file shows the tick and the final report links it; failed or incomplete verification leaves the slice unticked.

## Example: the two orderings

> **Baseline order (forbidden):** endpoints → UI wiring → test written against finished code → passes first run → "done, tests green."
> **This skill's order:** failing test encoding "badge 1 → mark-read → badge 0, `read_at` set" → endpoints + wiring until it passes → demo run watched → hostile surfaces verified → slices file ticked → report.

## Common Rationalizations

The usual ways implementation escapes its slice's bound.

| Excuse | Reality |
|--------|---------|
| "While I'm in this file anyway, I'll wire the other event source: two lines" | Those are the next slice's two lines. Note them there; the bound holds. |
| "I'll add mark-all-read too, it's basically the same handler" | "Basically the same" turns a two-endpoint slice into four. The bound names two. |
| "The demo is obvious from the code; no need to click through" | Obvious demos fail on the seam nobody typed: run it, watch it. |
| "Tests are green, so the demo criterion is effectively satisfied" | The test is the criterion *encoded*; the demo is the criterion *executed*. Both, in that order. |
| "I'll tick the slices file at the end" | "The end" is after the report, which is never. Tick before telling. |

## Success Criteria

- The demo-criterion check existed and failed before implementation code
- Zero changes outside the slice's bound: any mid-work bound *correction* (never an expansion built this session) recorded in the slices file before the code relying on it
- The demo criterion was literally executed and observed
- Relevant tests and the full suite passed
- Hostile-input verification passed or was explicitly inapplicable
- The slices file is ticked with an outcome note before the final message

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Starting from the slice title alone | Read the slices file and the spec it links, in full |
| Test written after the code | Delete it as evidence; red first (step 2) |
| Bound violation reported as a bonus | It's a plan defect: slices file first, then code |
| "Done" in chat, `[ ]` in the file | The file is the pipeline's state; chat is not |

## Failure Modes

- **A blocker is unticked:** stop and name it; the blocker's slice comes first.
- **The demo criterion can't be run** (no UI harness, no seed path): say so and substitute the closest executable observation, labeled as such in the outcome note — never silently downgrade to "tests pass".
- **The slice turns out bigger than a session:** stop at a clean seam, write the remainder into the slices file as a new blocked slice, tick nothing.

## Summary

Implement one bounded slice at a time. Observe the failing test first, run the demo, and tick the slices file before reporting completion.
