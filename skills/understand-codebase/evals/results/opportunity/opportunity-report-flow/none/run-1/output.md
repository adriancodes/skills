I’ll trace the report-creation path from its request entry point through validation, persistence, external calls, and emitted side effects, citing the exact files and lines. I’ll only inspect the repository.

The main path is compact: `POST /reports` validates, inserts a row, then enqueues a `report.created` job before returning `202`. I’m now checking the concrete database and queue implementations plus the worker, because those determine the exact ordering, mutation semantics, and failure behavior.

A report is “created” by storing an in-memory record and enqueueing an in-memory notification job. There is no report generation, durable database, HTTP listener, or real email delivery in this repository.

## End-to-end flow

```text
POST /reports
  → validate body
  → create in-memory record and increment ID
  → append report.created job to queue
  → return 202 with stored record

Later, when runOneJob() is called:
  → remove oldest queued job
  → invoke the email stub
  → discard its result
```

1. Request entry

[`startServer()`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-MVPJsw/src/server.ts:3) returns an object whose `handle` property is `handleRequest`. It does not bind a port or start a network server.

[`handleRequest()`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-MVPJsw/src/http/router.ts:3) recognizes exactly:

```text
method = "POST"
path   = "/reports"
```

Anything else returns `404` with `{ error: "not found" }`.

2. Validation

The router passes the request body directly to [`createReport()`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-MVPJsw/src/reports/service.ts:6).

[`validateReport()`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-MVPJsw/src/reports/service.ts:13):

- Rejects null, undefined, and non-object inputs.
- Requires truthy `accountId` and `title` properties.
- Returns a new object containing only those two properties, so additional request fields are discarded.

Despite the TypeScript return type, runtime validation does not verify that either field is a string. Any truthy values pass. On failure it throws `Error("invalid report")`; there is no router-level error handling to convert that into an HTTP-style `400` response.

Validation has no side effects.

3. Record insertion

[`insertReport()`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-MVPJsw/src/reports/repository.ts:3) calls:

```ts
database.insert("reports", report)
```

The “database” is an in-memory ID counter. [`database.insert()`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-MVPJsw/src/storage/database.ts:4) returns:

```ts
{
  id: nextId++,
  table: "reports",
  accountId,
  title
}
```

Its only side effect is incrementing the module-level `nextId`. Nothing is placed in a collection or written to disk, so the created record cannot later be queried from this repository. Restarting the process resets IDs to `1`.

4. Job enqueueing

After insertion, the service calls [`enqueue()`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-MVPJsw/src/reports/service.ts:9) with:

```ts
{
  name: "report.created",
  payload: {
    reportId: stored.id,
    accountId: stored.accountId
  }
}
```

[`enqueue()`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-MVPJsw/src/jobs/queue.ts:5) appends that job to the module-level `pending` array. This is the second creation-time side effect.

The insert happens before enqueueing, with no transaction or rollback mechanism. The current in-memory enqueue implementation only performs an array push, but the service itself has no compensation if enqueueing were to reject.

5. Response

Only after `insertReport` and `enqueue` both resolve does the router return [`{ status: 202, body: report }`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-MVPJsw/src/http/router.ts:6).

For the first valid request:

```json
{
  "accountId": "acct-1",
  "title": "Quarterly report"
}
```

the response body is:

```json
{
  "id": 1,
  "table": "reports",
  "accountId": "acct-1",
  "title": "Quarterly report"
}
```

The `202` does not mean background report generation is occurring; only the notification job is pending.

6. Worker-side effects

Job processing is not automatically started anywhere in the repository. Some external caller must invoke [`runOneJob()`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-MVPJsw/src/worker.ts:4).

Each call:

- Uses [`pending.shift()`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-MVPJsw/src/jobs/queue.ts:9), permanently removing the oldest job.
- For `report.created`, converts both payload values to strings.
- Calls [`sendReportReady()`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-MVPJsw/src/notifications/email.ts:1).

`sendReportReady()` does not send an email. It merely returns:

```ts
{ delivered: true, accountId, reportId }
```

The worker ignores that return value. Because the job is removed before email processing, an exception from a future real email implementation would lose the job; there is no retry, acknowledgement, dead-letter queue, or error handling.

So, concretely, the complete successful side-effect set is:

1. Increment the in-memory report ID counter.
2. Append a notification job to an in-memory array.
3. Later, remove that job when `runOneJob()` is invoked.
4. Call a no-op email stub whose result is discarded.
