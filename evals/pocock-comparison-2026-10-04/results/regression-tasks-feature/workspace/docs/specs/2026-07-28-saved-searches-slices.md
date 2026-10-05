---
spec: 2026-07-28-saved-searches.md
status: open
---

# Saved searches with email alerts

The source spec is confirmed. This breakdown is awaiting review; implementation has not started.

Repository grounding: the saved-searches spec lives at the repository root. No application code, test harness, or repository path overrides are present in this workspace. The bounds below name confirmed behavior and affected surfaces, rather than claiming existing implementation paths. Choose concrete files and runnable test commands from the application repository when implementation begins.

The proposed table/API/UI/job/test phases are recut into three end-to-end slices. Tests belong to the behavior they verify. Each slice is bounded to one implementation session; unrelated search, account, and mailer refactors are outside scope.

## Slices

- [ ] 1. Save, list, rerun, and delete a search with alerts off
  - Layers: saved_searches migration and model · authenticated API · results page and account sidebar · tests
  - Bound: One saved_searches table with user id, name, query params as JSON, alerts_enabled, and last_run_at; POST /saved-searches, GET /saved-searches, and DELETE /saved-searches/:id; results-page Save search button; sidebar list with run-again links. Persist the current query and filters, default alerts to off, enforce 20 searches per user, and return 422 on the next create. Deletion is covered through the confirmed API; a separate delete UI is not required by the spec. Include only persistence, API, and UI checks for this saved-search lifecycle. Alert execution and toggle controls are deferred to the next slices.
  - Demo: In the application test environment, save a named search containing a query and filters, reload the sidebar, and run it again with the same parameters. Verify the record has alerts disabled, delete it through the API, and verify it disappears from GET and the refreshed list. Run automated checks for authentication on all three endpoints, user-scoped listing and deletion, JSON round-trip, alerts-off default, and the 20/21 boundary (including enforcement under concurrent creates). Include a UI journey covering save, reload, and rerun.
  - Blocked by: none

- [ ] 2. Enable and disable alerts from the saved list
  - Layers: saved_searches model · authenticated mutation API · sidebar toggle · tests
  - Bound: One per-search toggle in the existing saved list and the minimal authenticated mutation needed to persist alerts_enabled. The spec confirms toggle behavior but leaves the mutation route and method as implementation choices; choose and document them in this slice. Include persistence and user ownership checks plus toggle UI success and failure states. Do not add editing of names or query parameters, scheduling, or email delivery.
  - Demo: Save a search, enable its alerts in the sidebar, reload and verify the enabled state, then disable and reload again. Run automated checks for both transitions, authentication and ownership, persistence, and a failed request leaving the UI consistent with the stored state.
  - Blocked by: 1

- [ ] 3. Deliver hourly alerts and unsubscribe without login
  - Layers: hourly background job and search execution · saved_searches cursor updates · existing transactional mailer and email template · unsubscribe handler · tests
  - Bound: One hourly job over alerts-enabled searches; matching results newer than last_run_at; cursor advancement after processing; one alert email format using the existing transactional mailer; and a per-search, one-click unsubscribe link in every alert email. Implement a verifiable, search-scoped link that disables alerts without login. Keep job, email, cursor, and unsubscribe checks in this slice because they form one usable delivery path. No new mail provider, digest preferences, or search-editing surface. Define the initial cursor and failure/retry mechanics consistently with the spec's new-results and duplicate-prevention behavior, and document them with the implementation.
  - Demo: In a controlled test environment with a captured mailer, enable a saved search and seed its last_run_at plus matching results on both sides of that timestamp. Trigger the hourly worker; verify the email includes only newer matches and includes an unsubscribe link, and verify the cursor advances. Trigger it again with no new matches and verify no repeat email; add a newer match and verify it appears on the next run. Open the email's unsubscribe link without a session, verify only that search is disabled and the sidebar reflects it after reload, then verify subsequent runs send no alerts for it. Run automated checks for the hourly registration, disabled searches, timestamp boundary, no-match runs, first enablement, delivery failure/retry, link tampering, repeated unsubscribe, and search-scoped disabling.
  - Blocked by: 2

The dependency chain is deliberately serial: slice 2 uses the records and sidebar from slice 1; slice 3 needs the persisted opt-in behavior from slice 2 for its complete demo. Slice 1 can start immediately after this breakdown is approved and the application repository is available. All blocker IDs exist and the graph has no cycles.

## Verification

## Confirmation

Awaiting the user's review and approval of this breakdown. The source spec's confirmation on 2026-07-30 does not confirm these slices. Record the user's actual approval words and date here before setting status to confirmed.
