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

Turn a plan into a confirmed spec. Ask one question at a time. Record each decision as it resolves. Update the glossary when terms clarify. Create ADRs only for durable architecture choices. Nothing is confirmed before the final read-back.

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
- The deliverable is an agent skill: `create-skill` fits better. Switch mid-session only after the user approves the proposed switch.

## Required Context

- The plan under spec session, restated in one sentence and accepted by the user
- Existing `CONTEXT.md`, `CONTEXT-MAP.md`, ADRs, and specs. Read them before the first question. Resume matching work instead of duplicating it.

## Workflow

Load `references/artifacts.md` before creating the decision log.

1. **Open.** Announce the skill by name. If another skill fits better, propose one switch question. Keep these rules active until the user approves it. Restate the problem in one sentence. Do not smuggle a solution into that sentence.

   Resume any matching open decision log. Remap its branches against the current request and repository. Treat inherited ticks as provisional. Reopen decisions contradicted by current evidence. Otherwise create `docs/specs/<yyyy-mm-dd>-<slug>.md` with `status: open`.

   Done when the log exists and names the problem.

2. **Map branches.** List every design choice as a checkbox under Branches. Make each branch one decidable question. Split branches that contain independent choices. Mirror them into the harness todo tool when available. Keep the log as the source of truth. Add new branches immediately.

   Done when the request and repository scan are fully mapped.

3. **Choose the mode.** Use **capture** when the conversation already contains the answers. Ask zero questions during synthesis. Reread the full conversation. Classify every item as:

   - *decided:* the user's cited words;
   - *ASSUMED:* implied but unstated;
   - *Deferred:* consequential and open.

   Never assume product-shaping policy. Caps, deletion, retries, security, and public contracts stay Deferred when unstated. Flag gaps without asking. Then move to the exit gate. The read-back is capture's first question. Reopen the interview if it exposes a build-blocking Deferred branch.

4. **Ask one question per turn.** Walk branches in dependency order.

   - **Explore first.** Answer factual questions from the repository. Record the evidence. Still ask judgment and trade-off questions.
   - **Offer real options.** Use the harness option UI when available. Otherwise give 2–4 numbered choices. Put the recommendation first. Give one reason per choice. Keep free text available. Remove strawmen.
   - **Limit implicit assumptions.** Record a no-choice default as ASSUMED. Without delegation, allow at most 2 such branches per session.
   - **Probe boundaries.** Test a boundary answer with one concrete scenario. Use the next turn when the probe needs thought.
   - **Interpret terse answers narrowly.** "Yeah fine" resolves only the offered option. Blanket delegation covers reversible implementation defaults only. Record those as ASSUMED. Keep product policy Deferred.
   - **Record immediately.** Append the decision and tick its branch. Update domain glossary terms. Offer an ADR only when the reference test passes.

   Done when every branch is decided, ASSUMED, or Deferred.

5. **Run the exit gate.** Read back every decision as a numbered list. Name every ASSUMED and Deferred item. Ask for confirmation. If a build-blocking branch remains Deferred, ask it next instead. Record confirmation verbatim and set `status: confirmed`. Reopen any objected branch.

   Done when the log is confirmed and no build-blocking branch is Deferred.

6. **Hand off.** Name the log path, glossary changes, and ADRs. Then stop. Building starts only afterward.

   Done when the handoff names every written artifact.

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

- **"Just decide for me."** Decide reversible implementation defaults and mark them ASSUMED. Keep product policy Deferred. Resolve it before confirmation.
- **"Skip the read-back, build now."** An unsolicited explicit override may bypass the gate. Record the words verbatim. Set `status: confirmed-by-override` and proceed.
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

- **Answers become impatient:** Trigger only on an explicit pace complaint or two consecutive terse answers to distinct questions. A terse pick of an offered option is a decision, never impatience. Ask: "assume the rest and read back, or keep going?" Never infer delegation from silence.
- **Scope explodes:** Propose a split and require assent. Keep build-blocking branches in the current log. Confirm every split log that supplies build inputs.
- **No repository exists:** emit the session documents in conversation. State where they would normally live.

## Additional Resources

- **`references/artifacts.md`**: formats and rules for the decision log, glossary, and ADR, including the ADR three-part test. Loaded at session open (see Workflow).

## Summary

Ask one question per turn and record decisions as they resolve. Do not treat the spec as confirmed until the user approves the read-back.
