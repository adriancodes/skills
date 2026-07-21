---
topic: Which Fable-specific behaviors are worth enforcing in Opus 4.8, and at what cost
status: confirmed
started: 2026-07-06
---

# Distillation: Fable behavior port

## Branches

- [x] Valued behaviors — which concrete Fable behaviors, anchored to real moments
- [x] Probe tasks — which transcripts/tasks become the Opus baseline test set (ASSUMED)
- [x] Delivery mechanism — skill vs CLAUDE.md/output-style vs combination (always-on behavior may not fit a triggered skill)
- [x] Scope — one artifact or several (communication voice vs work discipline may split)
- [x] Context budget — how many always-loaded tokens the port is allowed to cost
- [x] Invocation — if a skill: model-invoked triggers vs always-on vs user-invoked
- [x] Success measure — how "Opus works more like Fable" gets verified (ASSUMED)
- [x] Name — toolbox voice, no collisions
- [x] Home — does it ship in the toolbox repo alongside distill

## Decisions

1. **Valued behaviors** — All four clusters: adversarial self-verification, decision hygiene, communication shape, autonomy calibration. _Why:_ each is observably distinct from Opus defaults in this session's record. No specific moments named yet — probe tasks branch must source them. (2026-07-06)
2. **Delivery mechanism** — Layered: a small always-on layer (communication shape + autonomy calibration) plus model-invoked skills for the heavyweight processes. _Why:_ always-on and task-triggered behaviors have opposite loading needs; one mechanism starves half the port. (2026-07-06)
3. **Decision hygiene via soft reference** — The port does not re-implement the interview: it invokes `distill` when installed, else a compressed inline fallback (~5 lines). Survived the probe: port-only installs accept the fallback's shallower interview. _Why:_ ADR-0001's pattern; avoids two competing interviews on double-install. (2026-07-06)
4. **Context budget** — Always-on layer capped at ~200 words, every rule no-op-tested against real Opus baseline output. _Why:_ always-on prose dilutes its own compliance as it grows; losers move into the triggered skills. (2026-07-06)
5. **Scope** — Two artifacts: the always-on layer (communication shape + autonomy calibration) and one adversarial-verification skill; decision hygiene rides the soft reference to `distill` per #3. _Why:_ follows directly from #2 and #3. (2026-07-06)
6. **Invocation & home** — The skill piece is model-invoked with tight triggers; both artifacts ship in the toolbox repo. _Why:_ applies the toolbox's confirmed standing decisions (toolbox log #9, #4), not a new choice. (2026-07-06)
7. **Names** — Verification skill: `harden`; always-on layer: `fable`. _Why:_ "we'll go with your recommendations" — harden names the probe-patch loop; fable names the behavior's provenance. (2026-07-06)
8. **Port contents (empirical)** — The always-on layer carries only the four baseline-failed behaviors: question batching, stated-as-confirmed, decisions-never-written, smoke-test-instead-of-attack. All other proposed rules passed Opus baseline and are omitted per the no-op test. _Why:_ six Opus 4.8 probes on record; unwritten rules preserve compliance for written ones. (2026-07-06)
9. **Names** — Verification skill `verify`, layer `discipline`. Supersedes #7. _Why:_ toolbox naming-convention change (toolbox log #14); user confirmed "ok" to spec/verify/discipline. (2026-07-08)
10. **Names, final** — `verify-work` and `work-discipline`. Supersedes #9 per toolbox log #15 (two-word verb–object convention, user-picked). (2026-07-08)

## Assumptions

- ASSUMED: generation follows skillforge's workflow with Opus 4.8 subagents as the baseline-probe target (confirmed in conversation, 2026-07-06).
- ASSUMED (1/2): probe set sourced from this session's on-record moments plus 1–2 synthetic tasks per cluster — asked, user AFK; recommended option taken.
- ASSUMED (2/2): success measure is a blind A/B — Opus-with-port vs Opus-without on the probe tasks, judged by Adrian against a rubric derived from the four clusters.

## Deferred

## Confirmation

"ok" — in response to the full 8-point read-back, 2026-07-06.
