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

## Overview

An engineer who ships code they cannot explain has outsourced their judgment, not their typing. Close the gap with retrieval practice: an adaptive quiz on the pending changes, one question at a time, answer before explanation. The skill tests the human, never the code — and it is advisory: it ends in an honest readiness read-back, never a verdict or a block.

## When to Use

- "quiz me on these changes", "test my knowledge", "do I actually understand this"
- Before opening a PR containing substantial AI-generated code
- A focus is welcome: "quiz me on the retry logic" narrows the session to it

## Do Not Use When

- No pending changes exist: for general codebase comprehension, use `understand-codebase` (if installed)
- The code itself needs judging: that is `code-review`'s job — this skill assumes the code is staying and tests whether the human understands it
- Enforcement is wanted (block the PR, record a score): this skill never gates; say so and stop

## Required Context

- The change set, resolved in this order: an explicit range the user names, else the branch diff against the merge-base, else staged plus unstaged changes. State which was used.
- The user's focus area, when given — it bounds the whole session.
- The repo's run/test commands, for executing prediction questions.

## Workflow

1. **Scope the material.** Read the full change set plus enough surrounding code to understand what the changes interact with. Honor a stated focus exactly. Done when the changed behaviors and their interactions with existing code are identified — privately; reveal nothing yet.

2. **Design the question set — privately.** Plan 5–8 questions, scaled down (2–3) for small diffs. Every question must pass the **lookup test**: if re-reading the diff text answers it, it is banned. Draw from five types: *counterfactual* ("what breaks if this lock is removed?"), *trace* ("a request with a stale token arrives — walk me through which branch handles it"), *prediction* ("what does this return for input X?" — executable), *justification* ("why streaming here instead of buffering?"), and *interaction* ("how does this change what the existing cache sees?"). Order warm-up to gotcha. Done when each planned question names the specific misunderstanding it would expose.

3. **Run the session, one question per message.** Ask exactly one question, then stop and wait. Never reveal an answer before the engineer commits to an attempt — "I don't know" counts as an attempt; a dumped question list is a failed session, not a fast one. Grade every answer with code evidence: quote the deciding lines or cite `file:line`. For prediction questions, run the code when a cheap command exists and show the real output beside the prediction. Adapt: a miss earns one harder follow-up in the same area before moving on; a clean, confident pass skips the remaining planned questions in that area. Done when every planned area is covered or the engineer stops the session.

4. **Read back readiness.** In 8 lines or fewer: the areas that held up, each shaky area with the exact thing to reread (`file:line`), and one advisory sentence on overall readiness. Advisory means advisory — "you'll want another pass over the abort path before someone reviews this", never "not ready to ship". Done when every miss from the session maps to a reread line.

5. **Offer the deck.** One line: offer to write the missed questions to `docs/quizzes/<date>-<slug>.md` as flashcards — question, the answer given, the correct answer with its evidence. Write only on acceptance. Done when the file is written or the offer declined.

## Tool Guidance

**Prefer:**
- Executing prediction questions over asserting their answers — real output settles arguments

**Avoid:**
- Reading only the diff: interaction questions require the surrounding code

**Constraints:**
- The session is read-only except the accepted deck file — never edit, fix, or comment the code under quiz, even when a question exposes a real bug; name the bug in the read-back and leave the fix to the engineer

## Success Criteria

- Every question passes the lookup test — none is answerable by re-reading the diff text
- Exactly one question per message; no answer revealed before an attempt
- Every grade cites code evidence; executed predictions show real output
- At least one harder follow-up was asked in each missed area
- The read-back maps every miss to a specific reread and stays advisory
- The deck file exists only if the engineer accepted the offer

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Trivia the diff answers ("what is the function called?") | Apply the lookup test; replace with a counterfactual or trace |
| Dumping the full question list | One question per message; wait |
| Grading a wrong answer as "close enough" | Score it a miss, show the deciding lines, follow up harder |
| Marching to the next topic after a miss | One harder follow-up in the same area first |
| Verdict language ("not ready", "failed") | Advisory read-back with rereads; the engineer decides |
| Fixing the bug a question exposed | Read-only: name it in the read-back, leave the code alone |

## Failure Modes

- **No pending changes:** say so and point to `understand-codebase` (if installed) for general comprehension; do not quiz the whole repository.
- **The diff is too large to quiz honestly (~1,500+ changed lines):** ask which part matters most, or quiz the stated focus only — never pad a session to cover everything thinly.
- **The engineer demands all questions and answers at once:** name the cost in one sentence — reading answers is not retrieval practice — then provide a self-contained quiz artifact with answers at the bottom. Their session, their call.
- **A question exposes a probable real bug:** finish the session; put the bug first in the read-back, labeled as a finding for `code-review` or the engineer — not as a quiz item to argue about.

## Summary

One question per message, answer before explanation, evidence in every grade, a harder follow-up behind every miss. End with an advisory read-back that maps each gap to a reread, offer the flashcards, and never touch the code.
