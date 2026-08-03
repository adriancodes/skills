# Skill Brief — create-spec

Reconstructed from `SKILL.md`, `references/artifacts.md`, and the toolbox
`CONTEXT.md` on 2026-08-01. Not confirmed through a Phase-0 interview;
every inference is marked `ASSUMED`.

## Job

Turn a plan into a confirmed spec by running a spec session: a relentless
one-question-at-a-time interview (or a zero-question capture of an earlier
conversation) that records every resolved decision incrementally in the
session's decision log (`docs/specs/<yyyy-mm-dd>-<slug>.md`), and treats
nothing as confirmed until the user approves the final read-back.

## Shape

- **Type**: Workflow (full template, session documents, exit gate).
- **Invocation**: Model-invoked — the description carries trigger phrases
  ("spec this out", "poke holes in this plan", "write this up as a spec")
  and no `disable-model-invocation` flag is set. `ASSUMED`.
- **Users**: Engineers with a vague or assumption-laden plan, or a design
  conversation whose decisions nobody wrote down. `ASSUMED`.

## Declared tier

**Tier 2 — targeted comparative.** Failure writes reversible local
Markdown files (decision log, glossary, ADR) and wastes recoverable
engineering time on wrong or unconfirmed decisions; no external mutation,
automation, or irreversible change is possible before the gate.

## Strongest-realistic-prompt baseline

The prompt arm uses the strongest short prompt a diligent user would
realistically type, so the skill must beat more than a strawman:

> "Interview me about this plan one question at a time — never batch.
> Give each question a recommended answer with a reason. Record every
> decision in `docs/specs/<date>-<slug>.md` as it is decided, not at the
> end. Don't assume product decisions — ask me. When everything is
> resolved, read back all decisions as a numbered list and get my
> explicit confirmation before writing any code."

## Success measures

Each traces to a gate in `SKILL.md`:

1. **One question per turn** (workflow step 4; Tool Guidance "never
   batch"): every question asked singly, recommendation first, a one-line
   why per option.
2. **ASSUMED cap** (step 4, terse-answer rule): absent explicit
   delegation, at most 2 branches close as ASSUMED; a third candidate is
   asked instead.
3. **Delegation boundary** (step 4; Genuine Exceptions): blanket
   delegation ("whatever you think") closes only reversible implementation
   defaults; product-shaping branches (caps, deletion semantics, security
   policy, retention, public contracts) stay Deferred and block
   confirmation until the user decides them.
4. **Read-back exit gate** (step 5): every decision read back as a
   numbered list with ASSUMED and Deferred stated explicitly; verbatim
   user confirmation recorded in the log; `status: confirmed` set only
   then; no non-document file touched before it.
5. **Incremental decision log** (steps 1–2, artifacts.md "append on
   resolution"): the log exists from session open, branches are mapped as
   checkboxes, and each decision is appended when it resolves — never
   reconstructed at session end.
6. **Resume discipline** (step 1): an open log on the same topic is
   resumed, inherited ticks are provisional, and any inherited decision
   the current repo state contradicts is reopened.

## Eval contract (Tier 2)

- **Value pair** (held-out, `prompt` vs `skill` arms): one vague plan
  specced end-to-end with a scripted user; scored against measures 1–5.
- **Regression cases** (skill-only): edge — resuming an open decision log
  whose inherited ticked decision the current repo state contradicts
  (must reopen it, treating inherited ticks as provisional); pressure —
  blanket delegation mid-session with product-shaping branches still open
  (must keep them Deferred and block confirmation).
- **Trigger cases**: 3 positive, 2 adjacent-negative (per Do Not Use
  When); kept with the skill but normally run in the shared portfolio
  routing suite, per the Tier-2 recipe.
- **Sessions**: 4 actor sessions by default (2 for the value pair, 2
  regressions). New-skill discovery pair not yet run. `ASSUMED`:
  scripted-user persona is acceptable for the interactive turns; no
  synthetic model sessions run until a bounded run is authorized.
