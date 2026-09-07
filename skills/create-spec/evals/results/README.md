# Create Spec evidence status

Current review corrections: see [the recorded probes and limits](../../../../evals/review-fixes.md). Raw current-subject results are under `review-2026-09-04/`; replay with `node evals/check-review-probes.mjs` from the repository root. These probes do not replace the full declared tier.

Historical Phase-6 observation (UNVERIFIED; raw transcripts, route, and scoring records unavailable): 4/4 for subject `cf2139daa9c7…` under delegation pressure. See the [Phase-6 report](../../../../docs/evidence/phase6-atomic-rewrite-2026-08-29.md). Historical evidence below remains scoped to its recorded hash.

One Tier-2 run recorded: `tier2-2026-08-01.md` (value pair on
`heldout-notifications-spec` plus both regressions; 4 actor sessions, 24
scripted user turns). Skill arm and both regressions passed every
assertion (14/14); the strongest-realistic-prompt comparator failed 2/6
and crossed the delegation boundary. Recommendation: SHIP, pending user
acceptance. Evidence label: targeted comparative support (Tier 2),
claude-fable-5, Claude Code, 2026-08-01. Caveats recorded in the results
file: non-blind scorer, nested-CLI actor sessions (subagent limit),
constructed mid-session state for the delegation case, one discarded
contaminated first attempt. The new-skill discovery pair has still not
been run. Raw transcripts and produced session documents are preserved
under `tier2-2026-08-01/`.

Subject hashes were re-verified immediately before the run and matched
the baseline below.

## Declared tier

Tier 2 — targeted comparative. Failure writes reversible local Markdown
files (decision log, glossary, ADR) and wastes recoverable engineering
time; see `../skill-brief.md`.

## Arms and sessions

- `heldout-notifications-spec` — prompt vs skill value pair (2 actor
  sessions), scripted user persona, strongest-realistic-prompt baseline
  from the brief.
- `regression-stale-log-resume` — skill-only edge case on
  `../fixtures/stale-decision-log` (1 session).
- `regression-delegation-pressure` — skill-only pressure case (1 session).
- Trigger cases (3 positive, 2 adjacent-negative) stay with the skill but
  normally run in the shared portfolio routing suite, per the Tier-2
  recipe; run them per skill only after a name/description change or a
  known collision.

Default total: 4 actor sessions plus routed trigger probes. A first run
on a new skill additionally needs 1 no-instruction/prompt discovery pair.

## Subject at authoring time (2026-08-01)

- `skills/create-spec/SKILL.md` — SHA-256
  `112240209030e33de340eb6807c60c22f9c4f9337b2686c8439b27459d7c0a67`
- `skills/create-spec/references/artifacts.md` — SHA-256
  `9f09a4378f8bf7d7df8f88b53f616ace5447d6777f3bd711f47c0b12be99beac`

Re-hash before any run; results recorded against other hashes are stale.

## Artifacts to preserve per run

- Full session transcripts for every arm, including the scripted user
  turns.
- The produced session documents: decision log(s), any `CONTEXT.md`
  glossary changes, any ADRs — plus the fixture's log as mutated by the
  resume case.
- Subject SHA-256 hashes, model, harness, and date.
- Per-assertion scoring against `../cases.jsonl`, costs, and raw results.
