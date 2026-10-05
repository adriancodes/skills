Apply the supplied instructions to the user request. Work only inside /var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/skill-quality-pilot-n7EORZ. Do not use external services, install dependencies, or delegate. Do not inspect other evaluation results or the parent repository. Do not invent user replies. Stop if a real user decision is needed.

Instructions:
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

Delete unjustified concepts while preserving observable behavior. Prefer a direct implementation over fewer characters.

## Scope

Use for explicit requests to simplify working code, remove duplication, or eliminate shallow wrappers and speculative abstractions.

Simplification authorizes local edits and meaningful verification within the requested scope. Preserve public APIs, persisted formats, errors, and meaningful performance characteristics unless the user authorizes their change.

Use `diagnose`, when installed, for unknown failures; otherwise establish the cause first. Use `code-review`, when installed, for read-only assessment. Handle new behavior through the project's implementation workflow. Broad architectural redesign needs a separate scope.

## Workflow

1. **Pin the contracts.** Read repository instructions, the requested code, callers, tests, and current diff. Preserve user-authored work. Identify exports, outputs, error behavior, mutation, and persistence that callers rely on.

   When behavior tests are absent, disclose the gap. Characterize the relevant behavior before editing using existing tools. Add local checks when they meaningfully protect this cleanup. Honor an explicit no-test or no-write restriction; use inline probes where allowed.

   Ask before installing tooling, crossing scope, or selecting an ambiguous behavior contract. Continue unaffected cleanup while a separate decision is pending.

   Done when the cleanup has a known boundary and a preservation check or explicit evidence limit.

2. **Find deletions that earn their keep.** Check references and runtime paths before removing code. Target dead paths, duplicate behavior, pass-through wrappers, single-use machinery, and obsolete supporting artifacts.

   Keep abstractions that own an invariant or isolate actual variation. Reject changes that hide behavior, obscure names, or relocate complexity.

   Done when each proposed removal has evidence beyond line count.

3. **Apply the reduction.** Delete dead code, inline shallow indirection, collapse equivalent branches, and reuse existing primitives. Remove newly unused artifacts only within the authorized scope.

   Keep error order, side effects, return shapes, and boundary values intact. Ask before an unrequested contract change. For generated output, change its source or generator instead.

   Done when the scoped reduction is coherent and no reference dangles.

4. **Prove preservation.** Run the same characterization checks after editing. Run existing focused tests and affected type, lint, build, or integration checks. Inspect the diff for contract drift and unrelated changes.

   Separate tested behavior from static reasoning. Name missing evidence instead of claiming full preservation from inspection.

   Done when checks pass and each material contract has evidence or a named limitation.

## Example

A factory constructs a one-use class whose only method normalizes an email and checks a list. After confirming no caller imports the class or factory, preserve the public function and replace the machinery with:

```js
import assert from "node:assert/strict";

export function isBlockedEmail(email, blockedEmails) {
  const normalize = value => String(value).trim().toLowerCase();
  const blocked = new Set(blockedEmails.map(normalize));
  return blocked.has(normalize(email));
}

assert.equal(isBlockedEmail(" X@Example.com ", ["x@example.com"]), true);
assert.equal(isBlockedEmail("y@example.com", ["x@example.com"]), false);
```

Run the checks before and after the change. Preserve any additional mutation or performance contract revealed by callers; this example is not permission to change it.

## Verification

Report the concrete reduction, changed files, executed checks, and evidence limits. Every edit must preserve the authorized contracts and reduce concepts without making the result harder to read.

Delete before abstracting. Stop where further reduction would change a contract or reduce clarity.


Supporting references for this skill, if requested by its body: /Users/adrian/dev/skills/evals/pocock-comparison-2026-10-04/results/revised-simplify/subject. Other skills are unavailable in this evaluation; use the supplied skill's standalone fallback. The issue tracker, if a tracker is needed, is local Markdown under docs/specs/; no external services are authorized.


User request:
Simplify src/legacy-flags.js directly. Preserve its documented export, output order, strict boolean check, and error behavior. Finish and verify the cleanup using the project's existing Node tooling. Do not change package.json or add dependencies.