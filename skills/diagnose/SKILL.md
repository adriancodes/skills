---
name: diagnose
description: >
  Use when a user asks to "diagnose this bug", "debug this failure",
  "why is this throwing?", or "investigate this regression". Also use
  for flaky tests, intermittent failures, incorrect behavior, crashes,
  hangs, and performance regressions whose cause is unknown.
license: MIT
metadata:
  category: Quality
  summary: Proves an unknown bug cause with a reproducible, minimized, evidence-backed diagnosis before any authorized fix.
---

# Diagnose

## Overview

**Prove the cause before proposing a fix.** Treat every plausible explanation as a hypothesis until an executed observation distinguishes it from credible alternatives. Build a *tight*, red-capable reproduction, minimize it, and test one variable at a time.

Diagnosis is read-only by default. A request to diagnose, debug, investigate, or explain authorizes inspection and safe execution, not file edits, instrumentation, regression tests, or fixes. Apply changes only when the user explicitly requests or authorizes them. No tight reproduction means no root-cause claim.

## When to Use

- Functional behavior differs from a stated expectation.
- A test fails, flakes, hangs, times out, or passes only in some environments.
- A process crashes or throws an unexplained error.
- Latency, throughput, memory, CPU, query count, or bundle size regressed.
- A bug report names a symptom but the causal mechanism remains unknown.
- A requested fix still requires root-cause discovery before implementation.

## Do Not Use When

- The request asks how working code behaves; use `understand-codebase` when installed, otherwise perform a focused read-only trace.
- The request asks whether a branch or diff matches standards or a specification; use `code-review` when installed, otherwise review the diff against those contracts.
- A finished artifact needs adversarial readiness testing; use `verify-work` when installed, otherwise execute hostile fixtures against its stated promise.
- The cause and desired change are already known; use the repository's implementation or TDD workflow.
- The task is live production experimentation, penetration testing, or incident response without explicit operational authorization.

## Required Context

Establish the smallest context that can make the symptom falsifiable:

- Observed behavior and expected behavior
- Exact input, environment, version, and timing conditions known to matter
- Existing reproduction steps, failing commands, logs, traces, profiles, or screenshots
- Applicable repository instructions and current workspace state
- Authority mode: `diagnosis-only` unless edits or a fix were explicitly requested

Infer available facts from the request and repository. Ask one pointed question only when a missing fact blocks the next discriminating observation. Done when the symptom can be stated as one observable proposition and the authority mode is explicit.

## Workflow

### 1. Establish a tight reproduction

Start from the user's exact symptom. Select the narrowest agent-runnable signal that can go red on that symptom:

1. Focused existing test
2. Direct function or module invocation
3. CLI or HTTP request with fixed input
4. Browser flow with a concrete DOM, console, or network assertion
5. Captured request, event, dataset, or trace replay
6. Differential command comparing known-good and failing states
7. Fixed-sample flake or performance harness

Run the command before reading broadly for a theory. Capture the exact invocation, exit status, and relevant output. For intermittent behavior, run a fixed stated sample and report the failure rate, such as `7/20`; improve the signal by controlling time, randomness, concurrency, filesystem, network, and environment.

Treat an existing broad suite as a starting point, not automatically as the tight loop. Narrow it until one command tests the reported symptom without unrelated failures. Done when one named command has already produced the exact failure, or when the diagnosis stops with a precise account of why reproduction is currently impossible.

### 2. Minimize the failing case

Remove one input, caller, layer, configuration value, dependency, or step at a time. Re-run the tight command after every removal. Keep a removal only when the same symptom remains red; restore it when the symptom disappears or changes.

For performance regressions, minimize the measured path and preserve comparable warm-up, workload, and environment conditions. Record both the baseline and failing measurement rather than relying on subjective slowness.

Done when every remaining element is load-bearing, or when a named boundary cannot be crossed with available access.

### 3. Rank falsifiable hypotheses

Write three to five credible hypotheses before testing the leading one. For each, record the evidence for it, evidence against it, a falsifiable prediction, and the cheapest observation that distinguishes it.

