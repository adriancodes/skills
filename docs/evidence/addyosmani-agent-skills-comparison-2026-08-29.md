# Addy Osmani `agent-skills` compared with Adrian's toolbox

**Research date:** 2026-08-29  
**Upstream snapshot:** [`addyosmani/agent-skills@d2c37ef`](https://github.com/addyosmani/agent-skills/tree/d2c37ef6225dd8726cdd369a8030307f48592d26)  
**Local snapshot:** [`adriancodes/skills@84399e7`](https://github.com/adriancodes/skills/tree/84399e7f04e1b906d8b2d6966ae482ec6e1754a2)

## Executive judgment

Addy's repository has the clearer product surface. It explains its parts in one mental model, writes instructions as small behavioral units, separates personas from workflows, and runs catalog-wide routing checks in CI. Adrian's toolbox has the stronger engineering core: stricter authority boundaries, self-contained skills, consequence-scaled evaluation, prompt-vs-skill comparisons, and more disciplined evidence claims.

The right strategy is not to copy Addy's skills. Copy the interface and writing discipline; keep Adrian's evidence model. In shorthand:

> **Addy's shell + Adrian's engine.**

The user's language observation is correct, with one important qualification: Addy's files are not shorter. They are easier to follow because each sentence or list item does less.

## Scope and method

This comparison covers repository structure, instruction language, agent/persona framing, skill organization, validation, evals, portability, and public presentation. Claims about Addy's repository use its source, documentation, or executable validators at the pinned commit. Local claims cite this repository at its pinned commit or use repo-relative links.

I cloned the upstream snapshot and ran:

```text
node scripts/validate-skills.js
node scripts/run-evals.js --min-rank1 80
```

The structural validator passed all 25 skills. The deterministic eval runner passed 136 checks and reported an 86% trigger rank-1 rate (72/84 positive prompts).

I also ran the local checks:

```text
node scripts/skills.mjs check
node scripts/skills.mjs readme --check
```

Both passed: 18 entries were structurally clean and the README linked every current entry.

### Language measurement

For a reproducible directional comparison, I stripped YAML frontmatter, headings, fenced code, blank lines, and Markdown list markers from every `SKILL.md`. I split the remaining text at sentence endings and line boundaries, then counted word tokens in each resulting instruction unit. This is a style heuristic, not a readability score.

| Measure | Addy | Adrian |
|---|---:|---:|
| Skills | 25 | 17 |
| Total `SKILL.md` words | 51,559 | 26,225 |
| Mean words per skill | 2,062 | 1,543 |
| Mean words per instruction unit | **10.9** | 13.7 |
| Median words per instruction unit | **9** | 13 |
| Units at 12 words or fewer | **67.7%** | 49.5% |
| Units above 30 words | **1.6%** | 3.1% |

Addy's average skill is 34% larger, but its median instruction is four words shorter. The perceived simplicity comes from **granularity**, not from less content.

## Side-by-side assessment

| Dimension | Addy | Adrian | Better direction |
|---|---|---|---|
| Product model | Five named layers with one-word jobs | Toolbox, optional pipeline, ground rules, and evidence are explained separately | Adopt one layer map |
| Skill language | Short commands, questions, examples, and checklists | Strong rules, often packed into dense multi-clause sentences | Rewrite into atomic behavioral units |
| Persona layer | Four specialist personas with explicit composition rules | No reusable `agents/` layer; no root `AGENTS.md` | Add both, but keep them small |
| Global behavior | `using-agent-skills` meta-skill supplies routing and operating behavior | `ground-rules` supplies calibrated authority, communication, and verification | Keep `ground-rules`; add a short identity and router |
| Skill authoring | Flexible section pattern; no minimum size; 500-line ceiling | Required sections, type-based word ranges, and a 2,500-word cap | Remove minimums; make sections conditional |
| Discoverability | Central intent map and catalog-wide lexical routing tests | Good trigger-only descriptions and per-skill cases, but no shared routing runner in CI | Add central routing preflight plus real trigger probes |
| Behavioral evidence | One behavioral case per skill; token-based runs are on demand | Risk-tiered comparisons, pressure cases, blinded judging, budgets, and claim limits | Preserve Adrian's model |
| CI | Structure, routing, links, commands, artifact paths, manifests, plugin install | Structure and README linkage | Expand local CI with cheap portfolio checks |
| Portability | Broad tool integrations, but shared root references break per-skill installs | Skills are deliberately self-contained and harness-neutral | Preserve Adrian's design |
| Review quality | Broad five-axis checklist, nits, optional comments, required praise | Findings must survive falsification and show a concrete consequence | Adrian is stronger; expose it through a persona |

## 1. Why Addy's structure feels coherent

Addy's strongest documentation move is a five-layer mental model:

| Layer | Job |
|---|---|
| Skills | How |
| Personas | Who |
| Commands | When |
| References | What to check |
| Evals | Does it work |

That mapping appears in the first substantive section of the [developer onboarding guide](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/docs/developer-onboarding.md#L9-L24). The README then presents the library as a development lifecycle—Define, Plan, Build, Verify, Review, Ship—and maps nine commands to it ([README lines 11–40](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/README.md#L11-L40)). A user can understand the whole repository before reading a skill.

Adrian's README is good at helping users choose an individual skill and explains the optional five-skill pipeline ([local README](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/README.md#L19-L43)). It does not give every artifact a distinct job. `ground-rules`, skills, evidence, specs, ADRs, and plugin packaging are individually documented, but users must infer how they compose.

### Recommendation

Add one short `docs/toolbox-anatomy.md` and reflect its table in the README:

| Layer | Location | Job |
|---|---|---|
| Ground rules | `ground-rules/` | Always-on operating behavior |
| Skills | `skills/` | Task workflows—the how |
| Personas | `agents/` | Perspective and report contract—the who |
| Entry points | native skill invocation / future commands | User intent—the when |
| Evidence | root portfolio evals + per-skill evals | Whether it works |

Do not invent command directories merely to make the diagram symmetric. Add commands only where a repeated composition genuinely saves user effort.

## 2. Why Addy's language steers behavior more directly

Addy's authoring guide says “Steps, not facts,” favors a concrete command over vague advice, requires evidence, and deletes sections that do not change behavior ([writing principles](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/docs/skill-anatomy.md#L122-L128)). The `using-agent-skills` meta-skill demonstrates the style:

- “STOP. Do not proceed with a guess.”
- “Name the specific confusion.”
- “Wait for resolution before continuing.”
- “You are not a yes-machine.”
- “Touch only what you're asked to touch.”

See [confusion management](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/skills/using-agent-skills/SKILL.md#L63-L84) and [scope discipline](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/skills/using-agent-skills/SKILL.md#L97-L108). Each line carries one decision. Headings name familiar behavior. Good/bad examples make the desired move easy to imitate.

Adrian's toolbox already knows this theory. Its behavioral-force guide says “command, don't suggest,” uses verb-first rules, and recommends concrete anchors and complete examples ([local guide](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/skills/create-skill/references/behavioral-force.md#L1-L45)). The authoring registry also requires imperative force, positive specification, examples, anchors, positioning, and leading words ([rule registry](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/skills/create-skill/references/rules.md#L70-L80)).

The gap is between the authoring theory and the produced documents. Three current rules push prose toward density:

1. Type-based word **ranges** create a floor as well as a ceiling: 500–800 words even for a simple technique and at least 1,000 for a standard workflow ([word targets](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/skills/create-skill/references/rules.md#L9-L20)).
2. Seven sections are mandatory for nearly every skill ([required sections](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/skills/create-skill/references/rules.md#L138-L145)).
3. Every workflow step must end with a demanding completion criterion ([step rules](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/skills/create-skill/references/rules.md#L120-L129)). The criterion is useful, but authors often pack the action, exceptions, rationale, and `Done when` gate into one paragraph.

The blanket ban on second person also removes a useful direct voice from global behavior and persona files ([behavioral-force voice rule](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/skills/create-skill/references/behavioral-force.md#L7-L20)). Keep verb-first imperatives in workflow skills, but allow “you” in personas and always-on identity text.

### Before and after

Current style from the ground rules:

> Longer answers open with an information-dense summary — outcome, key decisions, important risks, required next steps — complete enough to act on by itself. Supporting reasoning and technical depth follow the summary for readers who want them; never bury the answer under them.

The same behavior in atomic steering language:

> Lead with the answer. For long replies, name the outcome, decisions, risks, and next steps first. Put supporting reasoning after that. Never bury the answer.

No rule was lost. The model receives four actions instead of one compound paragraph. The current ground rules already use strong short anchors such as “Answer in layers,” “Complete the requested outcome,” and “Act immediately” ([ground rules](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/ground-rules/ground-rules.md#L14-L50)); the rewrite should make the surrounding explanation match them.

### Authoring changes

Change `create-skill` so it produces simpler language by default:

- Remove minimum word counts. Keep a ceiling only.
- Make only `Scope`, the core workflow/rules, and verification mandatory. Add mistakes, failure modes, tool guidance, and rationalization tables only when the skill needs them.
- Write one behavioral decision per sentence or bullet.
- Put rationale in the next sentence, not inside the command.
- Put `Done when …` on its own line.
- Allow direct second person in persona and global-behavior files.
- Add a non-blocking prose metric to the validator: median instruction unit, share over 30 words, and total body words. Use it to find drift, not to reward chopped-up prose.

## 3. Personas: what Addy has, and what it does not

There are two easily confused artifacts upstream:

1. Root [`AGENTS.md`](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/AGENTS.md#L1-L8) configures agents working **on Addy's repository**. It is not a reusable persona; the onboarding guide says so explicitly ([scope caveat](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/docs/developer-onboarding.md#L21-L28)).
2. `agents/*.md` contains four reusable specialist personas: code reviewer, security auditor, test engineer, and web-performance auditor ([persona catalog](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/docs/agents.md#L1-L18)).

Addy does **not** ship one universal personality. Each persona has one role, one perspective, an output format, rules, and a final composition block. Personas may use skills; they do not invoke other personas. The user or a command orchestrates them ([persona rules](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/docs/agents.md#L85-L103)).

Adrian's repository has neither a root `AGENTS.md` nor reusable persona files. The current glossary even says not to call the ground rules a persona ([local context](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/CONTEXT.md#L27-L32)). That distinction is sound: ground rules are behavior; a persona is perspective. The missing piece is a separate persona layer, not a rename of `ground-rules`.

### Recommendation

Add three small pieces, in this order:

1. **Root `AGENTS.md`:** repo-scoped guidance for agents maintaining this toolbox. Point to `CONTRIBUTING.md`, the authoring registry, structural checks, and evidence rules. State clearly that it is not shipped behavior.
2. **Baseline identity in `ground-rules`:** four sentences at most: pragmatic senior engineer; protect user intent and existing work; prefer the smallest complete change; verify before claiming completion. This supplies a stable “who” without a new installation mechanism.
3. **One specialist persona:** `agents/evidence-led-reviewer.md`, backed by the existing `code-review` skill. Give it one perspective, one findings-first output contract, and one composition block. Add more personas only after this one earns its context and maintenance cost.

The first persona can be better than Addy's reviewer immediately. Addy's reviewer checks five generic axes, includes Optional and Nit sections, and requires at least one positive observation ([review persona](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/agents/code-reviewer.md#L10-L57), [output and rules](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/agents/code-reviewer.md#L59-L96)). Adrian's `code-review` skill instead falsifies candidates, removes style noise and speculation, and reports findings first with concrete consequences ([local evidence gate](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/skills/code-review/SKILL.md#L124-L170)). The persona should expose that stronger workflow, not replace it with a generic checklist.

## 4. Skill organization and progressive disclosure

Addy's rule is simple: `SKILL.md` is required; scripts and references are optional. It recommends supporting files only when material exceeds 100 lines, scripts are needed, or a checklist is long enough to earn a separate file ([skill anatomy](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/docs/skill-anatomy.md#L3-L16), [supporting files](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/docs/skill-anatomy.md#L87-L96)). Twenty-one of its 25 skill directories contain only `SKILL.md`.

Adrian's 17 skills all have an `evals/` directory. Five have runtime references, one has a script, and one has an asset. This is appropriate because evals are development evidence, not runtime context. The runtime side is already restrained.

Do not copy Addy's root-level shared-reference pattern. Addy deliberately centralizes shared checklists, but acknowledges that a one-skill install then loses those references ([known portability gap](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/docs/skill-anatomy.md#L97-L103); [README warning](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/README.md#L61-L66)). Adrian's self-contained, soft-reference, harness-neutral rules are stronger and should remain ([local contribution rules](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/CONTRIBUTING.md#L15-L22)).

## 5. Validation and evals

Addy's main operational advantage is one catalog-wide eval contract:

- Tier 1: structural validation in CI.
- Tier 2: deterministic trigger ranking and description-collision checks in CI.
- Tier 3: on-demand behavioral execution graded against expectations.

The design and its limitation are explicit: Tier 2 uses stemmed TF-IDF and cannot judge semantics ([eval tiers](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/evals/README.md#L9-L31)). Every skill must have at least three positive prompts, two negatives, and one behavioral case ([case requirements](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/evals/README.md#L65-L73)). CI runs structure, routing, link, command-parity, manifest, and plugin-install checks ([workflow](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/.github/workflows/test-plugin-install.yml#L9-L99)).

Adrian's evaluation design is deeper. It selects a consequence tier, compares the skill against the strongest realistic prompt, preserves raw evidence, bounds token cost, separates triggering from body compliance, and limits claims to the tested route ([local evaluation tiers](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/skills/create-skill/references/rules.md#L47-L57), [comparative requirements](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/skills/create-skill/references/rules.md#L198-L217)). The repository also preserves uncomfortable results instead of laundering them; for example, `diagnose` remains `ITERATE` after exceeding its budget despite strong observed behavior ([diagnose evidence](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/skills/diagnose/evals/results/README.md#L1-L12)).

The weakness is operational consistency. Current CI runs only structural and README checks ([local workflow](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/.github/workflows/check.yml#L1-L11)). Trigger cases exist per skill, but the promised shared portfolio routing suite is not present as one executable root command. Deep evidence is available, yet the cheap catalog-health loop is missing.

### Recommendation: two eval surfaces

Keep both, with different jobs:

```text
evals/                         # cheap portfolio health, always in CI
  cases/<skill>.json           # 3+ positive, 2+ negative, 1 declared behavior case
  fixtures/
  run-routing.mjs              # lexical preflight, collision report, coverage

skills/<name>/evals/           # risk-scaled proof, run when that skill changes
  cases.jsonl
  fixtures/
  results/
  scorer/runner when needed
```

The root runner should be zero-dependency and honest: call lexical ranking a preflight, not autonomous-trigger proof. Preserve actual installed-harness trigger probes for release evidence. This combines Addy's fast feedback with Adrian's stronger epistemic standard.

## 6. What not to copy

1. **Do not copy Addy's length.** Four upstream skills exceed Adrian's 2,500-word cap. Simple syntax does not justify a larger runtime payload.
2. **Do not adopt “use a skill at even 1% chance.”** Addy's repo-scoped `AGENTS.md` uses that threshold and forbids direct implementation whenever a skill applies ([execution model](https://github.com/addyosmani/agent-skills/blob/d2c37ef6225dd8726cdd369a8030307f48592d26/AGENTS.md#L42-L60)). That can over-trigger process for small work. Adrian's “no skill for a quick factual question” and optional pipeline are better calibrated ([local README](https://github.com/adriancodes/skills/blob/84399e7f04e1b906d8b2d6966ae482ec6e1754a2/README.md#L19-L43)).
3. **Do not turn personas into duplicated skills.** A persona supplies perspective and output shape. The skill owns the workflow and evidence rules.
4. **Do not centralize runtime references.** Preserve per-skill installability.
5. **Do not treat lexical routing as behavioral evidence.** It is a cheap regression detector only.
6. **Do not require praise, nits, or generic checklist coverage.** Preserve evidence-led reporting.

## 7. Prioritized implementation strategy

### Phase 1 — Make the architecture legible

Smallest useful change:

- Add root `AGENTS.md` for repository maintenance.
- Add `docs/toolbox-anatomy.md` with the five-layer map.
- Update the README with that map and an `agents/` section.
- Add the four-sentence baseline identity to `ground-rules`.

**Exit gate:** a new contributor can answer “where does this rule belong?” from one table.

### Phase 2 — Fix the generator before rewriting the portfolio

Change `create-skill` and its validator:

- no minimum word counts;
- conditional sections instead of seven universal sections;
- one action per sentence or bullet;
- standalone `Done when` lines;
- second person allowed for personas and global identity;
- prose metrics reported as warnings;
- a complete persona template with role, perspective, output, rules, and composition.

**Exit gate:** the generator no longer rewards bulk, and a new skill or persona naturally uses atomic instructions.

### Phase 3 — Pilot the language on three artifacts

Rewrite only:

1. `ground-rules` — global behavior;
2. `improve-prompt` — simple technique;
3. `tdd` — pressure-resistant discipline.

Keep all existing behavioral requirements. Measure tokens, instruction-unit length, and existing eval results before and after. A sensible initial target is a median instruction unit of 12 words or fewer and fewer than 2% above 30 words. Treat those as diagnostics; behavioral evals decide whether the rewrite ships.

**Exit gate:** equal or better behavior, no safety or authority regression, and at least 20% fewer body words across the pilot.

### Phase 4 — Add one persona

Add `agents/evidence-led-reviewer.md`. It should:

- adopt an evidence-led Staff Engineer perspective;
- invoke or embed a fallback for `code-review`;
- output findings first;
- refuse generic smells, praise quotas, and unsupported severity;
- end with a composition block;
- never orchestrate another persona.

Test direct invocation, false invocation, output compliance, and behavior with and without the `code-review` skill available.

**Exit gate:** the persona improves invocation and report consistency without duplicating the workflow.

### Phase 5 — Add the portfolio routing loop

- Create one root case file per skill.
- Add the zero-dependency routing/collision runner.
- Run it in CI with structural validation.
- Establish the baseline before setting a ratchet; never choose a passing threshold first.
- Keep real installed-trigger probes in release evaluation.

**Exit gate:** every skill has 3+ positive prompts, 2+ neighboring negatives, and no unexplained collision; CI detects a deliberately broken description.

### Phase 6 — Rewrite the remaining skills by measured payoff

Order the backlog by runtime cost and observed failures, not by alphabetical completeness. Likely first: `create-skill`, `code-review`, `diagnose`, `engineering-best-practices`, and `create-spec`, because they are the densest or shape downstream artifacts.

For each skill:

1. Freeze current behavior cases.
2. Split compound rules.
3. Delete repeated rationale and no-op prose.
4. Move deep reference material only when it is truly conditional.
5. Re-run the smallest evidence tier that can detect a regression.

**Exit gate:** the portfolio becomes simpler without weakening its evidence claims.

## 8. Definition of “as good or better”

The toolbox is better when all of these are true:

| Outcome | Target |
|---|---|
| Architecture | One public layer map; every artifact has one job |
| Language | Median instruction unit ≤12 words; long units are rare and justified |
| Runtime size | No word minimum; pilot bodies shrink ≥20% without behavior loss |
| Personas | At least one single-role, tested persona; no persona-to-persona routing |
| Routing | Every skill has realistic positive and neighboring negative cases |
| CI | Structure, references, catalog coverage, routing, and collisions run on every PR |
| Behavior | Current consequence-tier evidence remains green or is honestly marked `ITERATE` |
| Portability | Every individual skill still works when installed alone |
| Claims | Lexical, forced-load, and installed-trigger evidence remain explicitly distinct |

## Final recommendation

Start with the generator and the layer model, not a mass rewrite. The root cause is not that Adrian lacks behavioral principles; those principles already exist. The root cause is that the authoring contract rewards completeness through word ranges, mandatory sections, and densely packed completion gates, while the repository lacks a first-class persona layer and a cheap portfolio routing loop.

Fix those three forces. Then simplify three representative artifacts under frozen evals. If they improve, roll the pattern through the rest of the toolbox. That produces Addy's clarity without giving up Adrian's stronger evidence, portability, and safety discipline.
