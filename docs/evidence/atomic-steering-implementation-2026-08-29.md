# Atomic steering implementation report

**Date:** 2026-08-29  
**Strategy source:** [Addy Osmani comparison](addyosmani-agent-skills-comparison-2026-08-29.md)

**Evidence correction — 2026-09-04:** Behavioral counts for ground-rules, TDD, the persona, and nine Phase-6 workflows lack raw audit artifacts. They remain UNVERIFIED historical observations. The preserved improve-prompt and be-concise verdicts can be reproduced. Counts and language metrics below describe the recorded revision, not later corrected subjects.

## Outcome

Phases 1–6 of the recommended strategy are implemented. The repository now combines a clear layer model, atomic authoring rules, one structurally checked persona, catalog-wide routing, and short instructions across every active skill.

## What changed

| Phase | Result | Evidence |
|---|---|---|
| Architecture | Added repo-scoped `AGENTS.md`, a public five-layer map, README integration, and a four-sentence baseline identity | `AGENTS.md`, `docs/toolbox-anatomy.md`, `ground-rules/ground-rules.md` |
| Authoring contract | Removed word minimums and universal sections; added atomic instructions, standalone completion gates, style warnings, and a persona template | `skills/create-skill/`, `scripts/skills.mjs` |
| Language pilot | Rewrote ground rules, improve-prompt, and TDD; behavioral preservation remains unverified where raw evidence is missing | current skill files and results below |
| Persona | Added one thin evidence-led reviewer, structural validation, direct and fallback probes | `agents/`, `scripts/validate-personas.mjs` |
| Routing | Added one case file per active skill, one declared behavior case each, collision reporting, a deliberately broken-description test, and CI execution | `evals/cases/`, `scripts/route-skills.mjs` |
| Catalog rewrite | Rewrote the ten remaining metric failures and recorded one reported behavioral regression per skill | `docs/evidence/phase6-atomic-rewrite-2026-08-29.md` |

## Language result

| Artifact | Before | After | Reduction | Median instruction unit | Units over 30 words |
|---|---:|---:|---:|---:|---:|
| ground-rules | 535 words | 416 words | 22.2% | 6 | 0% |
| improve-prompt | 604 words | 545 words | 9.8% | 8 | 0% |
| tdd | 2,212 words | 1,358 words | 38.6% | 8 | 0% |
| **Pilot total** | **3,351** | **2,319** | **30.8%** | — | — |

The pilot exceeds the 20% reduction gate. All three artifacts meet the diagnostic target of a median at or below 12 words and fewer than 2% long instruction units. Word counts use whole files; style metrics use the repository's instruction-unit heuristic.

The revised `create-skill` body is below 2,000 words with an 11-word median and no instruction units over 30 words.

Phase 6 reduced the ten selected bodies from 12,659 to 10,926 words. Every active skill now has a median instruction unit at or below 12 words and fewer than 2% over 30 words. See [the Phase 6 evidence](phase6-atomic-rewrite-2026-08-29.md).

## Behavioral evidence

| Subject | Recorded result | Claim boundary |
|---|---|---|
| ground-rules | UNVERIFIED reported 18/18 | Raw audit artifacts unavailable; prior pilot retained for its recorded subject |
| improve-prompt | SHIP, 16/16 checks, 3 sessions, 47,028 tokens | Explicit invocation on the recorded Codex route |
| tdd | UNVERIFIED reported 16/16 | Raw audit artifacts unavailable; prior comparison retained for its recorded subject |
| evidence-led-reviewer | UNVERIFIED reported 6/6 direct and 6/6 fallback | Raw audit artifacts unavailable; structural validation is independently runnable |

**Update — 2026-09-07:** after review restorations to the tdd subject (repeat gate, Genuine Exceptions), its three frozen cases were rerun fresh and verified: 16/16 PASS with preserved raw reports, scores, and workspaces. See `skills/tdd/evals/results/atomic-restore-2026-09-07/`.

Detailed results:

- `ground-rules/evals/results/atomic-rewrite-2026-08-29.md`
- `skills/improve-prompt/evals/results/README.md`
- `skills/tdd/evals/results/atomic-rewrite-2026-08-29.md`
- `agents/evals/results/evidence-led-reviewer-2026-08-29.md`

## Portfolio checks

- Structural validation: 18 entries clean.
- README coverage: every current entry linked.
- Routing: 51/51 positive prompts rank first; 17/17 active skills covered.
- Persona validation: one persona clean; validator positive and negative controls pass.
- Routing negative control: a deliberately misrouted description fails the preflight.
- JavaScript syntax and `git diff --check`: pass.

The prose validator reports no warnings. Phase 6 closed the measured legacy backlog without changing the warnings into release failures.

## Next step

Use measured behavioral failures to drive later edits. Re-run affected evidence whenever behavior changes.

Do not add more personas until a distinct perspective proves a distinct useful artifact. Do not raise the routing preflight into a claim about autonomous model triggering.
