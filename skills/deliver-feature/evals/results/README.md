# Deliver Feature evidence status

Historical Phase-6 observation (UNVERIFIED; raw transcripts, route, and scoring records unavailable): 4/4 for subject `2d9ac2922010…`; the actor ran one stage and stopped at its gate. See the [Phase-6 report](../../../../docs/evidence/phase6-atomic-rewrite-2026-08-29.md). Historical evidence below remains scoped to its recorded hash.

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

Historical subject SHA-256
(`skills/deliver-feature/SKILL.md`):
`4050980764f3003af98ddde154587ca2d0aa31d8511a28578ace66a05044843b`.

On 2026-08-29 the description gained the explicit trigger phrase "build this feature end to end" after the lexical portfolio preflight exposed that miss. The 51-case preflight passes. Installed-harness triggering for this revision remains untested, so the preserved behavioral evidence and current routing evidence are separate claims.
