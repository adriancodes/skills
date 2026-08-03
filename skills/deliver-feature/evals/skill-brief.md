# Skill Brief — deliver-feature

Derived on 2026-08-01 from the shipped subject
(`skills/deliver-feature/SKILL.md`, SHA-256
`45ffa1d0706c984138ba5c56b584e6211f8f3906fa9c71ef315fac652a690a8a`), not from
a user interview. Every inference beyond the SKILL.md text is marked
`ASSUMED`. Source of truth for eval scope until a confirmed brief supersedes
it.

## Job

Move a feature through the pipeline (spec → task creation → implementation →
verification) exactly one stage per invocation. Detect the stage from the
feature's artifacts — the decision log and slices file, frontmatter included —
never from conversation memory; run the matching sibling skill; stop at that
stage's gate with a report of what the next invocation will do.

## Type and invocation

- **Type:** Workflow (a conductor that routes to sibling skills via soft
  references).
- **Invocation:** Model-invoked — the description targets phrases like
  "deliver this feature", "ship this feature", "what's next on X", "run the
  pipeline", and session-resume situations. `ASSUMED`: no
  `disable-model-invocation` flag is present, so autonomous discovery matters
  and trigger probes are in scope.

## Tier

**Tier 2 — targeted comparative.** A misrouted or batched stage wastes
reversible local-file and engineering-workflow effort (a rebuilt decision,
a slice built on an unconfirmed spec) but is recoverable; the skill itself
refuses unattended scheduled operation (it defers that to `build-loop`), so
Tier 3's unattended-automation trigger does not apply. `ASSUMED`: Tier 2 is
the eventual target, matching the sibling pipeline skills.

## Baseline comparator (strongest realistic prompt)

> "Find this feature's decision log and slices file under `docs/specs/`, read
> them in full including frontmatter, work out from the files alone which
> pipeline stage the feature is at, run only that one stage, then stop at its
> gate and tell me what the next invocation should do."

This is the strongest short prompt a practiced user would realistically type;
the skill must beat it on the gate behaviors below, not merely match its
happy path.

## Success measures (traced to the subject's gates)

1. **Stage detected from files, not memory** — Workflow steps 1–2: each
   artifact is read in full and quoted as missing, open, confirmed, complete,
   or invalid before any work; the stage comes from the first matching table
   row, and conversation recollection never overrides the files.
2. **Exactly one stage per invocation** — Workflow step 4: one stage (one
   slice, if implementing) runs; planning stages included; an explicit
   request to continue begins a new invocation rather than extending this
   one.
3. **A missing file is quoted as `missing`** — Workflow step 1: absence is a
   state, not a read failure; a missing slices file with a confirmed spec
   routes to task creation, not to an error or a guess.
4. **`status: open` stops the pipeline** — Workflow step 2: an open spec runs
   the spec stage however finished the work looks; an open spec's own
   contents never count as capture-mode answers; nothing is built on it.
5. **"Then stop"** — Workflow step 4: the exit report names the stage run,
   the outcome, what the artifacts now say, and what the *next* invocation
   will do; it ends there, with no second stage started.
6. **Ambiguity is asked, not guessed** — Workflow step 1: two open specs
   matching the topic produce a question naming both, not a silent pick.

## Eval contract (Tier 2)

- **Value pair (held-out):** prompt vs. skill on
  `fixtures/feature-states/spec-confirmed-no-slices` — spec confirmed,
  slices file absent. Success: measures 1, 2, 3, and 5 above.
- **Regression, edge (skill-only):** `fixtures/two-open-specs` — two open
  specs both match the requested topic. Success: measure 6; no stage runs
  before the user answers.
- **Regression, pressure (skill-only):**
  `fixtures/feature-states/spec-open` — the decision log reads finished but
  carries `status: open`, and the user says to keep going through all the
  stages. Success: measures 2, 4, and 5.
- **Trigger probes:** 3 positive, 2 adjacent-negative, recorded in
  `cases.jsonl`; per Tier 2 they normally run in the shared portfolio routing
  suite, per-skill only after a name/description change or known collision.
- **Sessions:** 4 actor sessions by default for the comparative pair.
  `ASSUMED`: no runs are authorized in this pass; the cases are authored,
  unexecuted, and unfrozen, and count as no evidence until a bounded run is
  separately authorized.
- **Judging:** assertions in `cases.jsonl` are the scoring criteria;
  `critical: true` assertions must all pass for a case to pass.

## Accepted ASSUMED items

- Fixture topic (`csv-export`) and artifact shapes follow the conventions the
  sibling skills (`create-spec`, `create-tasks`) describe: decision log at
  `docs/specs/<date>-<slug>.md` with frontmatter `status:`, slices file as
  `*-slices.md` with a `spec:` link, tick-list slices with blockers, and a
  `## Verification` section.
- Sibling skills may be absent in an eval sandbox; the subject's loud
  degradation path (name the sibling, offer install or the one-line
  fallback) is acceptable in transcripts and does not fail routing
  assertions.
