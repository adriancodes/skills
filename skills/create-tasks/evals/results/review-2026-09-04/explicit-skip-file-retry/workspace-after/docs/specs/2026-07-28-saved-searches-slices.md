---
spec: docs/specs/2026-07-28-saved-searches.md
status: open
---
## Slices
- [ ] 1. Save and rerun a search
  - Layers: persistence · authenticated API · results UI · account sidebar · test
  - Bound: The `saved_searches` storage needed for user id, name, query-parameter JSON, `alerts_enabled` defaulting off, and `last_run_at`; authenticated `POST /saved-searches` and `GET /saved-searches`; the results-page “Save search” action; sidebar listing and run-again links; ownership and unauthenticated-request cases. Excludes deletion, the 20-search cap, alert toggling, delivery, and unsubscribe.
  - Demo: Sign in, run a filtered search, save it, see it in the account sidebar with alerts off, then use its link to rerun the same query and filters; another user cannot list it.
  - Blocked by: none
- [ ] 2. Keep the saved-search collection under control
  - Layers: persistence · authenticated API · account sidebar · test
  - Bound: Authenticated `DELETE /saved-searches/:id`, owner-only deletion, the 20-search-per-user create check and 422 response, sidebar deletion interaction, and focused boundary/error tests. Excludes editing searches and all alert behavior.
  - Demo: Delete one owned search from the sidebar and see it disappear; with 20 saved searches, attempt one more save and observe a 422 without a 21st record being created.
  - Blocked by: 1
- [ ] 3. Turn alerts on or off per saved search
  - Layers: persistence · authenticated API · account sidebar · test
  - Bound: The authenticated owner-only behavior needed to change `alerts_enabled`, the per-search sidebar toggle and state feedback, and focused authorization/state tests. The route and HTTP method are left to implementation because the confirmed spec names the behavior but not that endpoint. Excludes job execution, email delivery, and unsubscribe.
  - Demo: Toggle one saved search on in the sidebar, reload and see it remain on, then toggle it off; a different user cannot change it.
  - Blocked by: 1
- [ ] 4. Send hourly alerts without duplicate results
  - Layers: scheduler · search execution · persistence · transactional mailer · test
  - Bound: One hourly job over alerts-enabled searches; execution using each stored query and filters; selection of results newer than `last_run_at`; one alert-email template; advancing `last_run_at`; focused cases for enabled versus disabled searches, new versus old results, repeat runs, and mailer failure. Excludes unsubscribe-link handling and scheduler deployment configuration outside the application.
  - Demo: Enable a saved search, add one matching result newer than its checkpoint, run the job and receive one email containing that result; run the job again and receive no duplicate.
  - Blocked by: 3
- [ ] 5. Unsubscribe from one search without signing in
  - Layers: unsubscribe security · public HTTP handler · persistence · alert email · test
  - Bound: A tamper-resistant, search-specific one-click unsubscribe URL in alert emails; the unauthenticated handler that disables only that saved search; a confirmation response; focused tests for valid, modified, stale-or-deleted-search, and repeated links. Excludes account-wide unsubscribe and deletion of the saved search.
  - Demo: Open an alert email while signed out, follow its unsubscribe link, see confirmation, and verify that search’s alert toggle is off while another saved search remains unchanged.
  - Blocked by: 3

## Verification
<!-- written by the whole-feature verification pass when it runs; empty until then -->

## Confirmation
<!-- user confirmation words and date; empty while status is open -->
