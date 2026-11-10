# Reproduce the full evaluation

Run from the repository root with Node and the authenticated Codex CLI version in matrix.json. No live vendor lookup or real external publication is tested. Fixture documents and keys are synthetic.

```sh
node evals/gap-skills-2026-10-05/batch.mjs discovery prepare-pr
node evals/gap-skills-2026-10-05/freeze.mjs prepare-pr
node evals/gap-skills-2026-10-05/batch.mjs behavior prepare-pr
node evals/gap-skills-2026-10-05/batch.mjs native prepare-pr
node evals/gap-skills-2026-10-05/pack-judgments.mjs
node evals/gap-skills-2026-10-05/score.mjs prepare-pr
```

Existing result directories are immutable. On a reproduction, use a fresh checkout without results or launch a new explicit repetition/iteration via `run.mjs case-id:arm:repetition:iteration`. Never delete historical failures to turn a failed suite green. Baseline calibration repetitions and exclusions are recorded in matrix.json.

The runner creates isolated projects in the operating-system temporary directory. It records the exact prompt, fixture and subject hashes, harness arguments, raw JSON trace, stderr, usage, commands, wall time, and before/after file effects. Git fixtures establish actual base/head commits and optional dirty edits. Actors retain workspace-write sandboxing; local client startup may need an outer sandbox exception. No actor may inspect another run or private scoring files.

Native read observations require the exact installed body in command output, not merely a command mentioning its path. A combined command may read the body successfully and then exit nonzero on a later search; captured body content establishes the read. Positive application is scored separately from the anonymous output and artifacts. The harness does not infer a body read from a `$skill` mention or grant application from a read alone. The tested positive sessions' actual reads are retained. Native observer changes strengthen evidence capture without changing frozen requests or assertions.

Run `check-integrity.mjs` to verify every saved before/after/subject snapshot, native catalog capture, archived Git metadata and runner provenance. The initial body batch's module-loaded runner correction is recorded in `runner-provenance.json`; original per-actor manifests remain unchanged. Later runs save the exact loaded runner source. Parent recipient cases and fresh rounds use additional immutable manifests frozen before execution. Baseline critical failures are reported separately: the frozen rubric gates skill outcomes and compares recovery or parity; it does not require an intentionally failing baseline to pass.

Run `pack-judgments.mjs`, then give an independent evaluator only `judgments/observation-*` packets. Score each task.json assertion into judgments/outcomes.json with boolean pass, concrete evidence, reasons, independent commands, and limits. Keep the arm mapping private from the evaluator. Parent-run fresh recipients and adversarial script replays add separate downstream evidence; document unavailable testing honestly. The scorer rejects incomplete evidence, changed hashes, missing cells, and budget failures. Structural checks do not replace behavior or native-trigger observations.

The maintained suite also supports `current-comparison` (revised session-review comparisons and known regression, plus the first instruction fresh case) and `current-native` (review discovery plus its prepared instruction recipient). These share the same three-actor queue. `fresh-1` and `fresh-2` select genuinely new cases from the current revision's immutable fresh manifest; they never recycle earlier revision cases. Freeze fresh cases only after known gates pass, and judge the first round plus its actual recipient before launching the second.

`cases.jsonl` is the current shared case index for this skill. `cases-initial.jsonl` preserves the initial package. Immutable manifests and each result's saved case establish the revision actually tested; later fresh and recipient cases have their own manifests.
