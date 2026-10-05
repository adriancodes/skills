---
name: engineering-best-practices
description: Use when starting a substantive codebase, making or reviewing a non-trivial code change, or deliberately improving a codebase's architecture. Also use when the user asks to "follow best practices", "start a new application", "review this codebase", or "refactor this codebase", or when architecture is inconsistent or has no coherent patterns.
license: MIT
compatibility: Requires Node.js 20 or later for local retrieval.
metadata:
  category: Quality
  summary: Applies repository patterns and progressively retrieved engineering practices to design, implementation, review, and refactoring.
  author: agent-rules-books contributors
  version: 0.1.0
---

# Engineering Best Practices

## Overview

Apply established engineering practices without loading the full source corpus into context: identify the repository's state and direction, then retrieve only the practices the current task needs.

## When to Use

Use for:

- starting a substantive application or codebase;
- non-trivial design, implementation, testing, review, refactoring, or simplification;
- explicit requests to assess or improve architecture, paradigms, or patterns;
- work where consistency, failure behavior, changeability, or ownership boundaries matter.

## Do Not Use When

Skip prose-only work, trivial mechanical edits, generated files, dependency lockfiles, and questions unrelated to software design. A tiny standalone script needs no architectural interview unless its choices materially affect safety or maintainability. When a specialized testing, debugging, security, or refactoring skill governs the task, use it first, applying this skill inside it only for practice retrieval and project alignment.

## Required context

Before choosing guidance:

1. Read binding project instructions and the requested scope.
2. Read `docs/engineering-practices.md` when it exists.
3. Inspect relevant code, tests, interfaces, dependencies, and nearby analogous modules.
4. Determine the working state below.

Do not infer the architecture from directory names alone. Context acquisition is complete when binding instructions, any charter, affected code, tests, and analogous patterns are inspected or confirmed absent.

## Workflow

### 1. Detect the working state

| State | Enter when | Load |
|---|---|---|
| **Establish** | A substantive new application is starting, or only scaffolding exists with no approved direction recorded. | [references/establish.md](references/establish.md) |
| **Apply** | Scoped design, implementation, review, refactoring, or simplification is requested where an established direction or meaningful code exists. | [references/apply.md](references/apply.md) |
| **Align** | A codebase-wide architecture review or deliberate migration toward selected paradigms and patterns is explicitly requested. | [references/align.md](references/align.md) |

Load exactly one state workflow initially; load another only after the work genuinely changes state.

An existing codebase without a charter defaults to **Apply**, not **Align**; do not turn a feature request into an unsolicited architecture program. A repository holding only configuration, an empty framework shell, or placeholder examples can still be **Establish**.

### 2. Resolve the engineering direction

Resolve conflicts in this order:

1. Binding project requirements and safety constraints.
2. The approved engineering charter in `docs/engineering-practices.md`.
3. Coherent local patterns in analogous code.
4. Closely relevant practices retrieved from this skill's catalog.

Retrieved practices inform judgment; they do not override explicit requirements or justify unrelated rewrites.

A local pattern is coherent only when it:

- recurs across analogous locations;
- uses consistent names, boundaries, and dependency direction;
- is supported by tests or documentation; and
- creates no important correctness, security, reliability, operability, or changeability defect.

One-off code, conflicting conventions, and copied accidents are not established patterns. If the prevailing pattern is materially harmful, name the concrete evidence and request a direction rather than silently copying or replacing it. Direction resolution is complete when the governing requirement, charter decision, or coherent local pattern is explicit and any material conflict is resolved.

### 3. Retrieve the closest practices

Translate the task into a short retrieval query naming these five fields explicitly:

1. **Invariant**: the condition that must always hold or the behavior that must never occur.
2. **Concurrency/distribution scope**: whether coordination stays in one request or process or spans workers, processes, or machines.
3. **Atomicity/consistency mechanism**: the transaction, conditional write, unique constraint, compare-and-swap, lease, or other mechanism that makes the invariant enforceable.
4. **State owner**: the durable dependency or authoritative component owning the coordinated state.
5. **Failure/recovery**: what happens on interruption, retry, timeout, partial completion, and abandoned work.

Use `not applicable` only after inspection confirms the field does not affect the task. A query that names a concurrency symptom without the invariant, shared owner, enforcement mechanism, and recovery behavior is incomplete. Then run:

