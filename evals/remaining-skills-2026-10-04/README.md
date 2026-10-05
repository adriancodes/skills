# Remaining skills: structure and preservation

Started 2026-10-04; completed 2026-10-05. All thirteen remaining skills were consolidated. Together with the first four-skill pilot, every active skill now has a reviewed structure and name.

The thirteen entrypoint bodies fell from **18,116 to 13,574 words (25%)**. Across all seventeen, bodies fell from **22,020 to 16,121 words (27%)**. Counts exclude frontmatter and references; they measure initial instruction size, not total workflow context or execution cost.

Verdict: **structural consolidation with bounded preservation support; ITERATE on broad effectiveness claims**. This is not full per-skill Tier-2/Tier-3 validation, a formal SHIP verdict, or evidence that the collection outperforms Matt Pocock's skills. Changes are in the repository; nothing was installed, committed, or published.

## What changed

| Skill | Body words, before → after | Structure and preserved method |
|---|---:|---|
| `be-concise` | 787 → 621 | Layers, requested-depth overrides, report evidence, and safety slots; corrected the four-sentence example. |
| `build-loop` | 1,342 → 952 | Goal, independent verification, four guards, state spine, and L1 rollout; conditional pressure guidance. |
| `code-review` | 2,308 → 1,767 | Pinned diff, three lenses, candidate falsification, and findings-first report; conditional examples and pressure guidance. |
| `create-skill` | 1,994 → 1,698 | All authoring/evaluation phases and acceptance gates retained; authoritative brief fields referenced once. |
| `create-spec` | 1,603 → 1,025 | One question, immediate recording, capture provenance, and confirmation; worked example now records separate decisions immediately. |
| `diagnose` | 1,950 → 1,452 | Tight reproduction, minimization, falsifiable hypotheses, causal evidence, and explicit fix authority. |
| `engineering-best-practices` | 2,094 → 1,542 | State selection, five-field retrieval, direction precedence, and shared-owner invariant checks; existing corpus and retrieval code unchanged. |
| `explore-options` | 1,143 → 731 | Isolated divergence, fit-first convergence, and honest fallback; frame deck loaded when choosing perspectives. |
| `improve-prompt` | 497 → 430 | Intent preservation, visible assumptions, one target, and original execution authority. |
| `quiz-changes` | 850 → 602 | Reasoning questions, one question then wait, evidence-backed grading, advisory readiness, and opt-in deck. |
| `tdd` | 1,388 → 1,242 | Observed valid red, minimal green, real data boundaries, and repeated cycles; pressure table moved behind a pointer. |
| `understand-codebase` | 1,210 → 897 | Targeted evidence tracing, cited symbols, consequential uncertainty, and read-only scope. |
| `verify-work` | 950 → 615 | Executed attacks, actual novelty, authority, and documented limits; explicitly name excluded and untested classes. |

Core authority and evidence rules remain in the entrypoints or their existing required references. Newly optional files provide examples, frame prompts, or pressure reminders rather than sole definitions of essential gates. Names, descriptions, metadata, and invocation policies are byte-identical to the thirteen frozen originals. The [name review](../../docs/evidence/skill-names-2026-10-04.md) retained the clear existing names; cosmetic changes had no demonstrated discovery advantage.

The [accepted scope](../../docs/specs/2026-10-04-remaining-skills-structure.md) and [structure ledger](structure-ledger.json) record the removed duplicates and extractions. All original runtime files and available case definitions were frozen before editing. Old result indexes are labeled historical; all seven earlier review probes now replay against their exact original subjects, retaining all eighteen assertions.

## Independent review and behavior

Two independent static reviews covered all thirteen subjects: [interaction review](reviewer-interaction.md) and [safety review](reviewer-safety.md). They found no introduced loss of operative gates. The interaction reviewer exposed two retained example inconsistencies; both were corrected and independently rechecked.

The new experiment used **18 Codex CLI actor runs**, one explicit-load `gpt-6.1-sol` route at medium reasoning, with a 180-second cap per run. The budget was not expanded. Seventeen actors completed and one timed out. Independent outcome review and replay classify the records as:

