# Loop Artifacts

Templates and lookup tables for the four artifacts. Load before writing any of them. Paths are defaults; a repo CLAUDE.md pointer naming a different home wins.

## LOOP.md — the design spec

Lives at the repo root or `automation/<loop-name>/LOOP.md`. One loop per file.

```md
# Loop: ci-guardian

## Goal (verifiable)
Latest `main` CI run is green, AND this cycle's diff deleted, skipped, or weakened no test.
Anti-gaming: verification fails, regardless of CI color, on any diff that suppresses the failure signal instead of fixing it — reduced/removed assertions, loosened thresholds, broadened exception handling, skipped or deleted tests.

## Run design
triage: read CI status + STATE.md            (cheap — every run)
act:    diagnose + fix ONE failure           (expensive — only when triage found red)
verify: fresh agent checks goal + anti-gaming clause against the diff
persist: write STATE.md (always, before exit)
decide: verified-done | progress-written | escalated

## Guards
budget:  ≤ $X/day — worst-case run ($Y) × cadence (Z/day); max 25 iterations/run
breaker: 2 attempts at the same failure signature without new progress — in-run or across runs → escalate, link both attempt diffs
lock:    exit at once if previous run alive (pidfile / in-progress marker in STATE.md)
gate:    outcomes only a human causes: main changes, files deleted, users see something new.
         Enforced below L3 by credentials: the loop holds no push/merge/admin token.

## Rollout
level: L1        # L1 report-only | L2 assisted (PR-gated) | L3 unattended (non-gate actions only)
promotion: 5 consecutive clean runs at current level; counter lives in STATE.md

## Runner
<the actual command/schedule — see Runner mapping below>
```

## STATE.md — the spine

Beside LOOP.md. Read at run start, written before every exit.

```md
# State: ci-guardian
level: L1   clean-runs-at-level: 3   last-run: 2026-07-08T06:00Z ok

## Now
Investigating flaky `test_export_retry` — signature: TimeoutError in CI only.

## Tried
- run 14: reproduced locally with --repeat 50; suspect shared tmpdir. Patch drafted, NOT applied (L1).
- run 13: could not reproduce; noted CI-only. (signature match with run 14 → breaker at next miss)

## Awaiting human
- Approve tmpdir isolation patch (linked in run 14 notes).
- Flaky-test policy question: quarantine or fix-forward?
```

Ledger rules: every run appends to Tried with its ending state; failure notes carry the signature so the breaker can match; nothing is deleted — resolved items move under a `## Done` fold. The header's `level:` and `clean-runs-at-level:` fields are written only by the verifier or the human — never by the loop itself; the loop appends to the ledger and reads its level, nothing more.

## Pattern table

Cadence and cost class for common loops — pick the row, then still do the budget math with real numbers.

| Pattern | Cadence | Cost class | Notes |
|---------|---------|-----------|-------|
| Daily triage | 1×/day | low | read-only by nature; the natural first loop |
| Issue triage | 2h–1d | low | label/route; gate on closing issues |
| Research digest (non-code) | 1×/day | medium | anti-gaming: padded or unread summaries |
| Monitoring sentinel (non-code) | 5–60m | low | report-only by nature; its alerts are the output |
| Changelog drafter | 1×/day or per tag | low | writes a draft, never publishes |
| Post-merge cleanup | 6h–1d | low | dead branches, stale worktrees |
| Dependency sweeper | 6h–1d | medium | updates behind PRs, always L2+ |
| PR babysitter | 5–15m | high | responds to review comments; budget hard |
| CI sweeper | 5–15m | very high | the baseline disaster case — every guard earns its keep here |

## Runner mapping (harness-neutral)

| Runner available | How the loop runs |
|------------------|-------------------|
| Harness loop/goal command (e.g. `/loop`, `/goal`) | Pass the loop prompt; the goal command's own verifier still doesn't replace the fresh-eyes verify phase |
| Harness cron/scheduled tasks | Schedule the loop prompt at the LOOP.md cadence |
| CI schedule (GitHub Actions `schedule:`) | Job runs headless CLI with the loop prompt; STATE.md committed or cached between runs |
| OS cron + headless CLI | `cron → cli -p "$(cat loop-prompt.md)"` — add the overlap lock yourself (pidfile) |
| None of the above | The loop degrades to a manual ritual: a human runs the prompt on the cadence; every artifact still applies |

## The loop prompt

The prompt handed to each run is thin — the design lives in the files:

```
Read LOOP.md and STATE.md before anything else. Execute one cycle at your
current level exactly as LOOP.md defines it. End in one of the three endings;
write STATE.md before you exit, whatever happened.
```
