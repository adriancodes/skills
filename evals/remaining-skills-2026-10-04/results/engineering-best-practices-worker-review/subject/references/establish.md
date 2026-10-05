# Establish a Codebase Direction

Use this workflow only at the beginning of a substantive codebase or when the repository is still scaffolding and no engineering direction has been approved.

## 1. Inspect before asking

Read the product request, repository instructions, manifest, framework setup, deployment configuration, initial schema, and any existing decisions. Separate facts from decisions still open. Do not ask for information already established by evidence.

Summarize the likely application shape internally:

- users and primary capabilities;
- system and trust boundaries;
- state ownership and consistency needs;
- external integrations and failure modes;
- expected deployment, scale, and team constraints;
- testing and changeability priorities.

If substantive domain code and recurring patterns already exist, return to the **Apply** workflow.

Inspection is complete when repository facts, remaining material decisions, and the selected **Establish** state are explicit.

## 2. Interview only material decisions

Ask one multiple-choice question at a time under the main skill's question contract. Cover only unknowns that can materially change architecture, ownership, state management, reliability, or testing.

Typical decision areas are:

1. application shape and primary workflows;
2. domain complexity and rate of business-rule change;
3. data ownership, consistency, and concurrency;
4. deployment, scale, availability, and recovery expectations;
5. team, language, framework, or operational constraints;
6. testing, delivery speed, and long-term change priorities.

Questions should describe outcomes and tradeoffs rather than asking the user to select jargon. For example, ask whether workflows require one immediately consistent transaction or may complete asynchronously; do not ask whether to use an event-driven architecture without first establishing that need.

When recommended defaults are delegated, infer remaining answers conservatively and move directly to recommendation and documentation.

The interview is complete when every material decision is answered from evidence, selected by the user, or covered by explicit default delegation.

## 3. Offer coherent directions

Synthesize two or three complete directions, not a menu of independent patterns. Put the recommended direction first. For each direction, explain:

- why it fits the observed application and constraints;
- its module and dependency boundaries;
- its approach to state, errors, and external integrations;
- its testing strategy;
- the principal cost and the conditions that would outgrow it.

Prefer the simplest sufficient shape. Common profiles may include:

- a modular monolith organized around user capabilities or vertical slices;
- a domain-oriented modular monolith when business rules and language are genuinely complex;
- distributed or event-driven components only when independent scaling, failure isolation, ownership, or asynchronous workflows require them.

Do not recommend microservices, CQRS, event sourcing, clean architecture, DDD, or any named pattern solely because it is widely known. Retrieve practices relevant to the actual decision and use them to sharpen the profiles.

Recommendation is complete when two or three coherent directions connect repository evidence to boundaries, state, failures, tests, costs, and reconsideration conditions.

## 4. Confirm and refine

Ask for a choice through a multiple-choice interaction, with the recommended direction first and a custom alternative available. Incorporate feedback, restate changed tradeoffs, and repeat until the direction and language are accepted.

Explicit delegation to use recommended defaults counts as approval of the recommended direction. Record important inferred assumptions.

Confirmation is complete when one direction and its repository-specific language are accepted or covered by default delegation.

## 5. Codify the direction

Create `docs/engineering-practices.md` from the bundled template. Include only decisions that guide future work:

- the application context and priorities;
- the chosen architecture, paradigms, boundaries, and dependency direction;
- concrete practices and their source principle IDs;
- local conventions to establish;
- deliberately avoided approaches and why;
- exceptions and triggers for reconsideration.

Add the marked `AGENTS.md` pointer from the main skill. Preserve unrelated instructions. Verify that the charter is internally coherent and actionable by an agent joining without the interview history.

Codification is complete when the approved charter exists, the marked pointer is correct, and every unrelated instruction remains unchanged.

## 6. Begin in a tracer slice

Apply the charter to the first end-to-end capability. Validate boundaries, data ownership, failure handling, and testing in working code before multiplying scaffolding. If implementation evidence invalidates an assumption, update the decision with approval rather than quietly diverging from the charter.

The tracer slice is complete when one useful capability works end to end, its important failure paths pass, and its code conforms to the charter.
