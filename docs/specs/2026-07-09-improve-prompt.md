---
topic: A prompt-improver skill that sharpens a rough ask and pipes it to the right skill or task
status: confirmed
started: 2026-07-09
---

# Spec: improve-prompt

## Decisions

1. **Job** — Take a rough prompt where "what I write and what I mean don't match," produce a sharpened prompt that recovers the intent, and hand it to the actual work (a toolbox skill when one matches, the plain task otherwise). _Why:_ user request, verbatim. (2026-07-09)
2. **The core discipline** — Recovering intent must never become inventing it: everything the improver adds that the user didn't say is marked `[assumed: …]` inline in the improved prompt, so misreads are visible before they propagate. _Why:_ the benchmark's fig-leaf finding, applied at the prompt layer. (2026-07-09)
3. **Handoff** — Show-then-go: display the improved prompt + target, then proceed immediately; the user interrupts to correct. _Why:_ zero happy-path friction for a daily-use tool; user-confirmed via the option UI. (2026-07-09)
4. **Name & category** — `improve-prompt`, category Authoring. Model-invoked ("improve this prompt", "help me phrase this", "rewrite this ask") and natural as an explicit `/improve-prompt` prefix. (2026-07-09)
5. **Method** — skill-creator workflow: baseline probe before drafting, adversarial dry-run after. (2026-07-09)

## Assumptions

- ASSUMED: routing targets are named softly (toolbox skills if installed, else the improved prompt just runs as the task) per ADR-0001.
- ASSUMED: two registers exist — prompts destined for an agent (structure, deliverable, constraints) vs text destined for humans (tone, brevity); the skill must distinguish them.

## Deferred

- A history file of before/after prompt pairs (could feed future personalization); revisit after real use.

## Confirmation

"I want a skill that I can use to improve the prompt and pipe it to the actuall skill i'm trying to use" — 2026-07-09
