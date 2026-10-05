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

Implement one recorded slice per session. Stay inside its bound. Completion requires a successful demo and a ticked slices file. Green tests alone are insufficient.

## When to Use

- "implement slice N", "build the next slice", "keep working through the slices"
- A slices file exists (from `create-tasks` or hand-written) with an unblocked, unticked slice
- Slices keep getting coded while the slices file silently rots

## Do Not Use When

- No slices file exists: use `create-tasks` when installed. Otherwise write demoable, session-sized pieces. Build directly only when the work truly fits one session.
- More than one slice is wanted: one invocation, one slice; the next gets a fresh session
- The slice needs replanning: change the slices file first. Reopen spec decisions through a new superseding entry with the user's approval.

## Required Context

- The slices file and linked spec, read in full before code.
- Each slice needs Layers, Bound, Demo, and Blocked-by fields.
- The file needs `status:`, `## Confirmation`, and `## Verification`.
- The target slice: the one named, else the first unblocked unticked slice
- The repo's test and build commands

## Workflow

1. **Anchor.** Read the slices file and linked spec. Check every blocker. If one is open, stop and name it. Restate the slice's layers, demo, and bound.

   Done when the restatement is in the conversation.

2. **Encode the demo as a failing check.** Write a test or executable check before implementation. Make it express the demo criterion. Run it and observe the intended failure. Follow `tdd` when installed. Without it, preserve the same red-first order.

   Done when the check fails for the right reason.

3. **Build inside the bound.** Treat `Bound` as authoritative. `Layers` describes coverage, not permission to touch every file. Record adjacent work for a later slice.

   When reality contradicts the bound, stop. Correct the slices file before code. The correction may shrink or clarify this slice. Put new scope in a fresh slice. If the demo needs that new scope, narrow the demo or stop at a clean seam. Urgency never expands the active slice.

   Done when the check passes and every changed surface is inside `Bound`.

4. **Run the demo literally.** Execute the written criterion. Then run focused tests and the full suite once.

   Done when the demo is observed and both test levels pass.

5. **Verify hostile surfaces.** For scripts, configs, parsers, prompts, or similar artifacts, run `verify-work` when installed. Pass explicit authority for fixes inside the bound. Stop before any fix that expands it. Without `verify-work`, execute at least 3 hostile cases: empty, malformed, and boundary.

   Done when scope-bound fixes pass re-attack. Otherwise leave the slice unticked and record residual findings.

6. **Tick before telling.** After steps 4 and 5 pass, tick the slice. Add a dated one-line outcome note. Report the slice, demo, suites, hostile checks, changed files, and later notes. Commit when the repository commits per work unit.

   Done when the file shows the tick and the report links it. Failed verification leaves the slice unticked.

## Example: the two orderings

> **Baseline order (forbidden):** endpoints → UI wiring → test written against finished code → passes first run → "done, tests green."
> **This skill's order:** failing badge test → implementation → observed demo → hostile checks → file tick → report.

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
- Zero changes outside the slice's bound.
- Record any bound correction before code relies on it. Never build an expansion in the same session.
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
- **The demo cannot run:** use the closest executable observation. Label the substitution in the outcome note. Never silently downgrade to "tests pass."
- **The slice exceeds one session:** stop at a clean seam. Add the remainder as a new blocked slice. Tick nothing.

## Summary

Implement one bounded slice at a time. Observe the failing test first, run the demo, and tick the slices file before reporting completion.
