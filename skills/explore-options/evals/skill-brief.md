> Structural update, 2026-10-04: the [accepted collection scope](../../../docs/specs/2026-10-04-remaining-skills-structure.md) consolidates this skill while retaining its operative contract. [Current preservation evidence](../../../evals/remaining-skills-2026-10-04/README.md) is narrower than a full tier verdict; prior results remain historical.

# Skill Brief — explore-options

Confirmed by the user on 2026-08-01 after a four-question Phase-0 interview
(approach, invocation, output shape, ranking, frames). Source of truth for
scope and evals.

## Job

Escape the first-three-obvious-answers on open-ended decisions by fanning out
isolated parallel branches under different cognitive frames, then converging
with a critic pass — without drowning a skimming reader in output.

## Confirmed decisions

- **Type**: Workflow. **Invocation**: user-invoked only
  (`disable-model-invocation: true`); fires on `/explore-options` alone.
- **Output**: ≤15-line shortlist in chat (3 ranked picks, ★ wild slot, traps
  as one-liners); `map` and `deepen <pick>` expand layers on demand. No file
  artifact.
- **Ranking**: fit + viability first, novelty tie-breaks only; winner must
  pass an explicit constraint check; best novel-but-viable idea shown in a
  quarantined wild slot that never outranks a constraint-passing pick.
  (Chosen specifically to fix ADHD's observed failure: its novelty-weighted
  rubric promoted an impractical pick in its own eval.)
- **Frames**: curated table of 8, deduped from ADHD's 15.

## Accepted ASSUMED items

- Name `explore-options`; scope = any open-ended engineering/product decision
  (bugs excluded — `diagnose` owns them); default scale 5 frames × 6 ideas;
  cost ~6 agent calls/run (+1 per deepen), acceptable because invocation is
  explicit; Tier 2 evidence; provenance credit to UditAkhourii/adhd (MIT).

## Eval contract (Tier 2)

- **Baseline comparator** (strongest realistic short prompt): "Give me 10
  genuinely diverse approaches, avoid the obvious answers, group by
  underlying angle, flag traps with reasons, recommend top 3 with rationale."
- **Discovery pair**: no-instruction vs. strong-prompt on one held-out
  problem (run 2026-08-01 — see `results/opportunity-baseline.md`).
- **Value pair**: strong-prompt vs. skill on one held-out problem. Success
  measures traceable to the brief: (a) shortlist ≤15 lines, (b) winner passes
  constraint check, (c) ≥1 idea outside the senior-engineer playbook survives
  as viable (wild slot or ranked), (d) traps named with reasons, (e) full
  pool reachable via `map`.
- **Regression cases** (skill-only): edge — problem stated with zero
  constraints (skill must ask exactly one question, then proceed with
  viability-only ranking, saying the constraint check was skipped);
  pressure — user demands "just give me everything now" (skill must render
  the 15-line shortlist, not the wall).

## Opportunity verdict (Phase 1)

Behavioral opportunity is **partial**: the strong prompt already produced
wide, clustered, trap-flagged output (see `results/opportunity-baseline.md`)
— but entirely within the senior-engineer playbook, with visible single-
context anchoring (the top-3 compose into one design). Delivery opportunity
is **strong**: the strong prompt yields a ~900-word wall of text (the exact
failure the user created `/be-concise` to escape) and must be retyped each
use. The skill's bar: match the baseline's breadth and trap quality while
adding out-of-playbook range and the 15-line contract.
