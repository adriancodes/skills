I’ll use the supplied create-tasks instructions to read the confirmed spec and relevant code, then return the full task contract in chat without creating a file.

The spec is confirmed. The repository contains only the spec and README, so implementation file paths remain choices. These three tasks cover the confirmed behavior; each is bounded to one agent session.

```md
---
spec: 2026-07-28-saved-searches.md
status: open
---

## Slices

- [ ] 1. Save a search and run it again
  - Layers: storage · authenticated API · results page · account sidebar · tests
  - Bound: Add the saved_searches table with the specified fields; implement POST and GET /saved-searches; add the Save search button and sidebar list with run-again links. Store query and filters as JSON, default alerts to off, and enforce 20 searches per user. Exclude deletion and alert delivery. One agent session.
  - Demo: Save a named search with filters, reload the account sidebar, and run it again with the same query and filters. Verify persistence, alerts off by default, authentication, user isolation, and a 422 response for the 21st search.
  - Blocked by: none

- [ ] 2. Delete a saved search
  - Layers: storage · authenticated API · account sidebar · tests
  - Bound: Implement DELETE /saved-searches/:id and its sidebar action. Limit changes to deletion, list refresh, and ownership checks. One agent session.
  - Demo: Delete an entry and verify it remains absent after reload. Verify unauthenticated requests and another user's deletion attempts cannot remove it. After reaching the limit, delete one entry and successfully save a replacement.
  - Blocked by: 1

- [ ] 3. Opt into email alerts and stop them
  - Layers: storage · toggle and unsubscribe handlers · account sidebar · hourly job · transactional mailer · tests
  - Bound: Add the per-search alert toggle and persistence handler; one hourly job using the existing search execution path and transactional mailer; one alert email template with a one-click unsubscribe link. Email only matching results newer than last_run_at, then advance it. Include authenticated ownership checks for toggle changes and search-scoped unsubscribe without login. Exclude search editing and additional delivery channels. One agent session using existing search and mail infrastructure.
  - Demo: Enable alerts on one saved search, introduce a newer matching result, and invoke the scheduled job through its test entry point. Verify the email contains that result and an unsubscribe link, and last_run_at advances. Run again without new results and verify no duplicate mail. Verify older and nonmatching results are excluded and disabled searches produce no mail. Disable through the sidebar, then separately unsubscribe without login; verify each persists and stops subsequent alerts for that search.
  - Blocked by: 1

## Verification

## Confirmation

Pending approval of this breakdown. The spec's confirmation does not confirm these tasks.
```

Tasks 2 and 3 can proceed independently after task 1. No files were changed. Downstream workflows expect `docs/specs/2026-10-04-saved-searches-slices.md`; I can save the contract there when implementation starts.

Do you approve this breakdown?