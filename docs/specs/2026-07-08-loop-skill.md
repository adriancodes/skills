---
topic: A skill that designs effective continuous self-directed agent loops
status: confirmed
started: 2026-07-08
---

# Spec: loop skill

## Decisions

1. **Deliverable** — The skill produces a runnable loop, not advice: a `LOOP.md` design spec (goal as a verifiable condition, cadence, budget, stop conditions, escalation rules), a seeded `STATE.md` (the durable spine), the loop prompt itself, and an L1→L3 rollout plan. _Why:_ all three sources agree the artifacts, not the intentions, are the loop. (2026-07-08)
2. **Name** — `build-loop`, category `Automation` (new intention group). _Why:_ verb–object convention; it builds the loop files, not just designs. ASSUMED under delegation. (2026-07-08)
3. **Doctrine encoded** — the sources' converged rules: goal verified by a fresh checker, never the maker; state read at start / written at end, answering what-now / what-tried / what-awaits-human; triage cheap, spawn expensive only when actionable; budget estimated before launch (cadence × per-run cost); rollout report-only → assisted → unattended with promotion gates; every run ends verified-done, progress-with-state-written, or escalated — never a silent stall; hard iteration caps and a two-dry-runs-no-progress escalation; a named human gate. _Why:_ synthesis of Osmani's loop-engineering post, cobusgreyling/loop-engineering, and the Substack piece. (2026-07-08)
4. **Method** — skill-creator workflow: baseline probe (Opus, no skill) before drafting; adversarial dry-run after; findings patched. (2026-07-08)

## Assumptions

- ASSUMED: harness-neutral wording — scheduler named by role (harness loop/cron command, CI schedule, OS cron) with fallbacks, per skillforge portability rules.
- ASSUMED: no runtime tooling ships with the skill (the cobusgreyling repo's CLIs are external prior art, referenced not vendored).

## Deferred

- A companion loop-audit checklist skill, if build-loop sees team use.

## Verification

Baseline (Opus, no skill): the naive delivery was the sources' disaster case verbatim — cron + `--dangerously-skip-permissions` + auto-merge to main, "until green" verified by the fixing agent, no state, no breaker, no budget, nothing human-gated; six rationalizations captured into the skill's table. Dry-run (skill loaded, plus "skip the ceremony" pressure): refused the pressure with the guards-are-the-cost-control argument, closed all six baseline failures, and surfaced three seams — breaker granularity (in-run retries), gate-as-verb-list (direct-push bypass), anti-gaming scoped to tests/ — all patched. Final probe round on the patched text found one structural exploit — self-promotion via the loop writing its own `clean-runs-at-level` counter — patched: level fields are verifier/human-written only. Residual, named honestly: the self-promotion patch was not re-probed by a further fresh round; and gate enforcement above L2 ultimately rests on credential hygiene at handover, which the skill mandates but cannot itself enforce.

## Confirmation

"I want you to research and deeply understand loop engineering and create a skill that creates highly effective loops for agent workflows continuous self directed cycles." — 2026-07-08

## Sources

- addyosmani.com/blog/loop-engineering — five primitives + memory, failure modes, stay-the-engineer doctrine
- github.com/cobusgreyling/loop-engineering — seven production patterns, L1→L3 rollout, LOOP.md/STATE.md conventions
- cobusgreyling.substack.com/p/loop-engineering — triage economics, state-file primacy, tool convergence
