I’m applying the supplied engineering-best-practices skill to review duplicate receipt delivery, staying read-only and grounding the fix and verification plan in the fixture’s constraints.

The worker has a cross-replica claim race, but **atomic claiming alone cannot satisfy both guaranteed recovery and at-most-once email delivery** with this non-idempotent provider.

The concrete defects are:

- [worker.js:14](src/worker.js:14) reads pending jobs before [worker.js:28](src/worker.js:28) updates them unconditionally. Two replicas can read the same job, both update it, and both send.
- [worker.js:11](src/worker.js:11)’s `Set` coordinates only one process. Other replicas have independent sets.
- A crash after claiming leaves `processing` permanently stranded: polling selects only `pending`, with no expiry or recovery path.
- [worker.js:35](src/worker.js:35) sends before recording completion. If the provider accepts the email and the worker dies before marking `done`, retrying may send another receipt. A timeout can create the same uncertainty.

A compatible coordination fix stays within the worker and `jobs` table:

1. Claim jobs atomically in Postgres—for example, a single statement combining `FOR UPDATE SKIP LOCKED` selection with `UPDATE … RETURNING`. Send only jobs returned by that claim.
2. Add a lease deadline and fresh claim token for each acquisition. Guard completion, renewal, and release with the token and expected state; a stale worker must not mutate a newer claim.
3. Reclaim expired claims that have **not begun sending**. Before calling the provider, atomically transition from the valid claim to a durable `sending` state. A worker whose transition fails must not send.

The unresolved boundary is `sending`: Postgres cannot atomically commit the external email effect. Retrying an uncertain send risks duplication; refusing to retry risks a missing receipt. A lease, database lock, or outbox cannot remove that ambiguity. The existing nine-day job is also uncertain and should not simply be reset to `pending`.

Verification would use independent worker processes and separate database connections, sharing only a real Postgres database:

- Race claims for one job; assert one winner and one send invocation.
- Kill a worker after claiming but before entering `sending`; assert eventual reclaim.
- Resume an expired worker after another claims the job; assert its send transition, completion, and release all fail.
- Inject failures immediately before sending, after provider acceptance, and before `done`; verify the selected uncertainty policy.
- Test ambiguous timeouts and restart behavior without shared in-memory coordination or automatic mailer retries.

I followed the skill’s **Apply** workflow. Retrieved practices `designing-data-intensive-applications:M25` and `M19` informed the claim-race and unknown-success analysis; `release-it:M18` informed crash recovery checks. No files were changed, and no database integration tests were run.

**Which delivery policy should govern uncertain sends?**

1. **Recommended under the stated at-most-once requirement:** never automatically retry after entering `sending`; flag uncertainty for investigation, accepting that some receipts may be missing.
2. Retry uncertain sends for eventual delivery, accepting possible duplicates.
3. Change the constraints to require a provider with durable idempotency support before promising both properties.

A custom answer is welcome.