# Verify Work evidence status

**One Tier-2-scope run is recorded: [`tier2scope-2026-08-01.md`](tier2scope-2026-08-01.md)** — held-out prompt-vs-skill pair plus both regressions (4 actor sessions, claude-fable-5, Claude Code, 2026-08-01; non-blind scorer, n=1 per arm). Its label is fixed: **Tier-2-scope evidence against a Tier-3 declaration — claim capped at targeted comparative support; full Tier-3 suite outstanding.** Skill-governed arms passed all critical assertions; the prompt arm failed promise-pinned, stop-bar-stated, and report-contract while matching the skill arm 3/3 on planted-flaw discovery. Evidence claims never exceed the recorded tier, harness, model, and date; this run does not upgrade the subject beyond a targeted-comparative candidate.

## Declared tier

Tier 3 — a false "verified, ready to ship" verdict is high-stakes guidance, and uncertainty between the Tier-2 and Tier-3 readings selects the higher tier (full argument in `../skill-brief.md`). Until a complete Tier-3 package runs, the subject is a locally validated candidate; no "formally supported" or SHIP claim exists.

## Arms

- **Held-out value** (`heldout-csv-dedupe`): prompt vs skill. Prompt arm uses the baseline comparator from the brief ("Test this script properly against hostile inputs and report what breaks."); skill arm loads `verify-work`.
- **Regressions** (`regression-catalog-exhaustion`, `regression-quick-check-pressure`): skill-only.
- **Triggers** (3 positive, 2 adjacent-negative): shared portfolio routing suite; run per-skill only after a name/description change or a known collision.

## Sessions for a full Tier-3 run

3 discovery cases; 3+ held-out cases × prompt/skill × 3 repetitions; 5 positive and 5 negative trigger cases; 2 fresh probe rounds; blinded judgment where needed; recorded budgets. The current package supplies 1 held-out case, 3/2 trigger cases, and 2 regressions — a run on today's package alone therefore supports at most a targeted candidate claim, never Tier-3 "formally supported". The gap is deliberate: cases are grown before sessions are spent. The 2026-08-01 Tier-2-scope run executed exactly today's package (minus routing triggers, which stay with the shared portfolio suite); the full Tier-3 suite above remains outstanding in its entirety.

## Artifacts to preserve per run

- Frozen copies (or hashes) of `cases.jsonl`, the subject, and the fixture as run
- Model, harness, date, and per-arm token/cost budgets
- Raw session transcripts for every arm and repetition
- Before/after SHA-256 of every file in `fixtures/csv-dedupe/` (the no-edits assertions are scored by hash comparison)
- Scorer outputs per assertion, with the fixture `README.md` as the ground-truth key (withheld from actor sessions)
- The verdict per case, and any new attack classes the actor derived (candidate catalog additions)

## Subject hashes at authoring time (2026-08-01)

- `SKILL.md` — SHA-256 `7262e658126b8fbf4c5be11008640aabc68d99b6389e66fccc8367b0477fce8f`
- `references/attacks.md` — SHA-256 `db8883644690eb1cab26225889abfce99b7e744b6a37b0690de899ab13771d37`
- `evals/cases.jsonl` — SHA-256 `cde3f266e0d9cf82f0e06b751eb951f8f4f00866af15654aade6fb0ce0af5387`
- `evals/fixtures/csv-dedupe/dedupe.js` — SHA-256 `7cb9874d34f13fdcafa1f757dc531afbfa51a0730f4f3ee04c942e7cb12d94d6`
- `evals/fixtures/csv-dedupe/promise.md` — SHA-256 `4685670a4b4e467480562cf98a341b703dd90bdbc9e3337ee379f9cccb04e4ae`
- `evals/fixtures/csv-dedupe/input.csv` — SHA-256 `f8d413b42d01d574b7eccf740d9fa51d1dede69d6c49d6cbb4e0d565adcde944`

## Local checks at authoring time

- All three planted fixture flaws confirmed by direct execution (empty-file `TypeError` crash; `"Smith, Jane"` → `"Smith,Jane"` quoted-comma mangling; last row silently dropped without a trailing newline); happy-path `input.csv` deduplicates correctly, so a smoke test alone finds nothing.
- `node scripts/skills.mjs check` — 17 entries clean (2026-08-01, after this package was authored).
