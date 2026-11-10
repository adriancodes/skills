---
name: prepare-pr
description: Use when the user asks "prepare my PR", "write a PR title and body", or "make a local PR draft" from an existing change. Also use for composing a branch-change description using a repository template and recorded validation.
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
Run relevant safe checks when authorized and useful.
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
For requested publication, inspect the prepared artifact before using the existing PR tooling.
Use normal authentication and repository permissions.
Preserve unrelated work while preparing any necessary branch push.
Record the created or updated PR URL and any failed operation.
Keep merge and deployment outside PR publication authority.

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
