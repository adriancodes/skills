import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { migrateCustomers } from "../src/migrate-customers.js";

test("migrates customer files preserving records and repeatable UTF-8 output", async (t) => {
  const directory = await mkdtemp(join(process.cwd(), ".customer-migration-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const inputPath = join(directory, "input.json");
  const outputPath = join(directory, "output.json");
  const input = '[{"id":9,"fullName":"Zoë García"},{"id":"customer-2","fullName":"Ada Lovelace"}]\n';
  await writeFile(inputPath, input, "utf8");

  await migrateCustomers(inputPath, outputPath);

  const bytes = await readFile(outputPath);
  const output = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  assert.deepEqual(JSON.parse(output), [
    { id: 9, firstName: "Zoë", lastName: "García" },
    { id: "customer-2", firstName: "Ada", lastName: "Lovelace" },
  ]);
  assert.match(output, /[^\n]\n$/);
  assert.equal(await readFile(inputPath, "utf8"), input);

  await migrateCustomers(inputPath, outputPath);
  assert.deepEqual(await readFile(outputPath), bytes);
});
