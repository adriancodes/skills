---
name: code-review
description: >
  Use when a user asks to "review this branch", "review this PR",
  "review my changes", or "review since main". Also use for pre-merge
  review, work-in-progress diffs, staged changes, suspected regressions
  in a patch, or checking implementation against a specification.
license: MIT
metadata:
  category: Quality
  summary: Reviews a pinned diff for correctness, spec compliance, and repository-standard violations with evidence-backed findings.
---

# Code Review

## Overview

**Review changed behavior, not code aesthetics.** Report a finding only when the scoped change introduces a concrete defect, violates an applicable contract, or creates a demonstrable engineering risk. Attempt to falsify every candidate finding before reporting it. No evidence means no finding.

Review is read-only by default. A request to review, assess, or inspect authorizes repository inspection and safe diagnostics, not edits. When fixes were explicitly requested, finish and report the review first, then apply only supported fixes through the repository's implementation or TDD workflow.

## When to Use

- Review a branch, pull request, commit range, patch, or work-in-progress change.
- Check whether implementation matches an issue, PRD, specification, acceptance criteria, or migration plan.
- Assess staged, unstaged, or newly added files before commit.
- Investigate whether a patch introduces correctness, security, data, concurrency, compatibility, or regression risk.
- Check changed code against documented repository standards and coherent local patterns.

## Do Not Use When

- The request asks how unchanged code works; use `understand-codebase` when installed, otherwise trace the current path read-only.
- A reported runtime failure needs root-cause discovery; use `diagnose` when installed, otherwise reproduce and isolate the failure before proposing changes.
- A finished artifact needs hostile-input verification; use `verify-work` when installed, otherwise execute adversarial fixtures against its stated promise.
- The request asks for a broad architecture assessment or refactor plan without a bounded diff; use `engineering-best-practices` when installed, otherwise assess the architecture separately.
- The task is to summarize changes or draft a pull-request description; produce that communication artifact instead of inventing review findings.

## Required Context

Establish four facts before reviewing:

- **Scope:** branch, PR, commit range, patch, or working-tree changes
- **Endpoints:** immutable base and head identities, plus whether staged, unstaged, and untracked files are included
- **Contracts:** applicable specification, repository instructions, standards, tests, and migration or compatibility promises
- **Authority:** `review-only` unless fixes were explicitly requested

Honor an explicit base. Otherwise resolve the PR target, configured upstream, or repository default branch in that order, then state the inferred base. Ask one pointed question only when multiple plausible bases produce materially different diffs. Done when the review scope, endpoints, contracts, and authority mode are written down.

## Workflow

### 1. Pin the exact change set

Resolve refs before inspecting conclusions. For committed branch work, record the merge base and review `git diff <base>...<head>`. Record `git log <base>..<head> --oneline` for intent clues, never as a substitute for the diff.

For current or work-in-progress changes, additionally inspect:

- staged changes with `git diff --cached`;
- unstaged changes with `git diff`;
- relevant untracked files from `git status --short`, read directly because Git has no diff base for them.

Capture the resolved base SHA, head SHA, worktree status, changed-file list, and exact diff commands. Reject an invalid ref. For an empty diff, report the resolved scope and stop rather than reviewing unrelated files. Done when every reviewed file belongs to one frozen, reproducible scope.

### 2. Load the governing contracts

Read binding instructions that apply to each changed path, including the nearest `AGENTS.md`, contributor guidance, coding standards, test conventions, schemas, and migration rules. Locate the originating specification in this order:

1. A user-provided path or linked issue/PR
2. Issue references in the branch or commit metadata
3. A matching specification, PRD, decision log, or ticket under repository documentation
4. Explicit acceptance criteria in the request

When no specification is available, mark the Spec lens `unavailable` and continue with Correctness and Standards. Never invent requirements from branch names or commit messages.

Treat formatter, linter, type-checker, and compiler output as diagnostic evidence. Avoid restating issues those tools already report unless the review exposes a missing enforcement path or a user-visible consequence they do not explain.

Done when each lens has named sources or an explicit `unavailable` status:

| Lens | Governing evidence |
|------|--------------------|
| Correctness | Runtime contracts, callers, tests, types, schemas, invariants |
| Spec | Issue, PRD, specification, acceptance criteria |
| Standards | Binding repository docs and coherent analogous code |

### 3. Understand the changed behavior

Read the diff, then inspect enough surrounding code to understand every changed behavior. Follow changed symbols through callers, callees, state owners, configuration, persistence, asynchronous boundaries, and externally visible outcomes. Inspect tests for the changed path and determine which important conditions they prove or omit.

Classify every changed file as behavioral code, test, configuration, schema/migration, generated/vendor/lock output, or documentation. Give extra scrutiny to trust boundaries, durable state, destructive operations, compatibility edges, concurrency, retries, error paths, and migrations.

