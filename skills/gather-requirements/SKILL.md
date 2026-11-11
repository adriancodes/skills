---
name: gather-requirements
description: >
  Use when a user asks for something to be built and the request leaves
  out who it is for, why, what done looks like, or its limits: "build me
  an app that…", "I want to add a feature", "interview me first", or
  "ask me what you need to know". Also when work is about to start on
  guessed requirements.
license: MIT
metadata:
  category: Planning
  summary: Interviews the user one question at a time, recommending an answer each time, until a request is understood well enough to specify.
---

# Gather Requirements

Interview the user until the request is understood well enough to specify. Ask one question per turn. Recommend an answer every time; the user decides. Write no file and start no build.

## Scope

Use when a user brings something to build (an app, a feature, a tool, a change) and the request does not yet say who it is for, why, what done looks like, its constraints, or what is out of scope. Also use on explicit request.

Do not use when:

- The request already answers those five areas: proceed with it
- The change is small and reversible: ask at most one inline question, then do the work
- Decisions are already made and need writing down, or a drafted plan needs stress-testing: use `create-spec` when installed
- The open question is which approach to take, not what is wanted: use `create-rfc` when installed
- Nobody can answer, as in a scheduled or unattended run: report the missing requirements as a blocker and guess none of them
- The user asked for speed over questions: list the assumptions in one message and proceed

## Workflow

1. **Open.** Announce the skill by name. Read the repository, existing specs, glossary, and project instructions before the first question. Restate the request in one sentence that adds no solution.

   Done when the restatement is on the page.

2. **Map the unknowns.** Mark each area known or unknown:

   - who uses it, and in what situation;
   - the problem, and why it matters now;
   - what done looks like, as something observable;
   - what it must do, flow by flow;
   - constraints: platform, stack, data, integrations, deadline, budget, compliance;
   - what is out of scope.

   Mark an area known only from the user's words or repository evidence. An inference is unknown.

   Done when every area is marked.

3. **Ask one question per turn.** Ask the question whose answer changes the most later questions first.

   - **One ask per turn.** Request one piece of information. Close the turn with how to reply and nothing else. A closing "it would help to include roughly how many people…" is a second ask: give it its own turn.
   - **Ask only what shapes the build.** Ask when the answer changes what gets built or is costly to change afterwards. Record a detail that is cheap to change later, such as hosting or an exact time, as ASSUMED with the recommended value. Do not ask it.
   - **Look before asking.** Answer factual questions from the repository and say what was found.
   - **Use the option UI.** Present the question through the harness's multiple-choice UI when one exists. Otherwise give a numbered list the user can answer with a number.
   - **Offer 2–4 real options.** Make them mutually exclusive. Keep free-text input available on every question.
   - **Recommend first.** Put the recommended option first and label it. Base it on current best practice for this user's stated situation, and give the reason in one line. Give each other option its trade-off in one line.
   - **The user's choice stands.** Record a choice that differs from the recommendation as chosen. Name a serious risk once. Never re-argue it.
   - **Ask open questions plainly.** When no option list fits, ask in plain text and attach a best guess the user can accept.
   - **Make answers concrete.** Turn "fast" into "results in under one second on 10,000 rows?" and confirm it.
   - **Update the map.** Mark the area after each answer and add every unknown the answer exposes.

   Done when the stop test passes or the user says stop.

4. **Apply the stop test.** Stop asking at 95% understanding. Claim 95% only when all three hold:

   - every area is known, or the user declared it not applicable;
   - no remaining question has an answer that would change what gets built;
   - each main flow can be described from the user's first action to the result they see.

   When the user says stop, stop at once. Carry every unknown area into the read-back as an assumption or an open item.

   Done when the test passes or the user stopped the interview.

5. **Read back.** List the requirements by area as a numbered list. Tag each item *decided* (the user said it), *ASSUMED*, or *open*. Include no requirement the user did not state or accept. State the confidence and what it rests on. Ask for confirmation. On an objection, correct the item and read the changed items back.

   Done when the user confirms the read-back.

6. **Hand off.** Name the next step: `create-rfc` when the approach is undecided, otherwise `create-spec`. Continue into it only when the user's request already covered later stages.

   Done when the next step is named.

## Tool Guidance

- Never batch questions, even when many areas are unknown
- Never edit a file or run a build inside this skill

## Failure Modes

- **Answers turn terse or the user complains about pace:** ask once, "assume the rest and read back, or keep going?" A terse pick of an offered option is a decision, not impatience.
- **"Just decide for me":** decide reversible details and tag them ASSUMED. Keep choices that shape the product, such as who can see what, what is deleted, and what costs money, as open items in the read-back.
- **The request grows into several products:** propose a split and interview for the part the user picks first.

## Verification

Every question was asked alone and carried a recommendation. Every read-back item is tagged, and none was invented. The user confirmed the read-back or stopped the interview. No file changed.
