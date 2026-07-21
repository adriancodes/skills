---
name: write-pr-description
description: Draft or revise a standard pull-request description from the current repository's PR template and actual branch changes. Use when asked to write, generate, prepare, update, or improve a PR body, pull-request summary, testing notes, reviewer context, or checklist for a code change.
---

# Write a PR Description

## Gather evidence

1. Locate repository instructions and pull-request templates before drafting. Search tracked and hidden paths, especially `AGENTS.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/pull_request_template.md`, `.github/PULL_REQUEST_TEMPLATE/`, `docs/`, and contributor documentation. If several templates exist, select the one matching the change type; ask only when the choice materially changes the result.
2. Determine the comparison base from user input, branch configuration, or the repository's default branch. State the assumed base if it cannot be established reliably.
3. Inspect the branch diff, changed-file summary, and relevant commits against that base. Read enough changed code and tests to explain behavior and verification accurately. Do not infer the PR solely from commit messages.
4. Check issue references or user-provided context. Never invent ticket numbers, test results, screenshots, rollout details, or breaking-change claims.

Prefer read-only commands such as:

```sh
rg --files -uu | rg '(^|/)(AGENTS\.md|PULL_REQUEST_TEMPLATE|pull_request_template|CONTRIBUTING)'
git status --short
git diff --stat <base>...HEAD
git diff <base>...HEAD
git log --oneline <base>..HEAD
```

## Draft against the repository template

- Preserve the template's section order, headings, checklist wording, comments, and required markers. Treat it as the output schema rather than replacing it with a generic format.
- Fill every applicable section with concise, reviewer-oriented facts. Explain what changed, why it changed, meaningful implementation choices, user impact, risks, and validation where the template asks for them.
- Mark checklist items complete only when supported by evidence. Leave unsupported items unchecked. Use `N/A` with a short reason only when the template permits it.
- Keep HTML comments when the result is intended to be pasted directly into a PR and the comments provide author guidance or automation markers. Omit purely instructional comments only when the user requests a clean rendered version.
- Describe tests as commands or checks actually run. If none were run or their status is unknown, say so plainly and give the reason when known.
- Mention screenshots only for visible UI changes and never fabricate them. Retain the template's placeholder when screenshots still need to be supplied.
- Use issue-closing syntax only when the referenced issue and desired relationship are known.

If no repository template exists, use this compact fallback:

```markdown
## Summary

- <what changed and why>

## Testing

- <verified check, or "Not run (reason)">

## Risks

- <risk and mitigation, or "None identified">
```

## Verify and deliver

Cross-check every material statement against the diff, tests, or user context. Ensure no template section was silently dropped and no placeholder is presented as completed work. Return a paste-ready Markdown PR body unless the user explicitly asks to write it to a file or publish it. Do not create or update a remote pull request without explicit authorization.
