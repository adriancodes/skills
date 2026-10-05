# Stage checks and standalone fallbacks

Read only the section for the current stage. Use the owning skill when installed; these fallbacks preserve standalone use.

## Requirements — create-spec

Read existing decisions and repository evidence. Ask about unresolved behavior and real tradeoffs. Capture resolved decisions in the repository's spec location. Read back assumptions and obtain confirmation before building from them.

Do not infer confirmation from a finished-looking open document. Reuse actual decisions from the current conversation; do not invent answers or silently reopen confirmed policy.

## Planning — create-tasks

Break the confirmed outcome into bounded tasks with runnable acceptance checks and explicit blockers. Use vertical feature slices, genuine one-layer tasks, or expand–migrate–contract for wide refactors.

Write a slices file with `spec`, `status`, task ticks, `Layers`, `Bound`, `Demo`, `Blocked by`, `## Verification`, and `## Confirmation`. Ask for approval of a new breakdown before executing it. A confirmed spec is not approval of a newly authored task graph.

## Implementation — implement-task

Read the task and its blockers. Implement one task within its bound. Test-drive changed production behavior: observe the intended failing assertion, make the smallest causal change, then run the same check green.

For documentation, formatting, or a mechanical change with no behavior effect, use proportionate existing checks. Do not manufacture failing tests for those tasks.

Run the written demo and relevant surrounding checks. Exercise meaningful boundaries and failure paths for changed behavior. Tick the task and add a dated outcome only after its criteria pass.

Record necessary plan corrections before code relies on them. Ask before changing confirmed behavior or expanding the bound. A completed task permits starting the next unblocked task when the user's request covers it.

## Whole-feature verification — verify-work

Read the spec, completed tasks, and actual implementation. Execute checks that cover the complete behavior and interactions across tasks. Include applicable boundaries, malformed inputs, and failure paths.

Use `verify-work` when installed for its adversarial workflow. Pass along fix authority only when the original request includes implementation or fixes. A verification-only request remains read-only for the artifact.

For standalone delivery, record each check, output, and uncovered boundary. Fix supported in-scope failures when authorized, then rerun the failed and affected checks. Preserve the acceptance promise and fixtures.

Write a dated verification entry only when no known in-scope failure remains. Report inaccessible checks and the weaker conclusion they support. Keep the section empty while a failing criterion is unresolved.

## Artifact validity

Validate accepted statuses and recorded confirmation. Confirm the linked spec exists. Check that task IDs are unique, every blocker names a task, and the graph has no cycle. A confirmed plan must contain at least one task.

Match whole-feature verification to the current implementation. A prior report does not verify later edits. Preserve historical evidence; supersede or clear its current-status marker when it becomes stale.
