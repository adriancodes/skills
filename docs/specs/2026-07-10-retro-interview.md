---
topic: Retroactive scope interview for build-loop, tldr, and improve-prompt — 15 questions the founding session never asked
status: confirmed
started: 2026-07-10
---

# Spec: retro interview

Three subagent reviewers reconstructed the Phase-1 interviews these skills never got; all 15 questions were then answered by the user through the option UI. Supersedes the corresponding ASSUMED decisions in the three original spec logs.

## Decisions (user-answered)

1. **tldr register** — match the asker: plain words for plain questions, engineering vocabulary untranslated for technical ones.
2. **tldr mode** — ALWAYS-ON default (diverged from recommendation): brevity is standing behavior; "go long" lifts it per reply, "normal mode" per session. Implemented as work-discipline rule 5 + the skill's Persistence section inverted to opt-out.
3. **improve-prompt routing** — user-named target wins ("/improve-prompt for spec-plan: …"); inference is the fallback; multiple plausible matches are shown, never silently picked.
4. **build-loop deliverable** — portable core plus a wired runner adapter; guards ship as mechanisms; handover ends with the command that starts run one.
5. **tldr × caveman** — siblings; caveman only when named; ambiguous brevity phrases belong to tldr. (Fixes the "be brief" trigger collision found in review.)
6. **tldr scope** — extended to connective prose: commits, PR bodies, reports, summaries.
7. **tldr cap** — 4 sentences, as shipped.
8. **improve-prompt marks** — piped as a labeled `Assumed:` block above a clean prompt, never inline in the payload.
9. **improve-prompt human register** — kept.
10. **improve-prompt cap semantics** — the one clarifying question resets the assumption budget.
11. **improve-prompt history** — corrections only, appended to `docs/prompt-corrections.md`.
12. **build-loop domain** — generalized beyond repos: domain-neutral anti-gaming framing, non-code pattern rows.
13. **build-loop born-L1** — absolute, as shipped.
14. **build-loop repair** — audit branch added (misbehavior → missing guard → retrofit → demote to L1); the description's repair trigger now has a payload.
15. **build-loop verifier** — deterministic-check carve-out allowed when the goal is machine-checkable and the loop provably can't touch the checker.

## Confirmation

All 15 answers given via the option UI, 2026-07-10.
