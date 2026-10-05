---
name: build-loop
description: >
  Use when an agent should work continuously or on a schedule. The user
  asks to "build a loop", "set up a self-directed cycle", "run this
  nightly", or "keep X green/tidy automatically". Also when an existing
  loop burns tokens, repeats failed fixes, opens duplicate PRs, or
  ships unreviewed changes.
license: MIT
metadata:
  category: Automation
  summary: Designs a continuous agent loop using LOOP.md, a seeded state file, a loop prompt, and a report-only-first rollout.
---

# Build Loop

## Overview

A loop discovers work, acts, verifies, records state, and chooses the next move. Build four portable artifacts: `LOOP.md`, `STATE.md`, a loop prompt, and a rollout plan. Add a runner adapter only for a concrete runner. Never give credentials to a bare "keep going" prompt. The maker never verifies completion. Start every loop report-only.

## When to Use

- "build a loop", "run this on a schedule", "keep CI green automatically", "continuous self-directed cycle"
- A recurring job is re-prompted by hand every session
- An existing loop misbehaves: token burn, the same failed fix retried forever, duplicate branches, silent stalls

## Do Not Use When

- The job runs once: a plain session (ending with `verify-work`, if installed) beats a one-iteration loop
- The "loop" is multi-step work inside one session: that's a todo list, not a loop
- The job is vague: pin it first with `create-spec` when installed. A loop amplifies vague goals into scheduled mistakes.

## Required Context

- The job: what the loop discovers, what it may change, what "healthy" looks like
- The runner: a harness loop, CI schedule, or OS cron plus a headless CLI. Keep the design runner-agnostic.
- The budget reality: tolerable per-run cost and who reviews the output

## Workflow

Load `references/loop-formats.md` before writing any artifact (templates, pattern table, runner mapping).

**Repairing an existing loop?** Read its files and state ledger. Map each failure to its missing guard:

- token burn → no budget;
- repeated failed fix → no breaker;
- duplicate branch or PR → no lock;
- unreviewed change → no gate or a self-written level.

Add the missing guards. Create `LOOP.md` or `STATE.md` when absent. Demote the loop to L1 and reset promotion counters. Then hand over through step 6.

1. **Name a verifiable goal.** Write the exact check a fresh verifier runs. Replace "keep CI green" with "latest main CI is green." Add an anti-gaming clause. For code, forbid deleted tests, weaker thresholds, and hidden failures. Translate the same risk for other domains.

   Done when the condition and anti-gaming clause are written.

2. **Design the run.** Use **triage → act → verify → persist → decide**. Act only when triage finds actionable work. Give verification to another agent or the human gate. Never let the maker self-certify.

   A deterministic check may verify a machine-checkable goal. The loop must hold no credential that can alter that checker. A human still reviews the anti-gaming diff.

   End every run as *verified-done*, *progress-with-state-written*, or *escalated*. Any other ending is invalid.

   Done when `LOOP.md` contains the phases and three endings.

3. **Give it a spine.** Make `STATE.md` answer three questions:

   - What is active now?
   - What was tried, and what happened?
   - What awaits a human?

   Read state before acting. Write it before every exit, especially failures.

   Done when `STATE.md` contains all three sections.

4. **Set all four guards explicitly in LOOP.md:**
   - **Budget:** Calculate worst-case run cost × cadence before choosing the schedule. Add a numeric per-run cap in iterations or tokens. If pricing is unknown, write `unknown`. Keep the loop unscheduled at L1. Name the measurement needed before choosing cadence. Never invent a price.
   - **Circuit breaker:** Stop after two attempts at the same failure signature without progress. There is no third attempt. Count attempts within and across runs.
   - **Overlap lock**: a run that finds the previous run alive exits immediately.
   - **Human gate:** Name outcomes only a human may cause. Examples: main changes, data deletion, or user-visible publication. Never substitute a verb list. Below L3, enforce the gate by withholding credentials. For a read-only loop, gate any mutation or external publication. `nothing gated` is invalid.

   Done when `LOOP.md` contains all four guards. Monetary cost is numeric or explicitly unknown.