```bash
node <skill-directory>/scripts/retrieve-guidance.mjs \
  --intent <design|implement|review|refactor|simplify|test|operate> \
  --task "<specific engineering problem>" \
  --max <2-6>
```

Use `--books` or `--principles` only when a source or principle was explicitly requested. Principle IDs stay visible for attribution and durable charter references.

For ordinary work, make one retrieval call, select two to five closely applicable practices, and keep added context under roughly 1,000 tokens. A second call is allowed only for a genuinely distinct phase, such as reviewing a generated implementation. Do not browse the catalog, enumerate books, or load source files speculatively.

For each selected practice:

1. State its local implication in concrete terms.
2. Apply it to the design or code.
3. Verify the result with tests, inspection, or a focused review.

Discard weak matches. Retrieval is complete when every retained practice changes a concrete decision, implementation detail, test, or review check.

### Distributed invariant gate

When an invariant spans workers, processes, or machines, never accept process-local coordination as its enforcement mechanism. An in-memory mutex, map, weak map, cache, or singleton coordinates only one process; move enforcement to the durable shared state owner.

Require the shared owner to expose one atomic state transition per lifecycle boundary: claim, complete, and release, or analogous begin, commit, and abandon operations. Use a transaction, conditional write, compare-and-swap, unique constraint, lease, or equivalent owner-supported primitive. A separate read followed by a write is not an atomic claim.

Verify the invariant with adversarial cross-instance tests: construct independent application or worker instances sharing no in-memory lock, cache, singleton, or registry — only the durable dependency. Race the instances at the invariant boundary, inject failure after acquisition and before completion, and prove both single enforcement and recovery. The gate is complete only when the durable owner arbitrates the race and abandoned work can be reclaimed safely.

### 4. Execute the loaded workflow

Follow the selected state reference through its completion criteria, applying the question and charter contracts below when required. Execution is complete when the requested code, review, recommendation, or refactor slice exists and the retained practices are visible in its decisions or verification.

## Question contract

When a decision requires input, ask one question at a time, using the harness's multiple-choice interaction when available.

Every question must:

- offer two to four meaningful, mutually exclusive choices;
- place the recommended choice first and explain its tradeoff;
- allow a custom answer;
- use evidence already in the repository to avoid unnecessary questions.

Without structured interaction, present numbered choices and explicitly permit a custom answer. When told to use recommended defaults, stop interviewing, infer remaining low-risk choices from the application and constraints, and proceed with the recommended coherent solution.

## Engineering charter

Use [assets/engineering-practices-template.md](assets/engineering-practices-template.md) when a direction is approved or recommended defaults are delegated. Keep it concise, repository-specific, and human-readable; do not copy the catalog into it.

Write the charter to `docs/engineering-practices.md`. Add or update only this marked block in the nearest applicable `AGENTS.md`, preserving all unrelated content:

```markdown
<!-- engineering-best-practices:start -->
## Engineering best practices
For non-trivial software design, implementation, review, or refactoring, use the `engineering-best-practices` skill and follow `docs/engineering-practices.md`.
<!-- engineering-best-practices:end -->
```

Do not write or replace the charter before the direction is approved, unless recommended defaults were explicitly delegated.

## Lifecycle example

A new queue-processing service with only framework scaffolding enters **Establish**. Repository evidence answers the language and deployment questions; multiple-choice questions settle consistency and reliability priorities. The skill recommends a modular service with explicit ownership, idempotent message handling, bounded retries, and integration tests; after approval, the charter records those decisions and their source principle IDs.

A later request to add a consumer enters **Apply**. Run the exact local lookup:

```bash
node skills/engineering-best-practices/scripts/retrieve-guidance.mjs \
  --intent implement \
  --task "invariant: one side effect per delivery; concurrency/distribution scope: concurrent workers and processes; atomicity/consistency mechanism: conditional transaction for claim, complete, and release; state owner: durable message-state database; failure/recovery: an interrupted claim expires and a retry reclaims it" \
  --max 4
```

Retain only the returned directives that change the consumer design, then implement atomic lifecycle transitions in the durable owner without loading unrelated architecture guidance. Test with independent consumers whose only shared coordination is the database. The example is complete when concurrent duplicates produce one side effect and an interrupted claim can be retried safely.

