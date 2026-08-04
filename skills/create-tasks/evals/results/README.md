# create-tasks evidence status

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
