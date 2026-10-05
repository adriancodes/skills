## Current quality pilot — 2026-10-04

The subject and structure changed in the [confirmed pilot](../../../../docs/specs/2026-10-04-skill-quality-pilot.md). Current cases and raw runs are preserved in [the comparison suite](../../../../evals/pocock-comparison-2026-10-04/). Results below remain scoped to their recorded pre-pilot subjects; they do not validate the current body. The new comparison reports its own outcome and cost limits.

# create-tasks evidence status

Current review corrections: see [the recorded probes and limits](../../../../evals/review-fixes.md). Raw current-subject results are under `review-2026-09-04/`; replay with `node evals/check-review-probes.mjs` from the repository root. These probes do not replace the full declared tier.

## Review correction — 2026-09-04

The old `regression-chat-only-pressure` oracle rewarded violating "skip the file". Its exact prior request and assertions are preserved in [superseded-chat-only-case.json](superseded-chat-only-case.json). The active case keeps that request and now requires zero writes, the full contract in chat, the pipeline consequence, and an offer to save later.

`regression-chat-preference` separately requests a chat summary without prohibiting writes. `regression-no-write-boundary` now uses the same executable case schema as the other behavior cases. No valid authority case was weakened.

Historical recommendations below to make step 4 unconditional are superseded. A write despite "skip the file" is not accepted PASS evidence, including Session A of the 2026-08-03 addendum. Historical actor records remain unchanged; none establishes a current-subject verdict.

## Description change — 2026-08-29

On 2026-08-29 the description gained the explicit trigger phrase "create vertical slices" after the lexical portfolio preflight exposed that miss. The 51-case preflight passes. Installed-harness triggering for this revision remains untested, so the behavioral evidence and current routing evidence are separate claims.

## Historical evidence

Historical Phase-6 observation (UNVERIFIED; raw transcripts, route, and scoring records unavailable): 4/4 for subject `d226abdb718f…`; the chat-pressure actor wrote the full slices file before read-back. See the [Phase-6 report](../../../../docs/evidence/phase6-atomic-rewrite-2026-08-29.md). The result below records the earlier failure that motivated the authority correction.

One Tier-2 run is recorded: `tier2-2026-08-01.md` (targeted comparative
support, claude-fable-5, Claude Code, 2026-08-01). Outcome: value pair 6/6
(skill) vs 4/6 (prompt) — margin on the file contract and confirmation gate;
horizontal-recut regression 5/5; **chat-only-pressure regression failed its
critical assertion** (the actor asked permission before writing the slices
file instead of writing it before the read-back). Recommendation: NO-SHIP
until SKILL.md makes step 4 unconditional under pushback and the pressure
case is re-run. The subject carries no Tier-2 SHIP claim.

- **Tier:** 2 — targeted comparative (failure yields a bad local plan file;
  reversible engineering-workflow cost, no external mutation).
- **Arms:** `prompt` (strongest realistic baseline from `skill-brief.md`) vs.
  `skill` on the held-out case; `skill` only on the two regressions.
- **Sessions:** 4 actor sessions by default — `heldout-saved-searches` × 2
  arms, plus `regression-horizontal-recut` and
  `regression-chat-only-pressure` × 1 arm each. The 2026-08-01 run used 5
  (one contaminated prompt-arm session discarded and re-run; see the run's
  Deviations section). Trigger cases normally run in the shared portfolio
  routing suite, not here.
- **Artifacts to preserve per run:** the frozen `cases.jsonl`, subject
  SKILL.md SHA-256, tested route (harness, model, date), per-session costs,
  raw transcripts, and every produced `docs/specs/*-slices.md` file with its
  scored assertion outcomes.

Subject SHA-256 at authoring time (2026-08-01), verified unchanged at run
time: `e3b4f7db… (original) — current subject after the 2026-08-03 authority correction: 529179b93e7a59a91be3ea53dbdc3cfc3e8c0e962e9094528eea3ce45bdba561`.
