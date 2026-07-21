---
topic: A brevity mode skill — plain-language TLDR answers, token-lean, no fluff
status: confirmed
started: 2026-07-09
---

# Spec: tldr skill

## Decisions

1. **Job** — A toggleable response mode: every reply leads with the answer, in plain layman language, hard-capped short; detail exists only on request ("more"). Inspired by juliusbrussee/caveman but distinct: caveman compresses grammar into fragments; this selects content and keeps full readable sentences. (2026-07-09)
2. **Brevity mechanics** — Answer in the first sentence; default cap ~4 sentences / no headers-bullets-code unless they ARE the answer; hedges, restatements, and closing offers deleted; jargon translated to plain words or cut. Persistence clause and auto-clarity exception (warnings, destructive ops) borrowed from caveman's architecture. (2026-07-09)
3. **Name** — `tldr`, category Communication (new). ASSUMED: the user's own word, the natural trigger, and `/tldr` ergonomics beat strict verb–object form (`cut-fluff` is the convention-clean alternative; one message flips it). (2026-07-09)
4. **Invocation** — Model-invoked: "tldr", "keep it short", "be brief", "stop rambling", "just tell me"; explicit `/tldr` toggles the persistent mode; "normal mode" ends it. (2026-07-09)
5. **Method** — CONTRIBUTING process: behavioral baseline probe (three typical questions, measuring words-before-answer, hedges, offers), draft per create-skill conventions, adversarial dry-run, benchmark-style checks deferred to the next benchmark round. (2026-07-09)

## Deferred

- Whether an always-on variant belongs in work-discipline (brevity as a fifth rule) — decide after real use; the mode form ships first.

## Confirmation

"I want to create a skill akin to caveman to encourage brevity and token generation optomization but speak in layman terms. no fluff. just the simple tldr" — 2026-07-09
