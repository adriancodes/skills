> Historical evidence: runtime structure changed on 2026-10-04. These outputs validate their recorded original subjects, not the current body. See the [current preservation pass](../../../../evals/remaining-skills-2026-10-04/README.md); no old result was retagged as current.

# TDD evidence status

The current candidate was created from the user-confirmed brief and an audit of the existing local TDD materials:

- `/Users/adrian/.agents/skills/tdd/SKILL.md` — SHA-256 `5363bb2775679fe9311fbb67947f95359169c6e7f1fac77c0f25e190bca6cf2f`
- `/Users/adrian/.agents/skills/tdd/tests.md` — SHA-256 `859f9e592c188fda4fc7277dd180e4ce9c7a2e13f6efe1f6f29eccc9d28c106a`
- `/Users/adrian/.agents/skills/tdd/mocking.md` — SHA-256 `3ceb807fdf4a47d6a93d4d9a891e5ba6d362a6247bd08adc451feebfc17361ef`

The source had useful public-seam, independent-oracle, vertical-slice, and boundary-mocking guidance. The replacement closes material gaps: code-first recovery, valid-red proof, real data-boundary evidence, legacy seam creation, green-only refactoring, assertion anti-cheating, authority/worktree preservation, completion evidence, and portable behavior when subagents or a specific issue tracker are absent.

`cases.jsonl` preserves one prompt/skill value case plus data-boundary and combined-pressure regressions. Tier-2 runs executed on 2026-08-01: 4 actor sessions (value pair + 2 regressions), 22/22 assertions PASS — see `tier2-2026-08-01.md`. Evidence label: targeted comparative support (Tier 2), claude-fable-5, Claude Code, 2026-08-01.

Current subject SHA-256: `81f0678b0ad85524fa633c102132b9ed6f4a24c0055965aa4e4767735f19755f` (2026-09-05: restored the repeat-until-all-behaviors gate and the Genuine Exceptions escalation path dropped by the atomic rewrite). All three frozen cases were rerun fresh on this subject on 2026-09-07: 16/16 assertions PASS on Claude Code, `claude-fable-5`, with raw reports, scored results, and end-state workspaces preserved — see [`atomic-restore-2026-09-07/`](atomic-restore-2026-09-07/README.md). The 2026-08-29 regression below tested the prior subject `8f46a4456491…`.

The 2026-08-29 atomic rewrite reported 16/16 assertions, but raw outputs, route metadata, and scoring records are unavailable. This is an UNVERIFIED historical observation, not accepted current-subject PASS evidence. See `atomic-rewrite-2026-08-29.md`. The original Tier-2 prompt comparison remains historical evidence for its tested subject.

Local checks on 2026-07-18:

- `node scripts/skills.mjs check` — 15 entries clean.
- `node scripts/skills.mjs readme --check` — README up to date.
- Body length — 2,216 words, inside the 1,500–2,500 discipline target.
- Second-person and weak-suggestion scans — no matches.
- Free-shipping baseline — `4,999 → false`, `5,000 → false`; the `5,000 → true` assertion fails behaviorally with `ERR_ASSERTION`.
- Migration baseline — writes valid but contractually wrong `[]\n`, allowing a future red test to fail on transformed data rather than setup noise.
