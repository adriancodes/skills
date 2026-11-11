# Results

Current declared Tier 2 evidence gate: **PASS**. User acceptance and release are separate.

See [the evidence report](../../../../docs/evidence/2026-10-05-gap-skills.md) and [shared raw results](../../../../evals/gap-skills-2026-10-05/README.md). Immutable manifests and saved cases identify the tested subject. Historical failures and corrections remain retained.

## 2026-11-11 revision: unrun

The PASS above covers the subject in `suite-manifest-i1.json`, not this body. Changes:

- The description now leads with a decision that depends on an external fact, and excludes quick facts and questions about the repository's code.
- Step 4 answers in the conversation by default and writes a file only when a saved report is requested.

New cases in `../cases.jsonl`, all unrun and absent from the frozen manifest: `research-question-trigger-positive-3`, `research-question-trigger-negative-3` to `-6`, and `research-question-regression-chat-answer-no-file`. Routing near-misses were added to `evals/cases/research-question.json`; the lexical preflight passes, which is not native trigger evidence. Live retrieval remains untested.
