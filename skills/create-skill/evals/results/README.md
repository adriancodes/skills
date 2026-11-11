> Historical evidence: runtime structure changed on 2026-10-04. These outputs validate their recorded original subjects, not the current body. See the [current preservation pass](../../../../evals/remaining-skills-2026-10-04/README.md); no old result was retagged as current.

# Results Status

Current review corrections: see [the recorded probes and limits](../../../../evals/review-fixes.md). Raw current-subject results are under `review-2026-09-04/`; replay with `node evals/check-review-probes.mjs` from the repository root. These probes do not replace the full declared tier.

Verdict-gate rules (2026-11-09): see [the blocked-path probe](verdict-gates-2026-11-09/README.md). Verdicts on blocked paths are fixed; the stop gate held in 1 of 2 runs.

Verdict: **ITERATE**

The recorded Phase-0 runs are historical evidence for suite 1.0.0, collected before the workflow required a user-confirmed Skill Brief. They do not validate the revised 1.1.0 candidate and must not be reused to freeze or ship it. Six isolated actor runs plus six arm-blinded judge runs consumed 1,072,496 tokens.

The strongest realistic prompt passed cheaper-mechanism selection but failed three assertions: behavioral opportunity evidence (`opportunity`), reusable machinery rather than generic advice (`mechanism`), and an evidence-appropriate verdict under pressure (`verdict`). The recorded decision is therefore `PROTOTYPE`, not `SHIP`.

`matrix.json` is intentionally `UNFROZEN_DO_NOT_RUN` at suite 1.1.0 while `suite-manifest.json` remains the stale 1.0.0 record. No effectiveness run or effectiveness claim is permitted until the intent-first interactive cases and bounded user-acceptance loop are represented in the runner, new opportunity evidence is collected from confirmed briefs, and the matching suite is frozen.

## 2026-11-11 revision: unrun

No model eval was run for this revision. No new pass is claimed. The verdict above stays **ITERATE**.

Changed:

- `examples/complex-skill-example.md` and `examples/simple-skill-example.md`: every step has a standalone `Done when` line; pointers state when to load; the harness tool name is replaced by its role; word counts agree.
- `references/description-guide.md` and `references/validation-checklist.md`: removed the advice to spread keywords, synonyms, and user-phrasing variants through the body.
- `references/rules.md` Invocation: the portability note now names the Codex policy file and the claude.ai and Skills API rejection of the flag. `agents/openai.yaml` added.
- `SKILL.md` Scope: removed the slash-command exclusion; added a by-hand fallback for plugin packaging. Removed one no-op formatting line.
- Lever count corrected to seven in `rules.md`, `behavioral-force.md`, and `validation-checklist.md`; atomic steering added to the checklist line and to `behavioral-force.md`.
- `references/harness-tools.md`, `references/body-template.md`: stale model-invoked wording and the Source column removed.

Unrun regression cases in `cases.jsonl`: `regression-example-step-criteria`, `regression-one-term-body`, `regression-user-invoked-codex-policy`, `regression-slash-command-in-scope`.

The five `trigger-positive-*` cases still expect natural-language triggering, which `disable-model-invocation: true` prevents. They are unchanged.

Retired on 2026-11-11: `trigger-positive-create`, `trigger-positive-improve`, `trigger-positive-review`, `trigger-positive-discovery`, `trigger-positive-discipline` moved to [`../retired-cases.jsonl`](../retired-cases.jsonl). The skill is explicit-invocation only (`disable-model-invocation: true` plus the Codex policy file), so a natural request can no longer load it. Replaced by `trigger-explicit-create`, `trigger-implicit-natural-create`, `trigger-implicit-natural-improve` (unrun).
