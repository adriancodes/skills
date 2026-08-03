# Stale decision log

A target repo containing an interrupted spec session whose inherited
decisions the current repo state partly contradicts. Used by
`regression-stale-log-resume` in `../../cases.jsonl`.

- `docs/specs/2026-07-20-export-retention.md` — decision log at
  `status: open` with two ticked decisions: (1) CSV format, (2) persist
  finished exports to `var/exports/` on local disk for later download.
- `src/export.js` — a later refactor: exports now stream directly to the
  HTTP response and nothing is written to disk, contradicting ticked
  decision 2 (decision 1, CSV format, still holds).

On resume, the skill must extend this log (not start a second one), treat
the inherited ticks as provisional, reopen the contradicted storage
branch, and not confirm while it is unresolved.
