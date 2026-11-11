---
name: code-review
description: >
  Use when a user asks to "review this branch", "review this PR",
  "review my changes", or "review since main". Also use when asked
  whether a branch, PR, or diff is ready to merge or ship, and for
  work-in-progress diffs, staged changes, suspected regressions in a
  patch, or checking implementation against a specification.
license: MIT
metadata:
  category: Quality
  summary: Reviews a pinned diff for correctness, spec compliance, and repository-standard violations with evidence-backed findings.
---

# Code Review

**Review changed behavior, not code aesthetics.** Report a finding only when the scoped change introduces a concrete defect, violates an applicable contract, or creates demonstrable engineering risk. Attempt to falsify every candidate before reporting it; no evidence means no finding.

Review is read-only by default: a request to review, assess, or inspect authorizes repository inspection and safe diagnostics, not edits. Explicitly requested fixes follow the completed report, never precede it.

## Scope

Use for a bounded branch, PR, commit, patch, or worktree review against actual contracts.

Do not use when:

- The request asks how unchanged code works; use `understand-codebase` when installed, otherwise trace the current path read-only.
- A reported runtime failure needs root-cause discovery; use `diagnose` when installed, otherwise reproduce and isolate it before proposing changes.
- A finished, runnable artifact needs executed hostile-input attacks; use `verify-work` when installed, otherwise execute adversarial fixtures against its stated promise. This skill reads a diff against contracts.
- Working code needs reducing, not assessing; use `simplify-code` when installed, otherwise simplify it under the project's implementation workflow.
- The request is a broad architecture assessment or refactor plan without a bounded diff; use `engineering-best-practices` when installed, otherwise assess the architecture separately.
- The task is to summarize changes or draft a pull-request description; use `prepare-pr` when installed, otherwise write that artifact instead of inventing review findings.

## Required Context

Establish four facts before reviewing:

- **Scope:** branch, PR, commit range, patch, or working-tree changes
- **Endpoints:** immutable base and head identities, plus whether staged, unstaged, and untracked files are included
- **Contracts:** applicable specification, repository instructions, standards, tests, and migration or compatibility promises
- **Authority:** `review-only` unless fixes were explicitly requested

Honor an explicit base; otherwise resolve the PR target, configured upstream, or repository default branch, in that order, and state the inferred base. Ask one pointed question only when plausible bases produce materially different diffs. Done when scope, endpoints, contracts, and authority mode are written down.

## Workflow

### 1. Pin the exact change set

For committed branch work, record the merge base and review `git diff <base>...<head>`. Record `git log <base>..<head> --oneline` for intent clues, never as a diff substitute.

For work-in-progress changes, also inspect:

- staged changes with `git diff --cached`;
- unstaged changes with `git diff`;
- relevant untracked files from `git status --short`, read directly because Git has no diff base for them.

Capture the resolved base SHA, head SHA, worktree status, changed-file list, and exact diff commands. Reject an invalid ref. On an empty diff, report the resolved scope and stop; never review unrelated files. Done when every reviewed file belongs to one frozen, reproducible scope.

### 2. Load the governing contracts

Read the binding instructions for each changed path — the nearest `AGENTS.md`, contributor guidance, coding standards, test conventions, schemas, and migration rules — then locate the originating specification in this order:

1. A user-provided path or linked issue/PR
2. Issue references in the branch or commit metadata
3. A matching specification, PRD, decision log, or ticket under repository documentation
4. Explicit acceptance criteria in the request

If none is available, mark the Spec lens `unavailable` and continue with Correctness and Standards. Never invent requirements from branch names or commit messages.

Treat formatter, linter, type-checker, and compiler output as diagnostic evidence; restate their issues only when the review exposes a missing enforcement path or a user-visible consequence they do not explain.

Done when each lens has named sources or an explicit `unavailable` status:

| Lens | Governing evidence |
|------|--------------------|
| Correctness | Runtime contracts, callers, tests, types, schemas, invariants |
| Spec | Issue, PRD, specification, acceptance criteria |
| Standards | Binding repository docs and coherent analogous code |

### 3. Understand the changed behavior

Read the diff, then enough surrounding code to understand every changed behavior. Follow changed symbols through callers, callees, state owners, configuration, persistence, asynchronous boundaries, and externally visible outcomes. Check which important conditions the changed path's tests prove or omit.

Classify every changed file as behavioral code, test, configuration, schema/migration, generated/vendor/lock output, or documentation, giving extra scrutiny to trust boundaries, durable state, destructive operations, compatibility edges, concurrency, retries, error paths, and migrations.

Run focused read-only or safely isolated diagnostics when they can confirm a candidate defect. Never install dependencies, update snapshots, regenerate outputs, or mutate external systems to complete a review; report the unexecuted check as residual risk.

Done when every changed file is classified and every behaviorally significant hunk is traced to its contract and observable consequence.