Run focused read-only or safely isolated diagnostics when they can confirm a candidate defect. Do not install dependencies, update snapshots, regenerate outputs, or mutate external systems merely to complete a review; report the unexecuted check as residual risk instead.

Done when every changed file is classified and every behaviorally significant hunk has been traced to its affected contract and observable consequence.

### 4. Generate candidates through three lenses

Review the same frozen scope through all available lenses:

**Correctness and regression risk**

- Trace validation, authorization, state transitions, error behavior, cleanup, retries, concurrency, ordering, idempotency, compatibility, and data migration where applicable.
- Check boundary values and failure paths, not only the successful example.
- Treat a missing test as a finding only when a concrete changed behavior is both risky and unprotected; test preference alone is not a defect.

**Specification compliance**

- Identify missing, partial, or incorrectly implemented requirements.
- Identify behavior added outside the agreed scope when it creates cost, risk, or incompatibility.
- Cite the exact contract language for every Spec finding.

**Repository standards**

- Apply documented rules and coherent patterns from analogous code.
- Use `engineering-best-practices` when installed only when the request explicitly includes maintainability or architecture; otherwise apply project-local evidence directly.
- Report maintainability issues only when the diff creates a concrete defect risk or demonstrable change cost. Never manufacture findings from a generic smell checklist.

For each candidate, write the triggering condition, actual behavior, consequence, changed location, and supporting contract. Done when each available lens has been examined and every candidate has a falsifiable consequence.

### 5. Use parallel reviewers only when they earn their cost

When the harness supports subagents and the diff spans at least two independent subsystems or more than 500 non-generated changed lines, dispatch at most three independent reviewers: Correctness, Spec, and Standards. Give each the same frozen scope and only its governing sources. Ask for candidate findings, not a verdict.

For smaller diffs or harnesses without subagents, run the lenses sequentially. Parallel output never becomes a finding automatically; the primary reviewer must validate, deduplicate, and rank every candidate. Done when all reviewer output has passed the same evidence gate, regardless of execution strategy.

### 6. Falsify and rank every candidate

Attempt to disprove each candidate before reporting it:

1. Confirm the issue is introduced or materially worsened by the scoped change.
2. Read surrounding implementation, callers, tests, and configuration for a handling path that invalidates it.
3. Execute the smallest safe reproducer or focused check when feasible.
4. Confirm a realistic trigger and concrete consequence.
5. Deduplicate findings that share one root cause.

Drop candidates that are pre-existing, purely stylistic, speculative, automatically enforced, outside scope, or preference without consequence. Record unverified concerns as residual risk, not findings.

Assign the lowest defensible severity:

| Severity | Threshold |
|----------|-----------|
| **P0** | Immediate broad outage, irreversible loss, or critical security compromise |
| **P1** | Likely security, data, or core-function failure requiring merge blockage |
| **P2** | Real bounded correctness, reliability, compatibility, or significant maintenance defect |
| **P3** | Small but concrete defect with a realistic trigger; never a nitpick |

Done when every retained finding survives falsification, has one severity, and cites the changed line plus supporting evidence.

### 7. Report findings first

Sort findings by severity, then file location. Use one unified list and tag each finding with its lens or lenses so duplicate Correctness and Spec reports remain one issue.

Format each finding as:

```markdown
### [P1][Correctness, Spec] Cross-tenant export bypass: `src/export.js:3`

When an authenticated requester supplies a workspace ID it does not own, the new path calls
`store.export(workspaceId)` without checking membership. This violates the specification's
cross-tenant `404` requirement and can expose another tenant's data. Add the ownership predicate
at this boundary and cover the cross-tenant case.
```

Keep each finding to one short paragraph containing the trigger, behavior, consequence, evidence, and correction direction. Do not praise the patch, narrate the process, or bury findings under a summary.

After the findings, report:

- frozen scope and contracts reviewed;
- commands or tests actually run;
- unavailable lenses, unreviewed files, and residual risk.

If no candidate survives, lead with `No findings.` and still report coverage and residual risk. In review-only mode, stop there. If fixes were explicitly requested, move into the repository's implementation or TDD workflow after the report and re-review the resulting diff. Done when every finding is actionable and evidenced, every gap is explicit, and no unauthorized edit occurred.

## Core Example

Specification: “Export data only when the requester belongs to the workspace; return `404` for cross-tenant access.”

Scoped diff:

```diff
 export function exportWorkspace(requester, workspaceId, store) {
   if (!requester) return { status: 401 };
-  if (!requester.workspaceIds.includes(workspaceId)) return { status: 404 };
   return { status: 200, body: store.export(workspaceId) };
 }
```

Report:

