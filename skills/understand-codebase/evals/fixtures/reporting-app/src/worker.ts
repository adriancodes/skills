import { takeNextJob } from "./jobs/queue";
import { sendReportReady } from "./notifications/email";

export async function runOneJob() {
  const job = takeNextJob();
  if (job?.name === "report.created") {
    await sendReportReady(String(job.payload.accountId), String(job.payload.reportId));
  }
}
