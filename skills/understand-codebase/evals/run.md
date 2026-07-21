# Understand-codebase opportunity test

The v2 case is a two-turn interaction derived from `skill-brief.md`: vague request, pointed orientation, then a scoped answer.

Run the frozen discovery arms once each:

```bash
node skills/understand-codebase/evals/run-opportunity.mjs --arm none
node skills/understand-codebase/evals/run-opportunity.mjs --arm prompt
node skills/understand-codebase/evals/score-opportunity.mjs
```

The actors use an isolated temporary home and Codex home containing only a copied authentication file, ignored user configuration and rules, and a read-only fixture workspace. Evidence is append-only under `results/opportunity/`; historical v1 results are never overwritten or scored as v2.

## Tier 2 effectiveness

The frozen 1.1.0 suite selects the original prompt and passing orientation cells plus the two skill cells rerun after the symbol-citation correction. Reproduce the selected skill cells and score them with:

```bash
node skills/understand-codebase/evals/run-effectiveness.mjs --case heldout-audit-export --arm skill
node skills/understand-codebase/evals/run-effectiveness.mjs --case regression-action-pressure --arm skill
node skills/understand-codebase/evals/score-effectiveness.mjs
```

Those commands refuse to overwrite existing evidence. To reproduce from scratch, copy the frozen package without `results/effectiveness/`, change `result_runs` to fresh run names, update only the resulting package hashes, and retain the original package unchanged. The runner uses isolated homes, ignored user configuration and rules, a read-only fixture workspace, Codex CLI 0.144.1, `gpt-5.6-sol`, and low reasoning effort.

The v1.1.0 claim covers force-loaded body behavior only. Autonomous triggering remains assigned to the shared portfolio routing suite.
