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

## 2026-11-11 revision: unrun

Skill text changed after a review against Anthropic's skill guidance. No model session ran against this revision. Every case named below is unrun, and no new pass is claimed.

- Step 1 checks the slices file's `status` as well as the spec's and asks for a missing confirmation before building. Case: `regression-open-slices-status`.
- Steps 1 and 5 cover a plan that exists only in chat. Case: `regression-chat-only-plan`.
- Description: "work through the slices" replaced by "do the next slice"; multi-task requests belong to `deliver-feature`. Cases: `trigger-positive-next-slice`, `trigger-negative-all-remaining`; near-misses added to `evals/cases/implement-task.json`.
- Added `regression-docs-only-task` for the existing non-behavioural branch of step 2, which had no case.
- Wording only: `metadata.summary` matches the body; "slice" became "task" in Scope.
- Not changed: `trigger-positive-work-through` still expects this skill for "Keep working through the slices". It awaits an owner decision.
- The 2026-08-01 value pair tied its baseline prompt, so the measured value remains a delivery residual, not a behaviour gain.

Retired on 2026-11-11: `trigger-positive-work-through` moved to [`../retired-cases.jsonl`](../retired-cases.jsonl). The description no longer claims "work through the slices"; multi-task work belongs to deliver-feature. Replaced by `trigger-negative-all-remaining`, `trigger-positive-next-slice` (unrun).
