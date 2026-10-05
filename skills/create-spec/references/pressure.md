# Pressure and troubleshooting

Use when urgency, authority, sunk cost, or an uncertain shortcut threatens the workflow. The main skill retains its governing rules.

## Common Rationalizations

Each excuse was observed verbatim in baseline testing without this skill loaded.

| Excuse | Reality |
|--------|---------|
| "Every question I ask is a cost I'm imposing on a user in a hurry" | One question per turn costs seconds; a wrong schema costs a migration. Hurry raises the stakes of asking, not the case for skipping. |
| "They said the plan is basically solid: validate, don't interrogate" | "Solid" is the claim under test. Agreeing with it is not testing it. |
| "Listing my assumptions as I go is effectively the same as asking" | Stated is not confirmed. Assumptions enter the log as ASSUMED and are read back at the gate; they never self-ratify. |
| "They said 'then build it', so pausing for confirmation disobeys them" | The instruction authorises building *after* the gate. The gate is one turn, not disobedience. |
| "'Yeah fine' / 'whatever you think' lets me choose product policy" | A specific affirmative decides one offered option; blanket delegation covers only reversible implementation defaults. Product-shaping branches stay Deferred until decided. |
| "The chat history already records everything; a file is overhead" | Scrollback dies with the session. The log survives it: that is its entire job. |
| "A wrong assumption can be refactored later" | True for code; false for the schema, contract, and naming decisions spec sessions exist to settle. |

## Stop Conditions

These thoughts signal imminent violation; each maps to a table entry above:

- "I have enough context to start building"
- "Batching the remaining questions saves time"
- "These all have obvious defaults"
- "Silence is agreement"
- "I'll write the docs once decisions settle"

All of them mean: return to the current workflow step.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Two questions in one turn | Ask the upstream one; the other waits |
| Asking what a file could answer | Explore first; record the found answer in the log |
| Glossary filling with general programming terms | Domain terms only; delete the rest |
| Every decision offered as an ADR | Run the three-part test; the log is the default home |
| Ending on "sounds good" | Not the gate: read back the numbered list and get explicit confirmation |
| Scaffolding "just the obvious parts" before the gate | No building means none: no scaffolds, drafts, or "starting points" |

