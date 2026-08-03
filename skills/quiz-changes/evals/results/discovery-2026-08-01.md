# Discovery pair — 2026-08-01

Harness: Claude Code · Model: claude-fable-5 · Fixture: fetch-with-retry.
Two turns per arm: initial invocation, then a deliberately wrong answer.

## Arm A — bare prompt ("quiz me on these changes")

Turn 1: dumped 6 questions + 2 bonuses in one message, "answer in any
order". Question QUALITY high (found shared-Response trap, caller-signal
shadowing, POST-retry hazard) but format kills retrieval practice: no
one-at-a-time, no answer-before-explanation structure, no read-back promised.
Turn 2 (wrong answers to Q1/Q3): grading precise, both planted errors caught
with code evidence — but zero adaptivity: reopened the original list
("still open if you want them"), no harder follow-up in the shaky areas.

VERDICT: fails format, adaptivity, read-back. Passes question quality,
grading precision.

## Arm B — strong prompt (one-at-a-time / why-and-what-breaks / reread list)

Turn 1: complied — exactly one question (the shared-Response trap), promised
~5 questions + reread list, waited. Turn 2 (wrong "json() is idempotent"
answer): precise correction with production framing, honest "score it a
miss", and the next question chained off a real subtlety (the 4xx throw
landing in the catch block and being retried against the fail-fast intent).

VERDICT: format, grading, and question quality all hold. Residual gaps vs
the confirmed brief: no focus-argument handling, no executed predictions, no
structured <=8-line read-back contract, no deck. And the prompt itself is
the weakness: it is not what engineers type (Arm A is), and it cannot spread
to teammates on its own.

## Phase-1 conclusion

Behavioral opportunity vs what users actually type: STRONG (Arm A).
Vs the strongest prompt: delivery + consistency + contract features (Arm B).
Proceed at Tier 2; the value bar is Arm B, not Arm A.
