**Improved prompt →**

“Clean up the authentication code to make it easier to understand, maintain, and test. Consolidate duplicated authentication logic and clarify naming and control flow `[assumed: duplication and unclear structure are the main cleanup targets]`. Preserve existing authentication behavior and public interfaces `[assumed: this is a refactor, not a policy or feature change]`. Run the relevant tests and add focused regression coverage for any authentication paths materially changed `[assumed: test updates are within scope]`. Do not change credentials, authorization rules, database schemas, or external API contracts. Deliver the code changes with a concise summary of what changed and verification performed.”

**Assumed (3):**

- Duplication and unclear structure are the primary cleanup targets.
- Existing behavior and interfaces must remain stable.
- Relevant regression-test work is included.

**Target:** Plain coding-agent refactor task.

No execution was requested, so I’ve stopped after improving the prompt.
