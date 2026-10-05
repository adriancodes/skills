# Skill quality pilot — 2026-10-04

The four revised skills have smaller entrypoints and clearer scope rules. Targeted regressions support those changes. The comparative runs mostly tied on functional correctness; revised delivery produced stronger completion records. These results do **not** establish that the whole toolbox beats Matt Pocock's collection or uses fewer execution tokens.

Verdict for the broad superiority and execution-cost hypothesis: **ITERATE**. The local revisions are reviewable pilot improvements, not a blanket Tier-2 SHIP verdict. No installed copies, commits, or releases were changed by this pilot.

## Changes and structure

| Skill | Original body words | Revised body words | Change |
|---|---:|---:|---|
| `deliver-feature` | 1,069 | 634 | Continue authorized end-to-end delivery; honor a one-stage or one-task limit; preserve genuine decision gates. |
| `create-tasks` | 1,094 | 671 | Use vertical feature slices, genuine one-layer tasks, or expand–migrate–contract for wide refactors. |
| `simplify-code` | 786 | 525 | Characterize behavior with existing local tooling within scope; honor explicit restrictions. |
| `implement-task` | 955 | 717 | Preserve one-task bounds; allow coordinated repetition; use proportionate checks for nonbehavior changes. |
| **Total** | **3,904** | **2,547** | **35% smaller entrypoint bodies.** |

Counts exclude frontmatter and references. Stage fallbacks and the slices contract now live in self-contained conditional references inside their owning skills. The reduction measures initial instruction size, not total loaded text or execution cost. [All 17 names were reviewed](../../docs/evidence/skill-names-2026-10-04.md); existing clear names were retained.

The [confirmed brief](../../docs/specs/2026-10-04-skill-quality-pilot.md) identifies deliberately changed requirements. Historical one-stage-only delivery, forced verticality for every task, and an approval gate for every new characterization test are superseded. Scope, confirmation, no-write, behavior preservation, and handoff requirements remain. Historical per-skill packages remain intact and are labeled; their recorded results do not validate these revised subjects.

## Compared outcomes

| Fixture | Original | Revised | Strong prompt | Matt counterpart |
|---|---|---|---|---|
| End-to-end shipping feature | Correct code; ticks and verification; missing dated per-task outcomes | Correct code; ticks, dated outcomes, and reproducible verification | Correct code; ticks and verification; missing dated per-task outcomes | Correct code; task ticks and verification section unchanged |
| Four-package identifier migration plan | Compatible expand–migrate–contract | Compatible expand–migrate–contract | Compatible plan; extra discovery task and serial migration edges | Compatible expand–migrate–contract |
| Untested flag cleanup | Correct, smaller implementation | Correct, smaller implementation | Correct, smaller implementation | No matching subject tested |

The three cleanup implementations are identical apart from a comment. Planning differences do not establish a general winner. The refactor spec explicitly supplied the migration pattern, so this case cannot prove that the revised skill discovered the better approach. The prompt's plan did not use this toolbox's exact contract; that is a separate compatibility score, not a generic planning defect. Matt's local Markdown-tracker adaptation completed the delivery code but treated the plan as outside its change bounds. That is a concrete resumability gap in this fixture, not proof of inferior general implementation skill.

The original skills already completed the ordinary explicit requests. The initial [static audit](../../docs/evidence/matt-pocock-comparison-2026-10-04.md) predicted avoidable ceremony, but those predictions did not become baseline failures here. The changes clarify the written contract and preserve tested boundaries; claims should follow the observed outcomes.

An [independent reviewer](reviewer-report.md) first reviewed the instructions, then examined anonymized outputs and workspaces. Its delivery boundary probes passed for all four arms, and simplification preserved outputs, errors, and getter/iterator order in all three arms. It identified the revised delivery output as the strongest reproducible handoff and found no overall correctness winner in planning or simplification. The [identity key](blind-key.json) was withheld until that outcome review finished. This is one blinded review, not statistical evidence.

## Revised boundary checks

All eight scored revised regression runs met their frozen outcomes:

- Delivery completes one requested task and leaves the second untouched.
- An open spec prompts for the unresolved decision and produces no implementation edits.
- Feature planning recuts horizontal phases into vertical slices with tests per task.
- An explicit no-write request produces the full chat contract and no workspace changes.
- A chat-review preference still produces the disclosed open slices file.
- Cleanup with a no-tests/no-new-files restriction edits only the source and uses inline probes.
- Direct implementation completes only task 1, with red/green, its demo, and completion notes.
- Verification-only delivery records a known failure as `Status: incomplete` and leaves source and tests unchanged.

