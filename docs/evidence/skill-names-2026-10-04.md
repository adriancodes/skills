# Skill-name review

The [remaining thirteen-skill consolidation](../../evals/remaining-skills-2026-10-04/README.md) retained these decisions. All names, descriptions, and invocation policies stayed unchanged, with the catalog's 51 positive lexical routes still passing.

The user asked to improve structure and names as part of the quality comparison. Review names against the actual task, neighboring skills, natural requests, and existing install stability. Preserve a clear name when correcting its behavior is more useful than changing its label.

| Current name | Decision and boundary |
|---|---|
| `be-concise` | Keep: familiar user request; surrounding communication rather than artifact formatting. |
| `build-loop` | Keep: builds or repairs an automation runner; distinguishes setup from unattended execution. |
| `code-review` | Keep: standard engineering term for reviewing a bounded change. |
| `create-skill` | Keep: explicit authoring tool; distinct from general writing ability. |
| `create-spec` | Keep: writes or confirms a requirements artifact. |
| `create-tasks` | Keep: plans executable work; local tasks rather than external publishing. |
| `deliver-feature` | Keep and align behavior: an end-to-end request now continues to verified completion. |
| `diagnose` | Keep: establishes a cause; a request for a fix supplies additional implementation scope. |
| `engineering-best-practices` | Keep: existing reference-and-retrieval capability; broad guidance remains secondary to a focused workflow. |
| `explore-options` | Keep: explicit option generation, rather than final interface implementation. |
| `implement-task` | Keep: one bounded work item; a coordinator may repeat it for authorized delivery. |
| `improve-prompt` | Keep: rewrites an ask; execution requires original authorization. |
| `quiz-changes` | Keep: retrieval practice about pending changes, rather than general teaching. |
| `simplify-code` | Keep: behavior-preserving reduction, rather than architecture redesign. |
| `tdd` | Keep: established term engineers already request. |
| `understand-codebase` | Keep: onboarding and code-path explanations; its description carries read-only intent. |
| `verify-work` | Keep: executed adversarial checks of a finished artifact, distinct from diff review. |

No rename in this pilot has a demonstrated discovery advantage over these short, functional names. The main misleading name was `deliver-feature`, whose old mandatory stop prevented its documented workflow from matching an end-to-end promise. Correcting the workflow keeps existing installs and references stable.

The unchanged names and descriptions pass the 51-positive catalog lexical preflight. That is a collision regression check, not evidence that every installed harness selects them correctly. Author collections may overlap: evaluate Adrian's source skills and Matt's provenance-marked installed skills separately rather than attributing a shared-name directory to the wrong author.

If later native discovery evidence supports a rename, move the old skill to `skills/deprecated/`, add its successor pointer, update active references and routing cases, and document migration. Do not remove or replace another author's installed skill merely because it has a similar name.
