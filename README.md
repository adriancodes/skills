<p align="center">
  <img src="./logo.png" alt="Skills logo" width="640">
</p>

# Skills

Practical agent skills for planning, building, and shipping software.

The focus is reliable process under pressure: self-contained instructions, reproducible handoff files, and evidence that states its limits.

## Quickstart

```bash
npx skills add adriancodes/skills
```

Choose the skills you want during installation. Each works independently in any harness supported by the [skills CLI](https://github.com/vercel-labs/skills).

## How the toolbox fits together

| Layer | Job |
|---|---|
| [`ground-rules`](ground-rules/ground-rules.md) | Always-on operating behavior |
| [`skills`](skills/) | Task workflows: the **how** |
| [`agents`](agents/) | Specialist perspective and output contracts: the **who** |
| Native invocation | User intent: the **when** |
| `evals/` | Routing and behavioral evidence |

See [Toolbox Anatomy](docs/toolbox-anatomy.md) for composition and placement rules. Repository-level `AGENTS.md` configures contributors; it is not installed user behavior.

## Which skill, when

| You're about to… | Reach for |
|------------------|-----------|
| Generate non-obvious options for an open decision | [`explore-options`](skills/explore-options/SKILL.md) |
| Define, challenge, or record a software plan | [`create-spec`](skills/create-spec/SKILL.md) |
| Turn a confirmed spec into work items | [`create-tasks`](skills/create-tasks/SKILL.md) |
| Build the next task | [`implement-task`](skills/implement-task/SKILL.md) |
| Build or fix behavior test-first | [`tdd`](skills/tdd/SKILL.md) |
| Take a feature end-to-end (or resume one) | [`deliver-feature`](skills/deliver-feature/SKILL.md) |
| Run an agent on a schedule, safely | [`build-loop`](skills/build-loop/SKILL.md) |
| Understand an unfamiliar repository | [`understand-codebase`](skills/understand-codebase/SKILL.md) |
| Diagnose a bug, flake, or regression | [`diagnose`](skills/diagnose/SKILL.md) |
| Review a branch, PR, or work-in-progress diff | [`code-review`](skills/code-review/SKILL.md) |
| Apply maintainability and design guidance | [`engineering-best-practices`](skills/engineering-best-practices/SKILL.md) |
| Remove unnecessary code or abstractions | [`simplify-code`](skills/simplify-code/SKILL.md) |
| Ship a script, config, or skill | [`verify-work`](skills/verify-work/SKILL.md) |
| Write or fix an agent skill | [`create-skill`](skills/create-skill/SKILL.md) |
| Sharpen a vague ask before running it | [`improve-prompt`](skills/improve-prompt/SKILL.md) |
| Check you understand changes before shipping them | [`quiz-changes`](skills/quiz-changes/SKILL.md) |
| Get short plain answers, not essays | [`be-concise`](skills/be-concise/SKILL.md) |
| Everything, all session long | [`ground-rules`](ground-rules/ground-rules.md) (always-on layer) |
| Ask a quick factual question | No skill — just ask |

Five skills form an optional pipeline: `create-spec` → `create-tasks` → `implement-task` → `verify-work`, coordinated by `deliver-feature`. They hand work between sessions and teammates through files in `docs/specs/`. Each skill also works independently. An end-to-end request continues through authorized, unblocked work; an explicit one-stage or one-task request stops at that boundary. Task planning supports vertical feature slices and compatibility-preserving wide refactors.

The October 2026 quality pass covers all seventeen skills: a [four-skill outcome comparison](evals/pocock-comparison-2026-10-04/README.md) and [thirteen-skill structural consolidation](evals/remaining-skills-2026-10-04/README.md). The reports preserve both gains and validation gaps; shorter instructions alone do not establish better results.

## Agent personas

[`evidence-led-reviewer`](agents/evidence-led-reviewer.md) adopts a Staff Engineer review lens and uses `code-review` for its workflow. Personas own perspective and output shape; skills own process. See [Agent Personas](docs/agents.md).

Select a persona through a harness that supports agent definitions. Otherwise, load its file as the role or subagent instructions; the linked skill still installs independently through the skills CLI.

## Ground Rules

[`ground-rules`](ground-rules/ground-rules.md) is an optional always-on behavior layer, not an installable skill. Copy it into Claude Code as an output style:

```bash
mkdir -p ~/.claude/output-styles
cp ground-rules/ground-rules.md ~/.claude/output-styles/
```

For other agents, add its contents to the agent's project instructions.

## Updating from an older install

Re-run `npx skills add adriancodes/skills` to fetch the current versions. Skills have been renamed across releases (`spec-plan`→`create-spec`, `slice-spec`→`create-tasks`, `implement-slice`→`implement-task`, `ship-feature`→`deliver-feature`, `tldr`/`brevity`→`be-concise`, `diagnosing-bugs`→`diagnose`), and the installer does not remove old-name copies — they will shadow the current skills. Clean them with the migration script (dry-run by default; `--apply` moves stale copies to a recoverable `.migrate-trash/` dir — nothing is ever deleted — and only when the replacement is already installed):

```bash
curl -fsSL https://raw.githubusercontent.com/adriancodes/skills/main/scripts/migrate-install.mjs | node -          # report
curl -fsSL https://raw.githubusercontent.com/adriancodes/skills/main/scripts/migrate-install.mjs | node - --apply  # move to trash
```

If you installed the always-on layer under its old name, replace it: `rm ~/.claude/output-styles/work-discipline.md` and copy `ground-rules/ground-rules.md` per the Ground Rules section. Then restart your agent session so skill descriptions reload, and read the [CHANGELOG](CHANGELOG.md) — updates change agent behavior.

## Verify your install

Model-invoked skills can fail silently when their triggers do not fire. These checks cover the main workflows:

- **create-spec** — say *"stress-test my plan to add search to the app."* Pass: exactly one question arrives, with a recommended answer, and `docs/specs/<date>-*.md` appears. Fail: a batch of questions, or code.
- **verify-work** — point at any small script and say *"is this ready to ship?"* Pass: fixture files get written and executed. Fail: a verdict from reading the code.
- **ground-rules** — give it an ambiguous task. Pass: it offers compact numbered options, recommends a sensible default, and allows a custom answer. Fail: it guesses instead of asking.

## For teams

The planning and delivery skills write shared artifacts into your repository so work can survive the session that created it:

- `docs/specs/` — one decision log per spec session, read back and confirmed before building
- `CONTEXT.md` — glossary entries captured when terminology needs clarification
- `docs/adr/` — optional records for consequential architecture decisions

Everyone on the team runs the same install; the artifacts become the team's paper trail.

**Pin your version.** A skill update changes your whole team's agent behavior — treat it like a dependency upgrade. Pin to a commit or tag and read the [CHANGELOG](CHANGELOG.md) before moving.

## License

MIT — see [LICENSE](LICENSE). Every SKILL.md also carries `license: MIT` in its frontmatter, so a cherry-picked skill travels with its terms.

## Acknowledgements

Shout-out to [Matt Pocock's skills collection](https://github.com/mattpocock/skills), [Ponytail](https://github.com/DietrichGebert/ponytail), and [Caveman](https://github.com/JuliusBrussee/caveman). Their approaches to practical engineering workflows, simpler code, and concise agent communication helped inspire this collection.
