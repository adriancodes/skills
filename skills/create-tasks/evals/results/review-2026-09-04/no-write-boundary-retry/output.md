I’m applying the supplied `create-tasks` skill. I’ll inspect the repository and full confirmed spec, then return the complete parseable slices contract in chat only—no planning file will be written. I’ll stop at the confirmation gate.

The spec is confirmed and the workspace contains no application source beyond that spec, so the repository’s concrete framework/file boundaries are unavailable. I’ll keep implementation paths open where the spec does, while bounding each slice by named routes, UI surfaces, job behavior, and focused cases.

No files were written.

Layers identified: storage · authentication · saved-search API · search execution · results UI · account sidebar · scheduler/background job · transactional mailer · unsubscribe endpoint · focused tests.

No prefactoring slice is identifiable because the fixture contains only the spec.

```md
---
spec: docs/specs/2026-07-28-saved-searches.md
status: open
---
## Slices
- [ ] 1. Save a search from the results page
  - Layers: storage · authentication · create API · results UI · test
  - Bound: `saved_searches` storage with the six specified fields; authenticated `POST /saved-searches`; the results-page "Save search" action; query-and-filter JSON preservation; alerts off by default; ownership enforcement; and the 20-search limit with a 422 response for the twenty-first search.
  - Demo: an authenticated user saves the current query and filters from the results page and receives a successful response; an unauthenticated request is rejected, and a user with 20 saved searches receives 422.
  - Blocked by: none
- [ ] 2. List, rerun, and delete saved searches
  - Layers: storage · authentication · list/delete API · account sidebar · search navigation · test
  - Bound: authenticated `GET /saved-searches`; authenticated `DELETE /saved-searches/:id`; the account-sidebar saved-search list; one run-again link per entry that restores its query and filters; empty state; deletion ownership and missing-record behavior. No editing or dedicated saved-search page.
  - Demo: a user sees only their saved searches in the account sidebar, follows a run-again link to the corresponding results, and can delete one through the API without affecting another user's entries.
  - Blocked by: 1
- [ ] 3. Toggle alerts for one saved search
  - Layers: storage · authentication · alert-toggle API behavior · account sidebar · test
  - Bound: one authenticated mutation for `alerts_enabled`, using the repository's established route convention; one per-search sidebar toggle; ownership enforcement; success, unauthorized, forbidden/not-found, enable, and disable cases. No bulk alert controls or editing of search criteria.
  - Demo: toggling an owned saved search on or off in the sidebar persists the state after reload, while another user cannot change it.
  - Blocked by: 1
- [ ] 4. Send hourly alerts for new matching results
  - Layers: scheduler · background job · saved-search storage · search execution · transactional mailer · test
  - Bound: hourly scheduling; enabled searches only; execution using stored query parameters; results newer than each search's `last_run_at`; one alert email through the existing transactional mailer; advancement of `last_run_at` after delivery; focused cases for disabled searches, no new matches, new matches, duplicate prevention, and failed delivery. No digest preferences or scheduling controls.
  - Demo: with one result before and one after a saved search's recorded run time, an hourly job sends only the newer match and advances `last_run_at`; rerunning it sends no duplicate.
  - Blocked by: 3
- [ ] 5. Unsubscribe from an alert without logging in
  - Layers: alert email · unsubscribe token/link · public endpoint · saved-search storage · test
  - Bound: a tamper-resistant per-search unsubscribe link in every alert email; no-login handling that disables only the linked search; confirmation response; valid, repeated, malformed, and tampered-link cases. No global unsubscribe or account preference center.
  - Demo: following the link from an alert email while logged out disables alerts for that saved search; following it again is safe, and a modified link cannot alter another search.
  - Blocked by: 4

## Verification
<!-- written by the whole-feature verification pass when it runs; empty until then -->

## Confirmation
<!-- user confirmation words and date; empty while status is open -->
```

The dependency graph permits slices 2 and 3 to proceed independently after the save-search tracer; alert delivery then depends on toggling, and unsubscribe depends on the delivered email.

Downstream implementation skills expect this contract in `docs/specs/2026-09-04-saved-searches-slices.md`. Your no-write instruction takes precedence, so it exists only in chat. If you later want implementation to begin, I can write the confirmed contract then.

Please confirm these slices or tell me what to recut.