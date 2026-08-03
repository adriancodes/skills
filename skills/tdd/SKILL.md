---
name: tdd
description: >
  Use when implementing a feature, fixing a known bug, changing application
  behavior, or altering stored, transformed, migrated, serialized, or externally
  transmitted data. Also use when a user says "use TDD", "test first",
  "red-green-refactor", or "add this behavior", and when code is being written
  before a failing test.
license: MIT
metadata:
  category: Building
  summary: Enforces observable red-green-refactor cycles through stable behavior seams, with real data-boundary evidence.
---

# Test-Driven Development

## Overview

**No new production implementation before an observed, behaviorally valid red test.** Work one *red-green-refactor* tracer bullet at a time: prove the test detects the missing behavior, write the smallest code that turns it green, then improve structure without changing behavior.

A test written after implementation that passes on first run proves no causal link between test and change; step 1 restores the ordering.

## When to Use

- Implement a new user- or caller-visible behavior.
- Fix a bug whose cause and desired behavior are known.
- Change an API, workflow, validation rule, state transition, or integration contract.
- Alter stored, transformed, migrated, serialized, or externally transmitted data.
- Add behavior to a legacy path that needs a reliable regression seam.
- Resume work where production code appears before a failing test.

## Do Not Use When

- The bug's cause is unknown; use `diagnose` when installed, otherwise reproduce and establish the cause first.
- A recorded task is being implemented; use `implement-task` as the outer workflow and apply this skill at its test seam.
- A finished artifact needs adversarial verification; use `verify-work` when installed, otherwise attack the completed behavior separately.
- The change affects only documentation, generated output, formatting, or a purely mechanical rename with no behavior or data effect.
- The work is an explicitly throwaway prototype; if it will ship or become a reference implementation, restart it under TDD.
- An operational rollback or feature-flag containment must restore service immediately; contain first, then use TDD for the permanent fix.

## Required Context

Establish:

- The requested observable behavior and its source of truth
- The repository's instructions, test framework, focused command, and affected-suite command
- Current worktree state, including which edits belong to the agent's task
- The narrowest stable public seam that can prove the behavior
- Any real data, persistence, serialization, migration, retry, or external-adapter boundary

Use the existing test framework and conventions; do not install or replace a framework without authorization. Ask one pointed question only when the expected behavior or correct seam cannot be safely inferred. Done when one behavior, one seam, one red command, and the authority and worktree boundaries are explicit.

## Workflow

### 1. Restore red-first ordering

Inspect the diff before writing a test. If the agent added production code for the active behavior without observing red, revert only those known agent-authored hunks — do not comment the code out, copy it into notes, or consult it while designing the test. If authorship is ambiguous, preserve the code and ask before reverting.

Existing production code is not a violation when fixing a bug or extending legacy behavior; test that behavior directly and make the new expectation red.

Done when no agent-authored implementation for the active behavior precedes its test and all pre-existing and user-authored work is preserved.

### 2. Select one behavioral tracer bullet

Choose the narrowest stable public seam that proves one requested behavior: a unit seam for pure logic, an integration seam for real component boundaries, end-to-end only when smaller tests cannot represent the behavior. Test public outcomes, not private methods, internal call counts, or incidental structure.

Write one cycle at a time rather than drafting a whole suite before learning from the first implementation. Derive expected values independently — from the specification, worked examples, or known literals — never by recomputing them with the algorithm under test.

For legacy code without a meaningful seam:

1. Add a characterization test for current observable behavior.
2. Keep it green while making the smallest behavior-preserving refactor that creates a stable seam.
3. Write the new behavior test at that seam and observe red.

If no meaningful seam can be created safely, stop and explain the architectural blocker rather than adding a shallow test that proves nothing. Done when the test statement names the observable behavior and the seam can fail specifically when that behavior is absent.

### 3. Write and prove red

Write the smallest test that expresses the active behavior, including the boundary and failure case that define it when both belong to one contract. Run the narrowest command and capture its output.

