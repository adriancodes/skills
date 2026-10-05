Apply the supplied skill to this local preservation probe. The project is /var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/remaining-skills-probe-rA9xzX. You may inspect and edit only that project, according to the user's narrower authority below. Supplied skill resources under /Users/adrian/dev/skills/evals/remaining-skills-2026-10-04/results/verify-work-regression-catalog-exhaustion/subject are authorized read-only inputs: read them only when the skill requires them. Other skills, subagents, network services, and dependency installation are unavailable. Do not inspect parent repositories or other evaluation outputs. Do not invent user answers. Stop at a real decision gate. Do not create a Git commit.

Supplied skill:
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

Prove an artifact with executed adversarial cases. Smoke tests and inspection do not count. Report every failure with a reproducer. Stay read-only unless the user authorizes fixes.

## Scope

Use to attack a finished artifact against its stated behavioral promise.

Do not use when:

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

## Pressure

Read [references/pressure.md](references/pressure.md) when urgency, authority, sunk cost, or an uncertain shortcut threatens the workflow. Those pressures do not waive its evidence or authority requirements.

## Failure Modes

- **The artifact cannot execute:** construct each attack input anyway. Trace it manually. Label every result REASONED, never proven.
- **Findings still flowing after ~8 rounds:** the design is the problem, not the details. Stop patching and recommend redesign, with the findings as evidence.
- **The promise keeps moving:** each patch renegotiates what the artifact "really" meant. Freeze the written promise from step 1 before continuing; renegotiation is the user's decision.

## Additional Resources

- **`references/attacks.md`**: per-artifact-type attack catalogs and the dry-round stop rule (loaded at step 2).

## Verification

Findings have executed reproducers. Record the authority mode, fresh-round bar, and every untested class or catalog limit; never infer completion from repeated old attacks.


Scenario:
The fixture files are at the workspace root: dedupe.js, promise.md, input.csv. Interpret the case's fixtures/csv-dedupe/dedupe.js as this supplied dedupe.js. No new workspace files may be created; use in-memory or inline probes.

User request:
Verify one thing only about fixtures/csv-dedupe/dedupe.js: that quoted fields containing commas survive dedupe byte-for-byte, per promise.md. Empty-file handling, row counts, and everything else are explicitly out of scope. Report findings only — do not modify any files.