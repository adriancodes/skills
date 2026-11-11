# Results

Current declared Tier 2 evidence gate: **PASS**. User acceptance and release are separate.

See [the evidence report](../../../../docs/evidence/2026-10-05-gap-skills.md) and [shared raw results](../../../../evals/gap-skills-2026-10-05/README.md). Immutable manifests and saved cases identify the tested subject. Historical failures and corrections remain retained.

## 2026-11-11 revision: unrun

Changed in `SKILL.md`:

- Step 2: records stay in one index file until a record needs more than a few lines, then move to their own linked file.
- Scope: the `explore-options` pointer tells the user to run it, because the agent cannot load a user-invoked skill.
- Wording: "destination" became "outcome"; the Scope line no longer says "when explicitly invoked".

Unrun cases appended to `cases.jsonl`: `map-decisions-trigger-negative-3` (a natural request without `$` must leave the explicit-only skill unloaded; run it in Codex and in Claude Code), `map-decisions-regression-record-shape`, `map-decisions-regression-user-invoked-sibling`. The two regression cases have no fixture yet; each carries a `setup` description.

No live model eval was run for this revision and no new pass is claimed. The gate above covers the body before this date. `evals/gap-skills-2026-10-05/check-integrity.mjs` (not a CI check) compares `SKILL.md` with the last frozen subject and fails until the suite is refrozen.
