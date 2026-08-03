---
name: create-spec
description: >
  Use when requirements need pinning down before anything is built:
  the user asks to "spec this out", "stress-test my design", "poke
  holes in this plan", or says "write this up as a spec" after a
  design discussion. Also when a plan is vague, rests on unstated
  assumptions, or decisions keep getting relitigated from scrollback.
license: MIT
metadata:
  category: Planning
  summary: Turns a plan into a confirmed spec via a one-question-at-a-time interview or direct capture of decisions already made.
---

# Create Spec

## Overview

Turn a plan into a confirmed spec by asking one question at a time and recording each resolved decision in the session's decision log. Update the glossary as terms clarify; create ADRs only for durable architectural choices. A stated decision stays unconfirmed until the user approves the final read-back.

## When to Use

- A plan exists but its requirements are unstated: "spec this plan", "pin down the requirements", "stress-test this", "poke holes in it"
- The conversation already holds the answers and needs writing down: "write this up as a spec", "capture what we decided" (capture mode: step 3)
- Requirements are vague, assumption-laden, or keep being relitigated from scrollback
- A design conversation is producing decisions nobody writes down
- A previous spec session was interrupted: a log in `docs/specs/` still has `status: open`

## Do Not Use When

- The user wants a quick fact or one-shot opinion: answer directly
- Only the wording needs work, not decisions: use `improve-prompt` when installed; never turn copy-editing into a spec session
- The change is small and reversible: a one-message plan needs a sentence of consent, not a session
- Poking holes in a *built artifact*, not a plan, is `verify-work`'s job (executed attacks, not questions)
- Implementation is underway and the user wants execution, not design review
- The user invokes a different interview skill by name (e.g. `/grilling` from another installed collection): follow that skill
- The deliverable is itself an agent skill: a skill-authoring skill such as `create-skill` fits better, but switch mid-session only through step 1's proposed-switch question or the user's say-so; otherwise proceed with the skill spec as the plan

## Required Context

- The plan under spec session, restated in one sentence and accepted by the user
- A scan of the target repo (`CONTEXT.md` or `CONTEXT-MAP.md`, `docs/adr/`, `docs/specs/`): read existing documents before the first question; resume and extend them rather than duplicating

## Workflow

Load `references/artifacts.md` at session open, before creating the decision log: it holds formats and rules for all three session documents.

1. **Open.** Announce the skill by name. If another installed skill fits better, propose the switch as one question; until the user's explicit say-so lands, every rule here stays in force. Restate the topic in one sentence naming the problem, never a solution: any design choice riding in the restatement or original plan is a step-2 branch, not a given. If an open decision log matches the topic, resume it: rerun step 2 against the current request and repo state, reopen any inherited decision the current state contradicts, and treat inherited ticks as provisional until they survive that check. Otherwise create `docs/specs/<yyyy-mm-dd>-<slug>.md` with `status: open`. Done when the log exists and names the topic.

2. **Map branches.** List every design branch the plan raises (purpose, structure, naming, edge cases, whatever the topic demands) as checkboxes in the log's Branches section. A branch is one decidable question: split any needing more than one independent choice before asking or ticking it. Mirror branches into the harness's todo tool if one exists; the log stays the tracker of record. Add mid-session discoveries the moment they surface, never holding them in memory. Done when every branch from the request and repo scan is listed.

