# Skill Portfolio Evidence Audit — 2026-07-12

## Scope

This is a bounded audit of evidence already preserved in this repository. It does not run new model actors, infer effectiveness from document quality, or upgrade directional evidence into a shipping claim.

Current subject hashes and evidence-source hashes are frozen in `manifest.json`.

## Evidence levels

- **Current reproducible:** the current subject revision has frozen cases, replayable raw runs, an executable scorer, and a comparative result against a strong prompt.
- **Partial:** some raw evidence is preserved, but it does not establish current comparative effectiveness.
- **Directional:** a summarized benchmark or probe exists, but missing raw runs, scorer, triggering, or revision identity prevents replay.
- **Untested:** no behavioral evidence supports the current promise.

## Portfolio result

No current skill revision has repository evidence sufficient for a `SHIP` effectiveness claim under `create-skill`'s present quality gate.

All nine skills and the always-on discipline layer pass the repository's structural checks. That establishes valid packaging and internal mechanical constraints only.

| Subject | Existing evidence | Current audit status | What is not established |
|---|---|---|---|
| `create-skill` | Six Codex Phase-0 actor runs and six blinded judge runs, with raw evidence and hashes; strongest prompt left a residual | **Partial — opportunity confirmed; effectiveness untested; verdict `ITERATE`** | Skill-vs-prompt downstream effectiveness, normal triggering, or cross-model behavior |
| `verify-work` | Opus 4.8 benchmark reported broader hostile-case coverage and stronger re-attack discipline at about 30% more tokens | **Directional** | Complete replayable run set, current-revision result, normal triggering, Codex behavior |
| `spec-plan` | Opus 4.8 benchmark reported consistent provenance, one-question cadence, confirmation gates, and artifact layout at about 50% more tokens | **Directional** | Complete replayable run set, patched current-revision result, normal triggering, Codex behavior |
| `slice-spec` | Round-two summary reported dependency edges and parseable artifacts 3/3 only in the skill arm | **Directional** | Raw runs, executable scorer, current-revision result, triggering, cost |
| `implement-slice` | Round-two summary reported red-first behavior was prompt-equivalent; the skill added hostile checks and outcome notes | **Directional** | Raw chronology evidence, current bound/unticked-on-failure behavior, triggering, cost |
| `ship-feature` | Round-two summary reported preservation of the conductor's terminal verification signal 3/3 only in the skill arm | **Directional** | Raw runs, full state-matrix behavior, current-revision result, triggering, cost |
| `build-loop` | Round-two summary reported state spine and certified promotion 3/3 only in the skill arm; basic PR-only safety was model-native | **Directional** | Executable guard behavior, current unknown-cost path, triggering, cost |
| `improve-prompt` | Round-two summary reported inline assumption provenance 3/3 versus 2/3 for the strong prompt | **Directional** | Current execution-authority behavior, raw runs, triggering, cost |
| `tldr` | Skill text and changelog describe a behavioral baseline and adversarial dry-run | **Directional, low confidence** | Preserved comparator runs, actionable-content retention, safety/depth exceptions, triggering |
| `work-discipline` | A summarized N=1 Opus probe supports four original discipline behaviors | **Directional, low confidence** | Current fifth rule, independent replay, interaction effects, Codex behavior |

## Objective conclusions

1. Existing evidence supports the hypothesis that several skills improve process consistency and artifact interoperability, not model intelligence.
2. The strongest prompts often recover individual behaviors. The plausible skill advantage is the coordinated bundle plus stable artifact contracts.
3. Round two is not reproducible from the repository: its raw `bench2/` runs and scoring greps are absent.
4. The preserved round-one artifact set is incomplete and has no checked-in executable scorer.
5. Existing behavioral benchmarks force-loaded skills. Autonomous trigger precision, recall, and collisions remain unmeasured.
6. Every top-level skill file currently has uncommitted changes, so older results do not identify the current revision as the tested subject.
7. The `create-skill` package has the strongest evidence integrity, but its completed evidence tests opportunity only. Its effectiveness suite remains intentionally unfrozen.

## Bounded next tests

If new testing is authorized later, prioritize one mechanically scored current-revision case per unresolved mechanism before adding repetitions:

1. `implement-slice`: red-before-code chronology, bound integrity, and unticked-on-hostile-failure.
2. `ship-feature`: frozen stage-transition matrix and exactly-one-stage enforcement.
3. `build-loop`: executable breaker, overlap lock, report-only guard, and unknown-cost scheduling path.
4. `spec-plan`: patched product-policy deferral and confirmation transition.
5. `improve-prompt`: explicit execution-authority canary.
6. `slice-spec`: open-spec refusal, one-session skip, and blocker graph validity.
7. `verify-work`: current hostile catalog against a planted parser defect.
8. `tldr`: brevity plus retained decision-changing caveat and depth override.
9. `work-discipline`: combined-pressure interaction of all five rules.
10. `create-skill`: the already-designed lean paired pilot, only after its suite is versioned and frozen.

Until those tests exist, use **directional**, **partial**, or **untested** rather than **proven** or **effective** when describing these skills.
