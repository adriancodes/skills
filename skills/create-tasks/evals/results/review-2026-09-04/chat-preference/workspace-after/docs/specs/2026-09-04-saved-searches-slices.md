---
spec: docs/specs/2026-07-28-saved-searches.md
status: open
---
## Slices
- [ ] 1. Save a search and see it in the account sidebar
  - Layers: saved-search storage · authenticated POST/GET API · results-page and account-sidebar UI · test
  - Bound: `saved_searches` records with user id, name, query JSON, alerts disabled by default, and `last_run_at`; `POST /saved-searches`; `GET /saved-searches`; the results-page "Save search" control; the sidebar list; ownership checks; the 20-search limit and 422 response; focused success, authentication, ownership, default-alert, and limit tests. No delete, run-again, alert-toggle, job, email, or unsubscribe behavior.
  - Demo: sign in, save the current query and filters from the results page, then see the named search in the account sidebar with alerts off; attempt a twenty-first save and see the 422 limit response without a new entry.
  - Blocked by: none
- [ ] 2. Run or delete one saved search from the sidebar
  - Layers: authenticated DELETE API · account-sidebar and search-results UI · test
  - Bound: `DELETE /saved-searches/:id`; the run-again link built from the stored query JSON; the per-entry delete interaction; ownership and missing-record cases; focused navigation, deletion, authentication, and ownership tests. No editing, alert-toggle, job, email, or unsubscribe behavior.
  - Demo: choose a saved entry to reopen its query and filters on the results screen, then delete it from the sidebar and see only that entry disappear; another user's entry cannot be opened through the list or deleted.
  - Blocked by: 1
- [ ] 3. Opt one saved search into or out of alerts
  - Layers: saved-search storage · authenticated alert-toggle action · account-sidebar UI · test
  - Bound: the authenticated per-search mutation needed by the specified toggle; the sidebar toggle and state feedback; ownership checks; focused on/off, authentication, and ownership tests. No alert execution, email delivery, unsubscribe, or editing of search criteria.
  - Demo: turn alerts on for one sidebar entry, reload and see the enabled state persist, then turn it off without changing another saved search.
  - Blocked by: 1
- [ ] 4. Send one hourly alert without duplicate results
  - Layers: hourly job · saved-search storage · existing search execution · transactional mailer · test
  - Bound: scheduling and processing for alerts-enabled searches; matching only results newer than each entry's `last_run_at`; one alert email per processed search when new matches exist; advancing `last_run_at` after successful processing; focused tests for disabled searches, no new matches, new matches, repeated runs, and mail/search failure. No unsubscribe handler or changes to saved-search criteria.
  - Demo: enable an alert, add one matching result newer than `last_run_at`, run the job and observe one email containing that result; run it again without newer results and observe no second email.
  - Blocked by: 3
- [ ] 5. Unsubscribe from one search directly from its alert email
  - Layers: alert-email link · unauthenticated unsubscribe action · saved-search storage · test
  - Bound: a search-specific one-click unsubscribe link in every alert email; the no-login handler that disables only the referenced search; invalid or altered-link handling; focused successful, repeated, cross-search, and invalid-link tests. No account-wide unsubscribe or deletion of the saved search.
  - Demo: follow the link in an alert email while signed out, see a success response, and verify that the referenced saved search remains present with alerts disabled and receives no email on the next hourly run.
  - Blocked by: 4

## Verification
<!-- written by the whole-feature verification pass when it runs; empty until then -->

## Confirmation
<!-- user confirmation words and date; empty while status is open -->
