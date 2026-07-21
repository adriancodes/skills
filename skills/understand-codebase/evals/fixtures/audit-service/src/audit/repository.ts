import type { Transaction } from "../storage/database";

export async function insertAuditEvent(tx: Transaction, event: unknown) {
  await tx.insert("audit_events", event);
}
