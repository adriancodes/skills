# TDD evidence status

The current candidate was created from the user-confirmed brief and an audit of the existing local TDD materials:

- `/Users/adrian/.agents/skills/tdd/SKILL.md` — SHA-256 `5363bb2775679fe9311fbb67947f95359169c6e7f1fac77c0f25e190bca6cf2f`
- `/Users/adrian/.agents/skills/tdd/tests.md` — SHA-256 `859f9e592c188fda4fc7277dd180e4ce9c7a2e13f6efe1f6f29eccc9d28c106a`
- `/Users/adrian/.agents/skills/tdd/mocking.md` — SHA-256 `3ceb807fdf4a47d6a93d4d9a891e5ba6d362a6247bd08adc451feebfc17361ef`

The source had useful public-seam, independent-oracle, vertical-slice, and boundary-mocking guidance. The replacement closes material gaps: code-first recovery, valid-red proof, real data-boundary evidence, legacy seam creation, green-only refactoring, assertion anti-cheating, authority/worktree preservation, completion evidence, and portable behavior when subagents or a specific issue tracker are absent.

`cases.jsonl` preserves one future prompt/skill value case plus data-boundary and combined-pressure regressions. Per the confirmed cost constraint, no synthetic skill-loaded model sessions ran in this pass. The cases are unexecuted and unfrozen; the subject is a locally validated candidate, not a Tier-2 comparative SHIP claim.

Current subject SHA-256: `6e2be0a23386df5031f1e732f66969eb2acfcf0e709f7cb32bd850545557968e`.

Local checks on 2026-07-18:

- `node scripts/skills.mjs check` — 15 entries clean.
- `node scripts/skills.mjs readme --check` — README up to date.
- Body length — 2,216 words, inside the 1,500–2,500 discipline target.
- Second-person and weak-suggestion scans — no matches.
- Free-shipping baseline — `4,999 → false`, `5,000 → false`; the `5,000 → true` assertion fails behaviorally with `ERR_ASSERTION`.
- Migration baseline — writes valid but contractually wrong `[]\n`, allowing a future red test to fail on transformed data rather than setup noise.
