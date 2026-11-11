---
name: prepare-pr
description: Use when the user asks to "prepare my PR", "write a PR title and body", "open a PR for this branch", or "make a local PR draft" from an existing change. Also when a branch needs a description that follows the repository template.
license: MIT
metadata:
  category: Delivery
  summary: Prepares a diff-grounded PR title and body with accurate validation and explicit publication scope.
---

# Prepare PR

Describe the actual reviewable change and observed validation. Keep publication within the user's request.

## Scope

Use for a pull-request title/body from an existing branch or specified diff.
Keep an unspecified or draft-only request local.
Publish through the repository's normal tooling only when publication is requested.

Do not use for:

- Reviewing correctness: use `code-review`; inspect the diff for evidence-backed defects if unavailable.
- Implementing or repairing the feature: use `deliver-feature`; preserve requirements and verify bounded changes if unavailable.
- Merging, deployment, or changing branch protection: require those actions in the user's scope.

## Workflow

### 1. Establish the review boundary

Inspect status, branch, base, head, and the actual diff.
Use the requested base or the repository's documented default.
Record ambiguity when neither can be established.
Separate committed branch changes from dirty user work.
Include dirty work only when the requested draft scope includes it.
Read the PR template and originating requirements when present.
Treat old titles and descriptions as historical context.

Done when the proposed PR scope matches observed Git state and the user's request.

### 2. Gather validation evidence

Read recorded commands, results, and their relationship to the current head.
Rerun the project's existing test or check command when it only reads.
Ask before running one that writes, deploys, or calls a network service.
Distinguish passed, failed, unrun, and historical checks.
Keep failures visible even when their cause appears environmental.
Describe a cause as inference unless the evidence establishes it.
Leave fixing code or tests to separately authorized work.

Done when each validation claim names an observed result and its coverage limit.

### 3. Write the review artifact

Lead the title and body with the concrete problem and resulting behavior.
Use a before/after example when it helps assess the change.
Follow the repository's template.
Keep detail proportional to the diff.
Report material risks, compatibility effects, and rollback where relevant.
Remove abandoned scope and unsupported readiness claims.
Save the requested draft or use `docs/pr-draft.md` as a fallback.

Done when a reviewer can assess the final change without reading this conversation.

### 4. Publish within scope

For a local draft, report its path and stop.
For requested publication, state the remote, head branch, base branch, and title in one line before acting.
Ask first when any of these holds, because each publishes something the user did not review:

- the base was not established;
- the branch holds commits the draft does not describe;
- the described change is not fully committed;
- an open PR for the branch already has a description someone else wrote.

Push only the head branch, without force.
Create or update the PR with the repository's existing tooling, normal authentication, and repository permissions.
Report the PR URL and any failed operation.
Leave merging and deployment to a separate request.

Done when the requested local or published artifact exists and its actual state is reported.

## Worked example

> **Fix export record separators**
>
> Export now emits one JSON object per line while preserving record order.
> Unit formatting checks passed for the recorded head.
> Integration failed with an upstream timeout; integration behavior remains unverified.
> The unrelated dirty logger edit is excluded from this PR draft.

## Verification

Compare the final title/body with the actual diff and template.
Check that failed or stale validation never became a passing claim.
Check publication stayed within the requested authority.
Return a reviewable artifact grounded in the actual change.
