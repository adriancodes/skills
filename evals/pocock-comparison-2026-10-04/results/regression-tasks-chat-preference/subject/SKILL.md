---
name: create-tasks
description: >
  Use when a confirmed spec or plan needs breaking into executable work —
  the user asks to "create tasks", "break this into tickets", or
  "turn the spec into tasks" or "create vertical slices". Also when implementation tasks keep
  overflowing an agent's context window, or a task list reads
  layer-by-layer: schema, then API, then UI.
license: MIT
metadata:
  category: Planning
  summary: Creates demoable implementation tasks from a confirmed spec, sized to one agent session with explicit blocking edges.
---

# Create Tasks

Turn a confirmed spec into bounded, independently verifiable tasks with explicit blockers. Use vertical slices for features. Use expand–migrate–contract when a wide refactor cannot land safely as feature slices.

## Scope

Use for task planning, recutting horizontal feature plans, and work that overflows an agent session.

Confirm unresolved requirements before planning. Use `create-spec` when installed; otherwise ask for the missing decisions directly. Accept `confirmed` and a recorded `confirmed-by-override`.

Build directly when the work fits one task and the user requested implementation. Route external issue creation to an installed tracker skill. Otherwise offer a local plan; publishing requires its own authority.

## Workflow

1. **Anchor the plan.** Read the confirmed spec and relevant repository paths, code, and tests. Identify the surfaces the work actually touches.

   Name confirmed behavior when routes or files remain implementation choices. Ask only when missing behavior prevents an executable acceptance check.

   Done when the plan's behavior and affected surfaces are grounded.

2. **Choose the task shape.** For a feature, cut a narrow end-to-end path through every layer its demo needs. Include tests within that task. Allow one-layer tasks when the actual work has one layer.

   Add prefactoring only when it makes the requested change easier and has its own preservation check. Avoid a standalone schema, API, UI, wiring, or test phase when it is only one part of a feature.

   For a wide mechanical refactor, use this sequence:

   - **Expand:** add the new form alongside the old. Prove compatibility with existing consumers.
   - **Migrate:** name bounded consumer batches, each small enough for a fresh session. Preserve compatibility and green checks between batches.
   - **Contract:** remove the old form after every migration batch passes and no consumer remains.

   If independently green batches are impossible, name an integration branch and final integration gate. Do not promise each batch is independently releasable.

   Done when each task has a runnable demo or preservation check and an explicit size bound.

3. **Write real dependencies.** Give every task a `Blocked by` field. Write `none` where appropriate. Add only prerequisites required by the code or acceptance check.

   Check for missing IDs and cycles. Ensure at least one task can start. Explain genuinely serial work rather than inventing parallelism.

   Done when the dependency graph is valid and each task's prerequisites are explicit.

4. **Save the contract.** Read `references/slices-contract.md` before writing the plan. Honor repository path overrides. Preserve its fields so delivery and implementation can resume from it.

   Treat “skip the file” and explicit no-write instructions as prohibitions. Return the full contract in chat instead. Explain that downstream workflows expect a saved file and offer to save it when implementation starts.

   A chat summary alone is not a write prohibition. Save the file and summarize it when writing is allowed.

   Done when the open contract exists in the repository, or appears completely in chat under a write prohibition.

5. **Confirm the breakdown.** Summarize tasks, bounds, demos, and blockers. Ask for approval when it has not already been given for this breakdown. Recut on objection.

   Record the user's actual confirmation and date before setting `status: confirmed`. Preserve an open status while awaiting a reply. Do not treat approval of the spec as approval of a newly invented breakdown.

   Done when the plan is ready for review or its actual approval is recorded.

## Example

For notifications, the first task includes the minimum storage, emitter, badge, and tests that demonstrate one notification. Mark-read follows as its own end-to-end behavior.

For a shared identifier rename, first support both names. Then migrate billing and exports in bounded tasks. Remove the old name only after both migrations and their compatibility checks pass.

## Verification

- Feature tasks are vertical across their real layers.
- Wide refactors preserve compatibility through expand, bounded migration, and contract.
- Every task has a bound, runnable acceptance check, and explicit blockers.
- The plan honors write restrictions and the downstream contract.
- Approval is recorded only when the user actually gives it.

Plan the smallest independently verifiable work units that preserve the confirmed outcome.