| Rank | Hypothesis | Prediction | Cheapest discriminating observation |
|------|------------|------------|--------------------------------------|
| 1 | Boundary comparison excludes equality | Adjacent values pass while the exact threshold fails | Probe threshold − 1, threshold, threshold + 1 |
| 2 | Caller maps the input incorrectly | Direct callee invocation passes while the full path fails | Compare caller and direct inputs |
| 3 | Configuration disables the behavior | Holding code and input fixed, changing only config changes the verdict | Print or inspect the resolved config |

Share the list briefly when domain knowledge could re-rank it, but continue with the best available ranking unless an answer is required. Discard any hypothesis that cannot predict an observable difference. Done when three to five ranked predictions cover the credible causal branches left by the minimized reproduction.

### 4. Falsify one hypothesis at a time

Run the cheapest discriminating observation for the leading hypothesis. Change exactly one variable and preserve the same reproduction signal. Record the result beside the prediction, then confirm, reject, or re-rank the hypothesis.

Prefer read-only probes: focused commands, debugger or REPL inspection, existing logs, resolved configuration, query plans, profiles, version history, or known-good comparisons. Use history only when a hypothesis predicts a relevant change. Request authorization before adding logs, probes, tests, feature flags, or other instrumentation; never disguise an edit as inspection.

When evidence contradicts the leading theory, re-rank instead of stacking speculative fixes. Done when one causal explanation accounts for the exact symptom and the strongest alternatives have executed contradictory evidence, or when the remaining uncertainty is explicitly irreducible with current access.

### 5. Report the diagnosis

Call something a root cause only when the evidence forms a causal chain:

`exact symptom → minimized reproduction → discriminating observation → causal code/configuration/state`

Report in this order:

1. Root cause and confidence, or `Root cause not yet established`
2. Reproduction command and decisive output
3. Minimal failure conditions
4. Confirmed and falsified hypotheses
5. File, symbol, configuration, log, trace, profile, or commit evidence
6. Remaining unknowns and the single highest-value next observation

In diagnosis-only mode, stop after the report. State the authority boundary once and move on; do not lecture or append an unsolicited patch plan. Done when every material claim is supported by an executed observation or labeled as inference or unknown.

### 6. Fix only with explicit authority

Enter this step only when the original request explicitly includes fixing the bug or the user separately authorizes a fix.

1. Turn the minimized reproduction into a regression test at the seam that exercises the real bug pattern.
2. Run the test and capture its red result before changing production code.
3. Apply the smallest causal fix; avoid adjacent refactors.
4. Run the regression test green.
5. Re-run the original, unminimized reproduction green.
6. Run the proportionate surrounding suite and inspect the diff.
7. Remove every temporary log, probe, flag, fixture, and debug artifact.

If no correct regression seam exists, state that limitation and ask before expanding scope to create one. Done when red-to-green evidence exists, the original symptom is gone, surrounding checks pass, and temporary instrumentation is absent.

## Core Example

Request: “Debug why eligible Gold customers sometimes receive no checkout discount. Do not change files.”

1. Run `npm test -- --test-name-pattern="at the threshold"`; capture `expected 1000, actual 0`.
2. Minimize to a direct call and vary only the subtotal:

   ```sh
   node --input-type=module -e 'import {calculateDiscount} from "./src/discount.js"; for (const cents of [9999,10000,10001]) console.log(cents, calculateDiscount({tier:"gold",subtotalCents:cents}))'
   # 9999 0
   # 10000 0
   # 10001 1000
   ```

3. Rank boundary comparison, caller mapping, tier mismatch, coupon suppression, and rounding as falsifiable hypotheses.
4. Falsify the caller, tier, coupon, and rounding branches with direct single-variable probes.
5. Report the strict `subtotalCents > GOLD_MINIMUM_CENTS` comparison as the cause because the requirement includes equality. Cite the function and failing output. Stop without editing files.

## Tool Guidance

