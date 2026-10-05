I’ll apply the supplied simplify-code workflow to `src/legacy-flags.js`, check its callers and tests, and verify that the documented behavior stays intact using the existing Node tooling.

The workspace has no reliable tests, no `CONTRIBUTING.md`, and no repository check scripts. Characterization tests would need your approval; I’ll proceed with syntax checks and executable comparisons without adding test files.

The four private helpers are used only here. I’ll inline them while keeping both passes: the current code reads every `enabled` value before reading names, which affects getter side effects and error order.

Simplified `src/legacy-flags.js` from 36 to 14 lines, removing four private helpers. Preserved the export, strict `=== true` check, output order, and two-pass evaluation.

Node syntax checks passed. Before/after executions matched for documented examples, coercion, getter order, and sampled errors. No reliable test suite exists; no test files were added.

Required checks failed with `MODULE_NOT_FOUND` because their scripts are absent:

- `node scripts/skills.mjs check`
- `node scripts/skills.mjs readme --check`
- `node scripts/skills.mjs route`
- `node scripts/validate-personas.mjs`

`package.json` and dependencies are unchanged.