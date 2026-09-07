---
status: confirmed
started: 2026-07-28
---

# Spec: Saved searches with email alerts

## Branches

- [x] Scope — resolved
- [x] Storage — resolved
- [x] API surface — resolved
- [x] UI surface — resolved
- [x] Alert delivery — resolved
- [x] Alert toggle — resolved
- [x] Unsubscribe — resolved
- [x] Limits — resolved

## Decisions

1. **Scope** — Users save a search (query plus filters) and optionally receive email alerts when new results match it. _Why:_ most-requested feature; alerts drive return visits.
2. **Storage** — One `saved_searches` table: user id, name, query params as JSON, `alerts_enabled`, `last_run_at`. _Why:_ a single table covers both the saved list and alert scheduling.
3. **API surface** — `POST /saved-searches`, `GET /saved-searches`, `DELETE /saved-searches/:id`; authentication required on all three. _Why:_ minimal surface; editing a saved search can wait.
4. **UI surface** — A "Save search" button on the results page; the saved list in the account sidebar with a run-again link per entry. _Why:_ reuses the existing sidebar; no new page.
5. **Alert delivery** — An hourly background job runs each alerts-enabled search and emails only results newer than `last_run_at`, then advances it. _Why:_ hourly is fresh enough; diffing on `last_run_at` prevents duplicate mail.
6. **Alert toggle** — Per-search toggle in the saved list; alerts are off by default when a search is saved. _Why:_ saving and alerting are separate intents.
7. **Unsubscribe** — Every alert email carries a one-click unsubscribe link that disables that search's alerts without login. _Why:_ deliverability requirement.
8. **Limits** — 20 saved searches per user; the create endpoint returns 422 beyond that. _Why:_ caps job cost; raise later if usage warrants.

## Assumptions

- ASSUMED: the existing transactional mailer is used for alert emails.

## Confirmation

Confirmed by the user on 2026-07-30: "Confirmed — build it as specced."
