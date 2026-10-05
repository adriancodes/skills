Apply the supplied instructions to the user request. Inspect and edit the project only inside /var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/skill-quality-pilot-l5lvOK. You may read the supplied skill and its references under /Users/adrian/dev/skills/evals/pocock-comparison-2026-10-04/results/regression-implement-one/subject; this read-only directory is part of your authorized evaluation input. Do not use external services, install dependencies, or delegate. Do not inspect other evaluation results or the parent repository. Do not invent user replies. Stop if a real user decision is needed.

Instructions:
---
name: implement-task
description: >
  Use when a task — a slice from a slices file — needs building. The user
  asks to "implement task 3", "implement slice 3", "build the next task",
  or "work through the slices". Also when implementation keeps wandering
  past its slice's bound, or slices get coded but the slices file never
  reflects it.
license: MIT
metadata:
  category: Building
  summary: Implements one slice to its demo criterion, starting with a failing test and ticking the slices file before reporting completion.
---

# Implement Task

Build one bounded task to its written acceptance criterion. For changed production behavior, observe a valid failing check before implementation. Record completion before reporting it.

## Scope

Use for one named task, the next unblocked slice, or a task whose completion record has fallen behind its code.

Read the slices file and linked spec. Use the named task, otherwise the first unblocked unfinished task. A delivery coordinator may invoke this workflow again for the next task covered by the user's request.

For several tasks, use `deliver-feature` when installed. Otherwise repeat this workflow in dependency order within the authorized scope. If no plan exists, create one only when the work needs decomposition; build a small, clear task directly.

## Workflow

1. **Read the contract.** Check the spec's confirmation, task bounds, demo, blockers, and current worktree. Honor repository path overrides.

   Stop dependent work when a blocker is incomplete. State the target task and bound. Preserve user-authored and pre-existing work.

   Done when the task is confirmed, unblocked, and bounded.

2. **Encode the acceptance check.** For changed production behavior, write the test first. Run it and observe the intended behavioral assertion fail. Use `tdd` when installed; otherwise retain that red-first order.

   For documentation, formatting, or mechanical changes without a behavior effect, use proportionate existing checks. Record why a failing behavior test is inapplicable. Repair broken test setup instead of counting it as red.

   Done when valid red is observed or a non-behavioral verification choice is recorded.

3. **Implement inside the bound.** Make the smallest change that satisfies the unchanged check. Treat `Bound` as permission; `Layers` describes coverage only. Record adjacent work for a later task.

   When evidence contradicts the plan, record a correction before code relies on it. Clarify or shrink the active bound. Put expanded scope in a new task; ask before changing confirmed behavior or scope. Leave incomplete work unticked.

   Done when the check passes and every changed surface belongs to the active task.

4. **Run the acceptance criterion.** Execute the written demo literally. Run focused tests and the affected package or subsystem suite. Run the full suite when proportionate and available; name unrun checks.

   For scripts, configurations, parsers, or rule documents, use `verify-work` when installed. Pass along only existing in-scope fix authority. Otherwise execute applicable adversarial cases against the changed promise, including empty, malformed, and boundary inputs when meaningful.

   If the exact demo cannot run, use the closest executable observation and record the weaker evidence. Leave the task incomplete when its acceptance promise is unproven.

   Done when the acceptance criterion and applicable surrounding checks pass.

5. **Record before reporting.** Tick the task only after verification. Add `Done: <date>: <one-line outcome>`. Clear or supersede whole-feature verification invalidated by these edits.

   Report the task, observed demo, commands, changed files, and remaining work. Commit only when authorized by the request or binding repository workflow.

   Done when the completion record matches the demonstrated result.

## Example

Task 2 adds mark-read behavior for an existing notification list. Its bound names two endpoints, the list interaction, and focused tests. Observe a failing unread-count assertion first. Implement the two endpoints and interaction. Run the written “badge 1 → mark-read → badge 0” demo. Tick task 2 after checks pass; leave an unrequested event source for its own task.

## Pressure checks

| Shortcut | Required action |
|---|---|
| “The neighboring handler is only two lines.” | Keep it outside this task unless the bound includes it. |
| “Tests are green, so the demo is obvious.” | Execute the written acceptance criterion. |
| “Write the test after this small change.” | Observe valid red first for production behavior. |
| “I'll tick the plan after the report.” | Update the completion record first. |
| “Urgency lets the bound expand.” | Correct the plan and obtain any missing scope decision. |

Follow the workflow silently. When a step is genuinely blocked, name the evidence, use the closest valid alternative, and state its limitation.

## Verification

- Changed production behavior has valid red-to-green evidence.
- The patch stays inside the confirmed task bound.
- The demo and applicable checks actually ran.
- Unproven acceptance leaves the task unticked.
- The plan records completion before the final report.

Build one bounded task, demonstrate its result, and record the evidence before claiming completion.


Supporting references for this skill, if requested by its body: /Users/adrian/dev/skills/evals/pocock-comparison-2026-10-04/results/regression-implement-one/subject. Other skills are unavailable in this evaluation; use the supplied skill's standalone fallback. The issue tracker, if a tracker is needed, is local Markdown under docs/specs/; no external services are authorized.


User request:
Implement task 1 only from docs/specs/2026-10-04-shipping-slices.md. Run its written demo, record completion, and leave task 2 alone. Do not commit or publish anything.