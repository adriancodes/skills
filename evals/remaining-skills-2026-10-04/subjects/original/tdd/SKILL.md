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

**No new production behavior before an observed, behaviorally valid red test.** Work one *red-green-refactor* tracer bullet at a time. Prove the test detects missing behavior. Write the smallest green change. Refactor only while green.

## Scope

Use for:

- New caller- or user-visible behavior.
- Known bug fixes.
- API, validation, workflow, or state changes.
- Stored, transformed, migrated, serialized, or transmitted data.
- Legacy behavior that needs a stable test seam.
- Work where agent-authored production code appeared before red.

Do not use for:

- Unknown root causes. Diagnose first.
- Documentation, formatting, generated output, or mechanical renames with no behavior effect.
- Immediate incident containment. Restore service first; test-drive the permanent fix.
- Throwaway prototypes. Restart under TDD before shipping or using one as a reference implementation.

When another workflow owns the task, use TDD at its implementation seam. Use separate adversarial verification after implementation.

## Required Context

Establish:

- One requested observable behavior and its source of truth.
- Repository instructions and current worktree ownership.
- The existing test framework, focused command, and affected-suite command.
- The narrowest stable public seam.
- Any real persistence, serialization, migration, retry, or external boundary.

Use existing test tools and conventions. Ask one question only when behavior or the correct seam cannot be inferred safely.

Done when one behavior, one seam, one red command, and worktree authority are explicit.

## Workflow

### 1. Restore red-first order

Inspect the diff. If the agent wrote production code for the active behavior before red, revert only those known agent-authored hunks. Never comment them out, copy them into notes, or consult them while designing the test.

Preserve pre-existing and user-authored work. Ask before reverting when authorship is ambiguous. Existing legacy code is not a violation; test its new expectation directly.

Done when no agent-authored implementation for the active behavior precedes its test.

### 2. Choose one tracer bullet

Test one observable behavior through the narrowest stable public seam. Use a unit seam for pure logic. Use an integration seam for real boundaries. Use end-to-end only when smaller tests cannot represent the contract.

Assert public outcomes. Never assert private methods, incidental call counts, or an expected value calculated by the algorithm under test.

For legacy code without a stable seam:

1. Characterize current observable behavior.
2. Keep that test green while creating the smallest behavior-preserving seam.
3. Write the new behavior test at that seam.

Stop when no meaningful seam can be created safely. A shallow test that cannot catch the defect is not progress.

Done when the test names one behavior and can fail specifically when that behavior is absent.

### 3. Prove valid red

Write the smallest test for the active behavior. Include a boundary or failure case when it defines the same contract. Run the focused command and capture its output.

Red counts only when the behavioral assertion fails for the expected reason. Syntax errors, imports, missing dependencies, broken fixtures, unrelated timeouts, manual throws, skips, and unrelated failures do not count. Repair setup without changing production behavior until the right assertion fails.

If the test passes first, check whether behavior already exists or the test is insensitive. Strengthen the test from the contract. Never break production code to manufacture red.

Done when the focused command's captured failure identifies the missing behavior.

### 4. Make the smallest green change

Write only enough production code to satisfy the red test. Run the same focused command after each small change. Add no speculative options, abstractions, adjacent cleanup, or unrequested behavior.

Keep the test contract fixed. Never weaken assertions, relax input, blindly update snapshots, skip tests, or redefine the requirement to manufacture green. Stop for confirmation when the requirement appears wrong, then re-establish valid red.

Done when the unchanged test is green because production behavior satisfies it.

### 5. Refactor while green

Improve names, duplication, boundaries, or structure only after green. Run the focused test after each refactor. Revert a refactor that breaks it.

Start every new behavior as a new red-green-refactor cycle. Pick the next smallest requested behavior or boundary case and repeat from step 2. Keep only tests that protect observable contracts.

Done when the code is as simple as the proven behavior permits and the test remains green.

### 6. Prove real data boundaries

Exercise the closest real boundary that proves the contract:

| Path | Evidence |
|---|---|
| Pure transformation | Representative inputs, outputs, and boundary values |
| Database write | Isolated test database or transaction |
| Migration | Before/after fixture; rollback when supported |
| Retry or upsert | Duplicate execution without corruption or unintended duplication |
| Serialization or file output | Write, read back, and validate bytes or representation |
| External service | Faithful fake or contract-tested adapter; never production |

Mocks may isolate nondeterministic external systems, time, or randomness. Mocks alone never prove stored, migrated, serialized, or transmitted data. Test public results instead of internal collaborator calls.

Done when every changed data contract has evidence at its closest real boundary.

### 7. Verify and report

Run:

1. Every new or changed focused test.
2. The affected package or subsystem suite.
3. The full repository suite when proportionate and available.

Inspect the diff for weakened assertions, skipped or focused-only tests, blind snapshot updates, unrelated code, and temporary fixtures.

Report the red command and decisive failure. Report the green command and result. Report affected and full-suite results, or why a suite was not run. Name changed files.

Follow the discipline silently while working. Deliver evidence, not a TDD lecture.

Done when every requested behavior and material boundary case completed its own observed cycle, the evidence is reproducible, the diff is scoped, and every unrun check is named.

## Core Example

Request: “Add free shipping for subtotals of 5,000 cents or more.”

Write the boundary test first:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { qualifiesForFreeShipping } from "../src/shipping.js";

test("free shipping begins at 5,000 cents", () => {
  assert.equal(qualifiesForFreeShipping(4_999), false);
  assert.equal(qualifiesForFreeShipping(5_000), true);
});
```

Run `node --test test/shipping.test.js`. Capture the expected failure at `5_000`. Then implement only:

```js
export const qualifiesForFreeShipping = (subtotalCents) => subtotalCents >= 5_000;
```

Run the same command green, then the affected suite. A comparator written first followed by a first-run-green test has no red evidence and fails this workflow.

## Common Rationalizations

| Shortcut | Reality |
|---|---|
| “The implementation is tiny; test afterward.” | First-run green does not prove sensitivity to missing behavior. |
| “Existing tests are green.” | They do not encode the new contract. |
| “The test failed, so red counts.” | Only the expected behavioral assertion counts. |
| “A database mock is enough.” | A mock does not prove persistence. |
| “Reverting code wastes time.” | Restore causal evidence by reverting only premature agent work. |
| “Refactor while making it pass.” | Reach minimal green first. |
| “Relaxing the assertion is equivalent.” | The contract controls the expectation. |

## Red Flags

- “Tests can come after this small part.”
- “Any failure counts as red.”
- “Keep the implementation nearby as reference.”
- “Update the snapshot and inspect it later.”
- “This mock is close enough to the real boundary.”
- “The deadline overrides test order.”

Return to the unfinished workflow step when any red flag appears.

## Genuine Exceptions

When a rule is genuinely impossible, name the blocked rule and show the evidence. Use the closest safe alternative and state the weaker conclusion. A missing or broken test framework needs reported evidence and authorization before installing or replacing tooling. An unavailable real data boundary takes the closest faithful substitute; never imply a mock proved persistence. Time pressure, tiny size, sunk cost, a green existing suite, and "just code it" never qualify.

## Verification

- Every production behavior follows an observed, valid red test.
- Premature agent work is reverted without touching user work.
- Tests use stable public seams and independent expectations.
- Data changes prove their closest real boundary.
- Every cycle reaches minimal green before refactoring.
- No test or requirement is weakened to manufacture green.
- Focused and affected suites pass; full-suite omissions are explicit.
- Final evidence names red, green, and verification commands.

No new production behavior before valid red. Restore the order whenever it breaks.
