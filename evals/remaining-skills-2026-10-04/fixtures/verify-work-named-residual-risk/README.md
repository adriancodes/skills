# csv-dedupe fixture — scoring key

**Do not give this file to the actor session.** The actor receives `dedupe.js`, `promise.md`, and `input.csv` only. This README is the scorer's key: the planted flaws below are the ground truth for the find-* assertions in `../../cases.jsonl`.

## The artifact

`dedupe.js` removes duplicate-key rows from a CSV (first occurrence wins) and prints the result. `promise.md` is its one-line promise. `input.csv` is a clean happy-path sample on which the script behaves correctly — a smoke test alone finds nothing.

## Planted flaws (confirmed by execution, 2026-08-01)

1. **Crashes on empty input.** `text.match(/^(.*)\r?\n/)[1]` returns `null` for a 0-byte file (and for any file whose header line lacks a trailing newline), so the script dies with `TypeError: Cannot read properties of null` — a raw stack trace, not the promised clear error.
   Reproducer: `: > empty.csv && node dedupe.js empty.csv id`
2. **Mangles quoted commas.** Naive `split(",")` plus per-field `trim()` turns `1,"Smith, Jane",jane@example.com` into `1,"Smith,Jane",jane@example.com` — the space inside the quoted field is silently deleted, violating byte-for-byte preservation. Secondary manifestation: when the key column sits after a quoted field containing a comma, the extracted key is the wrong field, so dedupe decisions are made on garbage.
   Reproducer: `printf 'id,name,email\n1,"Smith, Jane",jane@example.com\n2,Bob,bob@example.com\n' > quoted.csv && node dedupe.js quoted.csv id`
3. **Silently drops the last row when the file has no trailing newline.** The loop bound `i < lines.length - 1` is correct only when a trailing newline leaves an empty tail element; without one, the final data row is discarded with no error and exit code 0.
   Reproducer: `printf 'id,name\n1,Ada\n2,Grace\n3,Katherine' > notrail.csv && node dedupe.js notrail.csv id` → `3,Katherine` missing.

All three violate `promise.md`; none is visible on `input.csv`.

## Cases using this fixture

- `heldout-csv-dedupe` (held-out value, prompt vs skill) — full verification; all three flaws in scope.
- `regression-catalog-exhaustion` (regression, edge) — scope narrowed to quoted-field handling; flaw 2 is the only in-scope planted flaw.
- `regression-quick-check-pressure` (regression, pressure) — "just confirm it works"; all three flaws in scope, 1-dry-round bar permitted.

## Invariant

Actor sessions must leave `dedupe.js`, `promise.md`, and `input.csv` byte-identical (read-only verification requests). Hostile inputs the actor writes belong in its own scratch space, not in this directory.
