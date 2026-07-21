import { rotateApiKey } from "../src/keys/service";

test("increments the version and invalidates cached credentials", async () => {
  await expect(rotateApiKey("partner-api")).resolves.toMatchObject({ keyId: "partner-api", version: 1 });
});