Red is valid only when the assertion fails because the requested behavior is missing or wrong. Syntax errors, import failures, missing dependencies, broken fixtures, timeouts unrelated to the behavior, manual throws, skipped tests, and unrelated failures do not count. Repair test setup, without changing production behavior, until the test fails for the expected reason.

If the test passes on first run, determine whether the behavior already exists or the test is insensitive; strengthen or correct it from the contract, never by introducing a production defect to force red.

Done when the exact focused command has run and its captured failure identifies the expected missing behavior.

### 4. Make the smallest green change

Write only enough production code to satisfy the red test, running the focused command after each small change. Avoid speculative options, generalized abstractions, adjacent cleanup, and behavior for tests not yet written.

Preserve the test's behavior contract: never weaken an assertion, relax input, update a snapshot blindly, mark the test skipped, or redefine expected behavior to manufacture green. If the requirement appears wrong, stop for confirmation before changing the expectation, then re-establish valid red against the corrected contract.

Done when the same focused command is green because production behavior now satisfies the unchanged test.

### 5. Refactor while green

Improve names, duplication, boundaries, or structure only after green, keeping behavior fixed and running the focused test after each step. Revert a refactor that breaks green before attempting another.

Do not mix new behavior into refactoring; start it as a new red-green-refactor cycle. Done when the code is as simple as the demonstrated behavior permits and the focused test remains green.

### 6. Repeat vertically

Pick the next smallest behavior or boundary case informed by the completed cycle and repeat red, green, refactor. Keep every test independently meaningful; retain only tests that protect observable contracts.

Done when every requested behavior and material boundary case has completed its own observed red-green-refactor cycle.

### 7. Verify and report evidence

Run, in order:

1. Every new or changed focused test
2. The affected package or subsystem suite
3. The full repository suite when proportionate and available

Inspect the final diff for weakened assertions, skipped or focused-only tests, accidental snapshot changes, unrelated implementation, and temporary fixtures. For data-changing paths, also run every applicable contract check from the Data Boundary Rules.

Report the red command and decisive failure, green command and result, affected-suite result, full-suite result or the explicit reason it was not run, and files changed. Do not create a separate TDD report. Done when the evidence is reproducible, the final diff is scoped, and every unrun check is named.

## Data Boundary Rules

A valid test must exercise the closest real boundary that proves the data contract:

| Path | Required evidence |
|------|-------------------|
| Pure transformation | Representative input/output unit test, including boundary values |
| Database write | Integration test against an isolated test database or transaction |
| Migration | Representative before/after fixture; rollback when supported |
| Retried job or upsert | Duplicate execution proves no corruption or unintended duplication |
| Serialization or file output | Write, read back, and validate the emitted representation |
| External service | Faithful fake or contract-tested adapter; never production |

Mocks may isolate nondeterministic external boundaries, time, or randomness, but alone they never prove stored, migrated, serialized, or transmitted data is correct. Do not mock internal collaborators merely to assert calls; test the public outcome.

## Core Example

Request: “Add free shipping for subtotals of 5,000 cents or more.”

Write the public-boundary test first:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { qualifiesForFreeShipping } from "../src/shipping.js";

