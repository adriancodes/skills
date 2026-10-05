---
spec: ../../2026-07-28-saved-searches.md
status: open
---

# Saved searches with email alerts

Source: confirmed spec dated 2026-07-28, approved 2026-07-30. The spec lives at the repository root; the frontmatter path is relative to this plan.

This workspace contains the spec and README only. The bounds below name confirmed implementation surfaces rather than inventing existing source paths or test commands. Each slice includes its behavior tests and is bounded to one implementation session in the application repository. Map these surfaces to actual files and the existing test runner before implementation.

## Slices

- [ ] 1. Save a search and run it again from the sidebar
  - Layers: saved_searches storage · authenticated create/list API · results page and account sidebar · tests
  - Bound: One table with user id, name, JSON query params, alerts_enabled, and last_run_at; POST /saved-searches and GET /saved-searches; Save search button; sidebar list with run-again links. Persist query and filters, default alerts to off, and enforce 20 saved searches per user with 422 on a further create. Excludes deletion and alert controls/delivery. One session for this save/list/rerun path and its tests.
  - Demo: Save a query with filters, reload, and run it from the sidebar with the same query and filters. Verify alerts default off, unauthenticated requests fail, users cannot list another user's searches, and the 21st create returns 422 without adding a row. Run the focused storage/API/UI tests.
  - Blocked by: none

- [ ] 2. Delete a saved search from the sidebar
  - Layers: saved_searches storage · authenticated delete API · sidebar action · tests
  - Bound: DELETE /saved-searches/:id and a sidebar delete action; persist removal and update the list. Cover authentication and ownership. Excludes changes to creation, rerun, or alert delivery. One session for this removal path and its tests.
  - Demo: Delete an entry, reload, and verify it stays absent and a saved-search slot is available again. Verify unauthenticated deletion fails and another user's entry cannot be deleted. Run the focused deletion tests and slice 1 regression checks.
  - Blocked by: 1

- [ ] 3. Enable and disable alerts per saved search
  - Layers: saved_searches storage · authenticated mutation API · sidebar toggle · tests
  - Bound: Per-entry toggle that persists alerts_enabled, including its authenticated ownership-scoped mutation. The mutation route is an implementation choice because the spec does not name it. Excludes scheduling, email templates, and unsubscribe. One session for this preference path and its tests.
  - Demo: Confirm a newly saved search is off; toggle it on, reload, toggle it off, and reload again. Verify each state persists and unauthorized users cannot change it. Run focused toggle tests and save/list regression checks.
  - Blocked by: 1

- [ ] 4. Deliver hourly alerts with one-click unsubscribe
  - Layers: hourly background job · search execution and watermark storage · existing transactional mailer · login-free unsubscribe endpoint · tests
  - Bound: Schedule the hourly job; execute alerts-enabled searches with their stored query and filters; email only results newer than last_run_at and then advance that watermark. Every email includes a search-specific one-click unsubscribe link that disables only that search's alerts without login. Include link generation/validation and mailer integration. Excludes digest options, search editing, and changes to the hourly cadence. One session for this complete delivery path and its tests.
  - Demo: Using controlled result timestamps and the mailer test capture, enable one saved search and invoke the hourly job. Verify only newer matching results are emailed, the watermark advances, and a repeated run sends no duplicate results. Verify disabled searches send no mail. Follow the email's unsubscribe link without a session, verify that search is disabled while another enabled search remains enabled, and invoke the job again to prove no further mail for the unsubscribed search. Run focused job/mailer/unsubscribe tests plus the preceding slices' regression checks.
  - Blocked by: 3

Slices 2 and 3 can start after slice 1; neither needs the other. Slice 4 needs slice 3 to provide the user-controlled opt-in. It can proceed independently of slice 2. All blockers refer to existing IDs, the graph has no cycles, and slice 1 can start immediately.

## Verification

## Confirmation

Awaiting the user's review and approval of this breakdown. Spec approval is recorded in the source spec; it does not confirm these slices.
