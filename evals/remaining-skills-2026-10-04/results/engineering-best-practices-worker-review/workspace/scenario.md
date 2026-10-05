# Scenario: receipt worker duplicate sends

Billing runs a small job-queue service. When an invoice is finalized, the API
inserts a row into a Postgres `jobs` table:

```sql
CREATE TABLE jobs (
  id          uuid PRIMARY KEY,
  kind        text NOT NULL,            -- always 'send-receipt' today
  payload     jsonb NOT NULL,           -- { invoiceId, customerEmail }
  status      text NOT NULL,            -- 'pending' | 'processing' | 'done'
  worker      text,                     -- id of the worker that took the job
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
```

A consumer process (`src/worker.js`) polls the table every two seconds, picks
up pending jobs, emails the customer a receipt, and marks the job done.

Until last month one worker instance ran on one VM and nobody complained. The
team then moved the service to a container platform that runs **two to four
replicas** of the worker, each in its own process on its own node, all
pointing at the same Postgres database. Since the rollout, support has three
tickets from customers who received the same receipt email two or three
times. The duplicates cluster around deploys and around one incident where a
node was killed mid-poll.

There is also one job that has sat in `processing` for nine days. Nobody can
say which worker owns it, and no code path will ever touch it again.

Constraints from the team:

- Postgres is the only shared infrastructure; adding Redis or a message
  broker is out of scope for this change.
- Receipt emails go through a third-party API with no idempotency support on
  the provider side, so the worker itself must not send twice.
- The fix should stay inside the worker and the `jobs` table; the producing
  API is owned by another team and is not changing this quarter.

Task for the session: make the worker safe to run as multiple replicas —
each job's receipt is sent at most once, and a job abandoned by a dead
worker is eventually picked up again. Show how the change would be verified.
