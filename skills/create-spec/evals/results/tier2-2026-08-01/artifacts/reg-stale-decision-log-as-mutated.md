---
topic: How finished workspace exports are formatted, stored, and cleaned up
status: open
started: 2026-07-20
---

# Spec: Export retention

## Branches

- [x] Export format — resolved
- [x] Storage of finished exports — re-resolved 2026-08-01 (decision #3 supersedes #2)
- [x] Cleanup schedule — dissolved by decision #3: streaming-only leaves nothing to clean up
- [ ] Download filename — surfaced 2026-08-01: code contradicts the inherited naming assumption
- [ ] Failure notification

## Decisions

1. **Export format** — CSV with a UTF-8 BOM. _Why:_ the two enterprise customers open exports in Excel; BOM avoids the mojibake support tickets.
2. **Storage of finished exports** — Persist finished export files to `var/exports/` on local disk, one file per job, downloadable for later retrieval. _Why:_ cheapest durable option; re-running a large export to re-download it is worse than the disk cost.
   > REOPENED 2026-08-01: `src/export.js` (July refactor) now streams exports directly to the HTTP response; `var/exports/` was removed entirely and no file survives the request. Superseded by #3.
3. **Storage of finished exports** — Streaming-only: exports go directly to the HTTP response and nothing persists on disk (supersedes #2). The Cleanup schedule branch dissolves — with no stored files there is no retention to schedule. _Why:_ user 2026-08-01: "Keep streaming-only." Probe accepted: "a dead 2 GB download re-runs from scratch, that is acceptable." Ratifies the deliberate July refactor; eliminates disk growth and retention risk.

## Assumptions

- ASSUMED: File naming `<workspace>-<yyyy-mm-dd>.csv` — matches existing report downloads; correct at the read-back if wrong.
  > PROVISIONAL 2026-08-01: current code names the streamed download `<slug>.csv` with no date (`src/export.js:10`); revisit once Storage is re-decided.

## Deferred

- ~~Cleanup schedule~~ — resolved 2026-08-01: dissolved by decision #3 (streaming-only; nothing persists).
- Failure notification — not yet discussed.

## Confirmation

<!-- Filled only by the exit gate: the user's confirming words, verbatim, plus the date. -->
