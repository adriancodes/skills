# Adrian's skills compared with Matt Pocock's installed collection

Review date: 2026-10-04. Adrian repository: `f334a510f053da744c2d8cd58f2ac40037d4d497`.

Follow-up: the [four-skill pilot](../../evals/pocock-comparison-2026-10-04/README.md) implemented the first improvements and compared outcomes. Original skills already completed the explicit ordinary requests; the predicted ceremony did not appear in those runs. Correctness mostly tied, while revised delivery produced a more complete handoff record. The static observations below remain a historical hypothesis, not behavioral proof.

## Judgment

There is a credible path to a better everyday toolbox: retain the evidence-backed contracts, make routine work easier to complete, and keep only instructions that help the agent make a decision. The main opportunity is process calibration. More rules and more skills would not establish better results.

This is a static comparison, not a head-to-head behavioral benchmark. It identifies mechanisms and likely failure modes; it does not prove either collection produces better outcomes. No runtime skill was changed in this review.

## What was compared

Adrian's source is this repository's 17 active `skills/*/SKILL.md` entrypoints. Matt's comparison set is the 30 installed skills attributed to `mattpocock/skills` by `/Users/adrian/.agents/.skill-lock.json`. The [snapshot](matt-pocock-comparison-2026-10-04.snapshot.json) preserves paths, hashes, provenance, and entrypoint word counts.

Some shared names in the installation now contain Adrian's skill. For example, the installed `diagnose` matches Adrian's workflow; Matt's relevant counterpart is `diagnosing-bugs`. Comparing arbitrary installed names would conflate the authors. These results describe installed files, not the latest upstream collection.

| Entry-point measure | Adrian | Matt, installed |
|---|---:|---:|
| Skills | 17 | 30 |
| Body words, total | 22,020 | 19,525 |
| Median body words | 1,143 | 463.5 |

Counts exclude YAML frontmatter and supporting references. The portfolios have different coverage, and Matt's tiny wrapper skills depend on other skills. These numbers measure loading size, not quality, completeness, or total workflow tokens.

## Patterns worth adopting

Matt's `prototype` routes on the question the prototype should answer: logic/state versus UI appearance. Each branch produces a different useful artifact. This makes the selection rule concrete before adding detailed procedure.

Matt's `to-tickets` explains when vertical slices fail: wide refactors whose blast radius prevents an independent slice from landing green. It substitutes expand, bounded migration batches, and contract, with real blocking edges. This is an operational exception with a replacement method.

Matt's `diagnosing-bugs` leads with its central mechanism: construct a tight command that reproduces the exact symptom. Its longer instructions serve that mechanism. Brevity is not universal in his collection; some tasks justify substantial guidance.

Matt's `handoff` references existing artifacts instead of copying them into a second account of the work. Its small body gives a next agent what is needed to resume.

## What Adrian should keep

- The slice bounds, explicit blockers, confirmation records, and completion notes that support reliable handoffs.
- Review findings tied to introduced defects, concrete consequences, and supporting evidence; no mandatory praise or generic smells.
- Preservation of user work and external authorization boundaries.
- Public-seam tests, valid red evidence, and real data-boundary checks in TDD.
- Honest separation of structural checks, lexical routing, body behavior, and installed discovery.
- Standalone installation and inline fallbacks for missing sibling skills.

These are concrete mechanisms. Shortening must preserve them unless new evidence supports changing them.

## First improvements, ranked

| Priority | Subject and observed instruction | Proposed change | Regression to freeze |
|---|---|---|---|
| 1 | `deliver-feature` stops after exactly one stage despite accepting end-to-end requests. Its missing-sibling fallback also waits for additional approval. | Honor the requested completion scope. Preserve stage state and genuine decision gates, but continue authorized work when no decision is missing. Use the documented fallback when a sibling is absent. | An end-to-end request completes unblocked stages; a next-stage-only request stops at that stage; unresolved decisions still block dependent work. |
| 2 | `create-tasks` rejects horizontal slices without a wide-refactor exception. Its action step rejects one-layer slices while Success Criteria allow genuinely one-layer work. | Keep vertical slices as the default. Add expand–migrate–contract for mechanical refactors and align the one-layer exception throughout. | Notification work stays vertical; a shared-symbol migration has bounded batches and a final contract task; a backend-only task remains valid. |
| 3 | `simplify-code` requires approval before creating characterization tests when tests are absent. | Allow meaningful local characterization checks within the authorized simplification scope. Ask only when behavior, scope, dependencies, or external effects require a decision. | Untested legacy cleanup preserves outputs; read-only review remains read-only; no unrelated dependencies or API changes appear. |
| 4 | `create-skill` mandates an adaptive interview and separate confirmation for every behavior-changing update, plus user selection after each eval miss. | After the first pilots, calibrate authoring to information actually missing and risk. Preserve user choices, frozen cases, cost limits, and honest evidence claims. | A well-specified narrow edit proceeds; an ambiguous new skill asks a useful question; evaluation failures remain disclosed. This meta-skill needs Tier-3 evidence. |
| 5 | Larger skills repeat instructions across overview, workflow, rationalizations, mistakes, success criteria, and summary. | Prune one pilot at a time. Retain repetition that demonstrably protects behavior; extract only conditional depth. | Current correctness, pressure, scope, and override cases keep passing; loading size and workflow interruption cost improve. |

These are proposed behavior changes, not accepted releases. The target audience and existing invocation choices remain inferred from the repository. The user's preferred meaning of quality is pending.

## Coverage gaps

Matt's installed collection also supplies dedicated research, handoff, prototype, tracker triage, domain-modeling, and teaching workflows. Adrian does not need a duplicate of every installed skill. Add a capability only if the intended users need an independent version and existing installed coverage is insufficient. Runtime size reduction and capability expansion are separate decisions.

## Evidence and release plan

The initial repository checks all passed:

```text
node scripts/skills.mjs check       18 entries clean, including ground-rules
node scripts/skills.mjs readme --check   every current entry linked
node scripts/skills.mjs route       51/51 positives; 17/17 skills covered
node scripts/validate-personas.mjs  1 persona clean
```

The route command explicitly reports a lexical preflight. It is not proof of autonomous triggering. Existing result archives also contain historical or unverified runs; for example, `diagnose` remains ITERATE and `create-skill` has an unfrozen effectiveness matrix. Preserve those limits rather than treating file presence as passing evidence.

Recommended first batch: the three reversible local-workflow corrections above. Confirm the affected brief fields, freeze the new regressions before editing, and preserve existing valid cases. Apply the repository's Tier-2 recipe to each changed skill: a prompt/skill value pair plus edge and pressure regressions, recording current hashes, route, output, and cost. Run routing separately if discovery metadata changes. Do not expand into a portfolio-wide benchmark or alter the meta-skill's formal suite silently.

Success means the requested outcome completes with fewer unnecessary interruptions, existing scope and authorization boundaries remain intact, and no valid regression is weakened. Lower word counts are supporting measurements. A claim of matching or beating Matt requires matched downstream tasks and measured outcomes from both collections.

## Maintenance boundary

Repository `AGENTS.md` requires `create-skill` for behavior-changing edits. That skill currently says: “Do not test, scope, draft, or reject a candidate until intent is confirmed.” Its read-only review branch permits an inferred brief with ambiguity flagged. This document completes that comparison branch; runtime revisions await the required intent clarification and affected brief confirmation. No installed copies were updated.
