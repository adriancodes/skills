Blindly score the candidate outcome. The arm identity is intentionally absent.

Environment: Empty repository; candidate is a diagnosis skill

Request: Create a skill that helps engineers diagnose difficult bugs.

Assertions:
- opportunity: Behavioral none-vs-prompt evidence identifies a residual failure before drafting
- mechanism: Proposed mechanism is reusable context or machinery rather than generic debugging advice

Candidate response:
I’m using the skill-creator guidance because this request is specifically to build a reusable Codex skill. I’ll inspect its requirements, then scaffold and validate the diagnosis skill in this workspace.

The usage patterns are clear enough to proceed without blocking questions: intermittent failures, production-only regressions, concurrency bugs, performance pathologies, and unfamiliar-codebase defects. I’m structuring the skill around evidence preservation, hypothesis ranking, discriminating experiments, and a clear stop boundary between diagnosis and implementation.

The core skill is now written, with a compact main workflow and a separate playbook for concurrency, distributed, regression, performance, data, environment, and lifecycle failures. I’m doing the structural validation and a final trigger/metadata consistency check now.

The official validator is present but cannot start because its Python environment lacks the `yaml` module. I won’t install dependencies implicitly; I’ll run equivalent local checks with the available YAML parser and inspect the generated file set so validation still has concrete coverage.

Created the `diagnose-difficult-bugs` skill in the workspace.

Artifacts:

- [SKILL.md](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-normal-none-work-09BK3s/diagnose-difficult-bugs/SKILL.md)
- [failure-patterns.md](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-normal-none-work-09BK3s/diagnose-difficult-bugs/references/failure-patterns.md)
- [openai.yaml](/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-normal-none-work-09BK3s/diagnose-difficult-bugs/agents/openai.yaml)

The skill covers evidence preservation, causal modeling, hypothesis ranking, discriminating experiments, confidence calibration, and diagnosis-only boundaries. It includes targeted playbooks for concurrency, distributed systems, regressions, performance, data, environment, and lifecycle defects.

Frontmatter and agent metadata passed equivalent YAML and structural checks. The supplied `quick_validate.py` could not run because PyYAML is absent from the environment. No TODO placeholders remain.

Candidate artifacts:
--- diagnose-difficult-bugs/SKILL.md ---
---
name: diagnose-difficult-bugs
description: Systematically diagnose complex software defects using evidence preservation, reproduction, causal tracing, ranked hypotheses, and discriminating experiments. Use for intermittent or nondeterministic failures, production-only bugs, regressions, race conditions, memory or performance pathologies, distributed-system failures, misleading symptoms, unfamiliar codebases, or investigations where the root cause is unclear. Use when asked to investigate, debug, perform root-cause analysis, explain why a failure occurs, or design a diagnostic plan; stop at diagnosis unless the user also requests a fix.
---

# Diagnose Difficult Bugs

Produce an evidence-backed causal explanation, not a plausible guess. Reduce uncertainty with the cheapest safe observation or experiment that can distinguish competing explanations.

## Establish the contract

1. Restate the observed failure, expected behavior, impact, and scope.
2. Separate facts from reports, assumptions, and interpretations.
3. Identify the operating constraints: production safety, available logs, reproducibility, time budget, and whether mutation is authorized.
4. Treat investigation and remediation as separate phases. Do not change behavior when the request is diagnosis-only.

Ask for missing information only when it blocks the next useful test. Otherwise inspect available artifacts and state assumptions.

## Preserve the evidence

Before rerunning, restarting, cleaning, rebuilding, or editing, capture volatile evidence that those actions could destroy: exact errors, timestamps and time zones, request or trace IDs, versions, configuration, inputs, environment, process state, resource levels, recent changes, and reproduction commands.

Prefer read-only inspection first. Redact secrets and personal data from reports. Never increase production load or enable invasive instrumentation without authorization.

Maintain a compact evidence ledger:

| Observation | Source | Supports / weakens | Reliability |
|---|---|---|---|
| Exact fact, including time | Command, log, trace, file, or report | Hypothesis IDs | Direct / inferred / reported |

Record negative results; they eliminate branches and prevent repeated work.

## Build a minimal failure model

Describe the shortest causal path that could connect input to symptom:

`trigger -> relevant state transition -> violated invariant -> propagation -> observed symptom`

Locate the earliest known divergence between a passing and failing execution. Distinguish:

- Trigger: condition that exposes the defect.
- Root cause: defect or invalid assumption that makes the failure possible.
- Amplifier: retries, load, caching, timing, or topology that worsens it.
- Symptom: downstream observation, often far from the cause.

Construct a comparison matrix across good and bad cases. Include code version, data, configuration, dependencies, host or region, time, load, ordering, cache state, identity, and feature flags. Vary one dimension at a time where practical.

## Generate and rank hypotheses

Create multiple falsifiable hypotheses before committing to one. For each, specify:

- mechanism: how it produces the complete symptom pattern;
- predicted observation if true;
- observation that would falsify it;
- prior plausibility and evidence already available;
- cheapest safe discriminating test.

Rank hypotheses by explanatory coverage and test value, not familiarity. Prefer a test that produces different outcomes for the top two hypotheses. Avoid collecting more logs without stating what result would change the decision.

## Run a narrowing loop

