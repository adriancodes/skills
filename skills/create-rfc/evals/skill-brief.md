# Confirmed Skill Brief: create-rfc

Confirmed by the user on 2026-11-11 ("confirmed"), as part of [the SDLC loop](../../../docs/specs/2026-11-11-sdlc-loop.md).

- **Problem:** When there are several reasonable ways to build something, the agent quietly picks one and the choice is never examined or recorded.
- **Core job:** Write a short RFC that states the problem, lays out the real options with their trade-offs, recommends one, and lists what is still unknown.
- **When it runs:** Only when the approach is undecided. Small or obvious features go straight to `create-spec`.
- **Input:** The confirmed read-back from `gather-requirements` when there is one; otherwise the conversation.
- **Output:** `docs/rfcs/<date>-<slug>.md` with status draft, approved, or rejected.
- **Triggers:** "write an RFC", "which approach should we take", "compare the options for"; a build request where two or more approaches would lead to different systems.
- **Non-triggers:** Unclear requirements (`gather-requirements`); a chosen approach (`create-spec`); a wide brainstorm (`explore-options`); one factual question (`research-question`).
- **Invocation:** Model-invoked, plus explicit.
- **Type:** Workflow.
- **Success:** The user can choose an approach from the RFC alone, and `create-spec` can start from the approved RFC without reopening the choice.
- **Evidence:** Tier 1.
- **Accepted assumptions:** The user picks the approach. Two to four options with no strawmen, including the simplest and "do nothing" when real. Every option is judged on the same criteria, taken from the user's requirements. Repository claims are checked and cited. The RFC is short.
