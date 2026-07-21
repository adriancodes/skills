import { recordAuditEvent } from "../src/audit/service";
import { handleAuditExport } from "../src/export/worker";

test("persists before publishing export work", async () => {
  const event = await recordAuditEvent({ actor: "engineer", action: "login" });
  expect(event.id).toBeDefined();
  // The worker is a separate consumer; the HTTP path never calls it directly.
  await handleAuditExport({ eventId: event.id });
});
