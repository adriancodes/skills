# Verdict-Gate Probe, 2026-11-09

Verdict: **ITERATE**. Blocked-path verdicts are fixed. The stop gate is not yet reliable.

## What was tested

An author session ran `create-skill` on the brief in [after/brief.md](after/brief.md) and produced a regression-test verification skill. Fresh downstream sessions force-loaded that child skill on small synthetic Python projects. Two projects are blocked paths:

- `already-failing-suite`: the documented suite is red before any change. Expected: inconclusive, and no bug restoration.
- `claimed-bug-absent`: the supplied witness behaves identically on both versions. Expected: inconclusive, and no regressed-suite run.

Both projects are now frozen in `../../fixtures/gated-verdict/` and covered by the `heldout-gated-verdict` case in `../../cases.jsonl`.

## Results on the blocked paths

| Subject | Runs | Correct verdict | Stopped at the gate |
|---|---|---|---|
| Before: `create-skill` at commit `a7e8323` | 4 | 0 of 4 | 0 of 4 |
| After: the shipped verdict-gate text | 2 | 2 of 2 | 1 of 2 |

Before, the child reported `protected` twice on the red baseline and `not protected` twice on the absent bug. Every run restored the bug.

After, the red-baseline run stopped before restoring the bug. The absent-bug run printed identical witness results, then ran the regressed suite anyway, and still reported inconclusive. See the last command in [after/runs/claimed-bug-absent-1-creator/events.jsonl](after/runs/claimed-bug-absent-1-creator/events.jsonl).

The two unblocked after-runs returned the expected `coverage gap` and `protected`.

## Limits

- One trial per task after the change. One model and harness: `gpt-6-luna`, Codex CLI, low reasoning effort, child skill force-loaded.
- Stops were scored by reading command traces by hand. No executable scorer or blinded judge ran.
- The four before-runs and the after-runs used different author sessions, so the comparison includes authoring variance.
- Two intermediate drafts of the change were also probed and are not preserved here. The second draft stopped at the gate in 4 of 4 blocked runs; it differs from the shipped text by one `SKILL.md` pointer line and one checklist item. That difference is untested.
- The declared suite in `../../cases.jsonl` was not run. This probe supports no tier claim.

## Files

- `before/creator-revision.txt`: the `create-skill` commit used before the change.
- `before/runs/`: the four blocked-path runs of the child skill generated before the change.
- `after/generated/SKILL.md`: the child skill generated from the shipped text, SHA-256 `fc230382864c6721325ae6ef5fd42209e24fd1312dd2eed7421801ee9f54d843`.
- `after/oracle.json`, `after/plan.json`: expected verdicts and the run schedule.
- `after/runs/`: all four downstream runs, each with the prompt, answer, raw events, and before/after fixture hashes.

Fixture project copies, provider stderr, and the harness scripts are omitted.

The local home directory in run transcripts was replaced with `/Users/user` before publication.