1. Inspect the smallest relevant code and history slice. Trace values and state across boundaries rather than reading the repository linearly.
2. Reproduce with the smallest faithful case. Preserve the original failing case as a control.
3. Instrument at the earliest uncertain transition, capturing inputs, outputs, identity, ordering, and timing needed to test a hypothesis.
4. Run one discriminating experiment and compare its result with the prediction.
5. Update the evidence ledger and hypothesis ranking.
6. Repeat until one causal account explains all material observations and credible alternatives are contradicted.

Use repository-native tests and diagnostics when available. Do not mistake a test that passes after many uncontrolled changes for localization. If reproduction is impossible, use converging independent evidence and lower the confidence explicitly.

For specialized failure classes, read [references/failure-patterns.md](references/failure-patterns.md) and apply only the relevant section.

## Guard against common traps

- Do not equate correlation, the last log line, or the crashing frame with root cause.
- Do not anchor on the first plausible explanation or recent diff; use them as priors only.
- Do not silently modify code, dependencies, state, fixtures, or configuration during diagnosis.
- Do not use retries, sleeps, broader exception handling, cache clearing, or restarts as proof of cause.
- Do not claim absence from missing logs; distinguish “did not happen” from “was not observed.”
- Do not stop at a component label such as “race condition” or “bad data.” Identify the violated invariant and causal mechanism.

## Conclude with calibrated confidence

Report:

1. **Symptom and scope** — what fails, where, and under which conditions.
2. **Root cause** — the causal chain and violated invariant.
3. **Evidence** — decisive observations and experiments, with artifact locations or commands.
4. **Alternatives rejected** — leading hypotheses and contradicting evidence.
5. **Confidence** — high, medium, or low, plus what limits certainty.
6. **Next action** — the smallest confirmation or remediation step, clearly labeled and not executed unless authorized.

Use “root cause not yet established” when evidence is insufficient. Provide the next discriminating test instead of overstating certainty.

--- diagnose-difficult-bugs/agents/openai.yaml ---
interface:
  display_name: "Difficult Bug Diagnosis"
  short_description: "Find root causes in difficult software bugs"
  default_prompt: "Use $diagnose-difficult-bugs to investigate this bug and produce an evidence-backed root-cause diagnosis."

--- diagnose-difficult-bugs/references/failure-patterns.md ---
# Failure-class playbooks

Read only the section matching the observed failure. These are diagnostic prompts, not substitutes for evidence.

## Intermittent and concurrency failures

- Preserve ordering, thread or task identity, correlation IDs, clock source, and synchronization events.
- Check shared mutable state, atomicity boundaries, lock ordering, cancellation, duplicate work, and lifecycle races.
- Control scheduling or inject deterministic synchronization when possible; avoid assuming that added logging merely observes rather than changes timing.
- Treat sleeps and repeated runs as symptom detectors, not causal tests.

## Production-only and distributed failures

- Compare deployed artifact digests, runtime versions, flags, configuration sources, topology, identity and permissions, data shape, traffic, and regional dependencies.
- Build a time-aligned request path using trace or request IDs. Account for clock skew and sampling gaps.
- Examine timeout budgets, retry multiplication, idempotency, partial failure, stale discovery, replication lag, and split-brain assumptions.
- Distinguish application errors from proxy, queue, database, dependency, and observability artifacts.

## Regressions

- Establish the last known good and first known bad artifacts, not merely dates or branch names.
- Bisect only with a reliable oracle. Track coupled changes in schema, configuration, dependencies, generated files, and deployment environment.
- Verify that reverting a change removes the failure under the same inputs and state; a revert result alone may still reflect interaction effects.

## Performance and resource failures

- Define the metric and baseline: latency distribution, throughput, CPU, allocation, resident memory, I/O, queue depth, or saturation.
- Separate demand growth from per-operation regression. Compare normalized work, warm-up, cache state, and concurrency.
- Prefer profiles, traces, allocation data, and wait breakdowns over intuition. Check coordinated omission and sampling bias.
- For leaks, distinguish retained memory from allocator behavior and temporary peaks; identify the retaining path or unreleased resource lifecycle.

## Data-dependent failures

- Minimize the failing input while preserving its semantics and original copy.
- Inspect encoding, locale, time zone, numeric boundaries, nullability, ordering, normalization, schema version, and historical migrations.
- Trace provenance and transformation steps. Identify where valid data becomes invalid, or where an undocumented precondition is first assumed.
- Never expose sensitive payloads in logs or reports; use hashes, shapes, or redacted samples when sufficient.

## Build, dependency, and environment failures

- Compare lockfiles, resolved dependency graphs, compiler and runtime versions, platform and architecture, environment variables, filesystem semantics, and generated artifacts.
- Reproduce from a clean environment only after preserving the failing environment. A clean build can erase the evidence.
- Check undeclared dependencies, path and case sensitivity, nondeterministic generation, stale outputs, and network-sourced artifacts.

## State-machine and lifecycle failures

- Write the allowed states and transitions explicitly.
- Capture the actual transition sequence with entity identity and version.
- Look for duplicate, skipped, reordered, or post-terminal transitions; initialization and teardown asymmetry; cancellation; and reuse after disposal.
- Locate the first transition that violates an invariant rather than focusing on the later exception.


Return one 0-or-1 score and a concise reason for every assertion ID. Score only observable behavior.