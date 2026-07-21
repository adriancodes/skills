---
name: create-spec
description: >
  Use when requirements need pinning down before anything is built.
  the user asks to "spec this out", "stress-test my design", "poke
  holes in this plan", or says "write this up as a spec" after a
  design discussion. Also when a plan is vague, rests on unstated
  assumptions, or decisions keep getting relitigated from scrollback.
license: MIT
metadata:
  category: Planning
  summary: Turns a plan into a confirmed spec through a one-question-at-a-time interview or direct capture of decisions already made.
---

# Create Spec

## Overview

Turn a plan into a confirmed spec by asking one useful question at a time and recording each resolved decision. Maintain a decision log for every session, update the glossary when terms become clear, and create ADRs only for durable architectural choices. A stated decision is not confirmed until the user approves the final read-back.

## When to Use

- A plan exists but its requirements are unstated: "spec this plan", "pin down the requirements", "stress-test this", "poke holes in it"
- A design conversation already holds the answers and needs writing down: "write this up as a spec", "capture what we decided" (capture mode: step 3)
- Requirements are vague, assumption-laden, or keep being relitigated from chat scrollback
- A design conversation is producing decisions that nobody is writing down
- A previous spec session was interrupted: a log in `docs/specs/` still has `status: open`

## Do Not Use When

- The user asks a quick factual question or wants a one-shot opinion: answer directly
- The request only needs clearer wording, not decisions: use `improve-prompt` when installed; do not turn copy-editing into a spec session
- The change is small and reversible: a plan that fits in one message needs a sentence of consent, not a session
- The thing to poke holes in is a *built artifact*, not a plan: that is `verify-work`'s job (executed attacks, not questions)
- Implementation is already underway and the user wants execution, not design review
- The user explicitly invokes a different interview skill by name (e.g. `/grilling` or `/grill-with-docs` from another installed collection): follow that skill instead
- The deliverable is itself an agent skill: a skill-authoring skill such as `create-skill` is the better tool, but deferring to one mid-session happens only through step 1's proposed-switch question; absent one (or the user's say-so), proceed, treating the skill spec as the plan

## Required Context

- The plan under spec session, restated in one sentence and accepted by the user
- A scan of the target repo: `CONTEXT.md` or `CONTEXT-MAP.md`, `docs/adr/`, and `docs/specs/`: existing documents are read before the first question, resumed and extended rather than duplicated

## Workflow

Load `references/artifacts.md` at session open, before creating the decision log: it holds the formats and rules for all three session documents.

1. **Open.** Announce the skill by name: if another installed skill looks like the better match, propose the switch as a single question and switch only on the user's explicit say-so; until that answer lands, every rule here remains in force. Restate the topic in one sentence naming the problem, never a solution: any design choice riding in the restatement or the original plan is a branch for step 2, not a given. Scan for existing session documents; if an open decision log matches the topic, resume it: and resuming reopens the map: rerun step 2 against the current request and repo state, and reopen any inherited decision the current state contradicts. Inherited ticks are provisional until they survive that check. Otherwise create `docs/specs/<yyyy-mm-dd>-<slug>.md` with `status: open`. Done when the log exists and names the topic.

2. **Map branches.** List every design branch the plan raises: purpose, structure, naming, edge cases, whatever the topic demands: as checkboxes in the log's Branches section. A branch is one decidable question: when resolving it would take more than one independent choice, split it before it is asked or ticked. Mirror them into the harness's todo tool if one exists; the log remains the tracker of record. Branches discovered mid-session are added the moment they surface, never held in memory. Done when every branch from the request and the repo scan is listed.