An explicit request to reorganize the entire service enters **Align**. The agent audits actual change friction, offers a few coherent target directions, records the choice, and migrates in behavior-preserving slices rather than rewriting at once.

## Working discipline

- Deliver code and decisions, not a lecture about books.
- Tie review findings to concrete code evidence and consequences.
- Preserve behavior during simplification unless a behavior change is requested.
- Keep architectural decisions coherent; do not assemble a grab bag of fashionable patterns.
- Prefer the simplest direction that satisfies observed constraints.
- Record exceptions and reconsideration triggers instead of pretending decisions are permanent.
- Preserve source attribution when a retrieved practice influences a durable decision.

## Common Mistakes

| Rationalization | Required response |
|---|---|
| "The repository uses it once, so it is the pattern." | Inspect analogous locations and test the coherence criteria. |
| "Best practice says to replace the local design." | Apply the decision precedence and show concrete harm before proposing change. |
| "Ask every architecture question to be safe." | Infer answered facts; ask only decisions that materially change the solution. |
| "Load every related book for completeness." | Retrieve a small relevant packet and discard weak matches. |
| "A codebase review authorizes a rewrite." | Recommend a target and incremental migration; preserve behavior in bounded slices. |
| "The defaults were delegated, but approval is still required." | Apply the recommended coherent direction and document the assumptions. |
| "The patch is green and nearly finished, so retrieval is unnecessary." | Retrieve before accepting a non-trivial design; green tests may omit the governing failure mode. |
| "The relevant best practices are already obvious." | Run the bounded lookup; its purpose is to expose principles outside immediate recall. |
| "A process-local lock prevents the race in tests." | Put the transition in the durable state owner and race independent instances whose only shared coordination is that dependency. |

### Stop Conditions

These thoughts signal an imminent shortcut:

- "This pattern exists somewhere."
- "The tests are already green."
- "The user wants this quickly."
- "Retrieval can wait until review."
- "More sources will be safer."
- "The workers normally run in one process."

Return to the workflow and use the rationalization table: state the rule once, produce the compliant result, and move on.

### Closed loopholes

- Never substitute a generic best-practices checklist for the bounded catalog lookup; run the lookup for non-trivial work.
- Never load all three state references "for context"; load exactly the selected workflow.
- Never treat passing tests as proof a local pattern is coherent; check recurrence, boundaries, support, and material defects.
- Never continue an architecture interview after recommended defaults are explicitly delegated; document assumptions and proceed.
- Never accept process-local coordination for an invariant spanning workers, processes, or machines; require atomic lifecycle operations in the durable shared owner.

## Failure Modes

If retrieval returns no useful match, refine the task once with more concrete symptoms or constraints. If it still fails, proceed from project evidence and engineering judgment; do not force an irrelevant practice.

If the retrieval script or catalog is missing, report that the progressive source is unavailable and continue with the charter and coherent local patterns. If project evidence conflicts, surface the conflict and ask for a direction only when it materially affects the result.

For a genuine exception that prevents the workflow from running, name the blocked rule, explain the evidence, use the closest project-local alternative, and record the limitation. Time pressure, sunk cost, a green test suite, or confidence from memory are not genuine exceptions.

## Success Criteria

Before finishing non-trivial work, confirm:

- the correct state workflow was followed;
- binding requirements, charter, and coherent local patterns were respected;
- retrieved practices were few, relevant, and applied concretely;
- important failure paths and tests were considered;
- cross-instance invariants were enforced by atomic shared-owner operations and tested without shared process memory;
- no unrelated architecture migration was introduced;
- durable decisions or approved exceptions were recorded when required.

Success requires every applicable item above; an unverified or unexplained exception is incomplete.

## Additional Resources

- `references/establish.md`: greenfield discovery, recommendations, and charter creation.
- `references/apply.md`: daily generation, review, refactoring, and simplification.
- `references/align.md`: codebase assessment and incremental architectural alignment.
- `references/catalog.json`: generated index of attributed source principles; query through the retrieval script.
- `scripts/retrieve-guidance.mjs`: bounded local retrieval with no runtime dependencies.
- `assets/engineering-practices-template.md`: concise repository charter template.

**Always detect the state, establish the direction, and apply only the closest practices.**
