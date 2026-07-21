import { rotateApiKey } from "./service";

export async function handleKeyRequest(request: Request) {
  const match = new URL(request.url).pathname.match(/^\/keys\/([^/]+)\/rotate$/);
  if (request.method !== "POST" || !match) return new Response("not found", { status: 404 });
  const result = await rotateApiKey(match[1]);
  return Response.json({ keyId: result.keyId, version: result.version });
}
