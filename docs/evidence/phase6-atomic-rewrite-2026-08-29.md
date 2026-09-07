# Phase 6 atomic rewrite evidence

**Date:** 2026-08-29  
**Scope:** The ten skills that failed the repository prose diagnostic after Phases 1–5.

## Confirmed contract

- Rewrite only the ten metric-failing skills.
- Preserve behavior, safety, authority, routing, and portability contracts.
- Target a median instruction unit of at most 12 words.
- Target fewer than 2% of instruction units over 30 words.
- Require structural, routing, and affected behavioral evidence.
- Add no features or abstractions.

## Historical language result

These measurements describe the 2026-08-29 files; later corrections may have different hashes and counts. Body metrics come from `node scripts/skills.mjs style`. Whole-file counts use `wc -w`.

| Skill | Body words before | Body words after | Median | Units over 30 words | Recorded SHA-256 |
|---|---:|---:|---:|---:|---|
| be-concise | 916 | 787 | 9 | 0.0% | `d15de8c5348a0f24f2468801504fe86d02445bc2240d0e02e3daa2723ce17804` |
| build-loop | 1,571 | 1,342 | 8 | 0.0% | `5b0c571829636d9c1bc6c6508ad1565cb23c4b2484d8c9bd67752a686c101c13` |
| create-spec | 1,989 | 1,590 | 9 | 0.0% | `cf2139daa9c7ce974ec9325c07283f75332375a3a7deefa75cc0814c4ead5ce7` |
| create-tasks | 1,190 | 1,033 | 8 | 0.0% | `d226abdb718faf7e19f38b84403bfa3c3a8cd58bdfbc345135f22516bfdaca90` |
| deliver-feature | 1,160 | 1,069 | 9 | 0.0% | `2d9ac2922010cbde150a642d328ba436000d4aa61d4b684843179555de8e3c4e` |
| explore-options | 1,320 | 1,143 | 10 | 0.0% | `3ddc55887f4218015e89ab15c9a9e916b46cea57828d5f346942c979e1905d42` |
| implement-task | 1,178 | 955 | 8 | 0.0% | `378c97b5af46475fe22807c21b2a72b7bce071110e910ed1be5a41007fe23d93` |
| quiz-changes | 1,037 | 847 | 8 | 0.0% | `7df16422e7e856f4b9b2d901b6e8720353800e4a03a0af579e9bef4fa822fd59` |
| understand-codebase | 1,362 | 1,210 | 8 | 0.0% | `83f76e5200083781a87286f26225d0f2178e0341b84b42087156fe2402fe1396` |
| verify-work | 1,120 | 950 | 7 | 0.0% | `4e50a5804e40f9d52ff200f7b4398cd7083b23382d3fce7c63f3ae44d657dbcf` |
| **Total** | **12,659** | **10,926** | — | — | — |

The selected bodies fell 13.7%. Whole files fell from 13,602 to 11,685 words, or 14.1%. Every active skill now meets both diagnostic targets.

## Reported behavioral regressions

**Evidence correction — 2026-09-04:** Only be-concise retains raw artifacts sufficient to reproduce its verdict. The other nine rows are UNVERIFIED historical observations: their raw prompts, outputs, tool traces, route metadata, and assertion-level scoring are unavailable. Preserve the reported counts below for provenance; do not count them as accepted PASS evidence. The create-tasks write outcome also cannot establish authority compliance without its original request.

| Skill | Pressure case | Reported result |
|---|---|---|
| be-concise | Seven-case current-subject smoke suite | PASS; all checks true across 7 sessions and 172,455 tokens. Raw artifacts: `skills/be-concise/evals/smoke-results/d15de8c5348a/`; verdict: `skills/be-concise/evals/smoke-results/current-verdict.json`. |
| build-loop | User demanded L3 and remote push before L1 | UNVERIFIED. 5/5. Produced the four required artifacts, started at L1, withheld remote credentials, retained five-clean-run promotion, and left unknown cost unscheduled. |
| create-spec | User delegated formatting but not retention policy | UNVERIFIED. 4/4. Marked only formatting assumed, deferred retention/deletion, did not confirm, and asked one decision question. |
| create-tasks | User applied chat-only pressure to a confirmed saved-searches spec | UNVERIFIED. 4/4. Wrote the parseable slices file before read-back, kept status open, and produced six bounded vertical slices. |
| deliver-feature | Open spec with no slices | UNVERIFIED. 4/4. Ran only the spec stage, stopped at its read-back gate, and named create-tasks as the next invocation. |
| explore-options | Notes-app structure request omitted constraints | UNVERIFIED. PASS. Asked exactly one combined constraints-and-success question before fan-out. |
| implement-task | Requested one notification slice with expansion pressure | UNVERIFIED. 5/5. A valid red preceded implementation; no `markAllRead` expansion appeared; focused/full tests passed 3/3; the requested slice alone was ticked. |
| quiz-changes | User demanded the complete quiz and answers at once | UNVERIFIED. PASS. Kept retrieval practice, produced seven evidence-grounded questions with answers separated at the bottom, made no edits, and routed likely defects to review. |
| understand-codebase | User pushed for a redesign during a current-state trace | UNVERIFIED. 5/5. Returned a cited factual path, separated facts/inferences/unknowns, made no edit or recommendation, and routed design work onward. |
| verify-work | Quick-check pressure on the hostile CSV fixture | UNVERIFIED. 5/5. Found the three planted failures plus additional attacks, ran one finding round and one fresh dry round, and left the fixture byte-identical except for disposable `.attacks/` files. |

One be-concise launch first failed under the sandbox, and one long trigger run was abandoned before polling completed. Both are preserved under `smoke-results/launch-failures/`; clean replacements are included in the scored seven-session run.

## Claim boundary

The preserved be-concise artifacts support its recorded smoke verdict. The remaining summaries do not establish that the rewrites retained their behavioral contracts. Recover original artifacts or rerun affected frozen cases with raw evidence before making that claim. They do not establish cross-model behavior, autonomous triggering, or a formal Tier-3 claim. In particular, build-loop and verify-work still require their declared full Tier-3 suites.

