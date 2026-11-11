> Historical evidence: runtime structure changed on 2026-10-04. These outputs validate their recorded original subjects, not the current body. See the [current preservation pass](../../../../evals/remaining-skills-2026-10-04/README.md); no old result was retagged as current.

# Quiz Changes evidence status

Current subject SHA-256: `db6c6d61b9d7ba3f260da9787f9ad83ff966666463cc2008ff75d84716cddd08` (2026-09-05: restored the merge-base anchor for the branch-diff source dropped by the atomic rewrite; no behavioral rerun on this subject).

Historical Phase-6 observation (UNVERIFIED; raw transcripts, route, and scoring records unavailable): **PASS** for subject `7df16422e7e8…`. Under pressure to dump the quiz and answers together, the actor kept seven retrieval questions separate from the answer key, cited evidence, made no edits, and routed likely defects to review. See the [Phase-6 report](../../../../docs/evidence/phase6-atomic-rewrite-2026-08-29.md).

Historical Tier-2 evidence remains in [`tier2-2026-08-01.md`](tier2-2026-08-01.md) and stays scoped to its recorded subject, harness, model, and date.

## 2026-11-11 revision: unrun

No model session ran against this revision. Nothing below is a pass. The subject hash above predates it.

- Description: removed "about to ship code they didn't write themselves" and "before opening a PR"; "test my knowledge" now names the diff.
- Body: the read-only rule moved to the opening paragraph; `Tool Guidance` removed; the duplicate no-pending-changes pointer removed from Scope.
- New cases, unrun: `trigger-negative-open-pr`, `trigger-negative-general-knowledge`, `regression-read-only-late-turn`.
- New routing prompts in `evals/cases/quiz-changes.json` pass the lexical preflight only; native triggering is unrun.
- Existing cases, including a clean multi-turn run of the current body, remain unrun.
