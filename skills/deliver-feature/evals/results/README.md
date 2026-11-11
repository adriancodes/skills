## Current quality pilot — 2026-10-04

The subject and structure changed in the [confirmed pilot](../../../../docs/specs/2026-10-04-skill-quality-pilot.md). Current cases and raw runs are preserved in [the comparison suite](../../../../evals/pocock-comparison-2026-10-04/). Results below remain scoped to their recorded pre-pilot subjects; they do not validate the current body. The new comparison reports its own outcome and cost limits.

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

## 2026-11-11 revision: unrun

Skill text changed after a review against Anthropic's skill guidance. No model session ran against this revision. Every case named below is unrun, and no new pass is claimed.

- Step 2 and `references/stages.md` now send the agent to "Artifact validity" first; stage sections are read only when the owning skill is absent. Case: `regression-artifact-validity`.
- Step 1 asks to save a chat-only plan as the slices file before implementing. Case: `regression-chat-only-plan`.
- Description: the resume clause requires that no stage is named, and working through the remaining tasks in a slices file routes here. Cases: `trigger-positive-work-through-slices`, `trigger-negative-resume-named-stage`; near-misses added to `evals/cases/deliver-feature.json`.
- The planning fallback names the slices file after the spec file plus `-slices`.
- Not changed: `heldout-next-stage` and `regression-momentum-pressure` still assert the superseded one-stage behaviour (`single-stage`, `next-invocation-line`, `gate-stop-and-next`). They await an owner decision.
