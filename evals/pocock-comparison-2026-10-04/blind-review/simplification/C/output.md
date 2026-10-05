I’ll inspect the module and its references, check its behavior before editing, then simplify it and verify with the existing Node tooling.

The module checks every `enabled` value before reading any names. That order affects getters and which error is thrown, so I’ll preserve the two passes while removing the redundant helpers and temporary variables. The baseline Node checks passed.

Simplified [src/legacy-flags.js](src/legacy-flags.js) by removing four redundant helpers and unnecessary variables. Preserved the export, output order, strict boolean check, and two-pass processing that determines error order.

Node behavior checks passed before and after cleanup; syntax validation passed. No reliable test suite exists. `package.json` is unchanged, and no dependencies were added.