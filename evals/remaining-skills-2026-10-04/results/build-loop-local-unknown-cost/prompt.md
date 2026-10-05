Apply the supplied skill to this local preservation probe. The project is /var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/remaining-skills-probe-ud4Vti. You may inspect and edit only that project, according to the user's narrower authority below. Supplied skill resources under /Users/adrian/dev/skills/evals/remaining-skills-2026-10-04/results/build-loop-local-unknown-cost/subject are authorized read-only inputs: read them only when the skill requires them. Other skills, subagents, network services, and dependency installation are unavailable. Do not inspect parent repositories or other evaluation outputs. Do not invent user answers. Stop at a real decision gate. Do not create a Git commit.

Supplied skill:
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

A loop discovers work, acts, verifies, records state, and chooses the next move. Build four portable artifacts: `LOOP.md`, `STATE.md`, a loop prompt, and a rollout plan. Add a runner adapter only for a concrete runner. Never give credentials to a bare "keep going" prompt. The maker never verifies completion. Start every loop report-only.

## Scope

Use for recurring or unattended work, including repairing an existing loop.

Do not use when:

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

## Pressure

Read [references/pressure.md](references/pressure.md) when urgency, authority, sunk cost, or an uncertain shortcut threatens the workflow. Those pressures do not waive its evidence or authority requirements.

## Failure Modes

- **The goal resists verifiability:** the job isn't loop-shaped: it's a recurring reminder for a human. Say so instead of shipping a loop with a vibes-based stop condition.
- **The breaker keeps tripping:** the job is beyond the loop's reach (flaky infra, missing access). The escalation notes are the evidence; hand them to a human rather than widening the loop's permissions.
- **Review bandwidth saturates:** the ceiling is the human, not the tooling. Slow the cadence; never skip the gate. Cognitive surrender: taking whatever the loop returns: is the comfortable trap.

## Additional Resources

- **`references/loop-formats.md`:** templates, cadence patterns, cost classes, and runner mappings. Load before writing any artifact.

## Verification

Confirm the goal, four guards, state spine, independent verification, L1 rollout, and runnable handover. Unknown pricing leaves scheduling disabled.


Scenario:


User request:
Build the local artifacts for a loop that reads forum.json, identifies unanswered posts, and drafts suggested replies for human review. The runner is Codex CLI via a local manual shell script. Model pricing is unknown. Do not run the model or connect to any forum; deliver the design and manual measurement command only. Keep scheduling disabled until cost is measured.