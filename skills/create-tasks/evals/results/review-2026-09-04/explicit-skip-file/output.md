I’ll read the confirmed saved-searches spec and repository guidance, map the touched layers, then return the complete parseable slices contract here without writing files. I’ll stop at the confirmation gate.

The feature touches: persistence · authenticated HTTP/actions · results UI · account sidebar · search execution · scheduler · mailer · unsubscribe security · focused tests.

Per your instruction, I wrote no files. Here is the parseable slices contract:

```md
---
spec: docs/specs/2026-07-28-saved-searches.md
status: open
---
## Slices
- [ ] 1. Save and rerun a search
  - Layers: persistence · authenticated API · results UI · account sidebar · test
  - Bound: `saved_searches` storage for user, name, query JSON, and alerts-off default; `POST /saved-searches`; `GET /saved-searches`; Save search control; sidebar list; run-again links; authentication and ownership cases. Excludes limits, deletion, toggling, delivery, and unsubscribe.
  - Demo: An authenticated user saves the current query and filters, sees it in the account sidebar, and follows its link to rerun the same search; another user cannot access it.
  - Blocked by: none
- [ ] 2. Enforce the saved-search limit
  - Layers: authenticated API · results UI · test
  - Bound: The 20-search limit on `POST /saved-searches`, its 422 response, and a visible save failure message. Excludes configurable limits and bulk deletion.
  - Demo: A user with 20 saved searches attempts another save, sees an explanatory error, and remains at 20 records.
  - Blocked by: 1
- [ ] 3. Delete a saved search
  - Layers: authenticated API · account sidebar · persistence · test
  - Bound: `DELETE /saved-searches/:id`, the sidebar delete interaction, list refresh, ownership checks, and missing-record behavior. Excludes bulk deletion and undo.
  - Demo: A user deletes one sidebar entry; it disappears and can no longer be rerun, while another user cannot delete it.
  - Blocked by: 1
- [ ] 4. Turn alerts on and off
  - Layers: authenticated server action · account sidebar · persistence · test
  - Bound: One per-search alert-toggle action, sidebar toggle state and feedback, `alerts_enabled`, and ownership checks. Excludes alert execution and email delivery.
  - Demo: A newly saved search shows alerts off; its owner turns alerts on and off from the sidebar and sees the state persist after reload.
  - Blocked by: 1
- [ ] 5. Deliver hourly new-result alerts
  - Layers: persistence · scheduler · search execution · transactional mailer · test
  - Bound: Hourly processing of alerts-enabled searches, matching-result execution, results newer than `last_run_at`, one alert-email template, successful advancement of `last_run_at`, duplicate prevention, and no-new-result behavior. Excludes retry-policy redesign and mailer replacement.
  - Demo: Enable an alert, add a newer matching result, run the hourly job, and observe one email; rerunning without newer results sends nothing.
  - Blocked by: 4
- [ ] 6. Unsubscribe from an alert email
  - Layers: email template · signed public action · persistence · confirmation UI · test
  - Bound: A one-click per-search unsubscribe link, tamper-resistant token validation, disabling that search without login, success feedback, and invalid or expired-link behavior. Excludes global email preferences and resubscription outside the existing sidebar toggle.
  - Demo: Follow an alert email’s unsubscribe link while logged out; the targeted search becomes disabled and later job runs send no alert for it.
  - Blocked by: 5

## Verification
<!-- written by the whole-feature verification pass when it runs; empty until then -->

## Confirmation
<!-- user confirmation words and date; empty while status is open -->
```

Edges leave slice 1 immediately actionable; slices 2 and 3 can proceed independently after it, while alert delivery follows the toggle and unsubscribe follows delivery.

Downstream skills expect this contract at `docs/specs/2026-09-04-saved-searches-slices.md`. I can write it when implementation starts. Please confirm these slices or tell me what to recut.