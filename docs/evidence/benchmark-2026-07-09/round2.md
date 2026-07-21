# Ground-truth benchmark, round 2 — all remaining skills

Same design as round 1: 3 arms (none / strongest realistic one-line prompt / skill force-loaded) × k=3 runs, actor Opus 4.8, fresh isolated directory per run. Five scenarios covering the five previously unbenchmarked working skills: `slice-spec`, `implement-slice`, `ship-feature`, `build-loop`, `improve-prompt` — 45 scored runs (plus 9 harness launch failures, all retried; one cell needed five attempts). Excluded with reasons: `work-discipline` (already A/B'd in the port evidence), `create-skill` (no mechanical ground truth for a generated skill; scoring would be judge-model vibes).

## Results (counts; mechanical checks on files where possible)

| Measure | none | plain | skill |
|---------|------|-------|-------|
| **slice-spec** — vertical slices (not layer lists) | 0/3 | 3/3 | 3/3 |
| **slice-spec** — explicit `Blocked by:` edges per slice | 0/3 | 0/3 | **3/3** |
| **slice-spec** — parseable convention file (`status:`, ticks, `-slices.md`) | 0/3 | 0/3 | **3/3** |
| **implement-slice** — working code, tests pass, bound held | 3/3 | 3/3 | 3/3 |
| **implement-slice** — red test before implementation | 0/3 | 3/3 | 3/3 |
| **implement-slice** — slices file ticked | 2/3 | 3/3 | **3/3 (+ outcome note + hostile-input pass)** |
| **ship-feature** — exactly one slice taken; both artifacts read | 3/3 | 3/3 | 3/3 |
| **ship-feature** — `## Verification` left for the conductor (not prematurely filled) | 0/3 | 0/3 | **3/3** |
| **build-loop** — PR-only / never-merge safety design | 3/3 | 3/3 | 3/3 |
| **build-loop** — LOOP.md + STATE.md spine + certified promotion ladder | 0/3 | 0/3 | **3/3** |
| **improve-prompt** — no fabricated implementation on empty context | 3/3 | 3/3 | 3/3 |
| **improve-prompt** — inline `[assumed]` marks traveling with the prompt | 0/3 | 2/3 (labeled lists) | **3/3** |

## The two findings that matter most — both about us, not the model

**1. Strong one-liners recover single behaviors.** "Never layer-by-layer, write it to a file" produced vertical slices 3/3. "Test first and watch it fail" produced red-first 3/3. The skills' durable, unrecovered margin is the *bundle* — every discipline at once — plus the artifact conventions no one-liner produces: edges, status fields, tick formats, state spines, promotion ledgers. Those conventions are what let a second session (or teammate) resume the first one's work, and they went 0-for-18 without the skills across every scenario that tested them.

**2. Self-report probes overstate baseline failure.** build-loop's original baseline probe asked the model to *describe* its default loop design; it confessed a cron + auto-merge + no-guards disaster. This round's behavioral runs — same request, actually build it — produced PR-only designs with anti-cheat scanners (several self-tested) in 6/6 non-skill runs. Lesson adopted into CONTRIBUTING: baseline probes must elicit behavior, not self-description; rationalization tables built on self-report carry an evidentiary caveat. build-loop's table preamble has been corrected accordingly. The skill's verified margin on this scenario is the operational apparatus (state spine, breaker semantics, budget-before-cadence, certified promotion), not the core safety instinct — the model has that natively.

## Notable single events

- A `ship-feature` skill run, hitting the fixtures' no-runtime limitation, used the skill's escape hatch verbatim — labeling its stub a SUBSTITUTION in the outcome note instead of silently claiming tests passed.
- All six non-skill `ship-feature` runs — including the plain arm told to "read the docs fully" — filled the whole-feature `## Verification` section with slice-level notes, corrupting the conductor's terminal-state signal. This validates round 1's undefined-formats finding from the architecture review.
- Harness launch flakiness (9 dead-on-arrival runs returning prompt fragments) is an operational note for anyone reproducing this: score only runs with real tool activity, retry the rest.

## Caveats, same as round 1

k=3, one model (Opus 4.8), skills force-loaded (trigger rate untested), scenarios authored by the skills' author. Counts, not percentages. All artifacts preserved under `bench2/` in the build session; scoring greps are in the session log.
