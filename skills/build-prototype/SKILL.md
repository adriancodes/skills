---
name: build-prototype
description: Use when the user asks "build a throwaway prototype", "run an experiment before production", or "test this design with runnable code". Also use for a spike or proof of concept with a measurable question and synthetic inputs.
license: MIT
metadata:
  category: Engineering
  summary: Builds and runs the smallest disposable experiment that distinguishes design alternatives.
---

# Build Prototype

Test a named design question with an executed experiment. Keep the verdict within what the experiment measures.

## Scope

Use for disposable experiments before production implementation.

Do not use for:

- Implementing an accepted feature: use `deliver-feature`; specify, implement, and verify the accepted behavior if unavailable.
- Locating a regression's cause: use `diagnose`; reproduce and test causal hypotheses if unavailable.
- A visual sketch without an experiment: use the relevant design workflow.

## Workflow

### 1. Define the experiment

Name the unresolved question and alternatives.
Choose one observable discriminator, such as queue count or state transition.
Specify the same inputs for every alternative.
Include a normal path and at least two boundary or failure paths.
Inspect local prototype conventions and available runtimes.
Use synthetic data and a fake clock when external effects or real time obscure the question.

Done when a result could favor either alternative under stated criteria.

### 2. Build the minimum model

Write independently runnable code outside production paths.
Use an existing runtime and built-in tools before adding dependencies.
Model only the behavior needed by the discriminator.
Keep production code and user work intact.
Use a local stub for external operations.
Make event sequences deterministic and replayable.

Done when every alternative can receive the same fixture without external effects.

### 3. Execute and interpret

Run the experiment for each alternative.
Inspect actual output rather than predicting a result from the code.
Retain the replay command and observations beside the prototype.
Separate measured behavior from assumptions and untested effects.
Record an inconclusive verdict when the experiment cannot discriminate.
Correct the experiment when its fixture fails to represent the named question.

Done when an independent replay reproduces the observations supporting the verdict.

### 4. Return the decision evidence

Report the result, limitation, and next bounded decision.
Mark the artifact as disposable prototype code.
Use the existing experiment location or `prototypes/<topic>/` as a fallback.
Keep promotion into production as a separate requested implementation.

Done when the user can assess the tradeoff without mistaking the prototype for production readiness.

## Worked example

For resend behavior, drive both models through `send, click, fail, retry, succeed`.
Count queued sends immediately after the pending-state click.
An immediate-resend model queues two; a failure-gated model queues one.
Replay both with the same stub queue.
Record that this tests client queueing, while server idempotency remains untested.

## Verification

Replay the saved command after the last edit.
Check the inputs, observed output, and verdict agree.
Check production files and external services stayed outside the experiment.
Keep the verdict bounded by the executed experiment.
