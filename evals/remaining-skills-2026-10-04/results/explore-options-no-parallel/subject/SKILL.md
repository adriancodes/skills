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

Obvious answers arrive first. Escape them with isolated parallel branches under distinct frames. Then converge by fit, never cleverness. Branches that see each other anchor, so keep them isolated.

Render the result as a shortlist a skimmer absorbs in one glance. Hold everything else back until asked.

## When to Use

- Explicit invocation only: `/explore-options <problem>`. Never self-invoke.
- Fits architecture, API, naming, and product decisions where an obvious answer may be costly.

## Do Not Use When

- One canonical answer exists: give it directly; a fan-out decorates the inevitable.
- A bug needs a root cause: `diagnose` (if installed) owns hypothesis generation with a reproduction loop.
- The deliverable is a module interface: `design-an-interface` (if installed) produces full competing designs; this skill produces idea-level options.
- Requirements are unpinned: use `create-spec` when installed. Otherwise ask one direct question first.

## Required Context

- The problem statement and its stated constraints: scale, latency, budget, compatibility — whatever bounds a viable answer.
- When constraints are absent, ask exactly one question for constraints and success. Do not fan out first.
- A harness with parallel subagent dispatch (see Failure Modes when absent).

## Workflow

1. **Pick 5 frames.** Read [references/frames.md](references/frames.md) when selecting branch perspectives. Choose 4 matching tags and exactly 1 `wild` tag. Vary repeat runs.

   Done when 5 frames are chosen, including one wild frame.

2. **Diverge in parallel.** Spawn 5 isolated subagents in one message. Give each only the problem, constraints, frame prompt, and generator instruction. Never serialize them. Never share branch output. Never simulate branches in the orchestrator.

   Done when all 5 branches return.

   Generator instruction, verbatim per branch:

   > DIVERGENT mode: generator, not critic. Produce 6 distinct ideas under this frame, one sentence each plus a one-clause rationale. The first three answers any senior engineer would give are banned — push past them. No evaluation, no ranking, no hedging. Return a JSON array only: `[{"idea": "...", "why": "..."}]`

3. **Converge: fit first.** In the orchestrator, no extra agent call:
   - Cluster the pool by underlying angle, never by surface keyword.
   - Rank by fit to the stated problem and viability; novelty breaks ties only.
   - Flag every attractive-but-broken idea as a trap with a one-line reason.
   - Run the constraint check: restate the stated constraints and verify the top pick violates none. A pick that fails is demoted — it never ships as the winner, however clever.
   - Fill the ★ wild slot with the strongest novel-but-viable idea. The wild slot never outranks a constraint-passing pick.

   If clustering yields only one underlying angle, respawn the weakest two frames; surface variations do not establish breadth.

   Done when 3 ranked picks pass and the wild slot is filled or declared empty.

4. **Render the shortlist: 15 lines or fewer.** With no preamble or narration, emit exactly, in order:
   - 1 line: the problem and its binding constraint.
   - 3 lines: ranked picks — name, mechanism, why it fits, one line each.
   - 1 line: ★ wild pick, marked as such.
   - Up to 4 lines: traps, one line each with the reason.
   - 1 line: `More: "map" for all clusters · "deepen <pick>" for a build sketch.`

   No headers, no score chips, no prose between entries. Done when the reply is 15 lines or fewer and every line carries a decision-relevant fact.

5. **Expand on demand only.**
   - `map`: render every cluster — one header line per cluster angle, one line per idea. No commentary.
   - `deepen <pick>`: call one subagent. Return a 4–8 sentence sketch, key risk, first step, and 3 child ideas.

   Done when the requested layer is rendered and nothing beyond it.

## Failure Modes

- **No parallel subagents:** say so. Offer one strong prompt for 10 clustered approaches with traps. Label it anchored, not isolated.
- **All branches converge:** report that the problem is narrower than expected. Give the direct answer without padding.
- **No constraints obtainable:** stop after one question; rank by viability alone and say the constraint check was skipped.

## Provenance

Adapted from ADHD (github.com/UditAkhourii/adhd, MIT). It retains isolation and the generator/critic split. This version adds fit-first ranking, a gated wild slot, and layered output. Cost: about 6 calls, plus 1 per `deepen`.

## Verification

Verify real isolated dispatch, constraint-passing ranked picks, a viable or empty wild slot, and the requested output layer. Label any unavailable-parallel fallback honestly.
