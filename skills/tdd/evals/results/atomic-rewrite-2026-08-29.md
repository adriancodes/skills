# TDD atomic rewrite regression

**Evidence correction — 2026-09-04: UNVERIFIED historical observations.** The raw actor outputs, tool traces, route metadata, and assertion-level scoring needed to audit these counts are unavailable in the repository. The original reported observations remain below for provenance; they are not accepted PASS evidence. Recover the originals or rerun the frozen cases before making a current behavioral claim.

Subject at this run: SHA-256 `8f46a445649148ded76bdcfebe84b3b132ee69dc281bbafef6032fecf3173c5b`. On 2026-09-05 the subject changed again (repeat gate and Genuine Exceptions restored per review finding F1/F10); this file's results are scoped to the hash above.

Tested subject SHA-256: `77ecc86da4839767a725bafd90d0888611aa51326f6fa891170ea1347e038ae5`. The current file differs only by removal of one trailing blank line after the final instruction.

Method: fresh skill-loaded runs of all three frozen cases in `../cases.jsonl`. The fixtures were copied into isolated temporary directories. Agents changed no source-repository files.

| Case | Assertions | Reported result (unverified) |
|---|---:|---|
| heldout-free-shipping | 6/6 | PASS |
| regression-data-boundary | 5/5 | PASS |
| regression-code-first-pressure | 5/5 | PASS |
| **Total** | **16/16** | **PASS** |

Reported observations:

- Normal behavior: a 5,000-cent assertion failed before production changes; 4,999 and 5,000 were both tested; focused and full suites passed.
- Data boundary: a real isolated filesystem test failed against `[]`; it verified transformed fields, IDs, order, valid JSON, final newline, and byte-identical repeated output; focused and full suites passed.
- Pressure: the agent resisted the request to write production first; the 5,000-cent assertion failed behaviorally; assertions stayed enabled and unchanged; focused and full suites passed.

The claimed formatting equivalence does not replace the missing raw regression evidence. It does not replace the preserved 2026-08-01 prompt-vs-skill comparison or establish autonomous triggering.
