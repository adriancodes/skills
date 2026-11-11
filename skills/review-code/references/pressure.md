# Pressure and troubleshooting

Use when urgency, authority, sunk cost, or an uncertain shortcut threatens the workflow. The main skill retains its governing rules.

## Common Rationalizations

| Shortcut | Reality |
|----------|---------|
| “A review request implies permission for small fixes.” | Review-only authority ends at the findings report. |

## Stop Conditions

- “This looks suspicious.”
- “The code could be cleaner.”
- “The linter will catch the important parts.”
- “The other reviewer already validated it.”
- “This probably existed before.”
- “It is only a tiny fix.”

Each thought fails the evidence gate or the authority boundary. Return to the unfinished workflow step.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Reviewing `base..HEAD` without confirming intent | Resolve the merge base and use the frozen comparison the review actually promises. |
| Ignoring staged, unstaged, or untracked work | State whether each category is in scope and inspect included files separately. |
| Treating the diff as complete context | Follow changed symbols into callers, state owners, tests, and configuration. |
| Reporting missing tests as defects by default | Name the concrete unprotected behavior and consequence or leave it as residual risk. |
| Reporting a pre-existing issue | Drop it unless the scoped change materially worsens it. |
| Trusting subagent output | Reproduce or trace each candidate through the primary evidence gate. |
| Returning a review summary before findings | Lead with findings or `No findings.` |

