---
name: write-agent-instructions
description: Make the smallest evidence-backed change to persistent project instructions and test downstream behavior.
disable-model-invocation: true
license: MIT
metadata:
  category: Authoring
  summary: Repairs demonstrated instruction failures with minimal scoped navigation or policy changes while preserving user authority.
---

# Write Agent Instructions

Fix the demonstrated instruction defect in its owning layer. Preserve user policy and test the resulting behavior.

## Scope

Use when explicitly invoked to create or improve project instructions such as `AGENTS.md` or `CLAUDE.md`.

Do not use for:

- Skill authoring: use `create-skill`; confirm the skill brief and compare cheaper delivery mechanisms if unavailable.
- Session review without an instruction edit request: use `review-session`; trace events and propose bounded remedies if unavailable.
- Mechanical defects in source, checks, or tooling: recommend repairing that mechanism instead of adding another instruction.
- Replacing user policy with inferred preferences: preserve the policy and surface an actual conflict.

## Workflow

### 1. Establish the defect

Read the demonstrated failure and the affected task.
Inspect binding instructions and the canonical source of the missed behavior.
Identify whether the instruction was missing, inaccessible, ambiguous, contradictory, ignored, or already followed.
Choose a deterministic tooling remedy when the instruction was followed but its checker failed.
Name the smallest checker repair and a regression exercising the observed failure.
Recommend a hook or check when a clear, reachable instruction was ignored and the rule must hold every time.
Otherwise shorten the file or move the ignored rule to where the work happens.
Do not add emphasis to an ignored instruction.
Leave instructions unchanged when no instruction defect is supported.

Done when the proposed change has a specific failure it can plausibly prevent.

### 2. Choose the owning layer

Inspect the harness's actual instruction scope and precedence.
Use the narrowest file governing the affected work.
Keep repository-wide policy in the root and package conventions in their package.
Identify user-authored policy and notes to preserve verbatim.
Reuse canonical documents rather than creating a competing source.
Use a conditional pointer stating when to read a target and what it owns.
Add a behavioral rule only when navigation alone cannot address the demonstrated failure.

Done when the change has one owner and preserves existing authority.

### 3. Make the minimal edit

Write imperative instructions with one decision per sentence.
Keep task-specific detail in its canonical document.
Resolve relative pointers from the owning instruction file's location.
Retain explicit authorization boundaries.
Avoid adding global rituals for one local mistake.
Edit only the requested instruction scope.

Done when the diff addresses the defect without duplicating canonical material or changing unrelated policy.

### 4. Test downstream behavior

Give a fresh session or agent the ordinary affected task with the revised instructions normally present.
Keep the new answer out of its task prompt.
Check the actual output against the canonical requirement.
Test an adjacent task or policy boundary for regressions.
Compare before and after when fresh testing is available.
Use file/link checks as supplemental evidence, not a behavioral substitute.
Report unavailable fresh-context testing explicitly.

Done when downstream evidence shows the intended effect, or the remaining behavioral limit is clearly stated.

## Worked example

A session invented a JSON array because it missed the export conventions.
Add this conditional pointer to the owning instruction file:

> For export work, read `docs/export-conventions.md` before choosing the output format.
> That document owns the export contract.

Keep the release policy and user notes unchanged.
Ask a fresh agent to implement an export from the ordinary request.
Check its format against the canonical document.
As the adjacent boundary, confirm it still does not publish without being asked, because the release policy was left untouched.

## Verification

Check the diff, pointer resolution, and preserved user policy.
Check observed downstream behavior and adjacent boundaries.
Check that the instruction file gained nothing beyond the demonstrated defect.
