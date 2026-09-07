I’ll read the repository guidance and the confirmed saved-searches spec, then return the complete parseable slices contract in chat only. I’ll stop after asking for confirmation.

No files were written. The feature touches persistence, authenticated APIs, results UI, account sidebar, search execution, background scheduling, mail delivery, public unsubscribe handling, and focused tests.

```md
---
spec: docs/specs/2026-07-28-saved-searches.md
status: open
---
## Slices
- [ ] 1. Save, list, and rerun a search
  - Layers: persistence · authenticated API · results UI · account sidebar · search-link serialization · test
  - Bound: One `saved_searches` table with the core user, name, query/filter JSON fields; `POST /saved-searches`; `GET /saved-searches`; the results-page “Save search” action; sidebar listing; run-again links preserving the saved query and filters; focused authentication and round-trip tests. No deletion, limits, or alert behavior.
  - Demo: Sign in, run a filtered search, save it, see it in the account sidebar, then use its run-again link to reproduce the same results query.
  - Blocked by: none
- [ ] 2. Delete a saved search
  - Layers: persistence · authenticated API · test
  - Bound: `DELETE /saved-searches/:id`, ownership enforcement, removal from subsequent list responses, and focused success, unauthorized, and missing-search cases. No sidebar deletion control because the confirmed spec does not require one.
  - Demo: Delete an owned search through the authenticated endpoint and verify it no longer appears in the saved-search list.
  - Blocked by: 1
- [ ] 3. Enforce the 20-search limit
  - Layers: persistence query · authenticated API · test
  - Bound: Count only the requesting user’s saved searches; return 422 from `POST /saved-searches` when that user already has 20; cover the 20th save, rejected 21st save, and isolation between users. No configurable limits or UI-specific error treatment.
  - Demo: A user with 19 searches can save one more; their next create request returns 422 while another user remains able to save.
  - Blocked by: 1
- [ ] 4. Toggle alerts for an individual saved search
  - Layers: persistence · authenticated server behavior · account sidebar UI · test
  - Bound: Add `alerts_enabled` to the existing table with alerts off for newly saved searches; provide the server interaction required by the confirmed per-search toggle; render and operate that toggle in the sidebar; enforce ownership; cover default-off and on/off transitions. The route or transport is intentionally left to this slice because the spec does not prescribe it.
  - Demo: Save a search, observe alerts off in the sidebar, turn them on, refresh and see the setting persist, then turn them off again.
  - Blocked by: 1
- [ ] 5. Disable alerts through a no-login unsubscribe link
  - Layers: persistence · public request handling · unsubscribe-link generation · test
  - Bound: A search-specific one-click link that disables `alerts_enabled` without login; prevent the link from changing another search or unrelated fields; cover valid and invalid links plus repeated clicks. No alert email or hourly job yet.
  - Demo: Enable alerts, open the generated unsubscribe link in a logged-out session, and verify that the saved search’s alert toggle becomes disabled.
  - Blocked by: 4
- [ ] 6. Send hourly alerts for newly matched results
  - Layers: persistence · search execution · background scheduling · transactional mailer · unsubscribe integration · test
  - Bound: Add and maintain `last_run_at`; schedule the hourly job; process only alerts-enabled searches; reuse the saved query and filters; email only matches newer than that search’s watermark; include its working unsubscribe link; advance the watermark to prevent duplicate mail. Cover one enabled search with new matches, a second run with no duplicates, a disabled search, and multiple searches with independent watermarks.
  - Demo: Enable alerts for a saved search, introduce a newer matching result, run the hourly job, inspect the delivered email and its unsubscribe link, then rerun the job and observe no duplicate email for that result.
  - Blocked by: 4, 5

## Verification
<!-- written by the whole-feature verification pass when it runs; empty until then -->

## Confirmation
<!-- user confirmation words and date; empty while status is open -->
```

Downstream implementation skills expect this contract at `docs/specs/2026-09-04-saved-searches-slices.md`. If you confirm these slices, I can record your exact confirmation and write the file when implementation starts. Do you confirm this task breakdown?