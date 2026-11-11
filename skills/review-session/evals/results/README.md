# Results

Current declared Tier 3 evidence gate: **PASS**. User acceptance and release are separate.

See [the evidence report](../../../../docs/evidence/2026-10-05-gap-skills.md) and [shared raw results](../../../../evals/gap-skills-2026-10-05/README.md). Immutable manifests and saved cases identify the tested subject. Historical failures and corrections remain retained.

## 2026-11-11 revision: unrun

Changed in `SKILL.md`:

- Step 1: review the session the user names; with none named, review the current conversation and state the compaction limit.
- Scope: the `create-skill` and `write-agent-instructions` pointers tell the user to run them, because the agent cannot load a user-invoked skill.
- Worked example: rewritten as quoted sample output with the five report fields.

Unrun cases appended to `cases.jsonl`: `review-session-regression-current-conversation`, `review-session-regression-user-invoked-sibling`, `review-session-trigger-negative-6` (a natural request without `$` must leave the explicit-only skill unloaded; run it in Codex and in Claude Code). The two regression cases have no fixture yet; each carries a `setup` description.

No live model eval was run for this revision and no new pass is claimed. The gate above covers the body before this date. `evals/gap-skills-2026-10-05/check-integrity.mjs` (not a CI check) compares `SKILL.md` with the last frozen subject and fails until the suite is refrozen.
