# Results

Current declared Tier 3 evidence gate: **PASS**. User acceptance and release are separate.

See [the evidence report](../../../../docs/evidence/2026-10-05-gap-skills.md) and [shared raw results](../../../../evals/gap-skills-2026-10-05/README.md). Immutable manifests and saved cases identify the tested subject. Historical failures and corrections remain retained.

## 2026-11-11 revision: unrun

No model eval was run for this revision. No new pass is claimed. The Tier 3 gate above applies to the subject in the immutable manifests, not the current body.

Changed in `SKILL.md`:

- Step 1 adds the "ignored" classification and its remedy: a hook or check, a shorter file, or a moved rule, never added emphasis.
- The worked example's last check is split and names the adjacent boundary.
- The last Verification line is a check, not a rule.

Unrun regression case in `cases.jsonl`: `write-agent-instructions-regression-ignored-rule`. Its fixture is not built. The suite manifests do not include it.
