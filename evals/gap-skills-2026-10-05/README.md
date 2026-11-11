# Original gap skills: full evaluation

The user approved the [gap map](../../docs/skill-gap-map.md), asked to implement its eight core additions, and selected full evaluation. The [implementation log](../../docs/specs/2026-10-05-skill-gap-implementation.md) records scope, operational assumptions, and progress. The budgeted run is complete: seven candidates pass local tier gates and setup remains provisional. User acceptance remains separate from evidence. See [the final report](../../docs/evidence/2026-10-05-gap-skills.md).

`discovery-cases.json` contains each candidate's first discovery task. `cases.json` adds the Tier-3 discovery tasks, independent held-out cases, native positives/negatives, and separately prepared recipient tasks. Assertions are private scorer inputs and never enter actor projects. Each candidate's per-skill `evals/` freezes its subject, cases, fixtures, matrix, budget, and opportunity evidence before skill-arm execution.

Keep discovery cases separate from held-out cases. Actors receive only the scenario request, the common tool/authority constraints, the applicable arm instruction, and their disposable fixture. Preserve before/after files and raw traces. A scorer or its answer key stays outside the actor workspace.

The [matrix](matrix.json), [budget](budget.json), [rubric](rubric.md), and [reproduction guide](run.md) define the tested route, finite cost limits, outcomes, and methods. Raw records retain launch failures and timeouts. Initial baselines with unrelated global metadata visible are excluded calibration observations. Global skill enablement changes apply only to individual CLI processes; active installations remain untouched.

The [runner provenance correction](runner-provenance.json) preserves the exact loaded source of the initial held-out batch. Its source hash was originally read from disk at actor launch while the batch module was loaded once. Later native-capture/iteration-label edits did not execute in that batch. Current force-loaded subject hashes identify each actual revision; metadata-only Tier-2 changes retain identical runtime bodies and receive new native discovery probes. No raw manifest is overwritten.

Arm-hidden outcome judgments preserve assertion-level evidence, independent replay, limitations, and superseded corrections. Output style can reveal instruction use, so this is not perfect blinding. Setup runner replay is independent of generated self-tests. Handoffs and revised instructions require fresh recipients. These extra sessions count toward the run budget; collaboration judging overhead is disclosed separately because its usage is not exposed in CLI records.

All vendor names and credentials in locally authored fixtures are synthetic. A supplied offline primary-source corpus tests version applicability and citation behavior, not live web retrieval or current real-service capabilities. Mocked publication tests authorization behavior, not real service authentication.

Eleven byte-identical revised recipient inputs reuse earlier independent execution; six unchanged checker inputs reuse a before control. These prove parity, not new execution or incremental prevention. `mixed-command-evidence.json` addenda preserve actual checks omitted when a shell command also displayed a withheld body. Exact raw trace IDs, command hashes, outputs and statuses are validated, and corrupt-proof controls must fail.

## Redaction

Before publication, the local home directory and account name in prompts, traces, manifests and judgment packets were replaced with `/Users/user` and `user`. Recorded trace, prompt and command hashes were recomputed over the redacted text. Workspace snapshots, subjects, runners, verdicts and scores are unchanged. `disabled-global-skills.json` stores home-relative paths that `run.mjs` expands.

## Raw sessions

Raw sessions and scorer packets for this suite are kept outside the repository. Paths under `results/`, `judgments/` and `downstream.json` in this folder refer to that local archive. The checks that replay them run only where the archive is present.
