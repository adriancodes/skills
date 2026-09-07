I’ll inspect the repository instructions and read the full confirmed spec, then return the complete parseable slices contract in chat only. I won’t write or modify any files.

The spec is confirmed and the fixture contains no application code, so the slice bounds must name behavioral surfaces rather than invented routes or filenames where the spec leaves them unspecified. The feature touches persistence, authenticated API, results/account UI, hourly job/search execution, transactional email, tokenized unsubscribe, and focused tests.

No files were written. The repository contains only the confirmed spec, so no prefactoring slice is warranted.

```md
---
spec: docs/specs/2026-07-28-saved-searches.md
status: open
---
## Slices
- [ ] 1. Save, list, and rerun a search
  - Layers: persistence · authenticated API · results UI · account sidebar · test
  - Bound: saved-search storage; `POST /saved-searches`; `GET /saved-searches`; authentication; persisted name, query, and filters; alerts off by default; 20-search limit with 422 on the twenty-first; results-page save control; sidebar list; run-again links; focused success, authentication, default, and limit cases only
  - Demo: save the current results search, reload the account sidebar, then use its run-again link to restore the same query and filters; attempting a twenty-first save returns 422
  - Blocked by: none
- [ ] 2. Delete a saved search
  - Layers: persistence · authenticated API · test
  - Bound: `DELETE /saved-searches/:id`; authentication; ownership enforcement; removal from subsequent `GET /saved-searches` results; focused success, unauthenticated, and wrong-owner cases only; no bulk deletion or editing
  - Demo: delete one owned search through the API and show that it no longer appears in the authenticated saved-search list
  - Blocked by: 1
- [ ] 3. Toggle alerts for one saved search
  - Layers: persistence · server behavior · account sidebar UI · test
  - Bound: the confirmed per-search alert-toggle behavior, with its route or form mechanism chosen during implementation; persisted `alerts_enabled` state; ownership and authentication; sidebar toggle and feedback; focused on/off, reload, unauthenticated, and wrong-owner cases only; no search editing
  - Demo: enable alerts from the sidebar, reload and see the enabled state persist, then disable them again
  - Blocked by: 1
- [ ] 4. Disable alerts through a login-free unsubscribe link
  - Layers: unsubscribe capability · public request handling · persistence · test
  - Bound: generation and validation of a search-specific unsubscribe link; no-login alert disablement; invalid or altered-link handling; idempotent repeat use; focused tests only; no global unsubscribe or preference center
  - Demo: open a valid unsubscribe link without a session and show that alerts become disabled for only the referenced saved search
  - Blocked by: 1
- [ ] 5. Deliver hourly alerts without duplicate results
  - Layers: hourly scheduler · saved-search persistence · search execution · transactional email · unsubscribe · test
  - Bound: one hourly job over alerts-enabled searches; results newer than `last_run_at`; one alert email through the existing transactional mailer; inclusion of the slice-specific unsubscribe link; advancement of `last_run_at` after delivery; focused eligible, disabled, no-new-results, new-results, and second-run-no-duplicate cases only; no configurable cadence or batching redesign
  - Demo: run the job for an enabled saved search with one new matching result, receive one email containing that result and an unsubscribe link, then run it again and observe no duplicate email
  - Blocked by: 1, 4

## Verification
<!-- written by the whole-feature verification pass when it runs; empty until then -->

## Confirmation
<!-- user confirmation words and date; empty while status is open -->
```

Downstream implementation skills expect this contract at `docs/specs/2026-07-28-saved-searches-slices.md`. If you confirm these slices, I can record your exact approval and present the confirmed contract in chat; the file can be written when implementation starts if you later permit it.