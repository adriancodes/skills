# Confirmed Skill Brief: simplify-code

Confirmed through adaptive Q&A with the user on 2026-07-18.

- **Problem:** Simplification requests often leave superfluous code, unnecessary abstractions, indirection, configuration, tests, comments, or dependencies in place, or chase minimum line count at the expense of maintainability.
- **Users:** Engineers who repeatedly ask an agent to condense working code without changing its behavior.
- **Core outcome:** Produce the smallest maintainable implementation justified by repository evidence, with concrete before/after reduction and verification evidence.
- **Authority:** Edit the requested scope directly when simplification intent is explicit.
- **Contract boundary:** Ask before changing public APIs, persisted data formats, error behavior, or meaningful performance characteristics unless the request explicitly authorizes the exact change.
- **Scope boundary:** Ask before editing outside the user's stated scope.
- **Removal surface:** Remove demonstrably redundant production code, abstractions, duplication, indirection, tests, comments, configuration, and dependencies.
- **Maintainability:** Condense code without turning it into clever, compressed, or cryptic code.
- **Missing tests:** Disclose the gap and offer to generate characterization tests; do not generate them without approval.
- **Unknown failures:** Stop simplification and route to diagnosis first.
- **Triggers:** “simplify this code,” “remove the fluff,” “make this more concise,” “reduce this complexity,” and “clean up this bloated code.”
- **Non-triggers:** New behavior, diagnosis of unknown failures, read-only review, and architecture redesign without simplification intent.
- **Invocation:** Model-invoked, but only on expressed simplification intent.
- **Type:** Simple technique with approval guardrails.
- **Evidence target:** Tier 2 because the skill performs reversible local writes.
- **Cost tolerance:** Lightweight deterministic checks and realistic fixtures in this pass; no costly multi-session model comparisons.
- **Collisions:** `engineering-best-practices` owns broad design direction; `tdd` owns behavior changes; `diagnose` owns unknown failures; `code-review` owns read-only review; `verify-work` owns adversarial finished-artifact checks.
- **ASSUMED and accepted:** The first version may remain a locally validated candidate until bounded comparative actor sessions are separately authorized.
