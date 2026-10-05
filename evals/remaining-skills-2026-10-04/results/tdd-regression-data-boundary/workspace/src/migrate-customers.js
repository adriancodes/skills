import { readFile, writeFile } from "node:fs/promises";

export async function migrateCustomers(inputPath, outputPath) {
  const customers = JSON.parse(await readFile(inputPath, "utf8"));
  const migrated = customers.map(({ id, fullName }) => {
    const [firstName, lastName] = fullName.split(" ");
    return { id, firstName, lastName };
  });
  await writeFile(outputPath, `${JSON.stringify(migrated)}\n`, "utf8");
}
