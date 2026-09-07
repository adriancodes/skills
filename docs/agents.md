# Agent Personas

Personas add one specialist perspective and one output contract. They do not replace skills.

| Persona | Perspective | Workflow |
|---|---|---|
| [`evidence-led-reviewer`](../agents/evidence-led-reviewer.md) | Staff Engineer who reports only falsified, consequential findings | `code-review` |

## Contract

Every persona contains:

1. Discovery frontmatter.
2. One concrete `You are …` role.
3. One output contract.
4. Rules that shape the perspective.
5. A Composition section.

Start from the [persona template](../skills/create-skill/references/persona-template.md). Keep only rules that change the specialist perspective or output.

Personas may use skills. They never duplicate a skill's full workflow and never invoke another persona. The user or harness composes roles.

Add another persona only after a distinct perspective produces a distinct useful artifact. Do not add a role merely to mirror the skill catalog.
