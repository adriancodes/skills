import { recordAuditEvent } from "./service";

export async function handleAuditRequest(request: Request) {
  const url = new URL(request.url);
  if (request.method !== "POST" || url.pathname !== "/audit/events") {
    return new Response("not found", { status: 404 });
  }
  const event = await recordAuditEvent(await request.json());
  return Response.json({ eventId: event.id }, { status: 202 });
}
