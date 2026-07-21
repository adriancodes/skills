---
topic: Shape of the skills toolbox repo and the design of its first skill, interrogate
status: confirmed
started: 2026-07-03
---

# Interrogation: toolbox and interrogate

## Branches

- [x] Repo purpose
- [x] Distribution channels
- [x] Plugin granularity
- [x] Seeding strategy
- [x] First skill selection
- [x] Skill architecture
- [x] Skill naming
- [x] Improvements over the original
- [x] Invocation axis
- [x] Decision-log location
- [x] Repo and plugin identity

## Decisions

1. **Repo purpose** — Personal toolbox, published (mattpocock/skills-style, not a framework). _Why:_ lowest friction; a theme can emerge later.
2. **Distribution** — Dual-channel: skills CLI + Claude Code plugin, mirroring skillforge's packaging. _Why:_ packaging solved once already; covers all consumers.
3. **Granularity** — One plugin containing all skills. _Why:_ zero per-skill packaging overhead; cherry-picking is served by the skills CLI.
4. **Seeding** — Scaffolding first, then named skill ideas, then mining repeated workflows. _Why:_ prove the pipeline before filling it.
5. **First skill** — An improved, original descendant of grill-with-docs. _Why:_ user request; daily-driver workflow worth owning.
6. **Architecture** — Self-contained skill, soft references only (see ADR-0001). _Why:_ consumer DX wins over author DX; cherry-picked skills must work alone.
7. **Naming** — `interrogate`; toolbox voice is literal single verbs; never collide with installed third-party skill names. _Why:_ user preference over the recommended `depose`.
8. **Improvements** — Structured question UI, exit gate + branch tracking, incremental decision log, scenario stress-tests. _Why:_ each fixes a weakness observed while running the original chain live.
9. **Invocation** — Model-invoked with tight triggers and negative boundaries. _Why:_ discoverable by consumers who don't know the skill exists.
10. **Log location** — `docs/interrogations/<date>-<slug>.md`; glossary stays `CONTEXT.md`, ADRs stay `docs/adr/` for interop. _Why:_ user preference — the directory self-advertises the skill.
11. **Identity** — Repo `adriancodes/skills`, plugin `toolbox` (`/plugin install toolbox@skills`). _Why:_ the install command reads naturally and matches the glossary term.
12. **Skill name** — `distill`. Supersedes #7. _Why:_ the user reframed the skill as requirements distillation ("we're really requirements gathering… teasing out or distilling the requirements") and confirmed the name: "yeah that a good name for it." (2026-07-06)
13. **Log location** — `docs/distillations/<date>-<slug>.md`. Supersedes #10. _Why:_ #10's rationale was that the directory self-advertises the skill, so the directory follows the rename.
14. **Naming convention** — Names are the shortest literal word for the deliverable: skills `spec` (supersedes #12) and `verify`, layer `discipline`, logs in `docs/specs/` (supersedes #13). _Why:_ user: "I don't want to get cutesy with our skill names… name things exactly as they are" and "I just want a shorter name to have to execute"; confirmed "ok" to spec/verify/discipline. (2026-07-08)
15. **Naming convention, refined** — Short descriptive verb–object names, 1–4 words: `spec-plan`, `verify-work`, layer `work-discipline`; logs stay in `docs/specs/`. Supersedes #14's single-word form; the literal/no-metaphor rule stands. _Why:_ user: "I want a short descriptive name one to four words," picked the two-word option. (2026-07-08)
16. **Audience & README shape** — Audience is the author plus his engineering team; README mirrors mattpocock/skills: quickstart first, skills grouped by intention (Planning / Quality / Always-on), entries under 20 words with invocation marked, no fluff. _Why:_ user: "these skills are for engineers too and I also want to share them with my team… mirror my repository on the same principles." (2026-07-08)
17. **Developer-friendliness additions** — Four improvements beyond the mattpocock pattern: evidence blocks (docs/evidence/), per-skill install smoke tests, CHANGELOG + version-pinning guidance, and a "which skill when" decision table. Deferred: CI validation, CONTRIBUTING.md — until publish/contributors. _Why:_ user picked 1–4 from the improvement assessment. (2026-07-08)
18. **skill-creator import** — Skillforge's skill copied in as `skills/skill-creator/` (name per explicit user instruction, accepted exception to #15's verb–object form); internal references to the upstream Anthropic `skill-creator` plugin disambiguated to avoid self-reference. _Why:_ user: "bring in this skill into this repo (copy it and call it skill-creator." (2026-07-08)

## Assumptions

- ASSUMED: MIT license — matches skillforge.
- ASSUMED: `interrogate` classified as a workflow skill with a bulletproofed exit gate.
- ASSUMED: generation follows skillforge's full phase sequence, including baseline probe and dry-run eval.

## Deferred

- Which skills come after `interrogate` (mining repeated workflows).
- Versioning/release scheme for the toolbox.
- Category-level skill directories (`skills/<category>/<name>/`, Matt-style) — revisit when the skill count makes flat `skills/` hard to scan.

## Confirmation

"Confirmed — build it." — 2026-07-04
