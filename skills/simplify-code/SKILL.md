---
name: simplify-code
description: >
  Use when the user asks to "simplify this code", "remove the fluff",
  or wants bloated, superfluous, duplicated,
  over-abstracted, or dependency-heavy code reduced without changing behavior.
license: MIT
metadata:
  category: Quality
  summary: Condenses scoped code by deleting unjustified concepts while preserving maintainability and observable contracts.
---

# Simplify Code

## Overview

**Condense code without changing observable contracts.** Delete before abstracting: remove unjustified code and concepts while keeping the result direct and maintainable.

Treat simplification intent as authority to edit the requested scope. Ask before expanding it or changing a public API, persisted format, error behavior, or meaningful performance characteristic unless expressly authorized.

## Scope

Use when:

- The user asks to simplify, condense, remove fluff, or reduce complexity.
- Code contains dead paths, duplication, shallow wrappers, speculative abstractions, or redundant supporting artifacts.

Do not use when:

- New behavior is required; use `tdd` when installed, otherwise implement through the repository's behavior-change workflow.
- A failure's cause is unknown; use `diagnose`.
- The request is read-only review; use `code-review`.
- The goal is architecture direction or codebase-wide realignment; use `engineering-best-practices`.
- A finished change needs adversarial validation; use `verify-work`.

## Required Context

Read binding instructions, requested files, callers, dependencies, the diff, and tests. Identify exported interfaces, persisted formats, errors, and performance contracts.

When tests are absent, disclose the gap and offer characterization tests. Generate none without approval. Continue only when repository evidence makes behavior concrete. Done when scope, contracts, checks, and ownership are explicit.

## Workflow

### 1. Pin the boundary

Define the boundary and contracts. Preserve user-authored work. Ask before changing a contract or crossing the boundary. Done when every proposed edit is in scope and every contract is named or absent.

### 2. Build a deletion ledger

Inspect references and runtime paths. Record removal evidence for each candidate: unreachable use, duplication, pass-through wrapper, single-use abstraction, unnecessary branch, replaceable dependency, stale comment, or duplicate behavior test. Prefer fewer concepts over fewer characters.

Reject candidates that relocate complexity, hide behavior, compress names, or use clever syntax. Done when every candidate has evidence beyond line count.

### 3. Apply the smallest coherent reduction

Edit directly. Delete dead code, inline shallow indirection, collapse equivalent branches, use existing primitives, and remove newly unused artifacts. Retain domain names and abstractions that own an invariant or isolate volatility.

Keep the patch behavior-preserving and scoped. Present contract changes or broader redesigns separately for approval. Done when no evidenced candidate remains, no unjustified replacement abstraction appears, and no reference dangles.

### 4. Prove preservation

Run focused tests, then affected type, lint, build, or integration checks. Compare contractual exports, outputs, errors, bytes, and performance. Inspect the diff for behavior changes and unrelated cleanup.

When tests remain absent, run the strongest static and executable checks and label the evidence weaker. Claim no more than the checks prove. Done when every contract has evidence or an explicit limitation.

### 5. Report the reduction

Lead with the outcome. Report changed files, checks, and reductions in lines, branches, abstractions, configuration, or dependencies. Done when measurements are separate from judgment and every evidence gap is named.

## Core Example

Replace a one-use class and factory with the public function callers need:

```js
import assert from "node:assert/strict";

const normalize = (value) => String(value).trim().toLowerCase();

export function isBlockedEmail(email, blockedEmails) {
  // Keep normalization at the public comparison boundary.
  const blocked = new Set(blockedEmails.map(normalize));
  return blocked.has(normalize(email));
}

assert.equal(isBlockedEmail(" X@Example.com ", ["x@example.com"]), true);
assert.equal(isBlockedEmail("y@example.com", ["x@example.com"]), false);
```

Run with `node blocked-email.mjs`. Preserve the export and results; delete the factory and class only after confirming no caller imports them. This removes concepts without compressing names.

## Success Criteria

- Observable contracts and user-authored work remain unchanged unless explicitly authorized.
- Every edit stays inside the approved scope.
- Unjustified concepts or artifacts are measurably reduced.
- The implementation remains direct and maintainable rather than clever.
- Available checks pass; missing evidence and reductions are reported.

## Quick Reference

| Signal | Action |
|--------|--------|
| Dead path or shallow wrapper | Delete or inline after checking references. |
| Contract or scope pressure | Preserve it or ask for approval. |
| Missing tests | Disclose the gap and offer characterization tests. |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Optimizing line count | Reduce concepts and coupling; keep explanatory structure and names. |
| Mixing a behavior change into cleanup | Preserve the contract and request separate approval for the change. |

## Failure Modes

- **Unknown failure:** Stop simplification and diagnose the cause first.
- **Ambiguous contract:** Ask for the expected behavior before editing that path.
- **Missing tests:** Disclose the gap and offer characterization tests; create none without approval.
- **Contract or scope change required:** Explain the effect and wait for approval.
- **Generated code:** Simplify the source or generator instead of derived output.
- **Maintainability loss:** Keep the clearer form and explain why condensation stopped.

## Summary

Delete before abstracting, preserve observable contracts, and ask before changing behavior or scope. A smaller diff is successful only when the resulting code is also direct and maintainable.
