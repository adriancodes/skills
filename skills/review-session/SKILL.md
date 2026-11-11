---
name: review-session
description: Review an agent session for evidence-backed friction and the smallest measurable remedies.
disable-model-invocation: true
license: MIT
metadata:
  category: Improvement
  summary: Turns observed session failures into bounded remedies without inventing causes or applying unrequested policy changes.
---

# Review Session

Trace each recommendation to an observed event. Apply remedies only when the user requests application.

## Scope

Use when explicitly invoked to review a session's effectiveness.

Do not use for:

- Diagnosing a live defect: use `diagnose`; reproduce and discriminate causes if unavailable.
- Authoring a skill: tell the user to run `create-skill`. If it is not installed, confirm the skill's job and compare it with a cheaper mechanism.
- Editing persistent project instructions: tell the user to run `write-agent-instructions`. If it is not installed, verify the instruction defect and test a minimal change.
- General opinions about agent quality without session evidence: request the missing trace or limit the review to available facts.

## Workflow

### 1. Reconstruct the useful sequence

Review the session the user names.
With none named, review the current conversation and say that turns removed by compaction are not covered.
Read its tool results, artifacts, and the relevant repository state.
Identify the intended outcome and what actually happened.
Separate observations from causal hypotheses.
Keep gaps, unlogged time, and inaccessible evidence explicit.
Quote only the minimum context needed to identify a failure.
Redact secrets and unrelated private data.

Done when every reported friction point has an evidence pointer and a consequence.

### 2. Find the owning mechanism

Inspect existing checks, scripts, instruction layers, and local conventions.
Distinguish an absent mechanism from one that failed or was never run.
Use a deterministic check for a mechanical defect.
Prefer wiring or repairing an existing check over adding prose.
Use a bounded instruction change only for demonstrated instruction-related behavior.
Leave unresolved product choices with their owner.

Done when each proposed remedy addresses the observed failure in the appropriate layer.

### 3. Test the proposed effect

Replay a safe existing check against the original failing input when possible.
Verify check descriptions against runtime output rather than source spelling.
Show how the smallest remedy would change that result.
Define a downstream task for behavioral remedies.
Report an unavailable replay as a limit rather than an accomplished prevention.
Compare expected consequence and effort.
Rank at most three remedies and identify the first useful one.

Done when recommendations have a checkable effect and no unsupported universal guarantee.

### 4. Save the review

Follow the requested location or use `docs/session-reviews/<topic>.md`.
Include the observed issue, evidence, remedy, effect check, and unresolved limit.
Keep review-only work to the report.
Apply an explicitly requested remedy within its bounded scope.
Verify any applied change with its owning workflow.

Done when the review is inspectable and application status is unambiguous.

## Worked example

> Issue: `retrys` reached main; the formatter passed it.
> Evidence: the CI log runs only the formatter; `check-config.mjs` exists and is not in the CI command.
> Remedy: add `check-config.mjs` to the CI command.
> Effect check: replayed the checker on the misspelled file; it exits non-zero.
> Limit: the delay before the fix is unlogged; no cause is claimed.

## Verification

Check recommendations against actual events and existing mechanisms.
Check that the report contains no invented causal story or unrequested policy edit.
Recommend the smallest remedy whose effect the evidence can support.