3. **Choose the mode.** When the conversation already holds the answers, switch to **capture**: zero questions during synthesis. Reread the full scroll and bucket every item by provenance: *decided* (the user's words, cited), *ASSUMED* (implied but unstated, marked on the entry: a product-shaping choice like caps, deletion semantics, or retry policy is never ASSUMED: undiscussed means Deferred, however standard the default looks), or *Deferred* (consequential and open). Flag gaps found mid-capture instead of asking; then skip to the exit gate. The read-back is capture's first question: a build-blocking Deferred branch it exposes ends capture and reopens the interview. Otherwise, interview:

4. **Question relentlessly: one per turn.** Walk the branches in dependency order (upstream decisions first). For each question:
   - **Explore before asking.** Never ask a question of fact (what the code does, what exists): answer it from the repo and record it. Exploration never settles a judgment call: however strongly the findings point, a preference or trade-off is still asked: or, under delegation, logged as ASSUMED.
   - **Ask via the harness's multi-option question UI**: recommended answer first, a one-line "why" per option, free-text always available. Without it, ask in prose with 2–4 numbered options, recommendation first. Every "why" argues *for* its option: leave off strawmen, and record a question with no defensible alternative as ASSUMED instead of asking it. Absent explicit delegation, at most 2 branches per session close as ASSUMED this way; a third candidate proves the alternatives are defensible enough to ask.
   - **Probe with one concrete scenario** when the answer draws a boundary: "so when X happens, this means Y: correct?" Accept the answer only after the scenario survives. A probe is a question: it takes the next turn when the answer needs real thought, and may ride as the option question's explicit confirm-line when it doesn't: never silently skipped.
   - **Read terse answers precisely.** A terse affirmative to a specific option ("yeah fine") resolves that branch as decided. Blanket delegation ("whatever you think") authorizes only reversible, ordinary implementation defaults: record those as ASSUMED and go to the exit gate. Product-shaping branches (caps, deletion semantics, security policy, retention, public contracts) stay Deferred even under blanket delegation and block confirmation until the user decides them.
   - **Record on resolution.** Append the decision to the log, tick the branch, capture or challenge glossary terms in `CONTEXT.md`, and offer an ADR only when the three-part test in `references/artifacts.md` passes.
   Done when every branch is decided, logged as ASSUMED, or explicitly marked Deferred.

5. **Exit gate.** Read back every decision from the log as a numbered list, stating every ASSUMED entry and Deferred branch explicitly, and ask for confirmation. If a product-shaping or otherwise build-blocking branch is Deferred, ask it next instead of confirming. Otherwise record the user's verbatim confirmation in the log's Confirmation section and set `status: confirmed`. An objection reopens its branch and returns to step 4. Done only when the log says confirmed and no build-blocking branch is Deferred.

6. **Hand off.** Summarise what was written (log path, glossary terms added, ADRs created) and stop. Building begins only after this point.

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
- Never batch questions, even when many branches are open
- State a rule once, then proceed with the compliant behaviour; never lecture

## Success Criteria

- Every question asked singly, each carrying a recommended answer with a reason
- Every resolved decision in the log, appended at resolution time, not reconstructed at the end
- Zero open branches at the gate; user confirmation recorded verbatim in the log
- No non-document file created or modified before `status: confirmed`

## Common Rationalizations

Each excuse was observed verbatim in baseline testing without this skill loaded.

| Excuse | Reality |
|--------|---------|
| "Every question I ask is a cost I'm imposing on a user in a hurry" | One question per turn costs seconds; a wrong schema costs a migration. Hurry raises the stakes of asking, not the case for skipping. |
| "They said the plan is basically solid: validate, don't interrogate" | "Solid" is the claim under test. Agreeing with it is not testing it. |
| "Listing my assumptions as I go is effectively the same as asking" | Stated is not confirmed. Assumptions enter the log as ASSUMED and are read back at the gate; they never self-ratify. |
| "They said 'then build it', so pausing for confirmation disobeys them" | The instruction authorises building *after* the gate. The gate is one turn, not disobedience. |
| "'Yeah fine' / 'whatever you think' lets me choose product policy" | A specific affirmative decides one offered option; blanket delegation covers only reversible implementation defaults. Product-shaping branches stay Deferred until decided. |
| "The chat history already records everything; a file is overhead" | Scrollback dies with the session. The log survives it: that is its entire job. |
| "A wrong assumption can be refactored later" | True for code; false for the schema, contract, and naming decisions spec sessions exist to settle. |

## Stop Conditions

These thoughts signal imminent violation; each maps to a table entry above:

- "I have enough context to start building"
- "Batching the remaining questions saves time"
- "These all have obvious defaults"
- "Silence is agreement"
- "I'll write the docs once decisions settle"

All of them mean: return to the current workflow step.

## Genuine Exceptions

- **"Just decide for me."** Decide reversible implementation defaults, record them as ASSUMED, keep product-shaping branches Deferred, then run the exit gate; those branches must be decided before confirmation.
- **"Skip the read-back, build now."** An explicit instruction to proceed, neither solicited nor offered as an option, overrides the gate: whether it pre-empts the read-back or cuts it short after delivery. Record the user's words verbatim in the Confirmation section, set `status: confirmed-by-override`, proceed without commentary.
- **No file-write access.** Keep the log in-conversation as a fenced block the user can save; every other rule still applies.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Two questions in one turn | Ask the upstream one; the other waits |
| Asking what a file could answer | Explore first; record the found answer in the log |
| Glossary filling with general programming terms | Domain terms only; delete the rest |
| Every decision offered as an ADR | Run the three-part test; the log is the default home |
| Ending on "sounds good" | Not the gate: read back the numbered list and get explicit confirmation |
| Scaffolding "just the obvious parts" before the gate | No building means none: no scaffolds, drafts, or "starting points" |

## Failure Modes

- **Answers turn terse or impatient:** Impatience means an explicit pace complaint or two consecutive terse answers to *distinct* questions; a terse pick of an offered option is a decision, never impatience. When it fires, ask exactly one question: "assume the rest and read back, or keep going?" Assent to assuming follows the delegation path; anything else continues the spec session. Never convert disengagement into silent unilateral decisions.
- **Scope explodes mid-session:** Propose a split; it happens only with the user's assent. Excess branches move to their own spec session, but no branch the current build depends on leaves this log, and any split log covering build inputs reaches its own gate before building begins.
- **The topic has no repo:** Session documents cannot interoperate with existing conventions; emit them in-conversation and say where they would live.

## Additional Resources

- **`references/artifacts.md`**: formats and rules for the decision log, glossary, and ADR, including the ADR three-part test. Loaded at session open (see Workflow).

## Summary

Ask one question per turn and record decisions as they resolve. Do not treat the spec as confirmed until the user approves the read-back.
