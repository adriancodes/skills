---
name: deliver-feature
description: >
  Use when a feature should move through the whole pipeline. The user
  asks to "deliver this feature", "build this feature end to end",
  "continue the feature", or "run the pipeline". Also when a session resumes work that has
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
- The topic's decision log and `*-slices.md`, read in full.
- Repository instructions that re-home `docs/specs/`.
- Frontmatter status and every slice tick.

## Workflow

1. **Read the baton.** Find and fully read the decision log and slices file. Include frontmatter. Never infer state from filenames. If two open specs match, ask which. Treat a missing file as state and quote it as `missing`.

   Done when each artifact is classified as missing, open, confirmed, complete, or invalid.

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

   Treat `status: open` as a stop signal. Run that artifact's stage, however finished it looks. Treat `confirmed-by-override` as confirmed.

   Done when the stage is named before work starts.

3. **Run the owning skill.** Invoke the sibling and follow it fully. Never inline a shortcut when the skill is installed.

   When it is missing, name the gap and installation path. Stop unless the user approves the fallback:

   - spec → ask one decision question at a time and confirm a written log;
   - tasks → write vertical, demoable, session-sized slices with blockers;
   - implementation → build one slice test-first, run its demo, and tick it;
   - verification → execute hostile cases against the artifact.

   Done when the stage's own gate is reached.

4. **Exit clean.** Report the stage, outcome, and current artifact state. Name what the next invocation will do. Then stop. Run exactly one stage per invocation, including planning stages.

   Done when the report ends with the next-stage line.

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

- **Artifacts contradict:** stop at the spec because the upstream file wins. Read back the mismatch before work.
- **No artifacts exist:** start at the spec stage. Say so before running it.
- **The topic matches nothing findable:** ask for the spec path rather than guessing across features.

## Summary

Read the feature artifacts, run the current stage, stop at its gate, and state what the next invocation should do.
