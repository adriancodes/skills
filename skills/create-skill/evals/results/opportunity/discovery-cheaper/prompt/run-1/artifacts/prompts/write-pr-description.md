Write the pull-request description for the current branch.

Treat the repository's pull-request template as the source of truth. Find and read it before drafting. Preserve its headings, required sections, checklists, comments, and ordering; do not invent a competing format.

Inspect the branch diff, commit history, and relevant tests or documentation. Fill the template with concrete, reviewer-oriented facts:

- explain what changed and why;
- call out behavior changes, risks, migrations, compatibility concerns, and follow-up work when applicable;
- report tests actually run and their results—never claim unverified testing;
- include issue links or screenshots only when they are available or clearly mark them as not provided;
- remove instructional HTML comments from the final draft, but retain checklist items and mark only items supported by evidence.

If essential context cannot be derived from the repository, ask at most three focused questions. Otherwise, output only the completed Markdown PR description, ready to paste.
