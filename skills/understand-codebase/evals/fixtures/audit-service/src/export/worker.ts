import { archiveAuditEvent } from "./sink";

export async function handleAuditExport(job: { eventId: string }) {
  await archiveAuditEvent(job.eventId);
}
