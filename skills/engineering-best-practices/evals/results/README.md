> Historical evidence: runtime structure changed on 2026-10-04. These outputs validate their recorded original subjects, not the current body. See the [current preservation pass](../../../../evals/remaining-skills-2026-10-04/README.md); no old result was retagged as current.

# Engineering Best Practices evidence status

One Tier-2 run is recorded: [tier2-2026-08-01.md](tier2-2026-08-01.md)
(claude-fable-5, Claude Code, 2026-08-01; 6 actor sessions — value pair 2+2
plus both regressions). Value pair: 2/2 skill sessions pass all 7
assertions; pressure regression passes 5/5; the edge regression
(`regression-no-match`) could not exercise its no-match path — the catalog
matched the firmware query on the first call — and needs re-authoring with
forced-empty retrieval before edge coverage can be claimed. Scorer was
non-blind; deviations are listed in the results file.

Subject SHA-256 tested (`SKILL.md`):
`e0c4b5cbccc62976ef7035545e73fc60c24b0df9581f51a7d666721de5321646`.
`cases.jsonl` SHA-256 at run time:
`7be04c26484b35429d1ca31716c2dedec03ffc00fb626abc3234b45780ee8130`.

## Run shape used (matches the plan below)

- **Tier:** 2 — targeted comparative (failures are reversible local-file and
  workflow mistakes; see `../skill-brief.md` for the justification and the
  `ASSUMED` production-risk caveat).
- **Arms:** `prompt` (strongest-realistic baseline in the brief) and `skill`
  (subject loaded). Value case runs both arms; regressions run skill-only;
  trigger probes run skill-only, normally via the shared portfolio routing
  suite.
- **Sessions:** 4 actor sessions for the value pair by default (2 per arm),
  1 session per regression case, single-pass trigger probes.
- **Order:** value pair first, then regressions; freeze `cases.jsonl` and
  the subject hash before the first session.

## Artifacts to preserve from any run

- Frozen `cases.jsonl` and the subject SHA-256 actually tested.
- Tested route (harness, model, date) and per-session costs.
- Raw session transcripts for every arm, including the exact
  `retrieve-guidance.mjs` command lines and their full output.
- End state of each `fixtures/worker-claim` working copy (diffs against the
  committed fixture; the committed fixture itself stays unmodified).
- Per-assertion pass/fail with the transcript evidence cited, plus the
  judge's notes for any non-critical failures.

## Local checks at authoring time (not eval evidence)

- One local invocation of `scripts/retrieve-guidance.mjs` with the value
  case's five-field query (`--intent implement`, `--max 4`) returned four
  applicable practices (idempotency/replay, restart safety, event/stream
  consumer rules, distribution boundaries), confirming the case's query
  shape retrieves usable material.
- `node scripts/skills.mjs check` passed after authoring.
