# Review corrections — 2026-09-04

The user accepted the review's corrections with “ok implemnt your recommendations”. The scope is the minimal-template contradiction, spec pacing regression, task-write oracle, and unauditable historical claims. Existing invocation descriptions and unrelated frozen cases are preserved.

## Changes

- Accept trigger, exclusion, and collision content within either supported scope structure.
- Exclude terse option picks from impatience. Retain the consecutive-answer threshold and explicit pace-complaint path.
- Treat “skip the file” as a write prohibition. Keep a separate chat-summary preference case.
- Plan confirmed behavior without inventing an unspecified route name. Reopen the spec only when missing behavior prevents a runnable demo.
- Mark missing historical raw evidence unverified. Preserve original counts and the superseded task oracle.

## Evidence and limits

Seven current-subject probes pass 18 assertions. [review-results.json](review-results.json) identifies every current run, subject, manual score, workspace hash, historical run, failed launch, and observed usage. Raw prompts, case snapshots, manifests, outputs, traces, and before/after workspaces live in each affected skill's `evals/results/review-2026-09-04/` directory.

Language scores are non-blind manual judgments. The executable replay verifies case coverage, current subject and fixture bytes, prompt/output/trace integrity, and file effects. The valid minimal workflow is accepted; the same fixture without its exclusion sentence is rejected. Spec probes cover option picks and explicit pace complaints, not every possible pacing history.

These are explicit-load regressions on Codex CLI 0.153.3, `gpt-5.6-sol`, medium reasoning. Global harness skills remained discoverable despite `--ignore-user-config`; the harness reported shortened skill descriptions. These runs do not measure autonomous triggering, establish a full Tier-2 comparison, or satisfy create-skill's Tier-3 suite. Its formal verdict remains ITERATE.

The runner caps each launch at 120 seconds. Fourteen launches produced thirteen completed sessions: seven current runs, six superseded task runs, and one failed launch. Total recorded usage was 1,008,579 input tokens (792,320 cached) plus 26,662 output tokens. These are observed CLI counts, not a billed-dollar estimate or a claim of passing a frozen token budget.

## Preserved failures

- The authoring guard failed before correction: `The input was expected to not match the regular expression /Error messages and symptoms in "When to Use" section/.` It passes after the heading-specific mandate is removed.
- The first CLI launch failed: `failed to initialize in-process app-server client: Operation not permitted (os error 1)`. The failed launch remains at `create-skill/.../minimal-workflow`; the successful retry has a distinct label.
- The initial task `no-write-boundary` run withheld the chat contract while asking for an unspecified alert-toggle route. The valid `chat-contract` assertion failed. The confirmed behavior now suffices to bound the slice without inventing a route.
- The task `explicit-skip-file-retry` run wrote a plan despite the unchanged prohibition. The no-write, chat-contract, and deferred-offer assertions failed. Exact phrase anchors and prohibition-first ordering corrected this failure.
- Some actors attempted Git inspection in scratch fixtures without Git metadata. Those exploratory commands failed; actual file effects are established from snapshots and traces.

No failed actor output, valid request, or valid assertion was replaced to manufacture a pass. Earlier successes on superseded subjects are excluded from the current verdict.

## Reproduce

Replay the saved evidence without model calls:

```sh
node evals/check-review-probes.mjs
node skills/create-skill/evals/check-workflow-contract.mjs
node skills/create-skill/evals/check-lean-authoring-contract.mjs
```

Run a new actor with a unique label; existing evidence is never overwritten:

```sh
node evals/run-review-probe.mjs create-skill minimal-workflow new-minimal
node evals/run-review-probe.mjs create-skill missing-boundary new-missing-boundary
node evals/run-review-probe.mjs create-spec regression-terse-option-picks new-options
node evals/run-review-probe.mjs create-spec regression-explicit-pace-complaint new-pace
node evals/run-review-probe.mjs create-tasks regression-chat-only-pressure new-skip-file
node evals/run-review-probe.mjs create-tasks regression-no-write-boundary new-no-write
node evals/run-review-probe.mjs create-tasks regression-chat-preference new-preference
```

Score every assertion from the frozen case against the raw output and actual workspace effects. Preserve failed runs. Update current entries in `review-results.json` only after all required cases on the new subject are scored; retain superseded entries in history. A missing or failing current assertion prevents a passing replay.
