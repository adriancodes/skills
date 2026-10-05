import { database } from "../storage/database";

export async function insertReport(report: { accountId: string; title: string }) {
  return database.insert("reports", report);
}
