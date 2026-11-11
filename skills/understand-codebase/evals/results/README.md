> Historical evidence: runtime structure changed on 2026-10-04. These outputs validate their recorded original subjects, not the current body. See the [current preservation pass](../../../../evals/remaining-skills-2026-10-04/README.md); no old result was retagged as current.

# Evaluation history

Historical Phase-6 observation (UNVERIFIED; raw transcripts, route, and scoring records unavailable): 5/5 for subject `83f76e520008…`; the action-pressure actor stayed factual and read-only, cited symbols, separated uncertainty, and routed design onward. See the [Phase-6 report](../../../../docs/evidence/phase6-atomic-rewrite-2026-08-29.md). This summary does not establish a current-subject regression or replace comparative evidence.

The original opportunity experiment produced **ABANDON** only for an assistant-authored narrow brief, so it is retained as historical evidence rather than a product decision. It showed that a strong prompt was sufficient for one narrow job: a factual, read-only current-state map of a selected path with citations and no recommendations.

The confirmed-brief v2 opportunity experiment produced a clear delivery opportunity but exceeded its declared token budget. Its result is therefore **exploratory evidence**, not a shipping claim. The prompt arm scored 15/15 against the confirmed behavior while the unassisted arm scored 8/15, but the combined 265,572 tokens exceeded the frozen 160,000-token cap.

The post-draft Tier 2 suite initially found two symbol-citation omissions. After one user-authorized correction and a two-cell rerun, suite 1.1.0 passed every critical assertion: 11/11 in both held-out arms, 5/5 on vague orientation, and 7/7 under action pressure. The skill removed 419 characters of repeated prompt instruction at a 47.32% paired token premium, within the confirmed 50% ceiling. Cumulative evaluation use was 332,796 tokens across six scored actor sessions, within the authorized 380,000-token extension.

Frozen inputs, raw traces, outputs, costs, and executable scorers remain in this `evals/` tree. This evidence supports force-loaded body behavior on Codex CLI 0.144.1 with `gpt-5.6-sol` at low reasoning effort. Autonomous triggering remains deferred to the shared portfolio routing suite.

The user accepted the skill on 2026-07-17. Final verdict: **SHIP — Tier 2 targeted comparative support** for force-loaded body behavior and explicit invocation. Autonomous triggering is not part of the current evidence claim.

## 2026-11-11 revision: unrun

Changed; no model eval was run on this text and no new pass is claimed.

- Description: "how does this work?" became "how does this feature work in this repo?", and "trace this feature" became "trace this feature through the code".
- Scope no longer names `zoom-out`, `codebase-design`, `improve-codebase-architecture`, or `research`; it names catalog skills with an inline fallback.
- The evidence-ledger fragment in step 3 is one sentence.
- The Core Example is a short cited answer in a domain outside both fixtures; `references/examples.md` keeps only the vague-request questions.
- Tool Guidance and the repeated two-question limit were removed; the history and no-mutation rules moved to step 2.

Unrun cases: `regression-follow-on-routing` in `../regression-cases.jsonl`, a new file because `cases.jsonl` and `effectiveness-cases.jsonl` are hash-frozen by their manifests; the added near-miss prompts in `/evals/cases/understand-codebase.json` (lexical preflight only). The suite 1.1.0 cases have not been rerun on this text or on an Anthropic model.
