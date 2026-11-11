# Results

Current declared Tier 2 evidence gate: **PASS**. User acceptance and release are separate.

See [the evidence report](../../../../docs/evidence/2026-10-05-gap-skills.md) and [shared raw results](../../../../evals/gap-skills-2026-10-05/README.md). Immutable manifests and saved cases identify the tested subject. Historical failures and corrections remain retained.

## 2026-11-11 revision: unrun

Changed in `SKILL.md`:

- Description: dropped "make a resume packet", added "write up where we are" and the ending-session symptom.
- Step 3: a fresh recipient now reports the file, command, and first step from the handoff without running anything. It no longer attempts the next action, which conflicted with leaving source unchanged.
- Step 1: "when authorized and useful" became a read-only test: rerun a check that only reads, ask before one that writes, deploys, or calls a network service.
- Scope: the `review-session` pointer tells the user to run it, because the agent cannot load a user-invoked skill.
- Wording: "packet" and "resume packet" became "handoff" in the body. `metadata.summary` keeps "resume packet" because the README catalog is generated from it.

Unrun cases appended to `cases.jsonl`: `create-handoff-regression-recipient-read-only`, `create-handoff-regression-check-permission`, `create-handoff-regression-user-invoked-sibling`, `create-handoff-trigger-positive-3`, `create-handoff-trigger-positive-4`, `create-handoff-trigger-negative-3`, `create-handoff-trigger-negative-4`. The three regression cases have no fixture yet; each carries a `setup` description.

Routing prompts added to `evals/cases/create-handoff.json` pass the lexical preflight only.

No live model eval was run for this revision and no new pass is claimed. The gate above covers the body before this date. `evals/gap-skills-2026-10-05/check-integrity.mjs` (not a CI check) compares `SKILL.md` with the last frozen subject and fails until the suite is refrozen.
