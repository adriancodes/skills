Report creation has two phases: synchronous request handling and asynchronous job processing.

### 1. Request phase

A caller sends:

```http
POST /reports

{
  "accountId": "acct-1",
  "title": "Weekly"
}
```

The request enters [router.ts](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-gd7Se6/src/http/router.ts:3). The router recognizes only `POST /reports` and delegates to `createReport`.

In [service.ts](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-gd7Se6/src/reports/service.ts:6), `createReport` performs three ordered operations:

1. Validate that the input is an object with truthy `accountId` and `title`.
2. Store the report through `insertReport`.
3. Enqueue a `report.created` job containing the new report ID and account ID.

The repository in [repository.ts](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-gd7Se6/src/reports/repository.ts:3) forwards the insert to the fake database. The database assigns a sequential numeric ID and returns something like:

```ts
{
  id: 1,
  table: "reports",
  accountId: "acct-1",
  title: "Weekly"
}
```

The job is placed into the module-level `pending` array in [queue.ts](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-gd7Se6/src/jobs/queue.ts:3):

```ts
{
  name: "report.created",
  payload: {
    reportId: 1,
    accountId: "acct-1"
  }
}
```

Only after both insertion and enqueueing finish does the router return:

```ts
{
  status: 202,
  body: {
    id: 1,
    table: "reports",
    accountId: "acct-1",
    title: "Weekly"
  }
}
```

The `202 Accepted` status signals that follow-up processing is intended to happen later. The report itself has already been “stored,” although this fixture’s database is not persistent.

### 2. What happens after the response

Nothing happens automatically in this codebase. Some external process must call `runOneJob()` from [worker.ts](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-gd7Se6/src/worker.ts:4).

That function:

1. Removes the oldest queued job with `takeNextJob()`.
2. Checks whether its name is `report.created`.
3. Converts its account and report IDs to strings.
4. Calls `sendReportReady(accountId, reportId)`.

The notification adapter in [email.ts](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-gd7Se6/src/notifications/email.ts:1) does not really send email. It only returns:

```ts
{
  delivered: true,
  accountId: "acct-1",
  reportId: "1"
}
```

The worker ignores that return value. If the queue is empty, or the job has another name, `runOneJob()` simply returns `undefined`.

### 3. Where it is tested

Both phases appear in [report-flow.test.ts](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-gd7Se6/tests/report-flow.test.ts:4).

The first test verifies the request-facing contract:

- `POST /reports` returns `202`.
- The body contains the submitted account ID and title.

The second test creates a report, calls `runOneJob()`, and verifies only that the worker resolves without throwing.

That leaves important behavior unverified:

- The stored report ID is not asserted.
- The queued job’s name and payload are not inspected.
- The test does not prove `sendReportReady` was called.
- It does not prove the correct account and report IDs were passed.
- Validation, `404` behavior, empty queues, unknown jobs, and failures are untested.

There is also a subtle test-isolation issue: the first test queues a job but never consumes it. Because the queue is shared module-level state, the second test may consume the first test’s job rather than the job it just created. It still passes because it only checks for no exception.

The central file for follow-up questions is [service.ts](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/understand-codebase-none-work-gd7Se6/src/reports/service.ts:6): it defines the boundary between immediate report creation and deferred notification work.
