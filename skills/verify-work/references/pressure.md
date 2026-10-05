# Pressure and troubleshooting

Use when urgency, authority, sunk cost, or an uncertain shortcut threatens the workflow. The main skill retains its governing rules.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Tests are green, so it's effectively verified" | The happy-path fixture proves the happy path. The catalog exists because data is hostile. |
| "The user needs it in minutes: a smoke test will do" | The baseline's smoke test missed silent data loss. Deadlines raise the cost of shipping broken, not the case for skipping the attack. |
| "I can see from the code it handles that case" | Reading is not running. The baseline read its parser as correct; execution found three bugs. |
| "One clean round is enough" | In this repo's own history, round two kept finding what round one missed. Two dry rounds for anything shipping. |

## Stop Conditions

- "It's basically done, just ship it"
- "The code obviously handles that"
- "One fixture already passed"

Each maps to a table entry above; return to the workflow step in progress.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Reading the code and declaring it safe | Execute; runs catch what reads miss |
| One happy-path fixture as "tested" | Run the full catalog; the happy path proves nothing |
| Editing a fixture until output matches | Preserve the fixture; report the finding, patching the artifact only when fixes were authorized |
| Re-arguing old findings each round | Do-not-re-report list; only new findings reset the dry counter |
| Stopping after the first clean round | Dry means 2 consecutive rounds, not 1 |

