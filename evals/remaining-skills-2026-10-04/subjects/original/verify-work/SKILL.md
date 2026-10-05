---
name: verify-work
description: >
  Use when an artifact must survive hostile input before shipping:
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

Prove an artifact with executed adversarial cases. Smoke tests and inspection do not count. Report every failure with a reproducer. Stay read-only unless the user authorizes fixes.

## When to Use

- A finished script, agent skill, prompt, config, schema, or rule document needs proof it holds
- "verify this", "is this ready to ship", "test this properly", "poke holes in the implementation"
- A shipped artifact failed on an input nobody tried; silent corruption or failure is suspected
- Verification so far is one happy-path run, or a careful reading

## Do Not Use When

- The plan is unbuilt: use `create-spec` when installed. Otherwise question the plan first.
- Review for style, structure, or maintainability: use a code-review skill; verify-work only chases behavior that breaks the promise
- Statistical pass-rate benchmarking across many runs: use an eval harness
- Penetration testing of live systems: different discipline, requires authorization
- Writing tests for code as it's built: that is TDD (use a TDD skill); verify-work attacks *finished* artifacts. "Test this properly" about unwritten code means tests, not verification

## Workflow

Load `references/attacks.md` before choosing attacks.

1. **Fix the letter.** Write the promise in 5 or fewer bullets. Target every attack at the gap between promise and behavior. Pin a vague promise with `create-spec` or one direct question.

   Done when the promise list is written.

2. **Attack.** Select the matching artifact catalog. Execute every applicable attack. Run scripts against fixtures. Run fresh agents against rule documents. Feed boundary values to configs. Reject speculative findings.

   Done when every catalog attack has a recorded result.

3. **Honor authority.** Verification authorizes attacks and a report, not edits. Record each failure with an executed reproducer. Keep attacking the unchanged artifact.

   Patch only after explicit fix authority. Patch the artifact, never the fixture. Re-run every failed attack. Never narrow the promise without confirmation.

   Done when findings are recorded and authorized fixes pass re-run.

4. **Repeat with fresh eyes.** Start each round with unexecuted attacks. Carry a do-not-re-report list. Use a fresh subagent when available. Otherwise switch attack classes.

   Count a dry round only when it adds a new applicable attack and finds nothing. Unchanged reruns never count. Require 2 consecutive dry rounds for shipping. Allow 1 for a named quick check. State the applied bar.

   Report catalog exhaustion separately. If budget or time stops the run, name every untested attack class. Never stop silently.

5. **Report.** Stay within 10 lines. Name authority mode, findings, authorized patches, rounds, and residual risk. Omit process narration.

   Done when every decision-relevant result appears.

## Example: one attack on one promise

> **Promise:** "every CSV data row appears as one JSON object with all header keys present."
> **Mode:** fix-authorized: the request explicitly asked to fix findings.
> **Attack (delimiter-in-data):** write `a,"x, y",c` to a fixture; run the converter.
> **Result:** ` y"` lost, no error: finding.
> **Patch:** replace hand-split with the stdlib CSV parser; re-run fixture: passes.
> **Round note:** finding added to do-not-re-report; dry counter reset to 0.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Tests are green, so it's effectively verified" | The happy-path fixture proves the happy path. The catalog exists because data is hostile. |
| "The user needs it in minutes: a smoke test will do" | The baseline's smoke test missed silent data loss. Deadlines raise the cost of shipping broken, not the case for skipping the attack. |
| "I can see from the code it handles that case" | Reading is not running. The baseline read its parser as correct; execution found three bugs. |
| "One clean round is enough" | In this repo's own history, round two kept finding what round one missed. Two dry rounds for anything shipping. |

## Stop Conditions

- "It's basically done, just ship it"
- "The code obviously handles that"
- "One fixture already passed"

Each maps to a table entry above; return to the workflow step in progress.

## Success Criteria

- Every finding came from an executed attack, never from reading
- The report states read-only or fix-authorized; no artifact edits occurred without explicit fix authority
- When fixes were authorized, every patch landed in the artifact and no fixture was edited toward buggy output
- 2 consecutive fresh dry rounds for shipping.
- 1 dry round for a named quick check.
- Otherwise name catalog exhaustion or every untested class.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Reading the code and declaring it safe | Execute; runs catch what reads miss |
| One happy-path fixture as "tested" | Run the full catalog; the happy path proves nothing |
| Editing a fixture until output matches | Preserve the fixture; report the finding, patching the artifact only when fixes were authorized |
| Re-arguing old findings each round | Do-not-re-report list; only new findings reset the dry counter |
| Stopping after the first clean round | Dry means 2 consecutive rounds, not 1 |

## Failure Modes

- **The artifact cannot execute:** construct each attack input anyway. Trace it manually. Label every result REASONED, never proven.
- **Findings still flowing after ~8 rounds:** the design is the problem, not the details. Stop patching and recommend redesign, with the findings as evidence.
- **The promise keeps moving:** each patch renegotiates what the artifact "really" meant. Freeze the written promise from step 1 before continuing; renegotiation is the user's decision.

## Additional Resources

- **`references/attacks.md`**: per-artifact-type attack catalogs and the dry-round stop rule (loaded at step 2).

## Summary

Execute hostile cases. Report by default. Patch only with authority. Stop at the required dry bar or a documented limit.
