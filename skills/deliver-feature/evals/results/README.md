# Deliver Feature evidence status

One Tier-2 run is recorded: `tier2-2026-08-01.md` — 6 actor sessions
(value pair 2 prompt-arm + 2 skill-arm on the held-out
`spec-confirmed-no-slices` fixture; both regressions skill-only), all
critical assertions PASS, verdict SHIP pending user acceptance. Evidence
label: targeted comparative support (Tier 2), claude-fable-5, Claude Code,
2026-08-01. Substitutions (downstream-stage bounding, absent siblings via
loud degradation, explicit route only, non-blind scorer) are recorded in
the results file.

- **Tier:** 2 — targeted comparative. A misrouted or batched stage wastes
  reversible local-file and workflow effort; the skill refuses unattended
  scheduled operation, so Tier 3 does not apply.
- **Arms:** `heldout-next-stage` ran prompt vs. skill (the baseline
  comparator prompt is recorded in `../skill-brief.md`); the two regression
  cases ran skill-only; the five trigger probes remain with the shared
  portfolio routing suite, per-skill only after a name/description change or
  a known collision.
- **Sessions:** 4 actor sessions for the comparative pair plus 2 regression
  sessions, per the Tier-2 recipe.
- **Preserved run artifacts:** `cases.jsonl` and fixture hashes, the subject
  SKILL.md hash, harness and model identifiers with date, and the tested
  route (explicit invocation) are recorded in `tier2-2026-08-01.md`
  alongside per-assertion judgments with one-line evidence; per-session
  token usage was captured at run time (32k–37k subagent tokens per
  session).

Current subject SHA-256
(`skills/deliver-feature/SKILL.md`):
`45ffa1d0706c984138ba5c56b584e6211f8f3906fa9c71ef315fac652a690a8a`.