**Prefer:**

- Focused repository search with `rg --files` and `rg`
- The repository's narrowest test selector or direct executable seam
- Debuggers, REPLs, profiles, query plans, and differential commands that answer one prediction
- Existing logs and traces before new instrumentation
- Workspace hashes or version-control status when verifying read-only behavior

**Avoid:**

- Whole-repository tours before a reproduction exists
- Blanket logging, speculative patches, and simultaneous variable changes
- History archaeology without a history-dependent hypothesis
- Production mutation, destructive commands, or external side effects without explicit authorization

## Common Rationalizations

These shortcuts appeared in the no-instruction baseline or are direct loopholes exposed by it.

| Shortcut | Reality |
|----------|---------|
| “The boundary is already suspect.” | Suspicion selects a probe; it does not establish cause. |
| “The full suite reproduces it.” | A broad suite locates a symptom. Name and run the smallest exact signal. |
| “The wrapper is simple enough to leave in.” | Bypass it; a direct callee failure falsifies mapping as a cause. |
| “Only one explanation is credible.” | Rank three to five predictions before anchoring on the first plausible idea. |
| “History and blame might reveal something.” | Inspect history only when it distinguishes a stated hypothesis. |
| “The correction is obvious, so mention or apply it.” | Diagnosis-only authority ends at the evidence-backed cause. |

## Stop Conditions

- “The fix is obvious.”
- “One failing test is enough.”
- “This is probably caused by…”
- “Changing both values will be faster.”
- “A temporary edit does not count.”
- “The user said debug, so fixing is implied.”

Each thought maps to the Rationalization Table or the authority boundary. Return to the unfinished workflow step.

## Success Criteria

- Name and run one command that reproduces the user's exact symptom.
- Minimize the reproduction until every remaining element is load-bearing.
- Rank three to five falsifiable hypotheses and test one variable at a time.
- Support the root cause with executed evidence and cite the causal source, configuration, state, or change.
- Label an inconclusive diagnosis honestly and name the next discriminating observation.
- Leave files and external systems unchanged in diagnosis-only mode.
- For an authorized fix, show regression red, regression green, original reproduction green, surrounding checks passing, and temporary instrumentation removed.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Reproducing a nearby failure | Assert the exact observed-versus-expected symptom. |
| Reading code until a theory feels true | Build and run the tight signal first. |
| Testing the leading theory immediately | Write three to five ranked predictions before the first probe. |
| Changing several variables together | Restore the baseline and change one variable. |
| Treating correlation as cause | Require the full causal chain before using “root cause.” |
| Writing a shallow regression test | Exercise the real bug pattern at the correct seam. |

## Failure Modes

- **No reproduction:** Report every attempted signal and its result. Request the smallest missing artifact, environment access, or authorization needed for the next observation. Stop before hypothesizing a root cause.
- **Production-only symptom:** Prefer captured logs, traces, profiles, requests, and a safe staging replay. Request explicit operational authorization before any live probe.
- **Low-rate flake:** Quantify the current rate, control one nondeterministic source at a time, and report the evidence limit when the rate remains too low to discriminate.
- **Inaccessible dependency:** Prove behavior up to the visible boundary and label behavior beyond it unknown.
- **Conflicting evidence:** Preserve both results, inspect environment and input differences, and withhold the root-cause label.
- **No correct test seam after fix authorization:** Demonstrate the original repro, name the missing seam, and ask before expanding implementation scope.

## Genuine Exceptions

When a workflow rule is genuinely impossible:

1. Name the blocked rule and the concrete reason.
2. Show the attempts and evidence that establish the block.
3. Name the closest safe alternative and the weaker claim it supports.
4. Ask for missing access or authorization when it would unblock stronger evidence.

Time pressure, apparent simplicity, prior implementation effort, and a request to “just fix it” do not make the diagnosis steps impossible.

## Summary

Prove the cause before proposing a fix: reproduce, minimize, falsify, and cite. In diagnosis-only mode, stop at the evidence-backed explanation.
