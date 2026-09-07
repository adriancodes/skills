I’ll anchor on the confirmed saved-searches spec and repository guidance, then write the required local slices contract and present the same task breakdown here for review. I’ll stop before recording confirmation.

The fixture contains only the confirmed spec—no application code or repository-specific instructions—so the concrete layers are the specified storage, authenticated HTTP/actions, results/account UI, hourly job, mail delivery, and focused tests. I found no prefactoring target; the first slice will carry the minimum schema needed for its user-visible save/list flow.

Created the open slices contract: [2026-09-04-saved-searches-slices.md](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/skill-review-probe-ZynFca/docs/specs/2026-09-04-saved-searches-slices.md).

1. Save a search and see it in the account sidebar

   - Layers: storage · authenticated POST/GET API · results/sidebar UI · tests
   - Bound: schema, save/list endpoints, UI controls, ownership, alerts-off default, and 20-search limit.
   - Demo: save a search, see it in the sidebar, and reject a twenty-first search with 422.
   - Blocked by: none

2. Run or delete one saved search

   - Layers: authenticated DELETE API · sidebar/results UI · tests
   - Bound: run-again link, deletion, ownership, and missing-record cases.
   - Demo: reopen a saved search and delete it without affecting other entries.
   - Blocked by: 1

3. Opt one saved search into or out of alerts

   - Layers: storage · authenticated toggle action · sidebar UI · tests
   - Bound: persistent per-search toggle, feedback, and ownership checks.
   - Demo: enable an alert, reload to verify persistence, then disable it.
   - Blocked by: 1

4. Send one hourly alert without duplicates

   - Layers: hourly job · storage · search execution · transactional mailer · tests
   - Bound: enabled searches, `last_run_at` filtering and advancement, failure handling, and duplicate prevention.
   - Demo: a new matching result produces one email; another run produces none.
   - Blocked by: 3

5. Unsubscribe directly from an alert email

   - Layers: email link · unauthenticated unsubscribe action · storage · tests
   - Bound: search-specific link, disabling only that search, repeated requests, and invalid/altered links.
   - Demo: unsubscribe while signed out; the saved search remains but future alerts stop.
   - Blocked by: 4

Slices 2 and 3 can proceed independently after slice 1.

One review point: the spec requires an alert toggle but names no corresponding API endpoint. Slice 3 deliberately says “authenticated alert-toggle action” without inventing its route or transport.

Please confirm these slices, or tell me what to recut. On approval, I’ll record your exact confirmation and change the contract status to `confirmed`.