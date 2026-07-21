import { enqueueAuditExport } from "../export/queue";
import { database } from "../storage/database";
import { insertAuditEvent } from "./repository";

export async function recordAuditEvent(input: unknown) {
  if (!input || typeof input !== "object") throw new Error("invalid audit event");
  const event = { id: crypto.randomUUID(), payload: input, recordedAt: new Date().toISOString() };
  await database.transaction((tx) => insertAuditEvent(tx, event));
  await enqueueAuditExport({ eventId: event.id });
  return event;
}
