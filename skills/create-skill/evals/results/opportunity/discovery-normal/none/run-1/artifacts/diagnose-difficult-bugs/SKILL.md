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
