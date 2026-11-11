---
name: create-handoff
description: Use when the user asks to "create a handoff", "write up where we are", or "leave this for the next agent". Also when a session is ending or running out of context with work unfinished and someone else must continue it.
license: MIT
metadata:
  category: Workflow
  summary: Writes a verified resume packet that preserves user work and points a fresh recipient to the next bounded action.
---

# Create Handoff

Write from current evidence. Preserve existing work and the artifacts that own decisions.

## Scope

Use to transfer unfinished work to another session or agent.

Do not use for:

- Rewriting requirements: use `create-spec`; retain confirmed requirements and resolve only missing decisions if unavailable.
- Creating implementation tasks: use `create-tasks`; break confirmed scope into bounded work if unavailable.
- Publishing a pull request: use `prepare-pr`; prepare an actual-diff draft if unavailable.
- Reviewing session quality: tell the user to run `review-session`. If it is not installed, trace failures to evidence without changing policy.

## Workflow

### 1. Verify the working state

Inspect current files and relevant artifact paths.
Read repository status, branch, and base/head when Git is available.
Identify dirty user work separately from completed changes.
Classify checks as current, historical, failed, or unrun.
Rerun the project's existing test or check command when it only reads.
Ask before running one that writes, deploys, or calls a network service.
Retain a precise unknown when verification is unavailable.

Done when the handoff's state claims match observed files and check provenance.

### 2. Build the handoff

State the goal and remaining scope in two or three sentences.
Point to the canonical spec, task list, decisions, and check evidence.
Keep those artifacts authoritative instead of duplicating their contents.
Describe completed work and the smallest unfinished part.
Record blockers, unresolved questions, and the responsible owner when known.
Give one next action with a file, command, or decision target.
Mark user edits that must be preserved.
Redact credentials, private payloads, and unnecessary personal context.

Done when a fresh recipient can locate the work and act without reconstructing the conversation.

### 3. Save and check

Follow the requested destination or local handoff convention.
Use `docs/handoffs/<topic>.md` as a fallback.
Check every link and command against the current project.
When a subagent is available, give a fresh one only the handoff and ask it to report the file, command, and first step it would take, without running anything.
Fix the handoff where its answer is wrong.
Otherwise state that recipient testing was not done.
Leave source, decisions, and Git history unchanged unless separately requested.

Done when the handoff is saved, pointers resolve, and continuation evidence is reported honestly.

## Worked example

> Resume export work from `docs/specs/export.md`.
> Current `src/export.mjs` still joins records without separators.
> The green check in `docs/verification.md` predates this edit.
> Next: run `node test.mjs`, then finish the separator behavior required by the spec.
> Preserve all current edits; the handoff does not change the spec.

## Verification

Compare the final handoff with actual status and file contents.
Check that historical success is not presented as current validation.
Check that no secret values entered the handoff.
Transfer current evidence and the next action while preserving existing work.