5. **Stage the rollout.** Use L1 report-only → L2 assisted → L3 unattended. L3 may perform only actions outside the human gate. Require 5 consecutive clean runs before promotion. Only the independent verifier or human may certify a clean run. Only they write `level:` and `clean-runs-at-level:`. The loop reads its level but never writes it. Treat self-written levels as void. Start every loop at L1.

   Done when `LOOP.md` contains the ladder and counters.

6. **Hand over.** Deliver the artifacts and wired runner adapter. Implement guards as mechanisms. Use a concurrency group or pidfile for the lock. Use token scope for the gate. Put cadence in the runner schedule. State the human gate and L1 restriction.

   With known cost, end with the first scheduled L1 command. With unknown cost, leave scheduling disabled. End with one manual report-only measurement command.

   Done when the files and matching command exist.

## Example: goal, guard, ending

> **Goal:** latest `main` CI run green; cycle diff shows no test deleted, skipped, or weakened.
> **Breaker:** same failure signature two runs running → escalate, both attempt diffs linked from STATE.md.
> **Endings:** green+verified → *verified-done* · fix pushed as PR → *progress, state written* · breaker tripped → *escalated*.

## Common Rationalizations

Provenance: a self-report baseline probe. These excuses recur under mid-run pressure.

| Excuse | Reality |
|--------|---------|
| "CI is the source of truth: no state file needed" | CI stores results, not intent: run 2 re-diagnoses from scratch, duplicates branches, abandons run 1's PR. The spine records what was *tried*. |
| "Each run is idempotent: re-running is harmless" | Harmless on green; on red, two overlapping runs fight over the same fix. Lock plus ledger. |
| "The tests are the verifier" | The loop can edit the tests. Fresh eyes verify: a different agent, or the human at the gate. |
| "Auto-merge waits for checks: that's my safety net" | A gate the loop can satisfy itself is no gate. The human gate names what never merges alone. |
| "It's low-stakes plumbing; report-only is overkill" | Every loop is born L1. A week of reports proves "low-stakes" instead of assuming it. |
| "Cost is near zero on green runs" | Budget the red weeks, not the green days: worst-case run × cadence, written down first. |

## Success Criteria

- Goal written as an externally verifiable condition with an anti-gaming clause
- `LOOP.md` holds all four guards.
- Monetary cost is numeric or explicitly unknown.
- `STATE.md` contains the three required sections.
- The loop is born L1 with promotion counts, and the human gate names at least one gated outcome
- Every run's ending is one of the three states by construction
- The loop prompt and rollout plan exist; when a concrete runner exists, its adapter and run-one command exist too

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| "Keep going until done" as the whole design | The five-phase run and three endings, written in LOOP.md |
| Verifier is the maker rereading its work | Different agent with different instructions, or the human gate |
| Schedule chosen before cost | Budget math first; cadence follows from it |
| State written only on success | Written before every exit: the failure notes are the ledger |
| Broad credentials "to be safe" | The loop gets the tools its L-level needs, nothing ahead of promotion |

## Failure Modes

- **The goal resists verifiability:** the job isn't loop-shaped: it's a recurring reminder for a human. Say so instead of shipping a loop with a vibes-based stop condition.
- **The breaker keeps tripping:** the job is beyond the loop's reach (flaky infra, missing access). The escalation notes are the evidence; hand them to a human rather than widening the loop's permissions.
- **Review bandwidth saturates:** the ceiling is the human, not the tooling. Slow the cadence; never skip the gate. Cognitive surrender: taking whatever the loop returns: is the comfortable trap.

## Additional Resources

- **`references/loop-formats.md`:** templates, cadence patterns, cost classes, and runner mappings. Load before writing any artifact.

## Summary

A safe loop has a verifiable goal, independent verification, persisted state, numeric guards, and a report-only first stage. Do not automate it until those controls work.
