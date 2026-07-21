I’ll trace the request, persistence, async export path, retention-related configuration, and supporting tests. I’ll keep the inspection narrowly scoped and make no changes.

An audit event follows this path:

1. `POST /audit/events` is routed to the audit handler.
2. The JSON body is wrapped with a generated UUID and timestamp.
3. The event is inserted into `audit_events` inside a database transaction.
4. Only after that transaction resolves, an `audit.export.requested` job containing the event ID is published.
5. A separate worker receives the job and copies `audit-events/{eventId}.json` to the configured archive bucket, applying the configured retention period.
6. The HTTP handler returns `202` only after both persistence and queue publication have completed. Export execution itself remains asynchronous.

```mermaid
sequenceDiagram
    participant C as HTTP client
    participant R as Audit router
    participant S as Audit service
    participant DB as Database transaction
    participant Q as Audit queue
    participant W as Export worker
    participant O as Object store

    C->>R: POST /audit/events + JSON
    R->>S: recordAuditEvent(body)
    S->>S: Generate ID and recordedAt
    S->>DB: transaction(insert audit_events)
    DB-->>S: Transaction resolves
    S->>Q: publish audit.export.requested {eventId}
    Q-->>S: Publication resolves
    S-->>R: event
    R-->>C: 202 {eventId}

    Q-->>W: asynchronous job delivery
    W->>O: copy audit-events/{eventId}.json
    Note over W,O: archive bucket + expiresInDays
```

Text fallback: `HTTP → router → service → DB transaction → queue publish → 202`; independently, `queue consumer → export worker → object-store archive with retention`.

## Confirmed facts

### HTTP request

The top-level server dispatches every path beginning with `/audit` to `handleAuditRequest` ([server.ts:4](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-heldout-audit-export-prompt-work-EIv7Kw/src/server.ts:4)).

`handleAuditRequest` accepts only `POST /audit/events`. It parses the request body as JSON, calls `recordAuditEvent`, and returns `{ eventId }` with status `202` ([router.ts:3](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-heldout-audit-export-prompt-work-EIv7Kw/src/audit/router.ts:3)).

Because the handler awaits `recordAuditEvent`, the `202` response is not sent until the database operation and queue publication both resolve.

### Persistence and transaction boundary

`recordAuditEvent`:

- rejects null and non-object input;
- creates an event with `id`, the original body as `payload`, and an ISO `recordedAt`;
- runs `insertAuditEvent` through `database.transaction`;
- publishes export work only after that transaction call resolves.

This ordering is explicit in [service.ts:5](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-heldout-audit-export-prompt-work-EIv7Kw/src/audit/service.ts:5).

The transaction boundary covers only:

```text
insertAuditEvent(tx, event)
```

The queue publish is outside the transaction. The repository inserts the complete event into the `audit_events` table ([repository.ts:3](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-heldout-audit-export-prompt-work-EIv7Kw/src/audit/repository.ts:3)).

In this fixture, `database.transaction` and its `insert` operation are stubs: the callback is executed, but no real storage engine or commit/rollback implementation exists ([database.ts:3](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-heldout-audit-export-prompt-work-EIv7Kw/src/storage/database.ts:3)).

### Asynchronous handoff and export

After persistence resolves, `enqueueAuditExport` publishes:

```text
topic: audit.export.requested
payload: { eventId }
```

See [queue.ts:1](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-heldout-audit-export-prompt-work-EIv7Kw/src/export/queue.ts:1).

`handleAuditExport` is the separate consumer-side entry point. It passes the ID to `archiveAuditEvent` ([worker.ts:3](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-heldout-audit-export-prompt-work-EIv7Kw/src/export/worker.ts:3)).

The sink copies the object named `audit-events/{eventId}.json` into the archive bucket and supplies `expiresInDays` ([sink.ts:3](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-heldout-audit-export-prompt-work-EIv7Kw/src/export/sink.ts:3)).

### Retention configuration

Retention is archive-object expiration, configured by:

```text
AUDIT_RETENTION_DAYS
```

It is converted with `Number(...)` and defaults to 30 days. The archive bucket comes from `AUDIT_ARCHIVE_BUCKET`, defaulting to `audit-dev` ([config.ts:1](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-heldout-audit-export-prompt-work-EIv7Kw/src/config.ts:1)).

No retention control is present for rows in `audit_events`; the setting is used only as the object-store copy’s `expiresInDays`.

### Test coverage

The sole audit-flow test records an event, checks that it has an ID, and then invokes the export worker separately ([audit-flow.test.ts:4](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-heldout-audit-export-prompt-work-EIv7Kw/tests/audit-flow.test.ts:4)). Its comment explicitly documents that the HTTP path does not call the worker directly.

The test demonstrates the intended two-stage API shape, but it does **not** independently verify:

- transaction commit behavior;
- that insertion occurred before publication;
- the queue topic or payload;
- worker delivery or retry behavior;
- the object key, bucket, or retention value;
- the HTTP routing or `202` response.

The README also characterizes this repository as intentionally non-runnable and says its tests are behavioral documentation ([README.md:1](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-heldout-audit-export-prompt-work-EIv7Kw/README.md:1)).

## Inference

- Persistence-before-publication follows from sequential `await` statements. Assuming the real `database.transaction` resolves only after commit, the job becomes publishable after commit.
- There is a failure gap: if the transaction commits and queue publication then fails, the event remains persisted without an export job. No outbox or atomic database/queue mechanism is shown.
- Since queue publication is awaited, “asynchronous” refers to worker execution, not fire-and-forget request handling.
- `expiresInDays` appears intended to drive archive lifecycle expiration, but its exact semantics depend on the unseen `objectStore.copy` implementation.

## Unknowns

- How persisted database data becomes the source object `audit-events/{eventId}.json`; no serialization or object creation step exists here.
- How the queue topic is connected to `handleAuditExport`.
- Queue delivery guarantees, retries, dead-letter handling, and idempotency.
- Real commit, rollback, and isolation behavior.
- Whether archive expiration means deletion, transition, or another lifecycle action.
- Validation for negative, fractional, nonnumeric, or missing retention values beyond the 30-day default.
- Whether database records have any separate retention or deletion policy.
