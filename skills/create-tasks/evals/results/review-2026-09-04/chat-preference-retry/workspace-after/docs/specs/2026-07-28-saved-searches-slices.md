---
spec: docs/specs/2026-07-28-saved-searches.md
status: open
---
## Slices
- [ ] 1. Save a search and run it again
  - Layers: storage · authenticated API · results UI · account sidebar UI · test
  - Bound: the `saved_searches` data needed by this slice; authenticated `POST /saved-searches` and `GET /saved-searches`; the results-page "Save search" action; sidebar listing and run-again links; alerts off by default; the 20-search limit and its 422 response; focused create/list/auth/limit/UI tests. Excludes deletion, alert toggling, delivery, and unsubscribe.
  - Demo: sign in, run a query with filters, save it, see it in the account sidebar, and use its link to restore the same results search; after 20 saved searches, another save is visibly rejected with the 422 outcome.
  - Blocked by: none
- [ ] 2. Delete a saved search from the sidebar
  - Layers: storage · authenticated API · account sidebar UI · test
  - Bound: authenticated `DELETE /saved-searches/:id`; deletion of only the current user's record; a delete control and resulting sidebar state; focused success, ownership/auth, missing-record, and UI tests. Excludes alert behavior.
  - Demo: delete one entry from the account sidebar, see it disappear, refresh, and confirm it remains absent while another user's saved search cannot be deleted.
  - Blocked by: 1
- [ ] 3. Turn alerts on or off for one saved search
  - Layers: storage · authenticated alert-toggle behavior · account sidebar UI · test
  - Bound: persistence and authenticated mutation behavior for `alerts_enabled`; one toggle per sidebar entry; default-off, ownership/auth, and UI-state tests. The concrete route or transport is chosen during this slice because the confirmed spec names the behavior but not that interface. Excludes job execution, email delivery, and unsubscribe.
  - Demo: a newly saved search shows alerts off; turn them on, refresh and see the state persist; turn them off and see the persisted state reverse.
  - Blocked by: 1
- [ ] 4. Send hourly alerts only for newly matched results
  - Layers: storage · background scheduler/job · search execution · transactional email · test
  - Bound: hourly processing of alerts-enabled saved searches; replay of each stored query and filters; selection of matches newer than `last_run_at`; one alert-email format sufficient to show matched results; advancement of `last_run_at`; focused tests for disabled searches, no new matches, successful delivery, duplicate prevention, and timestamp advancement. Excludes unsubscribe links and the public unsubscribe handler.
  - Demo: enable a saved search, add one matching result older and one newer than `last_run_at`, invoke the hourly job, receive one email containing only the newer result, then invoke it again and receive no duplicate.
  - Blocked by: 1
- [ ] 5. Unsubscribe from a saved-search alert without logging in
  - Layers: unsubscribe token/link · public HTTP behavior · storage · alert email · test
  - Bound: a one-click unsubscribe link identifying one saved search securely; inclusion of that link in every saved-search alert email; public handling that disables only that search's alerts; focused valid, invalid/tampered, repeated-use, and no-login tests. Excludes global email preferences and resubscription flows.
  - Demo: open an alert email while signed out, click its unsubscribe link, see confirmation, and verify a later hourly run sends no alert for that saved search.
  - Blocked by: 4

## Verification
<!-- written by the whole-feature verification pass when it runs; empty until then -->

## Confirmation
<!-- user confirmation words and date; empty while status is open -->
