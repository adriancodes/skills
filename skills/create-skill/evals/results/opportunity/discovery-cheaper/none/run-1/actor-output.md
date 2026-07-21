I’m using the skill-creator guidance because this request is specifically to add a reusable skill. I’ll first inspect its instructions and the repository’s existing PR template, then scaffold and validate the skill in the workspace.

The workspace appears unusually sparse, so I’m checking hidden repository paths and Git’s tracked tree directly. The skill will treat the repository’s PR template as the source of truth instead of duplicating it, which keeps descriptions aligned when the template evolves.

The skill is now scaffolded and its main workflow is in place: discover the repository template, derive claims from the actual diff, preserve all required sections and markers, and avoid claiming unverified tests or checklist completion. I’m running structural validation and a final content check now.

Created the reusable `write-pr-description` skill in the current workspace.

Files:

- [SKILL.md](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-cheaper-none-work-B0GwCx/write-pr-description/SKILL.md)
- [agents/openai.yaml](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-cheaper-none-work-B0GwCx/write-pr-description/agents/openai.yaml)

The skill:

- Uses the repository’s existing PR template as the output schema.
- Inspects the branch diff, commits, tests, and repository instructions.
- Preserves template headings, checklists, comments, and automation markers.
- Avoids inventing test results, issue references, screenshots, or completed checks.
- Provides a compact fallback if no template exists.
- Produces paste-ready Markdown without publishing remotely.

Both files passed structural YAML and metadata validation. The official validator could not run because its `PyYAML` dependency is unavailable in the environment.