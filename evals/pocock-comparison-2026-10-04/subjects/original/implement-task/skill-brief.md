# Skill Brief — implement-task

Authored 2026-08-01 from the shipped `SKILL.md` (SHA-256
`6cc3790be6305ce5668024ff38ffa87a4c50a2b37c4643d562acf53f9da50fb9`) and the
`create-tasks` step-4 slices-file contract. No Phase-0 interview transcript
exists for this skill; every inference below is marked ASSUMED.

## Job

Implement exactly one slice from a slices file within its recorded Bound:
failing demo-criterion check first, demo run literally and observed, hostile
surfaces verified, and the slices file ticked with an outcome note before the
final report. The slices file — not chat — is the pipeline's state.

## Type and invocation

- **Type**: Workflow (ASSUMED from the numbered six-step body).
- **Invocation**: model-invoked; triggers on "implement slice N", "build the
  next task", "work through the slices", and on bound-wandering or
  file-rot symptoms (from the shipped description).

## Tier

**Tier 2 — targeted comparative.** Failure writes reversible local files (code
outside a slice's bound, a stale or mis-ticked slices file) — engineering
workflow mistakes that cost time but are recoverable in git; no external
mutation, unattended automation, or irreversible change. (ASSUMED: matches the
tier already used by the adjacent `tdd` and `code-review` packages.)

## Baseline comparator (strongest realistic prompt)

> Implement slice 2 from docs/specs/2026-07-28-notifications-slices.md. Write a
> failing test for the slice's demo criterion before any implementation code,
> change nothing outside the slice's Bound, run the demo and then the full
> suite, and tick the slice in the slices file with an outcome note before you
> report.

(ASSUMED wording: the strongest short prompt a disciplined user would realistically
type, naming the gates without the skill's amendment, substitution, and
rationalization machinery.)

## Success measures

Each traces to a gate in the skill's Success Criteria:

1. **Red first** — the demo-criterion check existed and was observed failing
   before implementation code (steps 2; criteria line 1).
2. **Bound holds** — zero changes outside the slice's Bound; mid-work bound
   edits only shrink or correct, recorded in the slices file before dependent
   code (step 3; criteria line 2).
3. **Demo observed, not inferred** — the demo criterion literally executed and
   watched; where the harness cannot run it, the closest executable
   observation substituted and labeled in the outcome note, never a silent
   downgrade to "tests pass" (step 4; Failure Modes).
4. **Suite evidence** — relevant tests then the full suite passed (step 4).
5. **Hostile surfaces** — verification passed or explicitly inapplicable
   (step 5).
6. **Tick before telling** — the slices file shows `[x]` with a
   date-and-outcome note before the final message (step 6; criteria line 6).

## Eval contract (Tier 2)

- **Held-out value pair** (`heldout-mark-read`): prompt vs. skill arms on the
  `fixtures/notifications-slice` fixture; assertions are measures 1–4 and 6
  above (hostile-surface applicability judged from transcripts).
- **Regressions** (skill-only): edge — `regression-demo-substitute`, the
  fixture's demo criterion (bell badge) cannot run in the harness, so the
  closest executable observation must run and be labeled a substitute;
  pressure — `regression-bound-pressure`, "while you're in there, add
  mark-all-read too, it's two lines" — the bound holds and the extra endpoint
  is noted for slice 3.
- **Trigger probes**: 3 positive, 2 adjacent-negative (no slices file exists;
  slice needs re-planning). They stay with the skill but normally run in the
  shared portfolio routing suite; run per skill only after a name/description
  change or a known collision (candidates: `tdd` for the inner red-green loop,
  `create-tasks`/`slice-spec` for re-planning, `ship-feature` for the outer
  pipeline).
- **Sessions**: 4 actor sessions by default (2 per arm on the held-out pair,
  1 per regression) (ASSUMED default from the tier table).
- **Preserve**: cases, subject hash, fixture state, tested route, transcripts,
  final slices-file state, diffs, costs, raw results.

## ASSUMED and unconfirmed

Type Workflow; Tier 2; baseline-prompt wording; fixture domain (notifications
mark-read, chosen to mirror the skill's own worked example); 4-session default;
scoring hostile-surface verification as "explicitly inapplicable" acceptable
for this store-only fixture. None of these came from a user interview.
