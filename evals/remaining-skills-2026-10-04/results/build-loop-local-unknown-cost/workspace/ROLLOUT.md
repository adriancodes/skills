# Manual rollout

Current status: L1 report-only, cost unknown, no schedule. Setup has not invoked
Codex or contacted any forum. The script is the only entry point; it has no
publishing capability. Human review gates publication, source changes, policy
changes, promotion, and scheduling.

When an already installed Codex CLI and model-only API authentication are ready,
run from the project root:

```sh
./automation/manual-measure.sh
```

This is one manual report-only measurement, not a recurring schedule. Review the
run directory's input.json, report.json, usage.jsonl, and elapsed time in STATE.md.
The JSON CLI event stream is retained for token and model usage; if it omits any
billing dimension, collect it from billing before calculating cost. Do not assume
zero cost or infer a price. Calculate worst-case per-run cost × proposed runs/day,
set a numeric cap, and confirm reviewer capacity before enabling any cadence.
No cadence has been selected, and this adapter cannot enable one.

Validate a saved report without a model call:

```sh
python3 automation/runner.py --verify automation/runs/RUN/report.json automation/runs/RUN/input.json
```

The human compares each reply with its question and missing product context,
checks the unanswered/deferred lists, and reviews any design/checker changes.
Only then record certification and update clean-runs-at-level. Five consecutive
clean L1 runs permit a human decision about L2; L2/L3 require a reviewed adapter.
No local report automatically becomes verified-done or a clean run.

On a breaker, resolve the recorded failure before appending the documented reset
entry. On a leftover lock, check its PID and confirm no run is alive before
removing automation/run.lock. Preserve the failure ledger and prior reports.
