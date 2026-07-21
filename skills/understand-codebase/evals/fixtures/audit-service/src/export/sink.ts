import { auditConfig } from "../config";

export async function archiveAuditEvent(eventId: string) {
  await globalThis.objectStore.copy(`audit-events/${eventId}.json`, {
    bucket: auditConfig.archiveBucket,
    expiresInDays: auditConfig.retentionDays,
  });
}
