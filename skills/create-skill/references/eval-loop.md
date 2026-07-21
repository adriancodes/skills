# Comparative Eval Loop

Load only after the user confirms the Skill Brief, then keep it loaded through final acceptance. The authoritative interview gate, case counts, arms, files, and stopping requirements live in `rules.md`; this guide explains how to apply them.

## The Three Questions

Keep three questions separate:

1. **Opportunity:** Does the candidate solve a recurring behavioral or prompt-delivery failure?
2. **Correctness:** Does the generated skill and anything it emits work on adversarial inputs?
3. **Effectiveness:** Does the skill materially improve total repeated-use utility over the best cheaper delivery mechanism at an acceptable cost?

A structurally excellent skill can fail any of them. Choose the consequence tier in `rules.md` before spending runs; abandoning a weak candidate protects every future conversation from context noise, while over-testing a harmless style skill wastes more than it protects.

## Stage 1: Opportunity Test

Start from the confirmed Skill Brief. Before drafting, create only the discovery evidence required by `rules.md` → Evaluation Tiers and Opportunity Test Requirements. Derive tasks and assertions from confirmed use cases and success measures; never replace them with a convenient agent-authored target. Make tasks behavioral: ask the model to perform the work, never to describe how it would behave. Tier 1 may start from an explicit user preference for response-only behavior.

For a new Tier-2 or Tier-3 skill, run two isolated arms for each required discovery case:

- **None:** task and normal harness instructions only.
- **Prompt:** the strongest short instruction an engineer would realistically add every time.

Preserve the exact prompt, environment, outputs, tool traces, artifacts, and cost. Score only observable outcomes. A confession such as “I would probably skip minimization” is not evidence; a speculative edit made before reproduction is.

After both arms, write an opportunity record:

```markdown
Opportunity type: <behavioral residual | delivery residual>
Residual failure or burden: <observable behavior the prompt did not recover, or recurring recall/application burden>
Proposed mechanism: <catalog, state contract, utility, decision rule, or coordination protocol>
Target metric: <mechanical or blinded measure>
Minimum meaningful improvement: <declared threshold>
Maximum cost premium: <tokens, latency, tool calls, interruptions, and user instruction burden>
Cheaper alternatives rejected: <prompt, template, repo instruction, script — and why>
```

When the prompt arm fixes the behavior but the none arm does not, test whether reliable delivery is itself part of the confirmed outcome. Compare a normally installed skill with a repository instruction, router, saved prompt, template, or script on user instruction burden, trigger recall, false triggers, consistency, and runtime cost. Prompt-loaded output parity does not erase a delivery residual. If neither behavioral nor delivery residual remains, present the evidence and recommended cheaper mechanism. Ask whether that mechanism satisfies the confirmed intent. Stop with acknowledgment when it does; revise and reconfirm the brief when it exposes an omitted use case. Do not create a skill merely to complete the workflow.

## Stage 2: Generate the Eval Package

Draft the minimal skill around the proposed mechanism, then create its tier-appropriate eval package **before running the skill arm**. Tier 1 keeps only cases, a smoke command or script, the subject hash, and results. Tier 2 keeps a compact package: cases, subject hash, tested route and budget, deterministic checks or a scorer, and raw results. Keep those facts together when separate rubric, matrix, manifest, and schema files would add ceremony without improving reproducibility.

Tier 3 uses the full package:

```text
<skill>/evals/
├── cases.jsonl
├── rubric.md
├── matrix.json
├── suite-manifest.json
├── run.md
├── score-input.schema.json
├── score.*
├── fixtures/
└── results/
```

`cases.jsonl` holds discovery, held-out behavior, trigger-positive, trigger-negative, and later regression cases. Give every case a stable ID, split, setup, user request, and assertion objects with individual IDs, criteria, and criticality. Trigger cases also name the expected skill or no-trigger result. Never promote a discovery case into held-out scoring.

`rubric.md` freezes downstream outcomes, scoring rules, critical failures, minimum improvement, maximum cost premium, and iteration plus total-run/cost budgets. Use exact checks where possible: defects fixed, unsafe changes absent, handoff resumed, lookup applied, or migration survived rollback. Process artifacts are correctness evidence, not an effectiveness substitute.

`matrix.json` freezes exact model identifiers, harness versions, launch commands, installation or force-load commands, environment, and model settings. Prefer a dated model snapshot. When an authenticated product route exposes only a moving alias, record `model_snapshot: null`, `snapshot_policy: opaque-time-bounded`, the auth route, and observation timestamp; limit the claim to that observed route and date. Never present an opaque route as snapshot-reproducible. Resolve every other placeholder before the first scored run; changing it versions the suite.

`suite-manifest.json` freezes opportunity evidence and content hashes before any skill-arm run. The scorer rejects a frozen matrix when this manifest is unfrozen, evidence is missing, or current files no longer match their hashes.

`run.md` records how to create isolated sessions, install or force-load the correct arm, collect usage, handle launch failures, and invoke the scorer. Another engineer must be able to reproduce the run without reconstructing decisions from chat.

`fixtures/` and its setup utility create every downstream repository or input deterministically. Prose descriptions alone are not fixtures.

`score-input.schema.json` defines the evidence-bearing record each run submits: exact arm, harness/model, iteration, usage, observed trigger, assertion method, and evidence paths. `score.*` validates those records, enforces repetitions and budgets, and emits assertion deltas, trigger metrics, cost, and verdict. A prose rubric without an executable or blinded scoring procedure is not reproducible.

