export async function sendReportReady(accountId: string, reportId: string) {
  return { delivered: true, accountId, reportId };
}
