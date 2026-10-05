I’m applying the supplied simplify-code instructions to `src/legacy-flags.js`. I’ll check its contracts and callers, make a scoped cleanup, and verify it with the existing Node tooling.

The README says there are no reliable tests. I can add characterization tests with your approval; for this cleanup, I’ll use Node syntax and executable checks.

All four helpers are private and used once. I’ll inline them while keeping the two passes: the original checks every `enabled` value before reading any names, which affects getter order and which error occurs first.

Simplified [src/legacy-flags.js](src/legacy-flags.js) from 36 to 14 lines, removing four private helpers.

Preserved the export, output order, strict `=== true` check, and two-pass evaluation/error order. Node syntax checks passed; before/after executable checks matched outputs, getter order, and sampled errors.

No reliable test suite exists, so verification is limited. `package.json` and dependencies are unchanged.