`results/` preserves every raw output, artifact, trace, score, exclusion, and retry. Never keep only the summary.

## Stage 3: Prove Correctness

Run the matching type-and-tier correctness method from `rules.md` → Eval Loop Requirements:

- **Scripts and verifiable outputs:** execute adversarial fixtures, fix the skill rather than the fixture, and rerun the full set after every change.
- **Disciplines:** test combined pressure using the arms required by the tier; capture actual rationalizations and close the observed loopholes.
- **References:** have a fresh agent perform real lookups and apply them.
- **Pure workflows:** have a fresh agent execute the declared correctness cases end to end.

At Tier 2, design the four behavior sessions to carry this correctness evidence too: the skill arm of the paired value case covers normal operation, while the two skill-only regressions cover edge and pressure/authority behavior. Do not add a second agent-run correctness suite.

For Tier-2 structured data, select the two boundary classes most likely to expose the mechanism's failure. At Tier 3, begin with empty, singleton, delimiter-in-data, embedded newline, ragged, escape-character, Unicode/BOM, numeric-boundary, and type-ambiguity cases. Add domain-specific cases; the catalog is a floor, not a claim of completeness.

## Stage 4: Compare Prompt and Skill

Tier 1 runs its three bounded smoke probes and stops. Tier 2 uses a targeted four-session behavior experiment and normally delegates triggering to the shared portfolio routing suite. Tier 3 runs the full behavior and triggering experiments separately.

### Behavior experiment

At Tier 2, run one representative held-out value case in both arms:

- **Prompt arm:** strongest realistic short prompt, candidate skill unavailable.
- **Skill arm:** candidate skill force-loaded as binding instructions, short prompt absent.

Then run two skill-only regression cases: one edge case and one pressure/authority case. That is four actor sessions by default. Repeat only a predeclared inconsistent or decision-boundary cell.

At Tier 3, run both arms for every held-out case with the repetitions required by the tier. At both tiers, keep task, environment, model settings, available tools, and non-skill instructions identical. The none arm is useful for diagnosis but not required again after the opportunity test.

Score the declared engineering outcome, not obedience theater. For a meta-skill that creates another skill, execute the generated child on representative downstream work and score that result. Use fixture children for stage-specific tests and at most one full nested child-eval case; otherwise evaluation recursively explodes. A longer report, more files, or more tool calls count as cost unless the rubric connects them to a useful result.

### Trigger experiment

Install the normal description set through the harness's native discovery mechanism without force-loading any body. Run natural positive and adjacent negative requests. At Tier 2, keep these cases with each skill but execute them through the shared portfolio routing suite; run them separately for a skill only after its name or description changes or when a collision is known. Tier 3 runs its dedicated trigger suite. Manual AGENTS/rules routing does not prove auto-triggering; mark the cell unsupported when native discovery is absent. Record correct triggers, misses, false triggers, and collisions. A body failure is not a trigger failure; rerun force-loaded before classifying it.

## Stage 5: Iterate Without Gaming

Compare each result with the confirmed Skill Brief and classify every failure before editing:

- trigger miss or collision;
- missing context acquisition;
- missing reference or mechanism;
- ambiguous workflow or completion criterion;
- rationalized shortcut;
- artifact or script defect;
- harness launch or scorer failure.

Present the mismatch and 1–3 ranked corrections to the user. Put the recommended correction first and state its expected effect, cost, and any tradeoff. Apply the selected correction to only the responsible layer. Add a regression case for every new failure class. At Tier 2, rerun only affected behavior cells and routing only when discovery metadata changed; keep the default suite bounded by replacing a weaker regression unless the new class is a distinct critical risk. At Tier 3, rerun the complete affected correctness, held-out, and trigger suites.

Freeze the test before seeing the skill output. Never weaken a valid assertion, delete a hard case, reveal held-out answers to the skill, or tune only for judge wording. When the eval itself is wrong, explain the correction, version the suite, and rerun every arm under the new version.

Repeat evaluate → explain → recommend → revise until the evidence passes and the user accepts the result. Keep the loop inside the frozen iteration and cost budgets. At the boundary, ask whether to authorize one explicit bounded extension, revise and reconfirm the brief, or stop. Never interpret “keep trying” as an unlimited run.

## Stage 6: Decide

Run the declared evidence tier and stop when its claim is satisfied. Expand to additional harnesses, models, or repetitions only when a broader or higher-consequence claim requires them.

End with exactly one verdict:

- **SHIP:** every critical case passes; the declared improvement over the prompt and cost ceiling pass; the tier-required rerun is clean; any required fresh probes reveal no new failure class; the user explicitly accepts the result.
- **ITERATE:** a specific skill-layer correction remains plausible and the iteration budget remains.
- **ABANDON:** the user stops, total repeated-use utility is equivalent to a cheaper delivery mechanism, the cost premium fails, the budget is exhausted without an authorized extension, or revisions only memorize known cases.

Treat user satisfaction as the product acceptance gate, not a substitute for evidence. A satisfied user cannot turn a failing eval into SHIP; a passing eval cannot force acceptance of a skill that misses the user's intent.

State the evaluation tier and tested route beside the verdict. Tier 1 means smoke-tested, Tier 2 has targeted comparative support, and Tier 3 is formally supported. Evidence from one force-loaded model supports only that model and body behavior; it says nothing about autonomous triggering or other harnesses.

## Above All

The deliverable is not maximum process. It is the smallest useful skill plus evidence proportionate to what failure would cost — or an explicit decision not to ship it.
