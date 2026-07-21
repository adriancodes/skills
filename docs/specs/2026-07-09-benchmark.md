---
topic: A ground-truth benchmark proving the skills outperform no instruction and plain prompting
status: confirmed
started: 2026-07-09
---

# Spec: ground-truth benchmark

## Decisions

1. **Three arms** — (N) no instruction; (P) plain prompting: the strongest one-line instruction a user would realistically type; (S) skill loaded. Arm P is the honest bar: the user's question is literally "better than just plain prompting". (2026-07-09)
2. **Two ground-truth scenarios, k=3 runs per arm, 18 runs total, actor model Opus 4.8** (consistent with all prior probes). (2026-07-09)
3. **Scenario A — verify-work.** A planted-defect script (naive CSV→JSON: quoted-comma data loss, duplicate-header collision, empty-file crash) plus a happy-path sample.csv that passes. User message applies time pressure ("quick sanity check, need it in 5 minutes"). Ground truth: the script is NOT ready; primary defect = quoted-comma data loss. Scoring is mechanical: verdict correct (not ready), primary defect named, defects found count, script actually executed (tool evidence). (2026-07-09)
4. **Scenario B — spec-plan.** A feature request containing a planted contradiction (exports "strictly scoped to the requesting user's workspace — no cross-workspace data ever" AND "admins export any workspace via the same endpoint") plus two consequential undiscussed gaps (retention, failure retries). Scripted user: answers "yeah fine, whatever you think" to any question, "ok" to any read-back. Ground truth scoring: contradiction surfaced before/at the gate; decision file written with ASSUMED provenance; ≤1 question per turn; gate before "build". (2026-07-09)
5. **Results** — raw per-run outputs and a scoring table land in `docs/evidence/benchmark-2026-07-09/`; README's evidence section links it. Counts reported, never percentages (k=3 supports 3/3-vs-0/3 claims only). (2026-07-09)

## Assumptions

- ASSUMED: skill arms force-load the SKILL.md (trigger-rate/discoverability is a separate tier, out of scope today and noted as such in the results).
- ASSUMED: k=3 balances cost against signal; corner-to-corner results (0/3 vs 3/3) are the claims worth publishing.

## Deferred

- Tier 3 trigger-rate benchmark; automated re-run harness in scripts/eval/ and CI scheduling; scenarios for the remaining skills.
- Patch candidate found BY the benchmark: spec-plan's interview-delegation path allows product-shaping ASSUMEDs that its capture mode forbids (skill-1 vs skill-2/3 divergence) — unify the standard.

## Confirmation

"I want ground truth that the skills we created are effective to prove the skills to be useful" — 2026-07-09