- **15 usable PASS records**, including the corrected verifier rerun.
- **1 retained FAIL:** the original verifier report did not name excluded residual test areas.
- **1 INCOMPLETE:** automation created its local artifacts but timed out before final verification and handover.
- **1 EXCLUDED:** the quiz fixture exposed a grading key that should have been withheld.

The revised brevity cases honored concise explanation, requested depth, and destructive-action safety. Spec continuations did not mistake terse option picks for impatience or a pace complaint for delegation. Review and diagnosis remained read-only. Both TDD runs observed valid behavioral red before implementation; independent checks passed for threshold/invalid input and real-file migration, including Unicode, IDs, order, newline, and repeated byte-identical output. Codebase tracing cited the synchronous and later processing paths while identifying fake persistence/email boundaries honestly. Prompt rewriting did not execute work. Option exploration disclosed unavailable parallel dispatch instead of simulating isolated branches.

The engineering review used bounded attributed retrieval and identified the non-idempotent email boundary: atomic database claims do not by themselves guarantee both recovery and at-most-once external delivery. No database integration execution was claimed.

The failed verifier request was frozen separately before a narrow report correction. The rerun named empty-file handling, row counts, malformed-input rejection, invocation errors, and other out-of-scope behavior. The original failure remains failed. Both verifier traces used genuinely new boundary inputs and combinations; neither exercised the conditional catalog-exhaustion branch. A dry discovery round does not repair known defects or establish shipping readiness.

## Explicit gaps

The timed-out automation artifacts passed independent local syntax, coverage-checker, two-attempt breaker, and overlap-lock checks in a disposable copy with model subprocesses forbidden. This is partial evidence. Actual CLI compatibility, sandbox/authentication behavior, usage measurement, generated model output, promotion certification, and final handover remain unverified. Artifact presence does not convert the actor into PASS.

The quiz actor read a fixture README containing a scorer key marked for withholding. Its observed first question met the frozen checks, but that contaminated run is excluded from independent behavioral support. The runner now rejects such fixtures before launch; replay tests that rejection. Grading guidance was moved outside the source actor fixture into `skills/quiz-changes/evals/scorer-notes.md`, with the quizzed patch unchanged. The contaminated frozen input remains intact. A clean quiz session remains unexecuted in this budget.

The `create-skill` probe covered only read-only rejection of a candidate missing collision boundaries. The positive minimal-candidate case was left unrun to make room for the verifier correction. The meta-skill and automation policies do not receive formal Tier-3 validation here. The exploration probe covers its no-parallel fallback, not real five-branch dispatch. Quiz/spec continuations do not prove complete interactive sessions. No native discovery, cross-model, repeatability, superiority, or execution-cost advantage is claimed.

Some actors emitted skill-announcement commentary before their final answers. Output-format grades apply to the last `agent_message`; all announcements remain in `output.md` and `trace.jsonl`. These grades do not claim that the complete visible turn contains no narration. Raw usage is retained per run; timeout usage is unavailable, not zero.

## Replay

```sh
node evals/remaining-skills-2026-10-04/check.mjs
node evals/pocock-comparison-2026-10-04/check.mjs
node evals/check-review-probes.mjs
```

The new replay validates original/current hashes, unchanged frontmatter, cases, launch-time resource hashes, runner snapshots, raw outputs, before/after trees, read-only effects, TDD ordering, independent behavior probes, and the contaminated-fixture rejection control. It writes [replay-results.json](replay-results.json). A passing replay means evidence matches its recorded outcome; it does not turn failures, exclusions, or incomplete runs into successes.

Independent scores remain in [outcomes-interaction.json](outcomes-interaction.json), [outcomes-safety.json](outcomes-safety.json), and [outcomes-followup.json](outcomes-followup.json). The correction uses [failure-case.json](failure-case.json); the quiz exclusion is preserved in [exclusions.json](exclusions.json). Current verifier hashes differ from its failed pre-correction run and are reported separately. No historical record was rehashed to appear current.

CI replays local evidence without launching a model. Repository structural, catalog, routing, persona, authoring-contract, and historical-provenance checks pass locally. Lexical routing remains 51/51 positives across 17 skills; this is a preflight, not native triggering proof. A read-only local `skills` CLI 1.5.19 listing also found the 17 active skills, with telemetry disabled and no installation; its output is preserved in [installer-list.txt](installer-list.txt).
