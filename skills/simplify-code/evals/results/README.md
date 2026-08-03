# Simplify-code evidence status

The candidate traces directly to the confirmed adaptive interview in `../skill-brief.md`. Its three preserved cases cover normal value, scope-and-contract pressure, and missing-test handling. The order-summary fixture has executable behavior contracts; the legacy-flags fixture intentionally records behavior without a test suite.

Tier-2 actor sessions ran on 2026-08-01: one prompt/skill value pair on the held-out case plus both skill-arm regressions, 16/16 assertions PASS (one vacuous). See `tier2-2026-08-01.md`. Evidence label: targeted comparative support (Tier 2), claude-fable-5, Claude Code, 2026-08-01. Honest caveat recorded there: the baseline comparator matched the skill on the held-out case in this single run, so the demonstrated margin is delivery plus evidence-discipline extras.

Subject SHA-256 at the 2026-08-01 run: `39aedaf0c9d32d0d1dc0b12992b482ae848fdb214bfb83cb5d9cd16f5b25928f` (working tree carried uncommitted wording edits vs the 2026-07-18 candidate below).

Candidate SHA-256 on 2026-07-18: `e60c2307aaa47b56fb56369bf34d636ce61b57845485d3b0ff1822a4ba2b3e67`.

Local checks on 2026-07-18:

- `node skills/simplify-code/evals/check-candidate.mjs` — passed; fixture behavior and eval-package shape are clean.
- `node scripts/skills.mjs check` — 16 entries clean.
- `node scripts/skills.mjs readme --check` — README up to date.
- Body length — 797 words, inside the 500–800 simple-technique target.
- Second-person and weak-suggestion scan — no matches.
