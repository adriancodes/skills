---
name: explore-options
description: Fan out isolated parallel perspectives on an open-ended decision, then converge on a fit-checked, skimmable shortlist. User-invoked.
disable-model-invocation: true
license: MIT
metadata:
  category: Design
  summary: Fans out isolated parallel frames, converges fit-first with a constraint-checked winner, and renders a 15-line shortlist that expands on demand.
---

# Explore Options

## Overview

The first three answers to any open-ended question are the answers every senior engineer gives in thirty seconds: correct, and forgettable. Escape them by fanning out isolated parallel branches under distinct cognitive frames, then converging with a critic that ranks by fit — never by cleverness. Isolation is the mechanism: branches that see each other anchor each other, and the fan-out collapses into one wide thought.

Render the result as a shortlist a skimmer absorbs in one glance. Hold everything else back until asked.

## When to Use

- Explicit invocation only: `/explore-options <problem>`. Never self-invoke.
- Fits: architecture choices, API surfaces, naming, product mechanics — any "what are my options" moment where the obvious answer being wrong is expensive.

## Do Not Use When

- One canonical answer exists: give it directly; a fan-out decorates the inevitable.
- A bug needs a root cause: `diagnose` (if installed) owns hypothesis generation with a reproduction loop.
- The deliverable is a module interface: `design-an-interface` (if installed) produces full competing designs; this skill produces idea-level options.
- Requirements are still unpinned: pin them first (`create-spec` if installed, otherwise one direct question) — diverging on an unconfirmed problem explores the wrong space.

## Required Context

- The problem statement and its stated constraints: scale, latency, budget, compatibility — whatever bounds a viable answer.
- When no constraint is stated, ask exactly one question for the binding constraints and success criteria before spawning anything: an unconstrained pool cannot be converged honestly.
- A harness with parallel subagent dispatch (see Failure Modes when absent).

## Workflow

1. **Pick 5 frames.** From the table below: 4 whose tags match the problem's shape, plus exactly 1 tagged `wild`. Vary the picks on repeat runs of the same problem. Done when 5 frames are chosen and at least one is wild.

2. **Diverge: parallel and isolated.** Spawn 5 subagent calls in a single message, one frame each. Each branch receives only the problem, the stated constraints, its frame's vantage prompt, and the generator instruction below — nothing else. Never serialize the calls, never pass one branch's output to another, and never simulate branches inside the orchestrator's own context: a simulated fan-out is one wide thought in a costume. Done when all 5 branches return.

   Generator instruction, verbatim per branch:

   > DIVERGENT mode: generator, not critic. Produce 6 distinct ideas under this frame, one sentence each plus a one-clause rationale. The first three answers any senior engineer would give are banned — push past them. No evaluation, no ranking, no hedging. Return a JSON array only: `[{"idea": "...", "why": "..."}]`

3. **Converge: fit first.** In the orchestrator, no extra agent call:
   - Cluster the pool by underlying angle, never by surface keyword.
   - Rank by fit to the stated problem and viability; novelty breaks ties only.
   - Flag every attractive-but-broken idea as a trap with a one-line reason.
   - Run the constraint check: restate the stated constraints and verify the top pick violates none. A pick that fails is demoted — it never ships as the winner, however clever.
   - Fill the ★ wild slot with the strongest novel-but-viable idea. The wild slot never outranks a constraint-passing pick.

   Done when 3 ranked picks pass the constraint check and the wild slot is filled or declared empty.

4. **Render the shortlist: 15 lines or fewer.** With no preamble or narration, emit exactly, in order:
   - 1 line: the problem and its binding constraint.
   - 3 lines: ranked picks — name, mechanism, why it fits, one line each.
   - 1 line: ★ wild pick, marked as such.
   - Up to 4 lines: traps, one line each with the reason.
   - 1 line: `More: "map" for all clusters · "deepen <pick>" for a build sketch.`

   No headers, no score chips, no prose between entries. Done when the reply is 15 lines or fewer and every line carries a decision-relevant fact.

5. **Expand on demand only.**
   - `map`: render every cluster — one header line per cluster angle, one line per idea. No commentary.
   - `deepen <pick>`: one subagent call producing a 4–8 sentence build sketch, the load-bearing risk, the first concrete step, and 3 child ideas. Render verbatim.

   Done when the requested layer is rendered and nothing beyond it.

## Frames

Pick 5 per run: 4 matching the problem's tags + 1 wild.

| Frame | Vantage prompt | Tags |
|---|---|---|
| **inversion** | Ask the opposite question: if the goal is X, how would X be guaranteed to fail? Negate each answer back into an idea. | code, design |
| **adversary** | Attack the obvious solution — exploit it, break it, abuse the legal-but-unintended path. Invert each attack into a design idea. | code, design |
| **transplant** | Pick one distant domain — immune systems, markets, logistics, game design — and force-fit its core mechanism onto this problem literally. | wild |
| **extremes** | Design both ends: the $0, one-hour crudest thing that still does the load-bearing job, and the infinite-budget decade version. The range exposes the middle. | code, general |
| **remove the assumption** | Name the one thing every answer treats as fixed — the framework, the database, request-response itself. Delete it. What becomes possible? | code, design, wild |
| **operator at 3am** | Design so the on-call engineer never gets paged and the auditor can prove what happened. Observability, reversibility, provability first. | code, design |
| **beginner** | A curious 10-year-old who has never seen software: naive, convention-free approaches. Ignore how it is usually done. | general, wild |
| **hardware** | Think in latency budgets, memory layout, physical constraints. Re-ask this as a hardware or systems problem: what do the bus, cache, and clock say? | code |

## Success Criteria

- The shortlist is 15 lines or fewer and every line carries a decision-relevant fact
- All 3 ranked picks pass the constraint check against the stated constraints
- The ★ wild slot holds a viable out-of-playbook idea or is declared empty — it never outranks a constraint-passing pick
- Branches ran as parallel, isolated subagent calls; nothing was simulated in the orchestrator's context
- `map` and `deepen` layers were rendered only when requested

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Simulating branches sequentially in one context | Spawn real parallel subagents; isolation is the mechanism |
| Clever pick wins over fitting pick | Fit and viability rank; novelty breaks ties; the constraint check gates the winner |
| Rendering the full pool unprompted | 15-line shortlist; `map` and `deepen` are opt-in layers |
| Ten variations of one idea presented as breadth | Cluster by underlying angle; one cluster means the divergence failed — respawn the weakest 2 frames |
| "Here are 30 ideas, you decide" | Converge with a real ranking; refusing to commit is a cop-out |

## Failure Modes

- **No parallel subagent support in the harness:** say so, then offer the fallback — a single-context strong prompt (10 diverse approaches, obvious ones banned, clustered, traps flagged) — labeled as anchored, not isolated. Never silently simulate isolation.
- **All branches converge on one angle anyway:** the problem is narrower than it looked; report that finding with the direct answer instead of padding the pool.
- **No constraints obtainable:** stop after one question; rank by viability alone and say the constraint check was skipped.

## Provenance

Adapted from ADHD (github.com/UditAkhourii/adhd, MIT): the isolation invariant and generator/critic split are retained; the ranking policy (fit-first with a constraint-checked winner and quarantined wild slot), the layered 15-line output contract, and the deduped frame table are redesigned. Cost: ~6 agent calls per run, +1 per `deepen`.

## Summary

Fan out 5 isolated frames in parallel, converge fit-first with a constraint-checked winner and one quarantined ★ wild pick, and render 15 lines or fewer. Everything deeper waits to be asked for.
