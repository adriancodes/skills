# Confirmed Skill Brief: tdd

Confirmed through adaptive Q&A with the user on 2026-07-18.

- **Problem:** Agents implement first, then add tests that pass immediately and provide false confidence.
- **Users:** Engineers building features, fixing known bugs, and changing data behavior.
- **Core rule:** No new production implementation before a test has failed for the expected behavioral reason.
- **Recovery:** When the agent writes its own implementation first, revert only that new work, observe red, then reimplement. Preserve pre-existing and user-authored work.
- **Triggers:** Implementing behavior, fixing a bug with a known cause, changing an API/workflow/outcome, and altering stored, transformed, migrated, serialized, or externally transmitted data.
- **Exemptions:** Documentation, generated files, purely mechanical changes, and explicitly throwaway prototypes.
- **Test selection:** Use the narrowest stable public seam that proves behavior; use integration or end-to-end only when smaller tests cannot represent the boundary.
- **Data paths:** Mocks alone are insufficient. Exercise the closest real persistence, serialization, migration, retry, or adapter boundary.
- **Valid red:** The test fails because requested behavior is absent, never because setup, syntax, fixtures, or dependencies are broken.
- **Legacy code:** Characterize current behavior, make the smallest behavior-preserving seam, then write the red behavior test. Stop rather than write a meaningless shallow test.
- **Green/refactor:** Write the smallest passing implementation and refactor only while tests remain green.
- **Anti-cheating:** Never weaken assertions or redefine expected behavior to manufacture green.
- **Completion:** Show red, green, affected-suite, and any full-suite omission evidence.
- **Collisions:** `diagnose` discovers unknown causes; `implement-task` is the outer planned-work workflow; `verify-work` attacks the finished result.
- **Invocation:** Model-invoked.
- **Type:** Discipline.
- **Evidence:** Tier 2 is the eventual target.
- **ASSUMED and accepted:** Use the existing framework; do not install another without authorization; create no separate report; run no costly synthetic model evaluation in this pass; locally validate a candidate and improve it from real usage.
