import { handleRequest } from "../src/http/router";
import { runOneJob } from "../src/worker";

test("creating a report returns the stored record with 202", async () => {
  const response = await handleRequest("POST", "/reports", {
    accountId: "acct-1",
    title: "Weekly",
  });

  expect(response.status).toBe(202);
  expect(response.body).toMatchObject({ accountId: "acct-1", title: "Weekly" });
});

test("the queued report-created job can be processed", async () => {
  await handleRequest("POST", "/reports", {
    accountId: "acct-1",
    title: "Weekly",
  });

  await expect(runOneJob()).resolves.toBeUndefined();
});
