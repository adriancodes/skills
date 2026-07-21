# Confirmed Skill Brief: diagnose

Confirmed by the user on 2026-07-17.

- **Problem:** Agents often jump from a symptom to a plausible fix without proving the root cause.
- **Users:** Engineers investigating functional bugs, flaky failures, and performance regressions.
- **Core job:** Build a tight, red-capable diagnosis loop: reproduce the exact symptom, minimize it, rank three to five falsifiable hypotheses, test one variable at a time, and report the evidence-backed cause.
- **Authority:** Diagnosis is read-only by default. Instrumentation, regression tests, and fixes require explicit authorization. When a fix is authorized, add a regression test before the fix, rerun the original reproduction after it, and remove temporary instrumentation.
- **Triggers:** Requests such as “diagnose this bug,” “debug this failure,” “why is this throwing?”, “this test is flaky,” and “performance regressed.”
- **Non-triggers:** General code explanation, branch review, verification of a finished artifact, and implementation of an already-known fix.
- **Collisions:** `understand-codebase` explains current behavior; `code-review` reviews a diff; `verify-work` attacks a finished artifact; implementation and TDD build a known change. `diagnose` is for discovering an unknown cause.
- **Success:** A named command reproduces the exact symptom; the reproduction is minimized; credible alternatives are falsified; the root cause is cited; no unauthorized edits occur; and an authorized fix demonstrates red-to-green behavior and cleanup.
- **Evidence:** Tier 2 targeted comparative support on Codex: one discovery pair, one prompt-versus-skill value pair, and two skill-only regressions, with no repetitions or budget extension by default.
- **Cost:** Prefer no more than 50% runtime premium over the strongest prompt.
- **Assumptions accepted:** No human-in-the-loop script unless evidence proves it necessary. Do not create a persistent diagnosis report by default.

Development direction updated by the user on 2026-07-18: prioritize the highest-quality practical skill over further token-heavy comparative runs. Preserve the opportunity evidence, perform local validation, and make no Tier-2 effectiveness claim until skill-loaded held-out evidence exists.
