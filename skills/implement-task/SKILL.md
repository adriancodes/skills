---
name: implement-task
description: >
  Use when a task from a work plan needs building. The user asks to
  "implement task 3", "build the next task", or "work through the tasks".
  Also when implementation keeps wandering past its task boundary, or
  slices get coded but the slices file never reflects it.
license: MIT
metadata:
  category: Building
  summary: Implements one planned task to its demo criterion, starting with a test and updating the work plan before reporting completion.
---

# Implement Task

## Overview

Implement one task from the work plan within its recorded boundary. Keep one task to one session so the next session starts with fresh context. Completion requires a successful demo, an updated work plan, and no changes outside the boundary. Green tests alone are not enough.

## When to Use

- "implement slice N", "build the next slice", "keep working through the slices"
- A slices file exists (from `create-tasks` or hand-written) with an unblocked, unticked slice
- Slices keep getting coded while the slices file silently rots

## Do Not Use When

- No slices file exists: create tasks first (`create-tasks` if installed; otherwise split the work into demoable, session-sized pieces and write the file) or, for genuinely one-session work, just build it
- More than one slice is wanted: one invocation, one slice; the next slice gets a fresh session
- The slice needs re-planning, not building: changes to slices go through the slices file first, and reopened spec decisions go through the spec's supersede rule (a new numbered entry with the user's say-so; history intact)

## Required Context

- The slices file (format defined by `create-tasks`, step 4: checkbox entries with Layers, Bound, Demo, and Blocked by fields plus `status:`, `## Confirmation`, and `## Verification`) and the spec it links: both read in full before any code
- The target slice: the one named, else the first unblocked unticked slice
- The repo's test and build commands

## Workflow

1. **Anchor.** Read the slices file and linked spec. Confirm every blocker of the target slice is ticked: an unblocked claim is checked, not assumed; if a blocker is open, stop and say which. Restate the slice's layers, demo criterion, and bound in one breath. Done when the restatement is in the conversation.

2. **Encode the demo as a failing check first.** Before any implementation code: write the test (or executable check) that expresses the slice's demo criterion, run it, and watch it fail. **REQUIRED BACKGROUND when installed:** a TDD skill (e.g. `tdd`): follow it at this seam. Without one: red first, then code, no exceptions: a test written after existing code passes immediately and proves nothing about the criterion. Done when the check exists and fails for the right reason.

3. **Build inside the bound.** Treat the slice's `Bound` field as authoritative; `Layers` names architectural coverage, not permission to touch every file in a layer. The pull to fix adjacent code, add the "basically the same" extra endpoint, or wire the next slice's parts is a bound violation, not a bonus: note it for the next slice instead. **When reality contradicts the bound** (a genuinely needed third endpoint, a hidden dependency): stop and edit the slices file first, then continue: and the amendment only *shrinks or corrects* this slice's bound. New scope becomes a new slice for a fresh session. When the slice's demo cannot run without the new scope, correct the demo downward in the file or stop at a clean seam (Failure Modes); user urgency never expands the active slice. Build-then-mention erases the evidence that the plan was wrong. Done when the failing check passes with every changed file or surface inside `Bound`.

4. **Run the demo literally.** Execute the demo criterion as written: seed the state, hit the endpoint, watch the badge drop: not "the tests imply it works". Then the relevant test files, then the full suite once. Done when all three ran, and the demo was observed, not inferred.

5. **Verify hostile surfaces before reporting.** When the slice produced a script, config, parser, prompt, or other artifact with hostile inputs, run `verify-work` if installed. The original implementation request authorizes fixes inside the slice's recorded bound; pass that authority explicitly and stop on any fix that would expand it. Without `verify-work`, execute at least 3 applicable hostile cases (empty, malformed, boundary). Done when the verification result is recorded and every authorized scope-bound fix passes re-attack, or the slice is explicitly left unticked with residual findings.

6. **Tick before telling.** Only after steps 4 and 5 pass, update the slices file: tick the slice and add a one-line outcome note (date, anything the next slice should know): *before* writing the final message. The report states: slice, demo result, full-suite result, hostile-input result or why inapplicable, files touched, and anything noted for later slices. Commit if the repo's flow commits per unit of work. Done when the file shows the tick and the final report links it; a failed or incomplete verification leaves the slice unticked.

## Example: the two orderings

> **Baseline order (forbidden):** endpoints → UI wiring → test written against finished code → passes first run → "done, tests green."
> **This skill's order:** failing test encoding "badge 1 → mark-read → badge 0, `read_at` set" → endpoints + wiring until it passes → demo run watched → hostile surfaces verified → slices file ticked → report.

## Common Rationalizations

These are common reasons implementation escapes its task boundary.

| Excuse | Reality |
|--------|---------|
| "While I'm in this file anyway, I'll wire the other event source: two lines" | That's the next slice's two lines. Note it there; the bound holds. |
| "I'll add mark-all-read too, it's basically the same handler" | "Basically the same" is how a two-endpoint slice becomes four. The bound names two. |
| "The demo is obvious from the code; no need to click through" | Obvious demos fail on the seam nobody typed: run it, watch it. |
| "Tests are green, so the demo criterion is effectively satisfied" | The test is the criterion *encoded*; the demo is the criterion *executed*. Both, in that order. |
| "I'll tick the slices file at the end" | "The end" is after the report, which is never. Tick before telling. |

## Success Criteria

- The demo-criterion check existed and failed before implementation code
- Zero changes outside the slice's bound: a mid-work bound *correction* (never an expansion built this session) recorded in the slices file before the code that relies on it
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

- **A blocker is unticked:** stop and name it: implementing over an open blocker builds on sand; the blocker's slice comes first.
- **The demo criterion can't be run** (no UI harness, no seed path): say so and substitute the closest executable observation, labeled as a substitution in the outcome note: never silently downgrade to "tests pass".
- **The slice turns out bigger than a session:** stop at a clean seam, write what remains into the slices file as a new blocked slice, tick nothing.

## Summary

Implement one bounded task at a time. Observe the failing test first, run the demo, and update the work plan before reporting completion.