The last case was frozen separately after static review found contradictory instructions: the delivery body required recording failures, while the reference required an empty verification section after failure. Both now require visible incomplete evidence. A nonempty failed record cannot count as completed verification. Earlier comparison runs preserve their earlier reference versions; the failure regression matches the final delivery resources. The replay reports current-body and current-resource matches separately and requires a current-resource run for each revised skill.

`simplify-tested` is frozen but was not run within this pilot's budget. Documentation-only implementation and native invocation were not behaviorally tested. Do not infer coverage from their presence in a case file or instruction body.

## Cost and execution limits

The ordinary comparisons used one fresh session per arm, Codex CLI 0.160.0, `gpt-6.1-sol`, medium reasoning, and explicit instruction loading. Reported input includes cached tokens; totals below are **not** dollar costs or uncached-token measures.

| Fixture | Original: tokens / seconds | Revised: tokens / seconds | Prompt: tokens / seconds | Matt: tokens / seconds |
|---|---:|---:|---:|---:|
| Delivery | 239,076 / 88.3 | 270,680 / 119.6 | 140,643 / 59.3 | 171,221 / 70.6 |
| Planning | 101,910 / 68.9 | 131,796 / 97.2 | 144,370 / 115.2 | 126,830 / 78.3 |
| Simplification | 131,011 / 66.5 | 128,971 / 66.8 | 118,802 / 85.8 | — |

Shorter entrypoints did not consistently reduce reported execution usage or time. Runs are too few for a stable cost ranking. Harness instructions and global skill metadata may still be present equally across arms; isolation removes repository AGENTS contamination, not the model's ordinary harness. Native discovery, cross-model behavior, external ticket systems, actual multi-package CI, and statistically repeated comparisons remain untested.

## Preserved evidence and replay

There are **19 scored runs**, five excluded model runs, and two setup/runtime-initialization failures that did not complete an actor. The declared 24-actor budget is exhausted. [Exclusions](exclusions.json) retain contamination and reference-access defects instead of treating them as skill failures or successes. Each scored run preserves its request, runner identity, subject body, conditional resources where present, trace, output, usage, and before/after project snapshots. Subject body hashes were recorded at launch; reference copies are preserved and checked for current-resource matches, but early manifests did not separately index their hashes at launch.

The root scores are explicit nonblind judgments. The blinded reviewer is separate. The scorer accepts either a dated `Done` note or a dated `Outcome` note because the frozen requirement is a dated per-task outcome, not an exact heading. It scores a local Markdown plan independently of this toolbox's canonical formatting. These scorer corrections do not turn absent completion records into passes: original/prompt dated-note failures and Matt's missing ticks/verification remain failures.

Replay without new model calls:

```sh
node evals/pocock-comparison-2026-10-04/check.mjs
node evals/check-review-probes.mjs
```

The first command verifies frozen cases, runner/body identities, preserved trees, current revised hashes, scope effects, independent behavior probes, available fixture tests, plan graphs, and completion-record judgments. It writes [replay-results.json](replay-results.json), including raw reported usage and current-version matches. Comparison-arm failures are recorded outcomes, so a passing replay does not mean every comparison arm passed every criterion. CI runs this replay without invoking a model.

The second command retains all 18 historical review-probe assertions. At this pilot's completion, four probes had current subjects and three create-tasks probes used their frozen original subject. The [subsequent thirteen-skill consolidation](../remaining-skills-2026-10-04/README.md) also archived the remaining four subjects, so all seven now replay against their exact originals. No historical transcript was rehashed as if generated by the new skill.

The runner and frozen cases are retained for inspection. Fresh actor runs would require a newly declared budget; replay does not authorize a broader experiment. The original authoring meta-skill is outside this pilot.

## Repository validation

Local validation passed after the revisions: structural checks for 18 entries, README catalog coverage, all 51 lexical positive routes across 17 skills, persona validation and its controls, routing controls, both authoring-contract checks, historical review-probe replay, and the 19-run pilot replay. Changed/new report links and pilot JSON parsed cleanly; `git diff --check` passed. Lexical routing is not proof of native model triggering. The new CI step was validated locally; no remote CI run was requested.
