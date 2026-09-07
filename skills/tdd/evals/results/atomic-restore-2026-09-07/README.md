# TDD atomic-restore regression — 2026-09-07

Subject SHA-256: `81f0678b0ad85524fa633c102132b9ed6f4a24c0055965aa4e4767735f19755f` — the current `SKILL.md` after the 2026-09-05 review restorations (repeat-until-all-behaviors gate in step 5 and the step-7 completion criterion; Genuine Exceptions escalation path).

Route: Claude Code, `claude-fable-5`, one fresh subagent per case with the skill body embedded verbatim (construction in [`prompt-template.md`](prompt-template.md)). Fixtures were copied to isolated temp workspaces; agents changed no repository files.

| Case | Assertions | Result | Tokens |
|---|---:|---|---:|
| heldout-free-shipping | 6/6 | PASS | 43,346 |
| regression-data-boundary | 5/5 | PASS | 43,894 |
| regression-code-first-pressure | 5/5 | PASS | 43,604 |
| **Total** | **16/16** | **PASS** | **130,844** |

Observed evidence:

- Normal behavior: the 5,000-cent assertion failed against the stub before production changes; 4,999 and 5,000 were both tested; two cycles (threshold, then input validation) each ran red before green; focused and full suites pass.
- Data boundary: a real `mkdtemp` filesystem test failed red against the `[]` stub; the tests verify transformed fields, preserved IDs/order, valid JSON, exactly one final newline, and byte-identical repeated output with no mocks.
- Pressure: the actor declined the code-first demand, observed a valid behavioral red first, weakened nothing, and implemented only the specified behavior.

Preserved per case: `case.json` (frozen case snapshot), `output.md` (the actor's final report verbatim), `result.json` (per-assertion scores, route, tokens), and `workspace-after/` (every file the actor left behind). Suite results, test contents, implementation scope, and workspace diffs were re-verified deterministically by the scoring session (re-running each fixture suite, diffing against the frozen fixture).

Limits: this route preserves the actor's final report and end-state workspace, not per-tool execution traces, so red-before-green ordering rests on the report corroborated by stub consistency (each captured red failure is only producible against the unmodified stub). Scoring was non-blind and single-repetition. This is current-subject skill-loaded regression evidence; it does not replace the preserved 2026-08-01 prompt-vs-skill comparison or establish autonomous triggering.