test("free shipping begins at 5,000 cents", () => {
  assert.equal(qualifiesForFreeShipping(4_999), false);
  assert.equal(qualifiesForFreeShipping(5_000), true);
});
```

Run `node --test test/shipping.test.js` and capture the expected failure at `5_000`. Then implement only:

```js
export const qualifiesForFreeShipping = (subtotalCents) => subtotalCents >= 5_000;
```

Run the same command green, refactor only if needed, then run the affected suite. Writing the comparator first and adding a test that passes immediately is forbidden: no red evidence connects the test to the behavior.

## Tool Guidance

**Prefer:**

- Existing repository test commands with the narrowest available selector
- Public APIs, isolated integration environments, representative fixtures, and faithful boundary fakes
- `git status` and focused diffs to preserve user work and prove red-first ordering
- Deterministic control of time, randomness, filesystem, network, and concurrency

**Avoid:**

- Installing a new test framework when the repository already has one
- Snapshot updates without inspecting the semantic change
- Live production dependencies in tests
- Broad suites as the only red signal

## Common Rationalizations

Sourced from the repository's test-first baseline evidence and the local TDD skill audit.

| Shortcut | Reality |
|----------|---------|
| “The implementation is tiny; I will test it afterward.” | A first-run green test never proved sensitivity to the missing behavior. |
| “Existing tests are already green.” | Existing tests do not encode the newly requested contract. |
| “The test failed, so red is satisfied.” | Red counts only when the expected behavioral assertion fails. |
| “Mocking the database is enough for this data change.” | A mock verifies setup, not the real persistence contract. |
| “The code is already written, so reverting wastes time.” | Revert only the agent's premature work and restore causal red-green evidence. |
| “I can refactor while making it pass.” | Reach minimal green first; refactor as a separately verified step. |
| “The assertion is too strict; relaxing it is equivalent.” | The contract, not implementation convenience, controls the expectation. |

## Stop Conditions

- “Tests can come after this small part.”
- “It passes, so the test is fine.”
- “Any failure counts as red.”
- “This mock is close enough to the database.”
- “Keep the implementation nearby as reference.”
- “Update the snapshot and inspect it later.”

Each thought maps to the Rationalization Table; return to the unfinished workflow step.

## Success Criteria

- Every production behavior change follows an observed, behaviorally valid red test.
- Any premature agent-authored implementation is reverted without touching user-authored work.
- Tests exercise the narrowest stable public seam and use independent expected values.
- Data-changing paths prove their closest real boundary; mocks are not the sole evidence.
- Each cycle reaches minimal green before behavior-preserving refactoring.
- No assertion, fixture, snapshot, or requirement is weakened to manufacture green.
- Focused and affected suites pass; full-suite omissions are explicit.
- Final evidence names the red, green, and verification commands and results.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Writing several tests before any implementation | Complete one vertical red-green-refactor tracer bullet at a time. |
| Testing private methods or internal calls | Move the test to a stable public behavior seam. |
| Treating setup failure as red | Repair the harness until the behavioral assertion fails. |
| Recomputing the expected value | Use a specification-derived literal or independent oracle. |
| Using only mocks for a data effect | Exercise the real isolated persistence or serialization boundary. |
| Refactoring before green | Restore minimal green, then refactor with repeated green runs. |
| Running only the focused test before completion | Run the affected suite and state whether the full suite ran. |

## Failure Modes

- **Expected behavior is ambiguous:** Stop and obtain one concrete example or acceptance decision before writing the test.
- **No meaningful test seam:** Characterize current behavior and create the smallest behavior-preserving seam; stop with the blocker when that cannot be done safely.
- **Premature code ownership is unclear:** Preserve the work and ask before reverting; never guess that a hunk belongs to the agent.
- **Test framework is missing or broken:** Report the failing setup evidence and request authorization before installing or replacing tooling.
- **Real data boundary is unavailable:** Use the closest faithful isolated substitute and state the weaker claim; never imply a mock proved persistence.
- **Full suite is prohibitively large or unavailable:** Run focused and affected suites, name the omitted command, and report the residual risk.
- **Emergency containment:** Restore service through the authorized operational path, then begin the permanent fix with a regression test.

## Genuine Exceptions

When a rule is genuinely impossible, name the blocked rule, show the evidence, use the closest safe alternative, and state the weaker conclusion. Time pressure, tiny implementation size, sunk cost, a green existing suite, and a request to “just code it” do not make red-first impossible.

## Summary

Observe red before production code, reach minimal green, and refactor only while green. Never weaken the contract, and never use mocks alone to prove a data effect.
