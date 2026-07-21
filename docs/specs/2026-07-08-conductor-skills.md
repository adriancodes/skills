---
topic: Two skills closing the pipeline — implement-slice (execute one slice) and ship-feature (the stage-detecting conductor)
status: confirmed
started: 2026-07-08
---

# Spec: conductor skills

## Decisions

1. **`implement-slice`** — Executes exactly one slice from a slices file to its demo criterion: blockers checked, test-first (soft-ref `tdd` if installed), work bounded to the slice, the demo criterion literally run, the slices file ticked with an outcome note, `verify-work` soft-invoked on artifact-producing slices. One slice, one session — the boundary is the point. Category: Building (new). (2026-07-08)
2. **`ship-feature`** — The conductor: reads the pipeline's artifacts (spec log → slices file → tick states) to detect the current stage, runs the right sibling skill for exactly one stage, and exits clean at that stage's gate. Never re-plans over existing artifacts; reopening a confirmed decision goes through the log's supersede rules. Missing siblings degrade loudly with a compact inline fallback per stage (ADR-0001). Category: Building. (2026-07-08)
3. **One stage per invocation** — The conductor advances one stage (and the implement stage one slice) per invocation, then stops; continuing is the user's explicit call. _Why:_ preserves per-slice fresh context — the mega-session chainer violates the disciplines it conducts. (2026-07-08)
4. **The baton is the files** — Stage detection reads artifacts only, never conversation memory: spec missing/open → spec stage; confirmed+no slices → slice stage; unticked unblocked slice → implement stage; all ticked → verify stage; verified → done. Composes with `build-loop` (a loop cycle = one conductor invocation). (2026-07-08)

## Assumptions

- ASSUMED: names `implement-slice` and `ship-feature`; new category "Building"; one message flips any of these.
- ASSUMED: commit behavior inside implement-slice follows the repo's convention rather than mandating commits.

## Deferred

- Parallel slice execution across worktrees (conductor currently serial; build-loop + worktrees is the future shape).

## Verification

Baselines (Opus, no skills): the implementer wrote tests after code, felt real scope-creep pull (extra endpoint, adjacent cleanup), never ticked the slices file, called done on green tests, and would build-then-mention a wrong bound; the resumer batched all remaining slices, skimmed the spec as reference, admitted it would miss `status: open`, and would code unsliced work as a lump — ten rationalizations captured into the two tables. Dry-runs (skills loaded, same scenarios plus traps): implement-slice went red-first, stopped at the bound violation and edited the file before continuing, ticked before telling; ship-feature took exactly one slice, stopped on `status: open`, routed a missing slices file to slice-spec, and dropped the websockets relitigation citing the table. Three findings patched: the bound-amendment branch could launder scope creep (amendments now shrink/correct only; new scope = new slice, fresh session); vacuous blockers were undefined (now explicit); an open spec's own contents could masquerade as capture-spec's "answers" (now excluded). Residual: patches follow the auditors' own directions but were not re-probed.

## Confirmation

"yes lets fill the gaps. Use your best effort and the skill-creator to design the skills" — 2026-07-08
