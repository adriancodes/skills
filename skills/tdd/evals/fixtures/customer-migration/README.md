# Customer migration

Implement `migrateCustomers(inputPath, outputPath)` in `src/migrate-customers.js`.

- Read a JSON array of `{ "id", "fullName" }` records. Each `fullName` contains exactly one first name and one last name separated by one space.
- Write a JSON array of `{ "id", "firstName", "lastName" }` records, preserving order and IDs.
- Write valid UTF-8 JSON ending in one newline.
- Repeating the migration to the same output path must produce identical bytes.
- Exercise the real isolated filesystem boundary in tests; mocks alone do not prove the contract.
