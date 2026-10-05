I’ll apply the supplied simplify-code instructions, inspect the documented contract and callers, and use inline checks before and after editing. I won’t create any files.

There are no reliable tests or local callers. I’ll remove the four private helpers while preserving the export, strict `=== true` check, name conversion, and input order. I’ll also keep the existing sequence: read all `enabled` values before reading names, so getter side effects and error order stay intact.

Simplified [src/legacy-flags.js](src/legacy-flags.js) by removing four private helpers. Preserved the public export, exact-true filtering, trimmed names, input order, and property-access order.

Inline checks passed before and after; syntax validation passed. No files were created. No reliable project test suite exists.