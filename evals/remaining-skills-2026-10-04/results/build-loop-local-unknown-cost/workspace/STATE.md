# State: local forum reply drafts
level: L1
clean-runs-at-level: 0

## Now
Design delivered; no model invocation or measured cost. Scheduling disabled.
Latest operational status is the last event in Tried. Local draft reports await
human review and never count as answers in forum.json.

## Tried
No runs yet. Adapter appends `event: {JSON}` records here, including ending,
signature, attempts, report path, elapsed time, and usage-log path when available.
History is retained. For a resolved breaker a human may append:
`event: {"kind":"reset","signature":"EXACT_SIGNATURE"}`

## Awaiting human
- Run the manual measurement only when model access is available.
- Review saved input, drafts, uncertainty, and changes to the checker/design.
- Measure usage and actual pricing; decide budget and cadence before scheduling.
- Certify clean runs and update authority fields; no promotion before five clean
  runs at the current level. Only the human may publish any reply.
