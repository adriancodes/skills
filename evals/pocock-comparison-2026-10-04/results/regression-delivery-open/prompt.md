Apply the supplied instructions to the user request. Inspect and edit the project only inside /var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/skill-quality-pilot-B4luxT. You may read the supplied skill and its references under /Users/adrian/dev/skills/evals/pocock-comparison-2026-10-04/results/regression-delivery-open/subject; this read-only directory is part of your authorized evaluation input. Do not use external services, install dependencies, or delegate. Do not inspect other evaluation results or the parent repository. Do not invent user replies. Stop if a real user decision is needed.

Instructions:
---
name: deliver-feature
description: >
  Use when a feature should move through the whole pipeline. The user
  asks to "deliver this feature", "build this feature end to end",
  "continue the feature", or "run the pipeline". Also when a session resumes work that has
  existing spec or slices artifacts, or nobody remembers where a
  feature stands.
license: MIT
metadata:
  category: Building
  summary: Delivers the requested feature scope from artifact state, continuing authorized stages while preserving task bounds and decision gates.
---

# Deliver Feature

Complete the delivery scope the user requested. Read state from the feature's artifacts. Continue authorized work across stage boundaries; pause for missing decisions, access, or authority.

## Scope

Use for end-to-end feature delivery, resuming a feature, or finding its next stage.

- For “finish this feature,” continue through every unblocked task and whole-feature verification.
- For “what's next,” report the next stage. Execute it when the request also asks to advance the work.
- For “one stage” or “one task,” stop at that boundary.

Use the named stage skill for a direct stage request. Handle a small fix directly when it needs no pipeline. Use `build-loop`, when installed, for unattended scheduling; otherwise design that automation separately.

## Workflow

1. **Read the artifacts.** Find the decision log and slices file. Honor repository path overrides. Read statuses, decisions, bounds, blockers, completion notes, and verification evidence.

   Ask which feature is intended when multiple artifacts plausibly match. Treat a missing file as state. Preserve confirmed decisions and user-authored work.

   Done when the feature and requested stopping point are known.

2. **Select the next stage.** Validate the artifact contract before choosing work. Read `references/stages.md` for the current stage's checks and standalone fallback.

   | State | Next action |
   |---|---|
   | Malformed status, missing linked spec, zero-task confirmed plan, or invalid blocker graph | Report the exact defect; repair only a mechanical inconsistency supported by existing evidence. Ask before changing decisions or scope. |
   | Missing or open spec | Establish or confirm requirements. Build nothing from unresolved decisions. |
   | Confirmed spec; missing or open slices | Create or confirm the work plan. |
   | Confirmed slices with unfinished tasks | Implement an unblocked task within its bound. |
   | Every task complete; verification absent or invalidated by later changes | Verify the whole feature against the spec. |
   | Every task complete; verification still covers the current feature | Report completion and its evidence. |

   Treat `confirmed-by-override` as confirmed only when its recorded user override exists. An open artifact's prose is not user confirmation.

   Done when the next action follows from current evidence.

3. **Execute the stage.** Use its owning skill when installed. Otherwise apply the fallback in `references/stages.md` without asking the user to approve the same authorized work again.

   Keep each implementation task bounded. Run its demo and checks before recording completion. Reuse a stable session; summarize progress or hand off at a clean seam when context becomes insufficient.

   Stop dependent work at a genuine decision gate. Continue unaffected authorized work where possible. Ask before external publication, unrelated edits, or a product decision the user has not made.

   Done when the stage's actual completion criterion passes, or its precise blocker is reported.

4. **Continue to the requested outcome.** Re-read changed artifact state after each stage. Continue when the request covers the next stage and its prerequisites are settled.

   End-to-end delivery includes whole-feature verification. Record commands, findings, resolved fixes, and limits under `## Verification`. Verify behavior against the spec, not just the existence of planning files.

   Done when the requested outcome is verified, its explicit stopping boundary is reached, or further progress requires user input.

## Example

A confirmed plan has two unfinished tasks: a badge and mark-read. “Finish notifications” authorizes both, in blocker order, followed by whole-feature verification. “Implement only the badge” authorizes that task and its checks. An unresolved retention policy remains a question in either mode.

## Verification

- Artifact state and blockers determine the work.
- Confirmed decisions and each task's bound remain intact.
- Completed tasks have an observed demo, checks, and dated outcome notes.
- Whole-feature evidence covers the current implementation before claiming delivery.
- The report names completed work, checks, and any specific remaining blocker.

Continue until the requested outcome is satisfied or a real prerequisite is missing.


Supporting references for this skill, if requested by its body: /Users/adrian/dev/skills/evals/pocock-comparison-2026-10-04/results/regression-delivery-open/subject. Other skills are unavailable in this evaluation; use the supplied skill's standalone fallback. The issue tracker, if a tracker is needed, is local Markdown under docs/specs/; no external services are authorized.


User request:
The shipping spec looks basically done. This is urgent: get the whole feature finished now.