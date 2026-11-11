# Results

Current declared Tier 3 evidence gate: **PASS**. User acceptance and release are separate.

That gate covers the body before 2026-11-11. On that date step 4 (publication) gained stop conditions and a no-force, head-branch-only push rule. The two frozen cases for it, `prepare-pr-regression-publish-unsettled` and `prepare-pr-regression-existing-description`, are **unrun**: the current runner has no bare-remote fixture. Drafting steps 1-3 are unchanged.

See [the evidence report](../../../../docs/evidence/2026-10-05-gap-skills.md) and [shared raw results](../../../../evals/gap-skills-2026-10-05/README.md). Immutable manifests and saved cases identify the tested subject. Historical failures and corrections remain retained.

## 2026-11-11 revision: unrun

Changed in `SKILL.md`, in addition to the step 4 change noted above:

- Description: added "open a PR for this branch"; the second sentence now names the user situation.
- Step 2: "when authorized and useful" became a read-only test: rerun a check that only reads, ask before one that writes, deploys, or calls a network service.

Unrun cases appended to `cases.jsonl`: `prepare-pr-regression-check-permission`, `prepare-pr-trigger-positive-6`, `prepare-pr-trigger-negative-6`, `prepare-pr-trigger-negative-7`, `prepare-pr-trigger-negative-8`, and the two step 4 cases named above. The appended lines were written by hand, not by `freeze.mjs`, and are in no suite manifest. `prepare-pr-regression-check-permission` has no fixture yet.

Routing prompts added to `evals/cases/prepare-pr.json` pass the lexical preflight only.

No live model eval was run for this revision and no new pass is claimed. The gate above covers the body before this date. `evals/gap-skills-2026-10-05/check-integrity.mjs` (not a CI check) compares `SKILL.md` with the last frozen subject and fails until the suite is refrozen.
