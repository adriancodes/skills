import { createReport } from "../reports/service";

export async function handleRequest(method: string, path: string, body: unknown) {
  if (method === "POST" && path === "/reports") {
    const report = await createReport(body);
    return { status: 202, body: report };
  }

  return { status: 404, body: { error: "not found" } };
}
