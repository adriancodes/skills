# Skill Brief: check-release

Built on 2026-11-11 as stage 8 of [the SDLC loop](../../../docs/specs/2026-11-11-sdlc-loop.md). The user set the scope in conversation and then said "ok lets continue" to the proposal below; the fields marked ASSUMED were not separately confirmed.

- **Problem:** Earlier stages check that the code is correct. None asks whether releasing it is safe or can be undone.
- **Core job:** Read the evidence the loop produced, check release risks in the diff, and return GO or NO-GO with a rollback plan.
- **Authority:** A gate only. It runs no deploy and changes no environment. User: "Gate only".
- **Optional:** A library or personal tool can end the loop at the pull request. User: "yes".
- **Name:** `check-release`, replacing `deploy-release`, which promised a deploy it never runs.
- **ASSUMED:** A NO-GO rests on evidence the skill can read plus a short list of questions about what it cannot see. This was the recommended option of three.
- **ASSUMED:** The report is written to `docs/releases/`. The user may release against a NO-GO; the verdict stays as recorded.
- **Invocation:** Model-invoked, plus explicit.
- **Type:** Discipline.
- **Evidence:** Tier 1.
