> Historical evidence: runtime structure changed on 2026-10-04. These outputs validate their recorded original subjects, not the current body. See the [current preservation pass](../../../../evals/remaining-skills-2026-10-04/README.md); no old result was retagged as current.

# Explore Options evidence status

Historical Phase-6 observation (UNVERIFIED; raw transcripts, route, and scoring records unavailable): **PASS** for subject `3ddc55887f42…`. Under a request with missing constraints, the actor asked exactly one combined constraints-and-success question before fan-out. See the [Phase-6 report](../../../../docs/evidence/phase6-atomic-rewrite-2026-08-29.md).

Historical Tier-2 evidence remains in [`../results/tier2-2026-08-01.md`](tier2-2026-08-01.md) and stays scoped to its recorded subject, harness, model, and date.

## 2026-11-11 revision: unrun

No recorded result covers this body. Changes:

- Step 1 classifies the problem as `code`, `design`, or `general` before picking frames; `references/frames.md` defines the tags.
- Step 2 requires isolation, not parallelism: subagents with fresh contexts may run one at a time. The fallback now applies only when no subagents exist.
- Step 3 bounds the one-angle respawn to one rerun and allows fewer than 3 picks with the shortfall stated.
- Wording only: inline fallbacks for the two sibling bullets, attribution moved to `metadata.attribution`, cost moved to Required Context.
- `agents/openai.yaml` now sets `allow_implicit_invocation: false` for Codex. Codex native-selection negatives have not been rerun.

New cases in `../cases.jsonl`, all unrun: `regression-frames-product-naming`, `regression-sequential-isolated-subagents`, `regression-convergence-bounded`. This file is new; the Tier-2 cases from the brief were never frozen as JSON lines.
