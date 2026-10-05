import { writeFile } from "node:fs/promises";

export async function migrateCustomers(_inputPath, outputPath) {
  await writeFile(outputPath, "[]\n", "utf8");
}
