import { enqueue } from "../jobs/queue";
import { insertReport } from "./repository";

type ReportInput = { accountId: string; title: string };

export async function createReport(input: unknown) {
  const report = validateReport(input);
  const stored = await insertReport(report);
  await enqueue("report.created", { reportId: stored.id, accountId: stored.accountId });
  return stored;
}

function validateReport(input: unknown): ReportInput {
  if (!input || typeof input !== "object") throw new Error("invalid report");
  const value = input as Partial<ReportInput>;
  if (!value.accountId || !value.title) throw new Error("invalid report");
  return { accountId: value.accountId, title: value.title };
}