### 4. Generate candidates through three lenses

Review the same frozen scope through all available lenses:

**Correctness and regression risk**

- Trace validation, authorization, state transitions, error behavior, cleanup, retries, concurrency, ordering, idempotency, compatibility, and data migration where applicable.
- Check boundary values and failure paths, not only the happy path.
- Treat a missing test as a finding only when a concrete changed behavior is both risky and unprotected; test preference alone is not a defect.

**Specification compliance**

- Identify missing, partial, or incorrectly implemented requirements.
- Flag additions outside the agreed scope that create cost, risk, or incompatibility.
- Cite the exact contract language for every Spec finding.

**Repository standards**

- Apply documented rules and coherent patterns from analogous code.
- When the request explicitly includes maintainability or architecture, use `engineering-best-practices` if installed; otherwise apply project-local evidence directly.
- Report maintainability issues only when the diff creates a concrete defect risk or demonstrable change cost. Never manufacture findings from a generic smell checklist.

For each candidate, record the trigger, actual behavior, consequence, changed location, and supporting contract. Done when every available lens is examined and every candidate has a falsifiable consequence.

### 5. Use parallel reviewers only when they earn their cost

When the harness supports subagents and the diff spans at least two independent subsystems or more than 500 non-generated changed lines, dispatch at most three reviewers: Correctness, Spec, and Standards. Give each the same frozen scope and only its governing sources. Ask for candidate findings, not a verdict.

For smaller diffs or harnesses without subagents, run the lenses sequentially. Parallel output never becomes a finding automatically; the primary reviewer must validate, deduplicate, and rank every candidate. Done when all reviewer output passes the same evidence gate.

### 6. Falsify and rank every candidate

Attempt to disprove each candidate before reporting it:

1. Confirm the scoped change introduces or materially worsens the issue.
2. Read surrounding implementation, callers, tests, and configuration for a handling path that invalidates it.
3. Execute the smallest safe reproducer or focused check when feasible.
4. Confirm a realistic trigger and concrete consequence.
5. Deduplicate findings that share one root cause.

Drop candidates that are pre-existing, purely stylistic, speculative, automatically enforced, outside scope, or preference without consequence. Record unverified concerns as residual risk, not findings. Read [references/examples.md](references/examples.md) when unsure whether a candidate is a finding, residual risk, or nothing.

Assign the lowest defensible severity:

| Severity | Threshold |
|----------|-----------|
| **P0** | Immediate broad outage, irreversible loss, or critical security compromise |
| **P1** | Likely security, data, or core-function failure requiring merge blockage |
| **P2** | Real bounded correctness, reliability, compatibility, or significant maintenance defect |
| **P3** | Small but concrete defect with a realistic trigger; never a nitpick |

Done when every retained finding survives falsification, has one severity, and cites the changed line plus supporting evidence.

### 7. Report findings first

Sort findings by severity, then file location, in one unified list; tag each with its lens or lenses so duplicate Correctness and Spec reports remain one issue.

Format each finding as:

```markdown
### [P2][Correctness] Retry repeats an accepted charge: `src/billing/charge.js:41`

When the gateway accepts a charge but the response times out, the new retry loop calls
`gateway.charge(order)` again without the idempotency key that `refund.js:18` passes. The
customer is charged twice. Pass `order.id` as the idempotency key and cover the
timeout-then-success case.
```

Keep each finding to one short paragraph with the trigger, behavior, consequence, evidence, and correction direction. Do not praise the patch, narrate the process, or bury findings under a summary.

After the findings, report:

- frozen scope and contracts reviewed;
- commands or tests run;
- unavailable lenses, unreviewed files, and residual risk.

If no candidate survives, lead with `No findings.` and still report coverage and residual risk. In review-only mode, stop there. If fixes were explicitly requested, apply only supported fixes through the repository's implementation or TDD workflow after the report, then re-review the resulting diff. Done when every finding is actionable and evidenced, every gap is explicit, and no unauthorized edit occurred.

## Pressure

Read [references/pressure.md](references/pressure.md) when urgency, authority, sunk cost, or an uncertain shortcut threatens the workflow. Those pressures do not waive its evidence or authority requirements.

## Failure Modes

- **Diff too large for complete review:** Split by independent subsystem or commit range, state the completed partitions, and name every unreviewed one. Time pressure and “just a quick look” do not justify silent sampling.
- **External issue or PR inaccessible:** Ask for pasted acceptance criteria only when Spec coverage is required; otherwise mark the lens unavailable.
- **Generated or binary change:** Review its source and generation contract when available; mark opaque output as residual risk.
- **Conflicting standards:** Cite the conflict and apply the more local binding instruction; ask only when precedence remains ambiguous.

## Verification

Every finding survives falsification and cites an introduced consequence. Scope, executed checks, unavailable lenses, and residual risk are explicit.
