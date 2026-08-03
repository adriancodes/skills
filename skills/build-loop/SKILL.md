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

A loop repeatedly discovers work, acts, verifies, records state, and picks the next move without human prompting. Build four portable artifacts: `LOOP.md`, `STATE.md`, the loop prompt, and a rollout plan. Add a runner adapter only when a concrete runner exists. Never give credentials to a bare "keep going until done" prompt. The agent that makes a change never verifies completion, and every new loop starts report-only.

## When to Use

- "build a loop", "run this on a schedule", "keep CI green automatically", "continuous self-directed cycle"
- A recurring job is re-prompted by hand every session
- An existing loop misbehaves: token burn, the same failed fix retried forever, duplicate branches, silent stalls

## Do Not Use When

- The job runs once: a plain session (ending with `verify-work`, if installed) beats a one-iteration loop
- The "loop" is multi-step work inside one session: that's a todo list, not a loop
- The job isn't specified yet: pin it first (`create-spec`, if installed): a loop amplifies a vague goal into vague scheduled changes

## Required Context

- The job: what the loop discovers, what it may change, what "healthy" looks like
- The runner: the harness's loop/goal/cron feature, a CI schedule, or OS cron + headless CLI: whichever exists; the design is runner-agnostic
- The budget reality: tolerable per-run cost and who reviews the output

## Workflow

Load `references/loop-formats.md` before writing any artifact (templates, pattern table, runner mapping).

**Repairing an existing loop?** Audit instead: read its files and state ledger, map each misbehavior to its missing guard: token burn → no budget, the same fix retried → no breaker, duplicate branches or PRs → no lock, unreviewed changes → no gate or a self-written level. Retrofit the missing guards (creating LOOP.md/STATE.md if absent), demote to L1 with promotion counters reset, and rejoin step 6 to hand over.

1. **Name the goal as a verifiable condition.** Not "keep CI green" but the check a fresh verifier runs: "latest main CI run green AND the cycle's diff deleted or skipped no test." Beside it, write the anti-gaming clause: every way to satisfy the condition without doing the job. For code loops: deleted tests, loosened thresholds, suppressed failure signals; other domains wear the same move differently: a triage loop closing tickets unread. Done when condition and clause are written.

2. **Design the run.** One cycle = **triage** (cheap) → **act** (only when triage found something actionable) → **verify** (fresh eyes: a different agent or the human gate, never the maker; one carve-out: a deterministic check may verify only when the goal is machine-checkable *and* the loop provably holds no credential that could alter the checker: the anti-gaming diff review still needs real eyes) → **persist** → **decide**. Every run ends in exactly one of three states: *verified-done*, *progress-with-state-written*, or *escalated*; any other ending is a design bug. Done when the phases and the three endings are in LOOP.md.

3. **Give it a spine.** STATE.md answers three questions: what is being worked now; what was tried and what happened; what awaits a human. The loop reads state before acting and writes it before every exit, failed ones above all: the failure notes are the ledger's point. Done when STATE.md is seeded with the three sections.

4. **Set all four guards explicitly in LOOP.md:**
   - **Budget**: worst-case run cost × cadence = daily spend, written *before* choosing the schedule; plus a numeric per-run operational cap (iterations or tokens). When pricing is unknown, write monetary cost as `unknown`, keep the loop unscheduled at L1, and name the measurement needed before choosing cadence: never invent a price. The operational cap stays numeric.
   - **Circuit breaker**: two consecutive *attempts* at the same failure signature without new progress → stop and escalate; there is no attempt three. Attempts count within and across runs: an iteration cap is no license to retry the same fix inside one run.
   - **Overlap lock**: a run that finds the previous run alive exits immediately.
   - **Human gate**: a capability boundary, never a verb list: name the *outcomes* only a human may cause ("main changes", "data is deleted", "users see something new"): a verb list invites the direct-push that technically isn't a "merge". Below L3, absent credentials enforce the gate, not prose: no token that could cause a gated outcome. For an intrinsically read-only loop, the gate is the transition from reporting to any mutation or external publication; `nothing gated` is never valid.

   Done when LOOP.md contains a numeric operational cap and breaker threshold, a concrete lock mechanism, and a capability boundary enforced by absent credentials; monetary cost is numeric or explicitly unknown.

5. **Stage the rollout.** L1 report-only (findings and would-do written to state; nothing changed) → L2 assisted (changes behind a PR or approval) → L3 unattended (only actions outside the human gate). Promotion needs 5 consecutive clean runs at the current level; only the fresh-eyes verifier or the human certifies a run clean and writes `level:` / `clean-runs-at-level:` (on a personal repo, one human message certifies). The loop reads its level, never writes it; a self-written level is void. Every loop is born L1. Done when LOOP.md carries the ladder and counts.

6. **Hand over.** Deliver the artifacts including the wired runner adapter: the guards live in it as mechanisms (`concurrency:` group or pidfile for the lock, token scope for the gate, the schedule itself for cadence). Say out loud what the loop will *not* do: the human gate and L1 restriction. With known cost, end with the command starting the first scheduled L1 run. With unknown cost, leave scheduling disabled and end with the command for one manual report-only measurement run; schedule only after its cost is recorded. Done when the files and the matching command exist.

## Example: goal, guard, ending

> **Goal:** latest `main` CI run green; cycle diff shows no test deleted, skipped, or weakened.
> **Breaker:** same failure signature two runs running → escalate, both attempt diffs linked from STATE.md.
> **Endings:** green+verified → *verified-done* · fix pushed as PR → *progress, state written* · breaker tripped → *escalated*.

## Common Rationalizations

Provenance: a *self-report* baseline probe. Behavioral baselines avoid the worst of these (models build PR-only loops unprompted), but the excuses resurface under mid-run pressure: exactly when this table earns its place.

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
- LOOP.md holds all four guards: numeric operational/breaker limits, a concrete lock, and an enforceable capability boundary; monetary cost is numeric or explicitly unknown; STATE.md is seeded with the three questions
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

- **`references/loop-formats.md`**: LOOP.md and STATE.md templates, the pattern table (cadence + cost class for seven common loops), and the runner mapping. Load before writing any artifact.

## Summary

A safe loop has a verifiable goal, independent verification, persisted state, numeric guards, and a report-only first stage. Do not automate it until those controls work.
