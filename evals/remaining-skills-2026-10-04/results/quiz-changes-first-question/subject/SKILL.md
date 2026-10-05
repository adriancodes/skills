---
name: quiz-changes
description: >
  Use when an engineer wants their understanding of pending changes tested
  before shipping: the user asks to "quiz me on these changes", "test my
  knowledge", "do I actually understand this", or wants to check they
  understand AI-generated code before opening a PR. Also when someone is
  about to ship code they didn't write themselves.
license: MIT
metadata:
  category: Learning
  summary: Runs an adaptive one-question-at-a-time quiz on pending changes, grades with code evidence, and ends with a readiness read-back and optional flashcards.
---

# Quiz Changes

Use retrieval practice to expose gaps in an engineer's understanding. Ask one adaptive question at a time. Require an answer before explaining. Test the human, never the code. End with advisory readiness notes, never a gate.

## Scope

Use to test an engineer's understanding of pending changes within their stated focus.

Do not use when:

- No pending changes exist: for general codebase comprehension, use `understand-codebase` (if installed)
- The code needs judging: use `code-review`. This skill tests whether the human understands code that is staying.
- Enforcement is wanted (block the PR, record a score): this skill never gates; say so and stop

## Required Context

- The change set. Prefer an explicit range, then the branch diff against the merge-base, then staged plus unstaged changes. State which source was used.
- The user's focus area, when given — it bounds the whole session.
- The repo's run/test commands, for executing prediction questions.

## Workflow

1. **Scope the material.** Read the full change set and relevant surrounding code. Honor a stated focus exactly. Identify changed behavior and its interactions privately.

   Done when the quiz has an evidence-backed scope.

2. **Design the questions privately.** Plan 5–8 questions. Use 2–3 for a small diff. Apply the **lookup test**: ban questions answered by rereading the diff.

   Mix five types:

   - *counterfactual:* what breaks if this lock disappears?
   - *trace:* which branch handles a stale token?
   - *prediction:* what does this return for input X?
   - *justification:* why stream instead of buffer?
   - *interaction:* what does the existing cache now observe?

   Order questions from warm-up to gotcha.

   Done when each question targets one specific misunderstanding.

3. **Run one question per message.** Ask exactly one question, then wait. Never reveal the answer before an attempt. "I don't know" counts as an attempt. Grade with quoted lines or `file:line` evidence. Execute prediction questions when a cheap command exists. Show real output beside the prediction. After a miss, ask one harder follow-up in the same area. After a clean pass, skip redundant questions there.

   Done when every planned area is covered or the engineer stops.

4. **Read back readiness.** Stay within 8 lines. Name strong areas. Map each shaky area to an exact `file:line` reread. End with one advisory readiness sentence. Never issue a shipping verdict.

   Done when every miss maps to a reread line.

5. **Offer the deck.** Offer one flashcard file at `docs/quizzes/<date>-<slug>.md`. Include each missed question, given answer, correct answer, and evidence. Write it only after acceptance.

   Done when the file exists or the offer is declined.

## Tool Guidance

**Prefer:**
- Executing prediction questions over asserting their answers — real output settles arguments

**Avoid:**
- Reading only the diff: interaction questions require the surrounding code

**Constraints:**
- Keep the session read-only except for an accepted deck file.
- Never edit, fix, or comment on the code under quiz.
- Put probable bugs in the read-back and leave fixes to the engineer.

## Failure Modes

- **No pending changes:** say so and point to `understand-codebase` (if installed) for general comprehension; do not quiz the whole repository.
- **The diff exceeds about 1,500 changed lines:** ask for the most important area. Never cover everything thinly.
- **The engineer requests all questions and answers:** name the retrieval cost in one sentence. Then provide a self-contained quiz with answers at the bottom.
- **A question exposes a probable bug:** finish the session. Put the bug first in the read-back. Label it for `code-review` or the engineer.

## Verification

Questions require reasoning, answers precede explanations, and grades cite code. Readiness stays advisory; deck writes require acceptance.
