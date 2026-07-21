---
topic: Two skills completing the plan→build pipeline — spec slicing and no-interview spec synthesis — plus two conventions from the mattpocock v1.1 review
status: confirmed
started: 2026-07-08
---

# Spec: pipeline skills

## Branches

- [x] Gap analysis — what the toolbox is missing (from the mattpocock/skills v1.1 review)
- [x] Slicing skill shape
- [x] Synthesis skill shape
- [x] Conventions — deprecation and artifact re-homing

## Decisions

1. **The gap** — The toolbox covers plan (`spec-plan`) and verify (`verify-work`) but nothing turns a confirmed spec into executable work, and nothing writes a spec from a conversation that already contains the answers. _Why:_ v1.1 review; user: "yes exactly I knew I was missing something." (2026-07-08)
2. **`slice-spec`** — Breaks a confirmed spec (or conversation) into tracer-bullet vertical slices — each cutting through every layer, demoable alone, sized to one fresh agent context window, with explicit blocked-by edges. Output: `docs/specs/<date>-<slug>-slices.md` next to the spec it derives from. Model-invoked. Category: Planning. (2026-07-08)
3. **`capture-spec`** — Synthesizes the current conversation into the same decision-log format `spec-plan` produces, asking zero questions during synthesis; undiscussed points become explicit ASSUMED or Deferred entries, never silent inventions; one read-back gate at the end (stated is not confirmed applies even to synthesis). Soft-references `spec-plan` for when the answers aren't actually in the conversation. Model-invoked. Category: Planning. (2026-07-08)
4. **Conventions adopted** — (a) Skills get deprecated into a `skills/deprecated/` directory with a successor pointer, never deleted (teams pin versions); recorded now, applied when first needed. (b) A target repo's CLAUDE.md may re-home the artifact paths (`docs/specs/`, `docs/adr/`, `CONTEXT.md`); skills check for such a pointer before using defaults. _Why:_ mattpocock v1.1 practices (deprecated/ dir; tracker-doc indirection commit). (2026-07-08)
5. **Method** — Both skills built with `skill-creator`: baseline probes before drafting, behavioral-force levers, adversarial dry-run after. Baselines target Opus 4.8 per toolbox convention. (2026-07-08)

## Assumptions

- ASSUMED: names `slice-spec` and `capture-spec` under the verb–object convention (toolbox log #15); one message flips them.
- ASSUMED: slices live in local markdown (no issue-tracker plumbing) — the tracker integration mattpocock uses is out of scope until the team asks for it.

## Deferred

- An `implement`-analog skill (execution loop) — the pipeline's last third; revisit after slice-spec sees real use.
- Issue-tracker publication of specs/slices (wayfinder-shaped multi-session mapping).

## Verification

Baseline probes (Opus 4.8, no skills): decomposition produced 8/8 horizontal layer-tasks, 2 unbounded, zero dependency edges, chat-only — five rationalizations captured verbatim into slice-spec's table. Synthesis baseline was strong (zero interviewing, gaps flagged) but produced no file, no provenance marking, no gate — capture-spec targets exactly those.

Dry-run evals (skill loaded, same scenarios): slice-spec produced 4 tracer-bullet slices, parallel edges, a file, and a confirmation-gated ending; capture-spec produced 0 pre-gate questions, all three trap topics routed to Deferred, grouped read-back. Three textual findings, all patched: capture-spec's "without landing in the read-back" clause licensed product-shaping ASSUMEDs (now mandatory-Deferred); slice-spec's example modeled a schema-only slice its own body forbids (rewritten); the "or states why" escape hatch in its success criteria (tightened to work-genuinely-has-one-layer). Residual, named honestly: the three patches implement the auditors' own patch directions but were not re-probed by a fresh agent.

## Confirmation

"yes exactly I knew I was missing something. can you create those skills using the skill-creator?" — 2026-07-08
