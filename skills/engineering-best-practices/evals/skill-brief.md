> Structural update, 2026-10-04: the [accepted collection scope](../../../docs/specs/2026-10-04-remaining-skills-structure.md) consolidates this skill while retaining its operative contract. [Current preservation evidence](../../../evals/remaining-skills-2026-10-04/README.md) is narrower than a full tier verdict; prior results remain historical.

# Skill Brief — engineering-best-practices

Authored 2026-08-01 from the shipped subject at
`skills/engineering-best-practices/SKILL.md` (v0.1.0). No confirming user
interview ran for this eval package; every scoping judgment below that the
SKILL.md does not state outright is marked `ASSUMED`.

## Job

Apply established engineering practices to real design, implementation,
review, and refactoring work without loading a book corpus into context:
detect one working state (Establish / Apply / Align), resolve the direction
from binding requirements, charter, and coherent local patterns, then
retrieve a small packet of closely applicable practices through the bounded
local script and keep only the ones that change a concrete decision.

## Confirmed by the subject

- **Type:** Discipline — the body is dominated by rationalization tables,
  stop conditions, closed loopholes, and gates. `ASSUMED` (the frontmatter
  does not name a type).
- **Invocation:** Model-invoked; the description carries trigger phrases and
  there is no `disable-model-invocation`. `ASSUMED` from frontmatter.
- **Retrieval:** One call to `scripts/retrieve-guidance.mjs` for ordinary
  work; a second only for a genuinely distinct phase. `--max` between 2 and
  6; two to five practices retained; added context under roughly 1,000
  tokens.
- **Query shape:** The retrieval task names five fields explicitly —
  invariant, concurrency/distribution scope, atomicity/consistency
  mechanism, state owner, failure/recovery — with `not applicable` allowed
  only after inspection.
- **Distributed invariant gate:** Cross-process invariants are never
  enforced by process-local coordination; the durable owner exposes atomic
  claim/complete/release transitions, and verification races independent
  instances sharing only the durable dependency.
- **Failure mode:** When retrieval returns nothing useful, refine once, then
  proceed from project evidence; never force an irrelevant practice.
- **Do Not Use When:** prose-only work, trivial mechanical edits, tiny
  standalone scripts, generated files, lockfiles; specialized skills govern
  first with this skill applied inside them only for retrieval and
  alignment.

## Tier

**Tier 2 — targeted comparative.** Failures produce reversible engineering
mistakes in local files (a racy design, a bloated context, an unwanted
architecture program) that cost time but are recoverable; the skill performs
no external mutation or unattended automation. `ASSUMED`: the distributed
invariant gate protects against bugs that would be expensive *in
production*, but the eval consequence tier is judged on what a failed
session damages, which is local and reversible — matching the tier chosen
for `tdd` and `code-review`.

## Baseline comparator (strongest realistic prompt)

> "Follow engineering best practices. Before designing, state the invariant
> that must hold, whether it spans processes or machines, what atomic
> mechanism enforces it, which component owns the coordinated state, and
> what happens on crash or retry. Use atomic database operations instead of
> in-memory locks for cross-process coordination, plan recovery for
> abandoned work, and keep the advice minimal and concrete — decisions and
> code, not a lecture."

This is what a strong engineer would realistically type without the skill
installed; it names the same concerns but has no state model, no bounded
retrieval, no budget, and no gates.

## Success measures (traced to the subject's gates)

1. **One state workflow** — the session loads exactly one of
   `references/{establish,apply,align}.md`, the one matching the evidence
   (Workflow step 1; closed loophole "never load all three").
2. **Five query fields named** — the retrieval `--task` string names
   invariant, concurrency/distribution scope, atomicity/consistency
   mechanism, state owner, and failure/recovery, each grounded in the
   fixture rather than boilerplate (Workflow step 3).
3. **Retained practices change decisions** — two to five practices kept from
   one retrieval call, each traceable to a concrete decision,
   implementation detail, test, or review check in the output; weak matches
   discarded; added context within roughly 1,000 tokens (Workflow step 3
   completion criterion).
4. **Distributed invariant gate honored** — for cross-instance invariants,
   enforcement lands in the durable owner as an atomic transition (no
   check-then-act, no in-memory `Set`/mutex), with a reclaim path for
   abandoned work and a cross-instance adversarial verification plan
   (Distributed invariant gate).
5. **No lecture** — output is code and decisions with source attribution
   where durable; no book summaries, catalog browsing, or generic
   best-practice essays (Working discipline; closed loophole on generic
   checklists).

## Eval contract (Tier 2)

- **Arms:** `prompt` (baseline comparator above) vs `skill` (subject
  loaded). Skill-only for regressions and trigger probes.
- **Value pair:** one held-out case on `fixtures/worker-claim` — a
  concurrency-shaped feature request exercising the distributed invariant
  gate — scored on the five measures above; 4 actor sessions by default
  (2 per arm).
- **Regressions (skill-only):** edge — retrieval returns no useful match
  twice, the session must proceed from project evidence without forcing a
  practice; pressure — the user demands "apply all the best practices you
  know", the session must stay within one retrieval call, 2–5 retained
  practices, and the token budget.
- **Trigger probes:** 3 positive, 2 adjacent-negative, kept with the skill
  but normally run in the shared portfolio routing suite; run per skill
  only after a name/description change or a known collision (Tier-2 rule).
- **Scoring:** assertions in `cases.jsonl`; all `critical: true` assertions
  must pass for a case to pass.
- **`ASSUMED` and unexecuted:** no synthetic model sessions ran in this
  pass, per the toolbox's standing cost constraint; the cases are authored
  and unfrozen, and nothing here is a Tier-2 SHIP claim until a bounded run
  is separately authorized. One local invocation of
  `retrieve-guidance.mjs` confirmed the value case's query shape returns
  applicable practices (idempotency/replay, restart safety, distribution
  boundaries).
