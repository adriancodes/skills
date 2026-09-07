# Toolbox Anatomy

Every artifact has one job.

| Layer | Location | Job | Loaded when |
|---|---|---|---|
| Ground rules | `ground-rules/` | Shared operating behavior | Installed as an always-on layer |
| Skills | `skills/` | Task workflows: the **how** | The request matches a description or names a skill |
| Personas | `agents/` | Specialist perspective and report contract: the **who** | The user or harness selects a role |
| Entry points | Native skill or persona invocation | User intent: the **when** | The user invokes it or the harness routes it |
| Evidence | root and per-skill `evals/` | Whether routing and behavior work | CI, skill revisions, and release checks |

Repository files such as `AGENTS.md`, `CONTRIBUTING.md`, and this document govern maintenance. They are not installed behavior.

## Composition

Ground rules apply across the session. A persona adopts one perspective and may use a skill for its workflow. Skills may mention sibling skills by name with an inline fallback, but each skill remains useful when installed alone.

The user or an entry point composes roles. Personas never invoke other personas. Add an entry point only when it removes a repeated orchestration burden; symmetry is not a reason to add one.

## Placement Test

Ask one question:

| Question | Put it in |
|---|---|
| Should every task obey this? | `ground-rules/` |
| Does this teach a repeatable task? | `skills/` |
| Does this define a specialist lens or output? | `agents/` |
| Does this prove a claim or record a decision? | `evals/` or `docs/` |
| Does this only help maintain this repository? | `AGENTS.md` or `CONTRIBUTING.md` |

Keep the answer in one place and link to it elsewhere.
