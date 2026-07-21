# Historical benchmark summary, round 2

**Status: directional and not reproducible.** The raw `bench2/` runs and scoring commands referenced by the original report are not preserved in this repository. The tables and observations below are retained as historical claims, not verified effectiveness evidence. The tested revisions are unidentified, and skill arms were force-loaded rather than triggered normally.

The original report described 3 arms × k=3 runs across five scenarios, for 45 scored runs on Opus 4.8, plus retried harness failures.

## Reported results

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

## Reported observations

**1. Strong one-liners reportedly recovered individual behaviors.** The summary attributed the remaining difference to bundled discipline and artifact conventions. The missing runs and scorer prevent verification.

**2. Behavioral runs reportedly contradicted an earlier self-report probe.** This motivated the repository rule that baselines must observe behavior rather than ask a model to describe it. No current effectiveness claim follows from the unpreserved comparison.

## Notable single events

- A `ship-feature` skill run, hitting the fixtures' no-runtime limitation, used the skill's escape hatch verbatim — labeling its stub a SUBSTITUTION in the outcome note instead of silently claiming tests passed.
- The report states that all six non-skill `ship-feature` runs filled the whole-feature `## Verification` section with slice-level notes. The underlying runs are not preserved here.
- Harness launch flakiness (9 dead-on-arrival runs returning prompt fragments) is an operational note for anyone reproducing this: score only runs with real tool activity, retry the rest.

## Caveats, same as round 1

k=3, one reported model, force-loaded skills, author-created scenarios, no triggering measurement, and no preserved `bench2/` run set or executable scorer. Treat every result above as directional history only.
