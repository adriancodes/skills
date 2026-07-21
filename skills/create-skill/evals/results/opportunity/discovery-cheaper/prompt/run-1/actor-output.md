I’m using the skill-creator guidance because this request explicitly asks to evaluate and potentially create a reusable skill. I’ll first inspect its criteria and the repository’s existing PR template, then choose the cheapest mechanism that meets the need.

The initial scan did not surface the template because hidden paths need a broader inventory. I’m completing the skill guidance and locating the repository-specific instructions/template before making the comparison.

The workspace is empty and is not a Git repository, so the stated comprehensive PR template is not actually available to inspect here. Even taking that premise as given, the comparison points away from a skill: this task needs no specialized tool, deterministic script, bundled reference, or fragile multi-step workflow—the repository template is already the source of truth. I’ll preserve a compact reusable prompt that dynamically reads that template and the current diff, then validate the artifact structurally.

The conventional `.codex/prompts` location is read-only under this workspace’s permission profile. I’m placing the same reusable prompt in a repository-level `prompts/` directory so the useful artifact remains in scope and portable.

A reusable skill would not materially outperform a strong reusable prompt here.

Why:

- The repository’s existing PR template already contains the specialized structure.
- Writing the description requires ordinary repository inspection, not custom tooling or deterministic scripts.
- A skill would add discovery and context overhead while duplicating the template.
- A prompt can dynamically inspect the template, branch diff, commits, and test evidence.

Created [write-pr-description.md](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-cheaper-prompt-work-jXcVdQ/prompts/write-pr-description.md), a concise production-ready reusable prompt.

Validation passed for required behaviors: template preservation, repository inspection, evidence-based testing claims, focused clarification, and paste-ready Markdown output.

Note: the workspace was empty and not a Git repository, so the stated PR template could not be inspected or used for an end-to-end generation test. The conventional `.codex/prompts` directory was also read-only, so the artifact was preserved under `prompts/`.