3. **Choose the mode.** When the conversation already holds the answers, switch to **capture**: zero questions during synthesis: reread the full scroll and bucket every item by provenance: *decided* (the user's words, cited), *ASSUMED* (implied but unstated, marked on the entry: a product-shaping choice like caps, deletion semantics, or retry policy is never ASSUMED: undiscussed means Deferred, however standard the default looks), or *Deferred* (consequential and open). A gap found mid-capture is flagged, never asked about during synthesis; then skip to the exit gate. The read-back is capture's first question. If it exposes a build-blocking Deferred branch, capture ends and that branch reopens the interview. Otherwise, interview:

4. **Question relentlessly: one per turn.** Walk the branches in dependency order (upstream decisions first). For each question:
   - **Explore before asking.** A question of fact: what the code does, what already exists: is never asked; answer it from the repo and record it. Exploration never settles a judgment call: a preference or trade-off, however strongly the findings suggest an answer, is still asked: or, under delegation, logged as ASSUMED.
   - **Ask via the harness's multi-option question UI**: recommended answer first, a one-line "why" per option, free-text always available. No such UI: ask in prose with 2–4 numbered options, recommendation first. Every option's "why" argues *for* that option; a strawman that exists to be rejected is left off, and a question with no defensible alternative is not asked: it is recorded as ASSUMED. Absent explicit delegation, at most 2 branches per session close as ASSUMED this way; a third candidate proves the alternatives are defensible enough to ask.
   - **Probe with one concrete scenario** when the answer draws a boundary: "so when X happens, this means Y: correct?" Accept the answer only after the scenario survives. A probe is a question: it takes the next turn when the answer needs real thought, and may ride as the option question's explicit confirm-line when it doesn't: never silently skipped.
   - **Read terse answers precisely.** A terse affirmative to a specific option ("yeah fine") resolves that branch as decided. A blanket delegation ("whatever you think") authorizes decisions only where an ordinary implementation default is reversible: record those as ASSUMED and go to the exit gate. Product-shaping branches: caps, deletion semantics, security policy, retention, public contracts: remain Deferred even under blanket delegation and block confirmation until the user decides them. Delegation changes who proposes a reversible default; it never turns product policy into an implementation default.
   - **Record on resolution.** Append the decision to the log, tick the branch, capture or challenge glossary terms in `CONTEXT.md`, and offer an ADR only when the three-part test in `references/artifacts.md` passes.
   Done when every branch is decided, logged as ASSUMED, or explicitly marked Deferred. A product-shaping Deferred branch remains open for confirmation purposes and blocks the build.

5. **Exit gate.** Read back every decision from the log as a numbered list; state every ASSUMED entry and every deferred branch explicitly; ask for confirmation. If a product-shaping or otherwise build-blocking branch is Deferred, ask that branch next instead of setting a confirmed status. Otherwise, on confirmation, record the user's words verbatim in the log's Confirmation section and set `status: confirmed`. An objection reopens its branch and returns to step 4. Done only when the log says confirmed and no build-blocking branch is Deferred.

6. **Hand off.** Summarise what was written: log path, glossary terms added, ADRs created: and stop. Building begins after this point, never before.

## Example: one question cycle

> **Q (via option UI):** Where should notification state live?
> 1. **New `notifications` table (recommended)**: survives restarts; the poller needs durable cursor state anyway.
> 2. **Redis**: no migration and the cheapest writes; right when losing unread state on a cache restart is acceptable.
>
> **User picks 1.** **Probe:** "A user has 40,000 unread notifications: does the bell show 40000, 99+, or cap the query?" **User:** "Cap at 99+."
>
> **Appended to log:** `3. **Storage**: new notifications table; unread badge capped at 99+. _Why:_ durability beats write cost; unbounded counts break the navbar.`

## Tool Guidance

**Prefer:** the harness's multi-option question UI; the harness's todo list mirroring open branches.
**Fallback:** numbered options in prose; the log's Branches section as the only tracker.
**Constraints:**
- Never edit any file other than the three session documents before the gate passes
- Never batch questions: one per turn, even when the list of open branches is long
- State a rule once, then proceed with the compliant behaviour; never lecture

## Success Criteria

- Every question asked singly, each carrying a recommended answer with a reason
- Every resolved decision present in the log, appended at resolution time: not reconstructed at the end
- Zero open branches at the gate; user confirmation recorded verbatim in the log
- No non-document file created or modified before `status: confirmed`

## Common Rationalizations

Every entry below was observed verbatim in baseline testing without this skill loaded.

| Excuse | Reality |
|--------|---------|
| "Every question I ask is a cost I'm imposing on a user in a hurry" | One question per turn costs seconds; one wrong schema costs a migration. Hurry raises the stakes of asking, not the case for skipping. |
| "They said the plan is basically solid: validate, don't interrogate" | "Solid" is the claim under test. Agreeing with it is not testing it. |
| "Listing my assumptions as I go is effectively the same as asking" | Stated is not confirmed. Assumptions enter the log as ASSUMED and get read back at the gate: they never self-ratify. |
| "They said 'then build it', so pausing for confirmation disobeys them" | The instruction authorises building *after* the gate. The gate is one turn; it is never disobedience. |
| "'Yeah fine' / 'whatever you think' lets me choose product policy" | A specific affirmative decides one offered option; blanket delegation covers reversible implementation defaults only. Product-shaping branches stay Deferred until decided. |
| "The chat history already records everything; a file is overhead" | Scrollback dies with the session. The log survives it: that is its entire job. |
| "A wrong assumption can be refactored later" | True for code, false for the schema, contract, and naming decisions spec sessions exist to settle. |

## Stop Conditions

These thoughts signal imminent violation; each maps to a table entry above:

- "I have enough context to start building"
- "Batching the remaining questions saves time"
- "These all have obvious defaults"
- "Silence is agreement"
- "I'll write the docs once decisions settle"

All of them mean: return to the current workflow step.

## Genuine Exceptions

- **"Just decide for me."** Decide reversible implementation defaults and record them as ASSUMED. Keep product-shaping branches Deferred, then run the exit gate; those branches must be decided before confirmation.
- **"Skip the read-back, build now."** An explicit instruction to proceed, neither solicited nor offered as an option, overrides the gate: whether it pre-empts the read-back or cuts it short after delivery. Record the user's words verbatim in the Confirmation section, set `status: confirmed-by-override`, proceed without commentary.
- **No file-write access.** Keep the log in-conversation as a fenced block the user can save; every other rule still applies.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Two questions in one turn | Ask the upstream one; the other waits |
| Asking what a file could answer | Explore first; record the found answer in the log |
| Glossary filling with general programming terms | Domain terms only; delete the rest |
| Every decision offered as an ADR | Run the three-part test; the log is the default home |
| Ending on "sounds good" | That is not the gate. Read back the numbered list and get explicit confirmation |
| Scaffolding "just the obvious parts" before the gate | No building means none: no scaffolds, no drafts, no "starting points" |

## Failure Modes

- **Answers turn terse or impatient:** Impatience means an explicit pace complaint or two consecutive terse answers to *distinct* questions: a terse pick of an offered option is a decision, never impatience. When it fires, ask exactly one question: "assume the rest and read back, or keep going?" Assent to assume follows the delegation path; anything else continues the spec session. Never convert disengagement into silent unilateral decisions.
- **Scope explodes mid-session:** Propose a split; it happens only with the user's assent. Excess branches move to their own spec session: but no branch the current build depends on leaves this log, and any split log covering build inputs reaches its own gate before building begins.
- **The topic has no repo:** Session documents cannot interoperate with existing conventions; emit them in-conversation and say where they would live.

## Additional Resources

- **`references/artifacts.md`**: formats and rules for the decision log, glossary, and ADR, including the ADR three-part test. Load at step 1, before creating the decision log.

## Summary

Ask one question per turn and record decisions as they resolve. Do not treat the spec as confirmed until the user approves the read-back.
