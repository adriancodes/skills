I’ll trace this read-only from the request entry point through synchronous execution, persistence, queueing, and each code-confirmed downstream effect. I’ll also call out boundaries where the repository does not establish behavior.

The repository is intentionally small: the report path spans the router, service, repository, in-memory database, in-memory queue, one-job worker, and email stub. I’m now checking every symbol’s usages so the map distinguishes executable connections from merely suggestive names.

## Current-state map

```text
startServer().handle
  → handleRequest("POST", "/reports", body)
    → createReport(body)
      → validateReport(body)
      → insertReport(report)
        → database.insert("reports", report)
      → enqueue("report.created", { reportId, accountId })
    ← HTTP-like { status: 202, body: storedReport }

Later, if invoked separately:
runOneJob()
  → takeNextJob()
  → sendReportReady(accountId, reportId)
```

### 1. Entry point and routing

`startServer()` returns an object whose `handle` property is the imported `handleRequest` function. It does not create a network listener or bind a port. [`startServer`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/server.ts:3)

`handleRequest(method, path, body)` recognizes exactly `POST /reports`; other method/path combinations receive `{ status: 404, body: { error: "not found" } }`. [`handleRequest`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/http/router.ts:3)

For `POST /reports`, the router awaits `createReport(body)`, then returns status `202` with the returned report as the response body. [`handleRequest`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/http/router.ts:5)

### 2. Synchronous validation

`createReport(input)` first calls the synchronous, private `validateReport(input)`. [`createReport`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/reports/service.ts:6) [`validateReport`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/reports/service.ts:13)

Validation rejects a falsy input, a non-object input, or an input whose `accountId` or `title` is falsy, by throwing `Error("invalid report")`. [`validateReport`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/reports/service.ts:14)

The runtime checks do not verify that `accountId` and `title` are strings; `ReportInput` supplies a TypeScript type, while validation only tests truthiness. [`ReportInput`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/reports/service.ts:4) [`validateReport`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/reports/service.ts:15)

Successful validation constructs a new object containing only `accountId` and `title`, so unrelated request-body properties are not passed to the repository. [`validateReport`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/reports/service.ts:17)

### 3. Storage call and immediate side effect

`createReport` awaits `insertReport(report)` before it queues any work. [`createReport`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/reports/service.ts:8)

`insertReport` delegates to `database.insert("reports", report)`. [`insertReport`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/reports/repository.ts:3)

Despite its name, the current `database.insert` does not retain the report in a table or call external storage. Its confirmed state mutation is incrementing the module-level `nextId`; it returns a newly constructed object containing the assigned `id`, the literal table name `"reports"`, `accountId`, and `title`. [`nextId`, `database.insert`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/storage/database.ts:1)

Consequently, the returned response body has the current shape:

```ts
{
  id: number,
  table: "reports",
  accountId: /* validated input value */,
  title: /* validated input value */
}
```

That shape comes from `database.insert`, and the router returns it unchanged. [`database.insert`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/storage/database.ts:4) [`handleRequest`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/http/router.ts:5)

### 4. Queued work

After insertion completes, `createReport` awaits `enqueue` with job name `"report.created"` and a payload containing only the stored report’s `id` and `accountId`. [`createReport`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/reports/service.ts:9)

`enqueue` appends that job to the module-local in-memory `pending` array. It does not contact an external broker or start a worker. [`pending`, `enqueue`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/jobs/queue.ts:3)

Only after `enqueue` resolves does `createReport` return the stored report, allowing the router to produce the `202` response. [`createReport`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/reports/service.ts:9) [`handleRequest`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/http/router.ts:6)

### 5. Worker and downstream effects

Downstream processing occurs only when some caller separately invokes `runOneJob()`. That function is not invoked by the request path itself. [`runOneJob`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/worker.ts:4) [`createReport`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/reports/service.ts:6)

`runOneJob` calls `takeNextJob`, which removes and returns the oldest pending job using `Array.shift()`. An empty queue yields `undefined`. [`takeNextJob`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/jobs/queue.ts:9)

If the removed job is named `"report.created"`, the worker converts its `accountId` and `reportId` payload fields to strings and awaits `sendReportReady(accountId, reportId)`. [`runOneJob`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/worker.ts:5)

`sendReportReady` does not send an external email in the current implementation. It only resolves to `{ delivered: true, accountId, reportId }`; `runOneJob` does not return or otherwise store that result. [`sendReportReady`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/notifications/email.ts:1) [`runOneJob`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/worker.ts:7)

A dequeued job with any other name is removed from the queue but receives no further handling. [`takeNextJob`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/jobs/queue.ts:9) [`runOneJob`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/worker.ts:6)

## Failure behavior confirmed by the code

If validation throws, insertion and queueing are never reached. [`createReport`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/reports/service.ts:7)

The router contains no `try`/`catch`, so a rejection from report creation propagates out of `handleRequest`; this code does not translate it into an HTTP error response. [`handleRequest`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/http/router.ts:3)

Insertion happens before queueing, and there is no transaction or rollback logic connecting the two operations. [`createReport`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/reports/service.ts:8)

The worker has no retry, failure-status, dead-letter, or exception-handling logic in `runOneJob`. [`runOneJob`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/worker.ts:4)

## Unknowns not established by this repository

- How `startServer()` is invoked or connected to an actual HTTP server is not established; the visible entry point only exposes `{ handle: handleRequest }`. [`startServer`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/server.ts:3)
- What invokes `runOneJob`, how often it runs, and whether multiple workers exist are not established by `runOneJob` or the queue module. [`runOneJob`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/worker.ts:4) [`pending`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/jobs/queue.ts:3)
- Durable report storage is not established; the current database implementation only generates and returns an object. [`database.insert`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/storage/database.ts:4)
- Durable queueing across process restarts is not established; jobs exist only in the module-local `pending` array. [`pending`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/jobs/queue.ts:3)
- Actual email delivery, recipient lookup, message content, and provider behavior are not established; the notification function is a result-returning stub. [`sendReportReady`](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-prompt-work-n4VplW/src/notifications/email.ts:1)
