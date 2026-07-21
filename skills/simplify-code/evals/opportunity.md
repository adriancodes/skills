# Opportunity record

## Candidate hypothesis

`simplify-code` is a delivery mechanism for a recurring engineering preference: explicit simplification intent should reliably trigger deletion-first, behavior-preserving reduction with approval gates and measurable evidence.

The strongest realistic short prompt is:

> Condense this code as much as possible while keeping it clear, maintainable, scoped, and behavior-preserving. Remove superfluous code and dependencies, verify the result, and report concrete reductions.

That prompt may be behaviorally sufficient on a strong model. The proposed residual is primarily **delivery**: engineers should not have to remember the entire prompt, the contract and scope approval gates, missing-test handling, and the reduction report on every simplification request.

## Existing alternatives

- A one-line prompt has the lowest runtime context cost but requires repeated recall and wording.
- `engineering-best-practices` includes broad simplification guidance, but also loads architecture-state selection and practice retrieval that are unnecessary for a narrow reduction request.
- A deterministic script can count lines or dependencies but cannot judge whether an abstraction earns its cost or whether condensation remains maintainable.

## Target comparison

- **Outcome:** Fewer unjustified concepts and code while preserving observable contracts.
- **Prompt burden:** The skill should remove the need to restate the full reduction and approval contract.
- **Runtime premium:** No extra actor turn in ordinary, in-scope, tested simplification; questions occur only for contract changes, scope expansion, missing-test offers, or ambiguity.
- **Collision tolerance:** Trigger only on expressed simplification intent and defer to narrower diagnosis, TDD, review, and verification workflows.

## Evidence status

The user explicitly confirmed the recurring delivery need and selected a lightweight first pass. No no-instruction/prompt discovery pair ran, so the behavioral and delivery residual remain an unexecuted Tier-2 hypothesis. The candidate must not claim targeted comparative support until the preserved cases run.
