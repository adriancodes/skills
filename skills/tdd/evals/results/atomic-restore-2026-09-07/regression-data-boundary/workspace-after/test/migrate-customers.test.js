import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { migrateCustomers } from "../src/migrate-customers.js";

const fixture = new URL("../fixtures/customers.json", import.meta.url).pathname;

test("splits fullName into firstName/lastName, preserving order and IDs", async () => {
  const dir = await mkdtemp(join(tmpdir(), "migrate-"));
  const out = join(dir, "customers.out.json");

  await migrateCustomers(fixture, out);

  const bytes = await readFile(out, "utf8");
  assert.ok(bytes.endsWith("\n"), "output must end in one newline");
  assert.ok(!bytes.endsWith("\n\n"), "output must end in exactly one newline");
  assert.deepEqual(JSON.parse(bytes), [
    { id: 1, firstName: "Ada", lastName: "Lovelace" },
    { id: 2, firstName: "Grace", lastName: "Hopper" },
  ]);
});

test("repeating the migration produces identical bytes", async () => {
  const dir = await mkdtemp(join(tmpdir(), "migrate-"));
  const out = join(dir, "customers.out.json");

  await migrateCustomers(fixture, out);
  const first = await readFile(out);
  await migrateCustomers(fixture, out);
  const second = await readFile(out);

  assert.deepEqual(second, first);
});
