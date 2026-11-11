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

Turn a plan into a confirmed spec. Ask one question at a time. Record each decision as it resolves. Update the glossary when terms clarify. Create ADRs only for durable architecture choices. Nothing is confirmed before the final read-back.

## Scope

Use to pin down requirements, stress-test a plan, capture prior decisions, or resume an open spec.

Do not use when:

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
- An approved RFC in `docs/rfcs/`, or a confirmed requirements read-back in the conversation, when one exists. Record what it decided as decided and cite it. Ask only about what it left open.

## Workflow

Load `references/artifacts.md` before creating the decision log.

1. **Open.** Announce the skill by name. If another skill fits better, propose one switch question. Keep these rules active until the user approves it. Restate the problem in one sentence. Do not smuggle a solution into that sentence.

   Resume any matching open decision log. Remap its branches against the current request and repository. Treat inherited ticks as provisional. Reopen decisions contradicted by current evidence. Otherwise create `docs/specs/<yyyy-mm-dd>-<slug>.md` with `status: open`.

   Done when the log exists and names the problem.

2. **Map branches.** List every design choice as a checkbox under Branches. Make each branch one decidable question. Split branches that contain independent choices. Mirror them into the harness todo tool when available. Keep the log as the source of truth. Add new branches immediately.

   Done when the request and repository scan are fully mapped.

3. **Choose the mode.** Use **capture** when the conversation already contains the answers; otherwise skip to step 4. Ask zero questions during synthesis. Reread the full conversation. Classify every item as:

   - *decided:* the user's cited words;
   - *ASSUMED:* implied but unstated;
   - *Deferred:* consequential and open.

   Never assume product-shaping policy. Caps, deletion, retries, security, and public contracts stay Deferred when unstated. Flag gaps without asking. Then move to the exit gate. The read-back is capture's first question. Reopen the interview if it exposes a build-blocking Deferred branch.

   Done when every item is classified and cited.

4. **Ask one question per turn.** Walk branches in dependency order.

   - **Explore first.** Answer factual questions from the repository. Record the evidence. Still ask judgment and trade-off questions.
   - **Offer real options.** Use the harness option UI when available. Otherwise give 2–4 numbered choices. Put the recommendation first. Give one reason per choice. Keep free text available. Remove strawmen.
   - **Limit implicit assumptions.** Record a no-choice default as ASSUMED. Without delegation, allow at most 2 such branches per session.
   - **Probe boundaries.** Test a boundary answer with one concrete scenario. Use the next turn when the probe needs thought.
   - **Interpret terse answers narrowly.** "Yeah fine" resolves only the offered option. Blanket delegation covers reversible implementation defaults only. Record those as ASSUMED. Keep product policy Deferred.
   - **Record immediately.** Append the decision and tick its branch. Update domain glossary terms. Offer an ADR only when the reference test passes.

   Done when every branch is decided, ASSUMED, or Deferred.

5. **Run the exit gate.** Check the decisions for design gaps first: state with no owner, an operation with no decided behaviour when it fails or runs twice, and a boundary with no stated contract. Use `engineering-best-practices` for this when installed. Ask each build-blocking gap as a branch. Name the rest at the read-back. Read back every decision as a numbered list. Name every ASSUMED and Deferred item. Ask for confirmation. If a build-blocking branch remains Deferred, ask it next instead. Record confirmation verbatim and set `status: confirmed`. Reopen any objected branch.

   Done when the log is confirmed and no build-blocking branch is Deferred.

6. **Hand off.** Name the log path, glossary changes, and ADRs. Start no build work inside this skill. Return to the user's workflow when the request already covers later stages. Otherwise stop.

   Done when the handoff names every written artifact.

## Example: one question cycle

A storage choice and an unread-count policy are separate decisions. Ask about storage first, record the answer, then probe the count boundary in the next turn. Read [references/examples.md](references/examples.md) when calibrating an interview turn.

## Tool Guidance

- Never edit any file other than the three session documents before the gate passes
- Never batch questions, even when many branches are open
- State a rule once, then proceed with the compliant behaviour; never lecture

## Pressure

Read [references/pressure.md](references/pressure.md) when urgency, authority, sunk cost, or an uncertain shortcut threatens the workflow. Those pressures do not waive its evidence or authority requirements.

## Genuine Exceptions

- **"Just decide for me."** Decide reversible implementation defaults and mark them ASSUMED. Keep product policy Deferred. Ask every build-blocking Deferred branch before confirmation. Name the rest at the read-back.
- **"Skip the read-back, build now."** An unsolicited explicit override may bypass the gate. The override skips the read-back only. Ask every build-blocking Deferred branch first. Record the words verbatim. Set `status: confirmed-by-override` and proceed.
- **No repository or no file-write access.** Keep the session documents in conversation as fenced blocks the user can save. State where they would normally live. Every other rule still applies.

## Failure Modes

- **Answers become impatient:** Trigger only on an explicit pace complaint or two consecutive terse answers to distinct questions. A terse pick of an offered option is a decision, never impatience. Ask: "assume the rest and read back, or keep going?" Never infer delegation from silence.
- **Scope explodes:** Propose a split and require assent. Keep build-blocking branches in the current log. Confirm every split log that supplies build inputs.

## Verification

Decisions are recorded on resolution. Confirmation or its explicit override is recorded. No build-blocking branch remains Deferred and no implementation precedes the gate.
