---
name: create-handoff
description: Use when the user asks "create a handoff", "make a resume packet", or "leave this for the next agent". Also use for transferring unfinished work to a fresh recipient who needs verified artifact pointers and a bounded next action.
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
- Reviewing session quality: use `review-session`; trace failures to evidence without changing policy if unavailable.

## Workflow

### 1. Verify the working state

Inspect current files and relevant artifact paths.
Read repository status, branch, and base/head when Git is available.
Identify dirty user work separately from completed changes.
Classify checks as current, historical, failed, or unrun.
Run a safe relevant check when authorized and useful.
Retain a precise unknown when verification is unavailable.

Done when the packet's state claims match observed files and check provenance.

### 2. Build the resume packet

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
Use a fresh recipient to attempt the bounded next action when available.
State explicitly when recipient testing was unavailable.
Leave source, decisions, and Git history unchanged unless separately requested.

Done when the packet is saved, pointers resolve, and continuation evidence is reported honestly.

## Worked example

> Resume export work from `docs/specs/export.md`.
> Current `src/export.mjs` still joins records without separators.
> The green check in `docs/verification.md` predates this edit.
> Next: run `node test.mjs`, then finish the separator behavior required by the spec.
> Preserve all current edits; the handoff does not change the spec.

## Verification

Compare the final packet with actual status and file contents.
Check that historical success is not presented as current validation.
Check that no secret values entered the packet.
Transfer current evidence and the next action while preserving existing work.
