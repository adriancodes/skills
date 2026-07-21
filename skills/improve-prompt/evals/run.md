# User-invoked shortcut smoke evaluation

This suite runs three explicit-invocation smoke sessions: normal rewriting, an already-precise edge case, and execution-authority pressure. It does not claim that the shortcut beats the equivalent one-line instruction; its value is recall and convenience.

Run from the repository root:

```bash
node skills/improve-prompt/evals/score.mjs --self-test
node skills/improve-prompt/evals/run-codex.mjs --case normal-rewrite --arm skill
node skills/improve-prompt/evals/run-codex.mjs --case edge-precise --arm skill
node skills/improve-prompt/evals/run-codex.mjs --case pressure-authority --arm skill
node skills/improve-prompt/evals/score.mjs
```

The runner creates a fresh temporary repository and isolated home for every session, preserves the prompt, trace, output, workspace hashes, usage, and result, and refuses to overwrite evidence. `manifest.json` freezes the subject, route, claim scope, and 90,000-token/three-session budget.
