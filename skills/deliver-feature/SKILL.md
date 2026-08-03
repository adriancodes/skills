---
name: deliver-feature
description: >
  Use when a feature should move through the whole pipeline. The user
  asks to "deliver this feature", "continue the feature", "what's next on
  X", "run the pipeline". Also when a session resumes work that has
  existing spec or slices artifacts, or nobody remembers where a
  feature stands.
license: MIT
metadata:
  category: Building
  summary: Runs one stage of the feature pipeline per invocation by reading its artifacts, selecting the right skill, and stopping at the stage gate.
---

# Deliver Feature

## Overview

Move a feature through spec, task creation, implementation, and verification, one stage per invocation. Detect the stage from files, not conversation memory; run the matching skill; stop at its gate. It routes work; it does not replace confirmed plans.

## When to Use

- "deliver this feature", "ship this feature", "continue the notifications work", "what's next on exports", "run the pipeline"
- A fresh session resumes a feature whose spec or slices files exist
- The feature's state is unclear: the artifacts, not recollection, should say

## Do Not Use When

- The user wants one specific stage: invoke that skill directly (`create-spec`, `create-tasks`, `implement-task`, `verify-work`)
- A quick fix with no pipeline artifacts and no need for them: just do it
- Running unattended on a schedule: design that wrapping loop with `build-loop`; the conductor stays one-invocation-one-stage inside it

## Required Context

- The feature's topic, enough to find its artifacts
- The artifact scan, read in full: `docs/specs/` (or a path re-homed by repo instructions like `AGENTS.md` or `CLAUDE.md`) for the topic's decision log and `*-slices.md`, including frontmatter `status:` and every tick state

## Workflow

1. **Read the baton.** Find and fully read the topic's decision log and slices file, frontmatter included; skimming relitigates confirmed decisions and builds on open ones. Two open specs match the topic: ask which. A missing file is a state, not a read failure: quote it as `missing`. Done when each file is quoted as missing, open, confirmed, complete, or invalid with the violated contract named.

2. **Detect the stage: artifacts only.** First matching row, top to bottom:

   | Artifact state | Stage to run | Exit at |
   |----------------|--------------|---------|
   | Malformed artifact, unknown `status:`, slices without a linked spec, or a confirmed zero-slice file | Invalid artifact: stop and name the exact contract violation | Artifact corrected and reconfirmed in a later invocation |
   | No decision log, or `status: open` | Spec: `create-spec`: capture mode only for answers gathered live in *this* conversation; an open spec's own contents never count as "the answers" | The spec's confirmation gate |
   | Spec `confirmed` (or `confirmed-by-override`), and no slices file or slices `status: open` | Task creation: `create-tasks` | The tasks read-back (slices `status: confirmed`) |
   | Slices `confirmed` with an unticked slice whose blockers (if any) are all ticked | Implementation: `implement-task` on the first such slice | That slice ticked |
   | Slices `confirmed`, unticked work remains, and no slice is unblocked | Invalid graph: stop and report the cycle, missing blocker, or unsatisfied edge | Slices file corrected and reconfirmed in a later invocation |
   | All slices ticked, `## Verification` section empty | Verification: run `verify-work` read-only on the feature's artifacts | If clean, write the report summary + date into `## Verification`; if findings remain, leave it empty and request explicit fix authority |
   | `## Verification` filled | Done: summarize the paper trail (spec, slices, verification) and stop |: |

   An unconfirmed artifact is a stop signal, not a formality: `status: open` runs that artifact's stage, however finished the work looks. `confirmed-by-override` is confirmed. Done when the stage is named to the user before any work starts.

3. **Run the stage through its skill.** Invoke the sibling and follow it fully; never inline a shortcut version of an installed skill. When a sibling is **missing**, degrade loudly: name it and how to install it, then stop or (with the user's say-so) apply the one-line fallback: spec → interview the decisions one question at a time to an explicitly confirmed written log; slicing → split into vertical, demoable, session-sized slices with blockers, in a file; implementation → one slice, test-first, demo run, file ticked; verification → execute the artifact against hostile cases. Done when the stage's own gate is reached.

4. **Exit clean.** Report the stage run, its outcome, what the artifacts now say, and what the *next* invocation will do; then stop. Exactly one stage runs per invocation, planning stages included; an explicit request to continue begins a new invocation rather than extending this one. Done when the report ends with the next-stage line and no second stage has started.

## Example: a resumed session

> **Read:** spec `2026-07-05-notifications.md`: `status: confirmed`, 6 decisions. Slices file: 1 ✓, 2–4 open, all blocked only by 1.
> **Stage:** implementation: task 2 is the first unblocked. Running `implement-task` on it.
> **Exit:** slice 2 ticked. Next invocation: slice 3.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "The slices are small and related: faster to do all three in one pass" | Faster until the third slice inherits two slices of stale context. One stage, one invocation; fresh windows are the pipeline's whole trick. |
| "I can see what's needed from the file names: no need to re-read the log" | Skimmed specs are how confirmed decisions get rebuilt differently. Both files, in full, first. |
| "Slice 1 established the patterns; the rest is mechanical: low risk to batch" | "Mechanical" is a claim the demo criterion tests one slice at a time. |
| "'Continue shipping' means they want a finished feature, not a status update" | It means advance the pipeline. The stage report *is* progress, resumable by anyone tomorrow. |
| "Actually, websockets would be cleaner than polling here" | `status: confirmed` closes that. Reopening goes through the log's supersede rule with the user (a new numbered entry, their say-so quoted, history intact): never through fresher opinions mid-stage. |

## Success Criteria

- Each artifact read in full or its absence established, both states quoted before any work
- The stage named before it runs; exactly one stage (one slice, if implementing) per invocation
- Zero confirmed decisions relitigated; zero building on a `status: open` spec
- The exit report says what the next invocation will do

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Treating checkboxes as the whole state | The spec's `status:` gates everything; read it first |
| Re-planning over existing artifacts | The conductor routes; changes go through the owning file's rules |
| Quietly inlining a missing sibling's job | Loud degradation: name it, offer install or the one-line fallback, get a say-so |
| Momentum past an implementation gate | One slice per invocation; the user decides to continue |

## Failure Modes

- **Artifacts contradict each other** (slices cite decisions the spec lacks): stop at the spec: the upstream file wins; read the mismatch back to the user before anything runs.
- **No artifacts exist at all:** the pipeline starts at stage one: say so and run the spec stage; "just code it" for pipeline-worthy work recreates the baseline lump.
- **The topic matches nothing findable:** ask for the spec path rather than guessing across features.

## Summary

Read the feature artifacts, run the current stage, stop at its gate, and state what the next invocation should do.
