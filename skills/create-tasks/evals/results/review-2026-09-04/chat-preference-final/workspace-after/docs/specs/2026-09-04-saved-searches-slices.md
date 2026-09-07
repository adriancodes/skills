---
spec: docs/specs/2026-07-28-saved-searches.md
status: open
---
## Slices
- [ ] 1. Save the current search
  - Layers: persistence · authenticated create API · results-page UI · test
  - Bound: The `saved_searches` storage needed by the confirmed spec; `POST /saved-searches`; authentication; alerts defaulting off; preservation of the current query and filters as JSON; the results-page "Save search" action; the 20-search limit and its 422 response; focused create, authorization, persistence, and limit tests. No listing, deletion, alert delivery, toggling, or unsubscribe behavior.
  - Demo: An authenticated user saves the query and filters shown on the results page and sees a success state; a twenty-first save shows the 422 limit outcome, while an unauthenticated save is rejected.
  - Blocked by: none
- [ ] 2. List and rerun saved searches
  - Layers: persistence · authenticated list API · account-sidebar UI · search navigation · test
  - Bound: `GET /saved-searches`; authentication; the account-sidebar saved-search list; saved names; run-again links that restore each entry's query and filters; empty state; focused list, authorization, rendering, and navigation tests. No deletion or alert controls.
  - Demo: A user with a saved search opens the account sidebar, sees its name, clicks its run-again link, and reaches results with the saved query and filters restored; a user with none sees the empty state.
  - Blocked by: 1
- [ ] 3. Delete a saved search
  - Layers: persistence · authenticated delete API · test
  - Bound: `DELETE /saved-searches/:id`; authentication; ownership enforcement; successful deletion and missing-or-foreign-id behavior; focused endpoint and persistence tests. No sidebar delete interaction, because the confirmed UI surface does not specify one.
  - Demo: An authenticated delete request removes the user's selected search, a subsequent list request no longer returns it, and another user cannot delete it.
  - Blocked by: 1
- [ ] 4. Toggle alerts for one saved search
  - Layers: persistence · authenticated alert-toggle behavior · account-sidebar UI · test
  - Bound: The confirmed per-search toggle behavior, with the route and method left to implementation; ownership enforcement; the alert control and current state in the saved-search sidebar; focused API, persistence, authorization, and UI tests. No hourly execution or email delivery.
  - Demo: A user switches alerts on for one sidebar entry, reloads the list, and sees that entry still enabled without changing another saved search; another user cannot change it.
  - Blocked by: 1, 2
- [ ] 5. Send hourly alerts only for new matches
  - Layers: scheduler · saved-search persistence · search execution · transactional email · test
  - Bound: One hourly job; alerts-enabled searches only; execution from stored query and filters; results strictly newer than `last_run_at`; one alert-email format using the existing transactional mailer; advancing `last_run_at` after successful processing; focused scheduling, matching, deduplication, mail, and failure-path tests. No unsubscribe handling.
  - Demo: Running the job for an enabled saved search emails only matching results newer than its prior run, advances `last_run_at`, and sends no duplicate results on an immediate second run; a disabled search sends nothing.
  - Blocked by: 1
- [ ] 6. Unsubscribe from a saved-search alert without login
  - Layers: email link · public unsubscribe handling · persistence · user-facing response · test
  - Bound: A tamper-resistant one-click link in every saved-search alert email; no-login handling that disables alerts for exactly that saved search; success, already-disabled, and invalid-or-tampered-link responses; focused link, authorization-token, persistence, and response tests. No global unsubscribe or account-wide preference.
  - Demo: A recipient follows the link in an alert email while logged out, sees a clear success response, and the next hourly run sends no email for that search; an altered link changes nothing.
  - Blocked by: 5

## Verification
<!-- written by the whole-feature verification pass when it runs; empty until then -->

## Confirmation
<!-- user confirmation words and date; empty while status is open -->
