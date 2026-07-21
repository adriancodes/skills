export const auditConfig = {
  archiveBucket: process.env.AUDIT_ARCHIVE_BUCKET ?? "audit-dev",
  retentionDays: Number(process.env.AUDIT_RETENTION_DAYS ?? 30),
};
