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

Prove an artifact by running adversarial cases; smoke tests and code inspection alone do not count. Report every failure with a reproducer. Verification is read-only by default; patch and re-run only when the user explicitly authorizes fixes.

## When to Use

- A finished script, agent skill, prompt, config, schema, or rule document needs proof it holds
- "verify this", "is this ready to ship", "test this properly", "poke holes in the implementation"
- A shipped artifact failed on an input nobody tried; silent corruption or failure is suspected
- Verification so far is one happy-path run, or a careful reading

## Do Not Use When

- The plan isn't built yet: stress-testing a *design* is an interview, not an attack: run `create-spec` if installed, otherwise question the plan first
- Review for style, structure, or maintainability: use a code-review skill; verify-work only chases behavior that breaks the promise
- Statistical pass-rate benchmarking across many runs: use an eval harness
- Penetration testing of live systems: different discipline, requires authorization
- Writing tests for code as it's built: that is TDD (use a TDD skill); verify-work attacks *finished* artifacts. "Test this properly" about unwritten code means tests, not verification

## Workflow

Load `references/attacks.md` at step 2, before choosing any attack: it holds the per-artifact-type catalogs and the stop rule.

1. **Fix the letter.** Write the artifact's promise: its spec, rules, or contract: as 5 or fewer bullets. Every attack targets the gap between this letter and actual behavior; a vague promise cannot be verified, so pin it first via `create-spec` or one direct question. Done when the promise list is written.

2. **Attack.** Select the catalog for the artifact type and execute every attack in it: run scripts against fixtures, run a fresh agent against rule documents, feed configs boundary values. The failing run is the deliverable: "this would probably break" is not a finding. Done when every catalog attack has a recorded executed result.

3. **Honor the authority boundary.** A request to verify, review, assess readiness, or find loopholes authorizes attacks and a findings report, not artifact edits. Record each failure with its executed reproducer and keep attacking the unchanged artifact. Only when the request explicitly includes fixing: or the user separately authorizes it: patch each finding in the artifact, never the fixture, then re-run every failed attack. Never quietly narrow the promise to dodge a finding; promise changes require confirmation. Done when every finding is recorded and, if fixes were authorized, every failed attack passes on re-run.

4. **Repeat with fresh eyes.** Start each round with attacks not yet executed, carrying a do-not-re-report list of prior findings. Use a fresh subagent per round when available; otherwise enter through a different applicable attack class. A round is dry only if it adds at least one new applicable attack and finds nothing new; re-running the same catalog unchanged never qualifies. Stop at 2 consecutive dry rounds for anything shipping; 1 suffices when the user names it a quick check or throwaway: state which bar applied. When no meaningful new attack remains, report catalog exhaustion separately from a dry-round claim. When stopping early for budget or time, say so and name every untested attack class. A silent early stop is a failed verification.

5. **Report.** In 10 lines or fewer and without process narration, state the authority mode, findings, any authorized patches, rounds run, and residual risk by name.

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
- 2 consecutive fresh dry rounds (1 when the user called it a quick check; the bar applied is stated): or an explicit stop naming catalog exhaustion or each untested class

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Reading the code and declaring it safe | Execute; runs catch what reads miss |
| One happy-path fixture as "tested" | Run the full catalog; the happy path proves nothing |
| Editing a fixture until output matches | Preserve the fixture; report the finding, patching the artifact only when fixes were authorized |
| Re-arguing old findings each round | Do-not-re-report list; only new findings reset the dry counter |
| Stopping after the first clean round | Dry means 2 consecutive rounds, not 1 |

## Failure Modes

- **The artifact cannot be executed** (no runtime, pure prose contract): degrade honestly: construct each attack input anyway, trace it by hand, and label every such result REASONED, never proven.
- **Findings still flowing after ~8 rounds:** the design is the problem, not the details. Stop patching and recommend redesign, with the findings as evidence.
- **The promise keeps moving:** each patch renegotiates what the artifact "really" meant. Freeze the written promise from step 1 before continuing; renegotiation is the user's decision.

## Additional Resources

- **`references/attacks.md`**: per-artifact-type attack catalogs and the dry-round stop rule (loaded at step 2).

## Summary

Execute hostile cases instead of relying on inspection. Report by default, patch only with explicit authority, and stop after two fresh dry rounds or a documented exhaustion or early stop.
