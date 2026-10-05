I’ll apply the supplied TDD skill, first checking the migration requirements, repository instructions, and existing changes.

The README defines a file migration contract, and the current function writes only an empty array. I’ll test the exported function with real files in a temporary directory inside this project, covering record order, IDs, Unicode names, the final newline, and identical output on repeat runs. The project uses Node’s built-in test runner and has no Git metadata.

Implemented the migration in `src/migrate-customers.js` and added `test/migrate-customers.test.js`.

- Red: `node --test test/migrate-customers.test.js` failed because output was `[]` instead of migrated records.
- Green: the same command passed after implementation.
- Affected and full suite: `npm test` passed.

Tests exercise real isolated files, verifying preserved IDs and order, Unicode names, UTF-8 JSON with one final newline, unchanged input, and identical bytes on repeat runs. No commit created.