> ### [P1][Correctness, Spec] Workspace export loses tenant authorization: `candidate-auth.js:3`
>
> Any authenticated requester can now export an arbitrary workspace because the changed path reaches `store.export(workspaceId)` without verifying membership. The removed condition enforced the specification's cross-tenant `404` requirement, so this change creates cross-tenant data exposure. Restore ownership enforcement at this boundary and add a cross-tenant regression test.

Do not add generic naming, abstraction, or style findings: the authorization regression is the evidence-backed review result.

## Tool Guidance

**Prefer:**

- `git rev-parse`, `git merge-base`, `git status --short`, focused `git diff`, and `git log`
- `rg --files` and `rg` for contracts, symbols, callers, and tests
- Read-only issue or PR retrieval when linked context is available
- Existing focused tests, type checks, linters, and analyzers that do not rewrite files
- Independent subagents only for genuinely substantial diffs

**Avoid:**

- Reviewing only commit messages, filenames, or the diff without surrounding code
- Whole-repository audits unrelated to the frozen scope
- Formatter, dependency, snapshot, generated-file, or external-system mutation
- Mandatory subagent use for small reviews

## Common Rationalizations

These shortcuts were exposed by auditing the existing local skill this version replaces.

| Shortcut | Reality |
|----------|---------|
| “Two independent reports can be pasted verbatim.” | Validate, deduplicate, and rank candidates before reporting them. |
| “A universal smell baseline catches maintainability issues.” | Generic smells manufacture noise; require repository evidence and concrete consequence. |
| “No base was supplied, so review must stop for a question.” | Resolve the PR target, upstream, or default branch and state the inference. |
| “Parallel agents always improve review quality.” | Parallelism adds cost and duplicates; use it only for substantial independent surfaces. |
| “No specification means the review is blocked.” | Mark that lens unavailable and continue with correctness and standards. |
| “A review request implies permission for small fixes.” | Review-only authority ends at the findings report. |

## Stop Conditions

- “This looks suspicious.”
- “The code could be cleaner.”
- “The linter will catch the important parts.”
- “The other reviewer already validated it.”
- “This probably existed before.”
- “It is only a tiny fix.”

Each thought maps to the Rationalization Table or evidence gate. Return to the unfinished workflow step.

## Success Criteria

- Pin an immutable, reproducible review scope and account for dirty worktree files when included.
- Examine Correctness, Spec, and Standards, marking unavailable lenses explicitly.
- Trace every behaviorally significant hunk through enough context to establish its consequence.
- Report only defects introduced or worsened by the scoped change.
- Make every finding survive falsification and include severity, lens, changed location, trigger, consequence, and evidence.
- Remove duplicates, generic smells, nitpicks, tooling restatements, and unsupported speculation.
- Preserve review-only authority and leave files and external systems unchanged.
- Report honest coverage and residual risk even when no findings survive.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Reviewing `base..HEAD` without confirming intent | Resolve the merge base and use the frozen comparison the review actually promises. |
| Ignoring staged, unstaged, or untracked work | State whether each category is in scope and inspect included files separately. |
| Treating the diff as complete context | Follow changed symbols into callers, state owners, tests, and configuration. |
| Reporting missing tests as defects by default | Name the concrete unprotected behavior and consequence or leave it as residual risk. |
| Reporting a pre-existing issue | Drop it unless the scoped change materially worsens it. |
| Trusting subagent output | Reproduce or trace each candidate through the primary evidence gate. |
| Returning a review summary before findings | Lead with findings or `No findings.` |

## Failure Modes

- **Invalid or unavailable base:** Report the failed ref resolution and ask for one valid fixed point; do not guess across materially different histories.
- **Diff too large for complete review:** Split by independent subsystem or commit range, state the completed partitions, and name every unreviewed partition. Never sample silently.
- **Specification unavailable:** Continue with other lenses and avoid spec-completeness claims.
- **External issue or PR inaccessible:** Ask for pasted acceptance criteria only when Spec coverage is required; otherwise mark the lens unavailable.
- **Generated or binary change:** Review its source and generation contract when available; mark opaque output as residual risk.
- **Diagnostics would mutate state:** Skip them, use read-only evidence, and report the unexecuted check.
- **Conflicting standards:** Cite the conflict and apply the more local binding instruction; ask only when precedence remains ambiguous.

## Genuine Exceptions

When complete review is genuinely impossible, name the blocked lens or scope, show the evidence establishing the block, review every unaffected part, and state the weaker conclusion. Time pressure, diff size, absent subagents, sunk cost, and an expectation of “just a quick look” do not justify silent sampling or unsupported findings.

## Summary

Review the pinned change, falsify every candidate, and report only evidence-backed findings. In review-only mode, stop without editing.
