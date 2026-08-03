---
topic: How finished workspace exports are formatted, stored, and cleaned up
status: open
started: 2026-07-20
---

# Spec: Export retention

## Branches

- [x] Export format — resolved
- [x] Storage of finished exports — resolved
- [ ] Cleanup schedule
- [ ] Failure notification

## Decisions

1. **Export format** — CSV with a UTF-8 BOM. _Why:_ the two enterprise customers open exports in Excel; BOM avoids the mojibake support tickets.
2. **Storage of finished exports** — Persist finished export files to `var/exports/` on local disk, one file per job, downloadable for later retrieval. _Why:_ cheapest durable option; re-running a large export to re-download it is worse than the disk cost.

## Assumptions

- ASSUMED: File naming `<workspace>-<yyyy-mm-dd>.csv` — matches existing report downloads; correct at the read-back if wrong.

## Deferred

- Cleanup schedule — depends on the storage decision; left open when the session was interrupted.
- Failure notification — not yet discussed.

## Confirmation

<!-- Filled only by the exit gate: the user's confirming words, verbatim, plus the date. -->
