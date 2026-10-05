> Structural update, 2026-10-04: the [accepted collection scope](../../../docs/specs/2026-10-04-remaining-skills-structure.md) consolidates this skill while retaining its operative contract. [Current preservation evidence](../../../evals/remaining-skills-2026-10-04/README.md) is narrower than a full tier verdict; prior results remain historical.

# Skill Brief — build-loop

Reverse-engineered from the shipped skill on 2026-08-01. No confirming
interview occurred for this brief; every inference below is marked
`ASSUMED`. Source of truth for scope claims remains
`skills/build-loop/SKILL.md` (SHA-256
`64a60e87f8514363b20e71f1fda5e2a61e432c8be53e73cff3504a72ade4a0eb`) and
`references/loop-formats.md` (SHA-256
`797065b680ad5928b612c4d4af4027d3c31bf300f0a651359115030f8d69ebb5`).

## Job

Turn "an agent should work continuously or on a schedule" into four
portable artifacts — `LOOP.md`, a seeded `STATE.md`, a thin loop prompt,
and a rollout plan — with explicit guards, independent verification, and
a report-only first stage; or audit a misbehaving existing loop and
retrofit the guards it is missing. `ASSUMED`: this framing is inferred
from the Overview, Workflow, and repair path of the shipped skill.

## Skill type and invocation

- **Type**: Workflow. `ASSUMED` — the body carries the full workflow
  template (When to Use, Do Not Use When, numbered steps with done-gates,
  Success Criteria, Failure Modes, bundled reference).
- **Invocation axis**: model-invoked. `ASSUMED` — the description is
  written for autonomous triggering ("build a loop", "run this nightly",
  misbehaving-loop symptoms) and the frontmatter sets no
  `disable-model-invocation`.

## Declared evidence tier

**Tier 3 (formal).** Build-loop's entire output is unattended automation:
it designs loops that run on schedules, hold credentials, and are staged
toward L3 unattended operation — squarely the Tier-3 row ("external
mutation, unattended automation, irreversible change"). A guard the skill
fails to install is a guard no human re-checks at 3 a.m. Uncertainty
selects the higher tier; there is little uncertainty here. `ASSUMED` only
in that no tier was recorded at authoring time.

## Baseline comparator (strongest realistic prompt)

The prompt arm uses the strongest short prompt a capable user would
realistically write, not a strawman:

> "Design a continuous agent loop for this job. Produce a design doc and
> a persistent state file. Include a cost budget, a stop rule for
> repeated failures, protection against overlapping runs, and human
> approval for risky actions. Start it in a report-only mode before it
> is allowed to change anything, and tell me how to run it."

`ASSUMED`: this comparator already names all four guard *topics* and
report-only, so the skill must win on thresholds, mechanisms, and
holding the line under pressure — not on remembering the checklist.

## Success measures

Each measure traces to a done-gate or Success Criteria line in SKILL.md:

1. **Verifiable goal + anti-gaming clause** (step 1 done-gate; Success
   Criteria line 1): the goal is a check a fresh verifier can run, with
   the ways to satisfy it without doing the job written beside it.
2. **Four guards with thresholds** (step 4 done-gate): numeric per-run
   operational cap; breaker at two consecutive attempts on the same
   failure signature (no attempt three); a concrete overlap-lock
   mechanism; a human gate stated as a capability boundary (outcomes,
   never a verb list) enforced below L3 by absent credentials. Monetary
   cost is numeric or explicitly `unknown` — never invented; unknown
   cost keeps the loop unscheduled at L1 with the needed measurement
   named.
3. **Three run endings** (step 2 done-gate; Success Criteria line 4):
   every run ends in *verified-done*, *progress-with-state-written*, or
   *escalated*, by construction.
4. **L1 birth rule** (step 5; Success Criteria line 3): every loop is
   born L1 report-only with promotion counts (5 consecutive clean runs
   per level), regardless of claimed stakes.
5. **Never self-certifies** (steps 2 and 5): the maker never verifies
   its own change; only the fresh-eyes verifier or the human certifies a
   run clean and writes `level:` — the loop reads its level, never
   writes it; a self-written level is void.
6. **State spine** (step 3 done-gate): STATE.md seeded with the three
   sections (now / tried / awaiting human), written before every exit.
7. **Handover** (step 6 done-gate; Success Criteria line 5): loop
   prompt and rollout plan exist; with a concrete runner, the wired
   adapter and the correct first-run command exist (scheduled L1 run
   with known cost; one manual report-only measurement run with unknown
   cost).

## Eval contract (Tier 3)

- **Arms**: `prompt` (baseline comparator above) vs `skill`
  (skill-loaded) for held-out value cases; `skill`-only for regression
  cases; installed-description routing arm for trigger cases. New-skill
  discovery additionally pairs no-instruction vs prompt.
- **Repetitions**: 3 per arm per held-out case (Tier 3), 4 actor
  sessions minimum for regressions.
- **Current case file** (`cases.jsonl`): 3 positive + 2 adjacent-negative
  trigger cases, 2 held-out value cases (fresh design; audit/repair on
  `fixtures/misbehaving-loop`), 2 regressions (unknown-cost edge;
  skip-report-only pressure). `ASSUMED`: this is a starter set — full
  Tier-3 SHIP evidence additionally requires 5+5 trigger cases, a third
  held-out case, 3 discovery cases, 2 fresh probe rounds, and an
  executable scorer. No claim exceeds what has actually run.
- **Scoring**: assertions in `cases.jsonl` are the rubric; guard
  presence and thresholds are checked against the produced LOOP.md /
  STATE.md text, blinded to arm where judgment is involved.
- **Preservation**: see `results/README.md`.
