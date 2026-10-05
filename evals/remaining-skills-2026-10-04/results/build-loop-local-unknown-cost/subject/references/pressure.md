# Pressure and troubleshooting

Use when urgency, authority, sunk cost, or an uncertain shortcut threatens the workflow. The main skill retains its governing rules.

## Common Rationalizations

Provenance: a self-report baseline probe. These excuses recur under mid-run pressure.

| Excuse | Reality |
|--------|---------|
| "CI is the source of truth: no state file needed" | CI stores results, not intent: run 2 re-diagnoses from scratch, duplicates branches, abandons run 1's PR. The spine records what was *tried*. |
| "Each run is idempotent: re-running is harmless" | Harmless on green; on red, two overlapping runs fight over the same fix. Lock plus ledger. |
| "The tests are the verifier" | The loop can edit the tests. Fresh eyes verify: a different agent, or the human at the gate. |
| "Auto-merge waits for checks: that's my safety net" | A gate the loop can satisfy itself is no gate. The human gate names what never merges alone. |
| "It's low-stakes plumbing; report-only is overkill" | Every loop is born L1. A week of reports proves "low-stakes" instead of assuming it. |
| "Cost is near zero on green runs" | Budget the red weeks, not the green days: worst-case run × cadence, written down first. |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| "Keep going until done" as the whole design | The five-phase run and three endings, written in LOOP.md |
| Verifier is the maker rereading its work | Different agent with different instructions, or the human gate |
| Schedule chosen before cost | Budget math first; cadence follows from it |
| State written only on success | Written before every exit: the failure notes are the ledger |
| Broad credentials "to be safe" | The loop gets the tools its L-level needs, nothing ahead of promotion |

