---
status: confirmed
topic: Improve skill results, structure, and names against the installed Matt Pocock comparison
---

# Skill quality pilot

## Confirmed direction

The user asked to make this toolbox as good as Matt Pocock's installed skills. After the initial comparison, the user asked how improvement would be measured, then asked to include structure and names. The response committed to outcome-based comparisons, core-technique-first structure, conditional references, selective renaming, and migration guidance. The user confirmed that direction with “ok continue”. This is the acceptance for the affected brief fields; another interview is not needed to repeat those decisions.

## Affected fields

- **Users and context:** engineers using this repository's skills; compare the installed local snapshot, not an unverified upstream revision.
- **Outcome:** finish authorized work correctly with less avoidable ceremony. Preserve scope, user work, meaningful decision gates, and honest validation.
- **First subjects:** `deliver-feature`, `create-tasks`, `simplify-code`; align `implement-task` with authorized multi-task delivery.
- **Structure:** lead with the mechanism, prune repeated guidance, and keep substantial conditional detail in self-contained references.
- **Names:** assess every current name; rename only when it clarifies the task and avoids collisions. Correct misleading behavior before changing a clear name.
- **Invocation:** preserve current invocation choices.
- **Artifacts:** preserve decision logs and the slices file contract. Do not rewrite historical evidence to appear current.
- **Success:** downstream fixture correctness and completion; authorized scope preserved; original valid boundary cases retained; lower entrypoint loading cost.
- **Tier:** 2 for these reversible local engineering workflows. The Tier-3 authoring meta-skill is outside this pilot.
- **ASSUMED budget:** one current-model route, at most 24 actor runs across baseline, prompt, revised, Matt, and regression arms; maximum 180 seconds per run and two corrective iterations. Usage is recorded, not estimated. Broader claims require a later matched repeated comparison.
- **ASSUMED name decision:** preserve already clear names unless inspection supplies a concrete improvement.

## Changes to existing briefs

`deliver-feature` will honor end-to-end versus one-stage intent. It continues already authorized work across unblocked stages and stops for real missing decisions. A stage boundary alone is not a permission gate.

`create-tasks` will keep vertical slices for feature work, support genuine one-layer work, and use expand–migrate–contract for wide mechanical refactors. The existing no-write contract and confirmation gate remain.

`simplify-code` may use meaningful local characterization checks within the authorized cleanup scope. It still honors explicit no-test/no-write limits and asks before unrequested public-contract or external changes.

`implement-task` remains a bounded single-task workflow when directly invoked. A coordinator may call it for the next task in the same authorized delivery session. Documentation-only or mechanical tasks use proportionate checks rather than manufactured failing tests.

## Discovery and boundaries

Keep existing trigger and adjacent-negative cases. End-to-end delivery belongs to `deliver-feature`; one named task belongs to `implement-task`; planning a confirmed spec belongs to `create-tasks`; scoped behavior-preserving cleanup belongs to `simplify-code`. Read-only review, unattended operation, external publishing, and unresolved product decisions remain outside these permissions.

## Evaluation

Freeze the original subjects and outcome cases before edits. Compare original/revised/prompt arms on the affected outcomes. Compare Matt's installed counterpart where one exists without inventing a substitute for missing coverage. Run normal, edge, and pressure cases through fresh isolated sessions. Preserve prompts, traces, workspaces, hashes, usage, manual judgments, and deterministic downstream checks.

An old requirement deliberately changed by this confirmation must remain archived and labeled superseded; do not silently reinterpret its score. Valid unchanged cases must still pass. A passing structural or lexical check does not establish model behavior or native discovery. Report the actual verdict and evidence limits; no automatic superiority claim follows from shortening.
