# Static preservation review: interaction skills

Reviewed on 2026-10-04. Compared frozen `subjects/original/<name>/SKILL.md` with current `skills/<name>/SKILL.md` for be-concise, improve-prompt, quiz-changes, explore-options, understand-codebase, and create-spec. Read all six current reference files, compared existing references with their originals, and checked local Markdown link targets. No actor outcomes, structure-ledger conclusions, or evaluation results were read. Only this report was written.

## Findings

No newly introduced loss of an operative authority gate, read-only restriction, interaction requirement, or standalone reference was established. Two current examples retain concrete baseline inconsistencies:

1. **[P3, retained] The brevity example exceeds its own cap.** `skills/be-concise/SKILL.md:32` caps simple answers at four sentences, but the revised good example at `:64` contains five. The final sentence repeats the cache consequence without adding a decision-changing qualification, so it does not justify lifting the cap. Remove that final sentence or merge the answer into four sentences. The frozen original already had five sentences at `subjects/original/be-concise/SKILL.md:68`; this revision corrected the closing offer but retained the cap violation. This is a calibration inconsistency, not a newly demonstrated outcome regression.

2. **[P3, retained and newly exposed by extraction] The spec example records two decisions together and too late.** `skills/create-spec/SKILL.md:81` explicitly says storage and count policy are separate decisions, with storage recorded before the next-turn count probe. The extracted `references/examples.md:7` presents the storage answer and count probe before a single combined Storage entry at `:9`. This conflicts with separate decidable branches (`SKILL.md:48`) and immediate recording (`:67`). Rewrite the example to append a storage entry immediately after its answer, label the count probe as the next turn, and append a separate unread-count policy entry after that answer. The combined example existed at `subjects/original/create-spec/SKILL.md:87–93`; extraction preserved it unchanged while the main document added explicit contrary guidance.

## Preservation coverage

| Skill | Preserved operative requirements |
|---|---|
| be-concise | Activation limits, requested-depth override, layered output, answer-first prose, report evidence exceptions, and safety slots remain in the body. Its patterns reference is unchanged. |
| improve-prompt | Explicit invocation, visible assumptions, three-assumption bound, one real target, and original execution authority remain in the body. Deleted mistakes duplicate those rules. |
| quiz-changes | Focus bounds, lookup test, one question then wait, evidence-backed grades, real prediction output, harder follow-ups, advisory read-back, and deck acceptance remain in the body. |
| explore-options | Real isolated parallel dispatch, fit and constraint checks, three passing ranked picks, narrow output layers, and honest unavailable-parallel fallback remain in the body. The frame deck is local and loaded when selecting frames; the previously table-only breadth retry is now operative in the workflow. |
| understand-codebase | Orientation before vague exploration, targeted tracing, evidence status, file-and-symbol citations, grounded diagrams, conversation-only reuse, and read-only boundaries remain in the body. The extracted example adds no missing prerequisite. |
| create-spec | Capture provenance, product-policy deferral, immediate recording, narrow delegation, confirmation and override, pre-gate write restrictions, and impatience handling remain in the body. Artifact rules remain in the required local reference; optional pressure/examples files are supporting material rather than sole gate definitions. |

All local Markdown links resolved within their own skill directories. Existing be-concise patterns and create-spec artifact rules were unchanged. Missing-sibling routing limitations present in the originals were not counted as extraction regressions.

## Limits

This was a static comparison, not proof that actors obey the instructions or load conditional references. No shorter-text quality advantage was assumed. No behavioral sessions, project mutations, or expanded skill review were performed. Current skills were read from the shared worktree; later concurrent edits require checking these cited locations again.

## Resolution check

Independently reread both corrected examples on 2026-10-04. `skills/be-concise/SKILL.md:64` now contains four sentences, satisfying the simple-answer cap. `skills/create-spec/references/examples.md:7` now records storage immediately; `:9` explicitly moves the unread-count probe to the next turn, and `:11` records that policy as a separate numbered decision immediately after its answer. Both retained findings are resolved. No findings remain from this review. No actor runs were added; only this report was updated.
