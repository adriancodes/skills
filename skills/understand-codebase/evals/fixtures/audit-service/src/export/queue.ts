export type AuditExportJob = { eventId: string };

export async function enqueueAuditExport(job: AuditExportJob) {
  await globalThis.auditQueue.publish("audit.export.requested", job);
}
