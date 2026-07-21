import { handleAuditRequest } from "./audit/router";
import { handleKeyRequest } from "./keys/router";

export function handleRequest(request: Request) {
  if (new URL(request.url).pathname.startsWith("/audit")) return handleAuditRequest(request);
  if (new URL(request.url).pathname.startsWith("/keys")) return handleKeyRequest(request);
  return new Response("not found", { status: 404 });
}
