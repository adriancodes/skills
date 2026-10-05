> Structural update, 2026-10-04: the [accepted collection scope](../../../docs/specs/2026-10-04-remaining-skills-structure.md) consolidates this skill while retaining its operative contract. [Current preservation evidence](../../../evals/remaining-skills-2026-10-04/README.md) is narrower than a full tier verdict; prior results remain historical.

# Skill Brief — quiz-changes

Confirmed by the user on 2026-08-01 after a Phase-0 interview (gate-vs-tool,
format, invocation) plus brief read-back. Source of truth for scope and evals.

## Job

Close the comprehension gap between an engineer and AI-generated code before
it ships: an interactive retrieval-practice quiz on the pending changes,
ending in an honest advisory readiness read-back. Tests the human, never the
code; never a gate.

## Confirmed decisions

- **Type**: Workflow. **Invocation**: model-invoked — teammates must be able
  to discover it from natural phrases ("quiz me on this", "test my
  knowledge") without knowing a command name.
- **Advisory, not a gate** (user chose against soft/hard gates): read-back
  names solid and shaky areas with rereads; no verdicts, no blocking, no
  recorded scores.
- **Format**: interactive one-question-at-a-time with answer-before-
  explanation, adaptive difficulty (miss → harder follow-up in that area),
  plus an exportable flashcard deck of missed questions, written only on
  acceptance.
- **Focus argument**: the user can name what to test ("quiz me on the retry
  logic") and the session concentrates there.

## Accepted ASSUMED items

- Name `quiz-changes`; 5–8 questions default (2–3 for tiny diffs); deck at
  `docs/quizzes/<date>-<slug>.md`; predictions checked by executing code
  where cheap; Tier 2 evidence.

## Eval contract (Tier 2, new skill)

- **Discovery pair** (run 2026-08-01, recorded in
  `results/discovery-2026-08-01.md`): bare "quiz me on these changes" vs the
  strongest realistic prompt ("Quiz me on these changes one question at a
  time; wait for my answers; focus on why and what-breaks, not trivia; end
  with what I should reread"), two turns each (initial + wrong answer).
- **Value case**: skill arm on the held-out `fetchWithRetry` fixture; the
  strong-prompt discovery arm doubles as the prompt arm. Success measures
  traced to the skill's Success Criteria: lookup test holds for every
  question, one question per message, evidence-cited grading, adaptive
  follow-up after a miss, ≤8-line advisory read-back mapping misses to
  rereads, deck only on acceptance.
- **Regression cases** (skill-only): edge — a tiny diff (3–5 changed lines)
  must produce a 2–3 question session, not a padded one; pressure — "just
  give me all the questions and answers at once" must name the testing-effect
  cost in one sentence, then provide an answers-at-bottom artifact.
- **Routing**: positive phrases ("quiz me on these changes", "test my
  knowledge", "do I actually understand this") recall from the description
  alone; adjacent negatives ("explain this codebase", "review my changes")
  do not. Runs in the shared portfolio routing suite.

## Opportunity verdict (Phase 1)

Behavioral opportunity vs the **bare** prompt (what engineers actually type)
is strong: the bare arm dumped all questions at once with no adaptivity and
no read-back — retrieval practice dies in that format — though its question
quality was high. The **strong** prompt held the format and graded well, so
the residual opportunity is delivery and consistency: nobody retypes that
prompt, it cannot spread to teammates on its own, and it lacks the focus
argument, executed predictions, structured read-back, and deck. Both arms'
raw transcripts: `results/discovery-2026-08-01.md`.
