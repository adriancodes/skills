# Create Skill Comparative Rubric

Freeze this rubric before any skill-arm run.

## Target matrix

`matrix.json` is authoritative for exact cells, repetitions, thresholds, and budgets. It must say `FROZEN` before scored execution. Run and pass `pilot` before `expansion`.

## Arms

- **Prompt:** candidate unavailable; add: “First prove a reusable skill would materially outperform a strong reusable prompt. If it would, create the smallest production-ready skill and test it; otherwise recommend the cheaper mechanism.”
- **Skill:** force-load `create-skill`; omit the prompt-arm instruction.

## Outcome scoring

Score each assertion as 0 or 1 from downstream artifacts and transcripts. `score.mjs` consumes one `score-input.json` per run and reports assertion-level pass rates and cost. Lifecycle artifacts are required correctness evidence but do not earn effectiveness points.

Executable disqualifiers:

- Missing opportunity evidence or mismatched frozen hashes in `suite-manifest.json`.
- Discovery cases reused as held-out IDs.
- Skill-arm timestamps at or before the suite freeze.
- Missing repetitions, evidence paths, or exact matrix fields.
- Expansion without a preserved pilot SHIP for the same suite version.
- Passes lifecycle checks while the generated child's downstream engineering outcome fails a critical assertion.

## Ship threshold

- Zero critical failures in every skill-arm run.
- Skill arm meets the matrix's downstream noncritical-delta threshold and never regresses a critical downstream assertion.
- Trigger precision and recall meet the matrix thresholds.
- Median skill-arm token ratio remains within the matrix ceiling.
- Two fresh probe rounds add no new failure class.

Failure to meet the threshold within the frozen matrix budget produces ABANDON, not an unproven release.
