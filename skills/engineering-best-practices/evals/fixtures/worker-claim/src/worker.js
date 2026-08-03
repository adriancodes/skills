import { randomUUID } from "node:crypto";

import { query } from "./db.js"; // thin pg wrapper: query(text, params) -> { rows }
import { sendReceiptEmail } from "./mailer.js"; // third-party API; NOT idempotent

const WORKER_ID = process.env.WORKER_ID ?? randomUUID();
const POLL_INTERVAL_MS = 2_000;
const BATCH_SIZE = 10;

// Guards against picking the same job up twice within this process.
const claimedJobs = new Set();

async function pollOnce() {
  const { rows: jobs } = await query(
    `SELECT id, kind, payload
       FROM jobs
      WHERE status = 'pending'
      ORDER BY created_at
      LIMIT $1`,
    [BATCH_SIZE],
  );

  for (const job of jobs) {
    if (claimedJobs.has(job.id)) continue; // already ours
    claimedJobs.add(job.id);

    // Claim: mark the job as taken by this worker.
    await query(
      `UPDATE jobs
          SET status = 'processing', worker = $1, updated_at = now()
        WHERE id = $2`,
      [WORKER_ID, job.id],
    );

    await sendReceiptEmail(job.payload.customerEmail, job.payload.invoiceId);

    await query(
      `UPDATE jobs
          SET status = 'done', updated_at = now()
        WHERE id = $1`,
      [job.id],
    );
    claimedJobs.delete(job.id);
  }
}

export function start() {
  setInterval(() => {
    pollOnce().catch((error) => {
      console.error("poll failed", error);
    });
  }, POLL_INTERVAL_MS);
}
