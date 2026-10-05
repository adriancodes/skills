## Current revision — 2026-10-04

The [confirmed quality-pilot brief](../../../docs/specs/2026-10-04-skill-quality-pilot.md) supersedes the affected fields below. Current cases and preserved runs are in [the pilot suite](../../../evals/pocock-comparison-2026-10-04/cases.json). The prior brief remains historical context; it does not define a current-subject verdict.

# Skill Brief — create-tasks

Authored from the shipped subject (`skills/create-tasks/SKILL.md`) on 2026-08-01.
No dedicated Q&A session ran for this brief; every inference beyond the SKILL.md
text is marked ASSUMED. Source of truth for eval scope.

## Job

Turn a confirmed spec into a repo work plan of small vertical tasks — each
crossing every layer its demo needs, demoable by a human, sized to one fresh
agent session, and naming its blockers — written to a parseable
`docs/specs/<date>-<slug>-slices.md` file and confirmed by the user, never
delivered only in chat.

- **Users:** Engineers (and pipeline skills such as `ship-feature` /
  `implement-slice`) who need a confirmed spec broken into executable work.
- **Type:** Workflow (five-step procedure with per-step done conditions).
- **Invocation:** Model-invoked — the description carries trigger phrases and
  `disable-model-invocation` is absent. ASSUMED from frontmatter.
- **Downstream contract:** the `*-slices.md` file is parsed by other skills:
  frontmatter (`spec`, `status: open | confirmed`), per-slice `Layers`,
  `Bound`, `Demo`, `Blocked by` fields, `[ ]`/`[x]` ticks with
  `Done: <date>: <outcome>` lines, and `## Verification` / `## Confirmation`
  sections.

## Tier

**Tier 2 — targeted comparative.** Failure produces a bad local plan file —
reversible engineering-workflow waste (horizontal slicing, overflowing
sessions, chat-only plans), with no external mutation, automation, or
irreversible change.

## Baseline comparator (strongest realistic prompt)

> "Break this spec into vertical slices with demo criteria and blockers.
> Size each slice to one agent session and write the plan to a file."

ASSUMED: this is the strongest short prompt a practiced user would actually
type; it names verticality, demos, blockers, sizing, and the file, so any
skill margin must come from enforcement (recuts, bounds, the parseable
contract, the confirmation gate), not from vocabulary the prompt lacks.

## Success measures

Traced to the subject's three slice tests (workflow step 2) and its file
contract (step 4):

1. **Vertical** — zero horizontal slices: no standalone schema, API-only,
   UI-only, wiring, or tests-at-the-end slice; a one-layer slice appears only
   when the work genuinely has one layer.
2. **Demoable** — every slice carries a runnable demo criterion (a request
   returns, a screen shows, or a test-proved state change); never "the model
   exists".
3. **Bounded (sized)** — every slice writes an explicit bound (files,
   surfaces, or cases included); nothing unbounded like "every call site".
4. **Edges** — every slice names `Blocked by:` (with `none` written, not
   implied); at least one slice is unblocked; no edge exists just because
   numbering implies it.
5. **File contract** — `docs/specs/<date>-<slug>-slices.md` exists in exactly
   the parseable shape above, written before the read-back.
6. **Confirmation gate** — a numbered read-back asks for confirmation;
   `status` flips to `confirmed` only with the user's recorded words and date.

## Eval contract (Tier 2)

- **Value pair:** 1 held-out prompt/skill case (`heldout-saved-searches`) on
  the `fixtures/confirmed-spec` decision log, scored on the six measures
  above.
- **Regressions (skill-only):** edge — a user-supplied layer-by-layer task
  list must be recut vertically, not transcribed; pressure — "just list the
  tasks in chat, skip the file" must still produce the slices file.
- **Trigger probes:** 3 positive and 2 adjacent-negative cases (unconfirmed
  plan routes to `create-spec`; tracker tickets defer to a tracker skill).
  Kept with the skill but normally run in the shared portfolio routing suite;
  run per skill only after a name/description change or a known collision
  (nearest neighbours: `create-spec` upstream, `implement-slice` downstream).
- **Sessions:** 4 actor sessions by default (held-out × 2 arms + 2
  skill-only regressions).
- ASSUMED: existing-skill recipe applies (no fresh no-instruction/prompt
  discovery pair), since the subject already ships in the toolbox; add the
  discovery pair first if a reviewer treats this as a new skill.
- Cases are authored and unexecuted; they count as evidence only after a
  bounded run is separately authorized, with cases, subject hash, route,
  costs, and raw results preserved under `results/`.
