---
name: verify-work
description: >
  Use when an artifact must survive hostile input before shipping.
  the user asks to "verify this", "is this ready to ship", "test this
  properly", or "find the loopholes". Also when a shipped artifact
  failed on an input nobody tried, or when verification so far is a
  happy-path smoke test.
license: MIT
metadata:
  category: Quality
  summary: Attacks a finished artifact with executed adversarial fixtures until two rounds find nothing new.
---

# Verify Work

## Overview

Prove an artifact by running adversarial cases against it, not by reading it alone. Report every failure with a reproducer. Verification is read-only by default; patch and re-run only when the user explicitly authorizes fixes. A smoke test or code inspection alone does not count as verification.

## When to Use

- An artifact exists: script, agent skill, prompt, config, schema, rule document: and the question is whether it holds
- "verify this", "is this ready to ship", "test this properly", "poke holes in the implementation"
- A shipped artifact failed on an input nobody tried; silent corruption or silent failure is suspected
- Verification so far is one happy-path run, or a careful reading

## Do Not Use When

- The plan isn't built yet: stress-testing a *design* is an interview, not an attack: run `create-spec` if installed, otherwise question the plan before verifying its output
- Code review for style, structure, or maintainability: use a code-review skill; verify only chases behavior that breaks the artifact's promise
- Statistical pass-rate benchmarking across many runs: use an eval harness
- Penetration testing of live systems: different discipline, requires authorization
- Writing tests for new code as it's built: that is TDD (use a TDD skill); verify-work attacks *finished* artifacts. "Test this properly" about unwritten code means tests, not verification

## Workflow

Load `references/attacks.md` at step 2, before choosing any attack: it holds the per-artifact-type catalogs and the stop rule.

1. **Fix the letter.** Write the artifact's promise: its spec, rules, or contract: as 5 or fewer bullet points. Every attack targets the gap between this letter and actual behavior; an artifact with a vague promise cannot be verified, so pin the promise first (via `create-spec` or one direct question). Done when the promise list is written down.

2. **Attack.** Select the catalog matching the artifact type and execute every attack in it: run scripts against fixture files, run a fresh agent against rule documents, feed configs their boundary values. Producing the failing run is the deliverable of this step: "this would probably break" is not a finding. Done when every attack in the catalog has an executed result recorded.

3. **Honor the authority boundary.** A request to verify, review, assess readiness, or find loopholes authorizes attacks and a findings report, not artifact edits. Record each failure with its executed reproducer and continue attacking the unchanged artifact. Only when the original request explicitly includes fixing: or the user separately authorizes it: patch each finding in the artifact, never the fixture, then re-run every failed attack. Never quietly narrow the promise to dodge a finding; a promise change requires confirmation. Done when every finding is recorded and, when fixes were authorized, every failed attack passes on re-run.

4. **Repeat with fresh eyes.** Start each round with attacks not executed in prior rounds, carrying a do-not-re-report list of prior findings. Use a fresh subagent per round when the harness has them; otherwise enter through a different applicable attack class. Re-running the same finite catalog unchanged never counts as a fresh dry round. A round counts as dry only after it adds at least one new applicable attack and produces zero new findings. Stop at 2 consecutive dry rounds for anything shipping; when the user names it a quick check or throwaway, 1 dry round suffices: state which bar applied. When no meaningful new attack remains, report catalog exhaustion separately from a dry-round claim. When stopping early for budget or time, say so and name every untested attack class. A silent early stop is a failed verification.

5. **Report.** In 10 lines or fewer, state the authority mode, findings, any authorized patches, rounds run, and residual risk by name. Deliver the report without process narration.

## Example: one attack on one promise

> **Promise:** "every CSV data row appears as one JSON object with all header keys present."
> **Mode:** fix-authorized: the original request explicitly asked to fix findings.
> **Attack (delimiter-in-data):** write `a,"x, y",c` to a fixture; run the converter.
> **Result:** ` y"` lost, no error: finding.
> **Patch:** replace hand-split with the stdlib CSV parser; re-run fixture: passes.
> **Round note:** finding added to do-not-re-report; dry counter reset to 0.

## Common Rationalizations

These are common reasons teams stop at a smoke test instead of verifying hostile cases.

| Excuse | Reality |
|--------|---------|
| "Tests are green, so it's effectively verified" | The happy-path fixture proves the happy path. The catalog exists because data is hostile. |
| "The user needs it in minutes: a smoke test will do" | The baseline's smoke test missed silent data loss. Deadlines raise the cost of shipping it broken, not the case for skipping the attack. |
| "I can see from the code it handles that case" | Reading is not running. The baseline read its parser as correct; execution found three bugs. |
| "One clean round is enough" | Round two of this repo's own history kept finding what round one missed. Two dry rounds for anything shipping. |

## Stop Conditions

- "It's basically done, just ship it"
- "The code obviously handles that"
- "One fixture already passed"

Each maps to a table entry above; return to the workflow step in progress.

## Success Criteria

- Every finding came from an executed attack, never from reading
- The report states whether the run was read-only or fix-authorized; zero artifact edits occurred without explicit fix authority
- When fixes were authorized, every patch landed in the artifact and zero fixtures were edited toward buggy output
- 2 consecutive fresh dry rounds (1 when the user called it a quick check; the bar applied is stated): or an explicit stop naming catalog exhaustion or each untested class

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Reading the code and declaring it safe | Execute; runs catch what reads miss |
| One happy-path fixture as "tested" | Run the full catalog; the happy path proves nothing |
| Editing a fixture until output matches | Preserve the fixture; report the finding, or patch the artifact only when fixes were authorized |
| Re-arguing old findings each round | Do-not-re-report list; only new findings reset the dry counter |
| Stopping after the first clean round | Dry means 2 consecutive rounds, not 1 |

## Failure Modes

- **The artifact cannot be executed** (no runtime, pure prose contract): degrade honestly: construct each attack input anyway, trace it by hand, and label every such result REASONED, never proven.
- **Findings still flowing after ~8 rounds:** the design is the problem, not the details. Stop patching and recommend redesign, with the findings as evidence.
- **The promise keeps moving:** each patch renegotiates what the artifact "really" meant. Freeze the promise from step 1 in writing before continuing; renegotiation is a decision for the user.

## Additional Resources

- **`references/attacks.md`**: per-artifact-type attack catalogs and the dry-round stop rule. Load at step 2, before choosing any attack.

## Summary

Execute hostile cases rather than relying on inspection. Report by default, patch only with explicit authority, and stop after two fresh dry rounds or a clearly documented exhaustion or early stop.
