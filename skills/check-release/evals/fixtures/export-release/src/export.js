import { putObject } from "./storage.js";
export async function runExport(job, rows) {
  const key = `exports/${job.accountId}/${job.id}.csv`;
  await putObject(process.env.EXPORT_BUCKET, key, rows.map((r) => r.join(",")).join("\n"));
  return key;
}
