I’ll apply the supplied simplify-code instructions, check the module’s contracts and callers, then simplify it and verify with the existing Node tooling.

There are no existing tests or package scripts. The code also finishes reading every `enabled` value before accessing any names, which affects side effects and error order. I’ll preserve those two passes, remove the four private helpers, and run Node checks before and after the edit.

Simplified `src/legacy-flags.js` by removing four private helpers. Preserved the public export, output order, strict boolean check, and two-pass evaluation that maintains error order.

Node characterization checks passed before and after; `node --check` passed. No existing test suite was available. `package.json` and dependencies are unchanged.