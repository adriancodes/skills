# Pressure and troubleshooting

Use when urgency, authority, sunk cost, or an uncertain shortcut threatens the workflow. The main skill retains its governing rules.

## Common Mistakes

| Rationalization | Required response |
|---|---|
| "The repository uses it once, so it is the pattern." | Inspect analogous locations and test the coherence criteria. |
| "Best practice says to replace the local design." | Apply the decision precedence and show concrete harm before proposing change. |
| "Ask every architecture question to be safe." | Infer answered facts; ask only decisions that materially change the solution. |
| "Load every related book for completeness." | Retrieve a small relevant packet and discard weak matches. |
| "A codebase review authorizes a rewrite." | Recommend a target and incremental migration; preserve behavior in bounded slices. |
| "The defaults were delegated, but approval is still required." | Apply the recommended coherent direction and document the assumptions. |
| "The patch is green and nearly finished, so retrieval is unnecessary." | Retrieve before accepting a non-trivial design; green tests may omit the governing failure mode. |
| "The relevant best practices are already obvious." | Run the bounded lookup; its purpose is to expose principles outside immediate recall. |
| "A process-local lock prevents the race in tests." | Put the transition in the durable state owner and race independent instances whose only shared coordination is that dependency. |

### Stop Conditions

These thoughts signal an imminent shortcut:

- "This pattern exists somewhere."
- "The tests are already green."
- "The user wants this quickly."
- "Retrieval can wait until review."
- "More sources will be safer."
- "The workers normally run in one process."

Return to the workflow and use the rationalization table: state the rule once, produce the compliant result, and move on.

### Closed loopholes

- Never substitute a generic best-practices checklist for the bounded catalog lookup; run the lookup for non-trivial work.
- Never load all three state references "for context"; load exactly the selected workflow.
- Never treat passing tests as proof a local pattern is coherent; check recurrence, boundaries, support, and material defects.
- Never continue an architecture interview after recommended defaults are explicitly delegated; document assumptions and proceed.
- Never accept process-local coordination for an invariant spanning workers, processes, or machines; require atomic lifecycle operations in the durable shared owner.

