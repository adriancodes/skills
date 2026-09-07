# implement-task evidence status

Historical Phase-6 observation (UNVERIFIED; raw transcripts, route, and scoring records unavailable): 5/5 for subject `378c97b5af46…`; valid red, bounded implementation, hostile checks, and focused/full tests all held. See the [Phase-6 report](../../../../docs/evidence/phase6-atomic-rewrite-2026-08-29.md). Historical evidence below remains scoped to its recorded hash.

One Tier-2 run is recorded: `tier2-2026-08-01.md` (raw evidence in
`tier2-2026-08-01-sessions.md`). 16/16 assertions pass across 4 actor
sessions; the value pair tied against the brief's gate-naming baseline prompt
(parity finding stated in the results), and both regressions pass. Evidence
label: targeted comparative support (Tier 2), claude-fable-5, Claude Code,
2026-08-01. Scorer was non-blind.

- **Tier**: 2 — targeted comparative (see `../skill-brief.md` for the
  justification).
- **Subject**: `skills/implement-task/SKILL.md`, SHA-256
  `6cc3790be6305ce5668024ff38ffa87a4c50a2b37c4643d562acf53f9da50fb9` at
  authoring time (2026-08-01), recomputed and matched at run time
  (2026-08-01). Results never claim beyond the recorded subject, harness,
  model, and date.
- **Arms**: `prompt` (strongest realistic baseline from the brief) vs. `skill`
  for `heldout-mark-read`; `skill` only for the two regressions; trigger
  probes run in the shared portfolio routing suite unless a name/description
  change or collision forces a per-skill run.
- **Sessions**: 4 actor sessions by default — 2 per arm on the held-out pair,
  1 per regression. Restore the fixture invariants
  (`../fixtures/notifications-slice/README.md`) before every session.
- **Artifacts to preserve per run**: frozen `cases.jsonl`, subject SHA-256,
  fixture pre/post hashes, tested route (harness + model + date), full
  transcripts, changed-file diffs, the final state of
  `docs/specs/2026-07-28-notifications-slices.md` from each session, assertion
  judgments with rationale, and token/cost figures — dated files in this
  directory.
