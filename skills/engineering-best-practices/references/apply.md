# Apply Best Practices to Daily Work

Use this workflow for scoped design, implementation, testing, review, refactoring, and simplification.

## 1. Establish local evidence

Read the request, binding instructions, engineering charter, affected code, tests, and at least one analogous implementation when available. Identify:

- behavior that must remain stable;
- module boundaries and dependency direction;
- state ownership, concurrency, and failure behavior;
- established testing style;
- concrete change pressure or review risk.

Classify relevant local conventions as coherent, accidental, harmful, or unknown using the main skill's coherence criteria.

Evidence gathering is complete when required behavior, boundaries, state, failure paths, tests, change pressure, and relevant local-pattern classifications are explicit.

## 2. Choose the applicable direction

Follow the main skill's decision precedence.

- In an established codebase, extend coherent analogous patterns.
- When local approaches conflict, prefer the charter and the pattern best supported by boundaries, tests, and repeated use.
- When a pattern creates material harm, describe the code evidence and consequence. Ask for direction if changing it expands the requested scope.
- When no pattern exists, choose the simplest option consistent with the codebase. Ask one multiple-choice question only if the choice materially changes architecture, public interfaces, ownership, persistence, consistency, or testing.

Do not introduce a new pattern merely to demonstrate a retrieved practice.

Direction selection is complete when the governing precedent is explicit and every material conflict is resolved or visibly escalated.

## 3. Retrieve the closest practices

Build one specific query from the work rather than from generic terms such as "clean code." Name all five fields in the query:

1. **Invariant** — the condition that must hold.
2. **Concurrency/distribution scope** — one request or process, or multiple workers, processes, or machines.
3. **Atomicity/consistency mechanism** — the primitive that enforces the invariant.
4. **State owner** — the durable dependency or authoritative component that owns the state.
5. **Failure/recovery** — interruption, retry, timeout, partial completion, and abandoned-work behavior.

Use `not applicable` for a field only after repository evidence establishes that it cannot affect the task. For example:

- "invariant: one ledger entry per accepted request; concurrency/distribution scope: workers on multiple machines; atomicity/consistency mechanism: unique key plus transactional conditional state transitions; state owner: primary database; failure/recovery: a crash after claim permits safe retry without duplicate effects";
- "invariant: existing public behavior remains stable; concurrency/distribution scope: one process; atomicity/consistency mechanism: characterization tests and a compatibility seam; state owner: existing module; failure/recovery: a failed extraction leaves the old path runnable."

Retrieve two to five practices with the intent matching the work. Discard results that do not change a decision, implementation detail, test, or review check.

Retrieval is complete when every retained practice has a repository-specific implication and every weak match is discarded.

### Enforce cross-instance invariants at the shared owner

When the invariant spans workers, processes, or machines, never accept process-local coordination. In-memory locks, maps, weak maps, caches, and singletons cannot arbitrate independent instances. Put the invariant in the durable shared state owner.

Require atomic claim, complete, and release operations, or analogous begin, commit, and abandon transitions, at that owner. Use an owner-supported transaction, conditional update, compare-and-swap, unique constraint, lease, or equivalent primitive. Reject a check-then-set sequence whose read and write can interleave.

Require adversarial tests using independent application or worker instances. Give those instances no shared in-memory lock, cache, singleton, or registry; their only shared coordination must be the durable dependency. Race acquisition, inject interruption between acquisition and completion, and verify that exactly one instance enforces the invariant while abandoned work remains recoverable.

Cross-instance design is complete only when the state owner atomically arbitrates claim, complete, and release or their analogues, and the independent-instance test proves both contention safety and recovery.

## 4. Execute the requested mode

### Generate or change code

Translate each selected practice into a local constraint, implement the smallest coherent solution, and test important behavior and failure paths. Match existing names and interfaces where they are sound. Avoid unrelated cleanup.

### Review code

Inspect correctness first, then boundaries, state, failure behavior, tests, and changeability. Use retrieved practices as lenses, not as a checklist to manufacture findings. Report only findings supported by a concrete location, consequence, and viable correction. Distinguish defects from optional improvements.

### Simplify code

Identify the source of complexity before editing: duplication of knowledge, shallow indirection, mixed responsibilities, temporal coupling, unclear state, or an unstable interface. Preserve observable behavior, reduce concepts or dependencies, and verify with tests. Fewer lines alone are not evidence of simplification.

### Refactor scoped code

Protect behavior with existing tests or focused characterization tests. Create a seam where needed, move in small steps, and keep the system runnable. A scoped refactor does not authorize codebase-wide alignment; switch to **Align** only after an explicit request.

Execution is complete when the requested mode produces its code or findings, preserves the declared scope, and verifies relevant behavior and failure paths.

## 5. Verify application

For each practice retained, verify the concrete effect:

- a design choice visible in code or documentation;
- a test covering the relevant invariant or failure;
- a review finding tied to evidence; or
- a measurable reduction in concepts, coupling, or duplicated knowledge.

Do not include a book report in the final response. Mention the selected practices and IDs only when they explain a non-obvious choice, satisfy an attribution request, or belong in the durable charter.

Verification is complete when every retained practice has a visible effect and every requested behavior or finding has supporting evidence.

## 6. Keep the charter honest

Update `docs/engineering-practices.md` only when the user approves a durable change, delegates defaults, or the work implements an already-approved decision that the charter was meant to capture. Do not turn every local tactic into a repository-wide rule.

If implementation repeatedly requires exceptions, recommend reconsidering the charter rather than accumulating silent divergence.

Charter handling is complete when it is either intentionally unchanged or updated only with approved durable guidance and recorded exceptions.
