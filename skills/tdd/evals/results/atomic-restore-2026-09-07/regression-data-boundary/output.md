Done. Report:

**Task**: `migrateCustomers(inputPath, outputPath)` per README — split `fullName` into `firstName`/`lastName`, preserve order and IDs, UTF-8 JSON with one trailing newline, byte-identical on repeat.

**Red** (test written before implementation; pre-existing stub wrote `[]\n`):
- Command: `node --test test/migrate-customers.test.js`
- Decisive failure, verbatim:
  0: / id: 1 / firstName: 'Ada' / lastName: 'Lovelace' / ...
  actual: (empty) / operator: 'deepStrictEqual'
  # pass 1 / # fail 1
  The behavioral assertion failed for the expected reason: expected migrated records, actual empty array from the stub. (The idempotency test was trivially green against the deterministic stub; it now guards the real implementation.)

**Green**:
- Same command, then `npm test` (full suite — identical, this is the whole repo):
  # tests 2 / # pass 2 / # fail 0

**Data boundary**: tests exercise the real filesystem — isolated `mkdtemp` output dir, write via the public API, read back and parse, assert exactly one trailing newline, and prove idempotency by comparing raw bytes of two consecutive runs. No mocks.

**Refactor**: none needed; implementation is already minimal.

**Files**:
- `test/migrate-customers.test.js` (new)
- `src/migrate-customers.js` (stub replaced with implementation)

Skipped: input validation for malformed records — README guarantees exactly one first and one last name; add a guard if untrusted input ever feeds this.
