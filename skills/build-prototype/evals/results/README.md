# Results

Current declared Tier 2 evidence gate: **PASS**. User acceptance and release are separate.

See [the evidence report](../../../../docs/evidence/2026-10-05-gap-skills.md) and [shared raw results](../../../../evals/gap-skills-2026-10-05/README.md). Immutable manifests and saved cases identify the tested subject. Historical failures and corrections remain retained.

## 2026-11-11 revision: unrun

The PASS above covers the subject in `suite-manifest-i2.json`, not this body. Changes:

- The description now quotes "throwaway prototype", "spike", "proof of concept", and "try both approaches and see".
- The prototype location rule moved from step 4 to step 2.
- The worked example now shows one normal path and two failure paths.

New cases in `../cases.jsonl`, all unrun and absent from the frozen manifest: `build-prototype-trigger-positive-3`, `-4`, `build-prototype-trigger-negative-3`, `-4`, `-5`, and `build-prototype-regression-location-first`. Routing near-misses were added to `evals/cases/build-prototype.json`; the lexical preflight passes, which is not native trigger evidence.
