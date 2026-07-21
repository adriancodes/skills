# The Rule Registry

Single source of truth for every invariant a skill is checked against. **Change a rule here and nowhere else.**

`SKILL.md` and `references/validation-checklist.md` cite this file for authoritative values. The guides (`description-guide.md`, `bulletproofing-guide.md`, `body-template.md`) explain *why* each rule exists — they must not restate the rules themselves. If a number or list appears in two files, this one wins.

Phase 6 loads this file alongside the validation checklist; the checklist's items resolve their values here.

## Word Targets

By skill type. Content beyond the target moves to `references/`.

| Skill Type | SKILL.md Target |
|-----------|-----------------|
| Simple technique | 500–800 words |
| Standard workflow | 1,000–1,500 words |
| Complex domain | 1,500–2,000 words |
| Discipline (with bulletproofing) | 1,500–2,500 words |

**Hard cap:** 2,500 words for any skill. No SKILL.md body exceeds this.

## Skill Types

Four types. Each maps to a word target above and, for discipline, to the Bulletproofing Requirements below.

| Type | One-line |
|------|----------|
| Technique | Concrete repeatable method |
| Discipline | Enforces rules under pressure |
| Reference | API docs, schemas, domain knowledge |
| Workflow | Multi-phase process with decision points |

## Confirmed Skill Brief

Complete this gate before scoping, opportunity testing, or drafting a new skill. For a behavior-changing edit, reconfirm the affected fields and preserve the rest. Read-only reviews may infer the brief from the artifact but must label ambiguity.

- [ ] Ask one adaptive, decision-changing question per turn
- [ ] For every creation or behavior-changing update, obtain at least one post-invocation answer before presenting the Skill Brief; brief confirmation does not count as that answer
- [ ] Offer 2–4 mutually exclusive choices with the recommended choice first, a one-line tradeoff for each, and a free-form Other path
- [ ] Confirm the problem, intended users/context, concrete use cases, 3–5 trigger examples, 2–3 non-triggers/non-goals, required behavior or artifacts, current failure modes, workflow boundaries, invocation, observable success, evidence tier, and cost tolerance
- [ ] Turn abstract answers into concrete examples before concluding the interview
- [ ] Mark every inference as `ASSUMED`; permit an interview waiver only for an explicit instruction such as “skip questions” or “use your judgment,” then read all assumptions back and obtain acceptance
- [ ] Treat requests for speed, efficiency, or only necessary questions as constraints on question quality, never as an interview waiver
- [ ] Restate the full Skill Brief and obtain explicit user confirmation or correction
- [ ] Trace the skill scope, opportunity cases, held-out cases, and success measures to confirmed brief fields

## Evaluation Tiers

Choose the highest applicable consequence tier before discovery cases. Uncertainty selects the higher tier. Evidence claims never exceed the recorded tier, harness, model, and date.

| Tier | Use when failure causes | Required evidence |
|------|-------------------------|-------------------|
| **1 — Smoke** | Poor wording, formatting, or another response-only inconvenience; no writes, external actions, high-stakes advice, or durable policy | One opportunity check or explicit user preference; 3 skill-loaded smoke cases covering normal, boundary/override, and pressure/safety when applicable; 2 positive and 2 adjacent-negative trigger probes only when autonomous discovery or a known collision matters; current subject hash and preserved outputs |
| **2 — Targeted comparative** | Reversible local files or engineering workflow mistakes that cost time but are recoverable | For an existing skill: 1 held-out prompt/skill value pair plus 2 skill-only regression cases (edge and pressure/authority), for 4 actor sessions by default. New skills first add 1 no-instruction/prompt discovery pair. Trigger cases stay with the skill but normally run in the shared portfolio routing suite; run them per skill only after a name/description change or known collision. Preserve cases, subject hash, tested route, costs, and raw results |
| **3 — Formal** | External mutation, unattended automation, security/privacy risk, irreversible change, high-stakes guidance, or a meta-skill that creates or evaluates durable behavior | 3 discovery cases; 3+ held-out cases × prompt/skill × 3 repetitions; 5 positive and 5 negative trigger cases; 2 fresh probe rounds; full frozen package, blinded judgment where needed, budgets, hashes, raw results, and executable scorer |

Tier 1 may SHIP as **smoke-tested**, Tier 2 as **targeted comparative support**, and Tier 3 as **formally supported**. “Proven across models” additionally requires the same passing Tier-3 suite on each named model and harness. `create-skill` is always Tier 3.

## Per-Type Recipe

Everything a type needs, in one row. Build to the row for the chosen type. The word-tier column names a row in Word Targets above — the numbers live there only.

| Type | Word tier | Section changes | Bulletproofing | Primary guide |
|------|-----------|-----------------|----------------|---------------|
| Technique | Simple technique | Merge When/Do-Not into one Scope section; keep Quick Reference | No | `body-template.md` → Simple Technique |
| Workflow | Standard workflow → Complex domain | Full template, all required sections | No | `body-template.md` |
| Reference | Complex domain | Workflow becomes Lookup Procedure; Quick Reference is primary content | No | `body-template.md` → Reference/API |
| Discipline | Discipline | Add Rationalization Table, Red Flags, Foundational Principle | **Yes** — all Bulletproofing Requirements | `bulletproofing-guide.md` |

## Behavioral-Force Rules

The six levers that decide whether an agent obeys a skill. Apply all six to every skill. `behavioral-force.md` explains and demonstrates each.

- [ ] **Imperative force** — instructions are verb-first commands (Always / Never / `<verb>`), never observations ("is helpful", "consider", "usually")
- [ ] **Positive specification** — behavioral guidance states the action to take; every prohibition is paired with its replacement ("Never X; do Y instead"). Scope boundaries ("Do Not Use When") are the one allowed exception
- [ ] **Load-bearing example** — at least one concrete, complete, runnable example demonstrates the core behavior
- [ ] **Concrete anchors** — vague qualifiers are replaced with measurable anchors where a limit is meant ("3 sentences or fewer", not "concise")
- [ ] **Position** — the most critical instruction sits in the first fifth and the last fifth of the body, and is restated at the end
- [ ] **Leading words** — each behavioral concept is named with a compact term the model already holds from pretraining (*adversarial*, *tight*, *red/green*) and repeated as that term, never re-explained; a leading word too weak to change behavior ("be thorough") is replaced with a stronger word ("relentless"), not with a longer sentence

## Invocation

Confirm the invocation axis in the Phase-0 Skill Brief and apply it during Phase-1 scoping. Each choice spends a different load; pick the cheaper one for how the skill actually fires.

- **Model-invoked** (default) — the skill keeps a trigger `description`, so the agent fires it autonomously and other skills can reach it by name. Costs *context load*: the description is loaded into every conversation whether or not the skill fires. Choose when the agent must discover the skill from a natural user request.
- **User-invoked** — set `disable-model-invocation: true` in frontmatter. Only the human typing the skill's name can fire it; zero context load, but the human must remember it exists (*cognitive load*). Choose when the skill only ever fires by explicit request (release rituals, personal checklists, meta-tools). The `description` becomes a human-facing one-liner; the Description Rules below do not apply. *Portability:* the flag is a Claude Code extension, not part of the open Agent Skills spec — in harnesses without it the skill stays model-invoked, so keep even the one-liner accurate as a trigger.
- **Router skill** — when user-invoked skills multiply past easy recall, add one skill that names each and when to reach for it, so the human remembers one name instead of many.

## Description Rules

The authoritative description checklist for **model-invoked** skills (user-invoked skills carry a one-line human-facing summary instead — see Invocation). `description-guide.md` explains the reasoning behind each.

- [ ] Starts with "Use when…" or "This skill should be used when…"
- [ ] Written in third person (not "you" or "I")
- [ ] Under 500 characters total (loaded into every conversation, so length is bounded)
- [ ] Contains 2–4 quoted trigger phrases users would say, covering distinct request branches — synonym rewrites of a single branch are capped at the 2 strongest
- [ ] Contains at least 1 symptom, error message, or keyword
- [ ] Does NOT summarize the skill's workflow or process
- [ ] Does NOT describe what the skill does (only when to use it)
- [ ] Specific enough to avoid false triggers
- [ ] Broad enough to catch legitimate variations

## Naming

**Spec constraints** (open Agent Skills spec, agentskills.io/specification): 1–64 characters; lowercase letters, numbers, and hyphens only; no leading or trailing hyphen; no consecutive hyphens; the name matches the parent directory name.

**Required:** the name is functional and unambiguous — a request for what the skill does reliably matches it, with no semantic collision with an unrelated common meaning (e.g., `writing-skills` collides with writing *ability*; `creating-skills` does not).

**Recommended:** verb-first active voice (`creating-X`, not `X-creator`). It sits closest to how requests are phrased and keeps a library consistent — but it is a convention, not a measured law. A functional, unambiguous noun name satisfies the requirement; verb-first is just the form that most reliably produces one.

## Frontmatter Fields

Per the open Agent Skills spec (agentskills.io/specification). Required: `name` (Naming above) and `description` (Description Rules above — create-skill's 500-character cap sits inside the spec's 1,024 ceiling). Optional — include only when applicable:

- `license` — license name, or the name of a bundled license file
- `compatibility` — environment requirements (system packages, network access, intended product), max 500 characters. Declare it whenever a generated skill's scripts need specific tooling (git, Python 3.x, docker); most skills omit it
- `metadata` — arbitrary string key-value map (author, version); use reasonably unique key names
- `allowed-tools` — space-separated pre-approved tools. Experimental; support varies by harness

## Steps and Pointers

Rules for workflow steps and file references. `body-template.md` (Writing Workflow Steps, Writing Context Pointers) demonstrates each.

- [ ] Every workflow step ends on a **checkable completion criterion** — the agent can tell done from not-done ("all fixtures pass on a full re-run", not "tests look good")
- [ ] Criteria that gate thoroughness are **exhaustive** ("every modified file accounted for", not "produce a change list")
- [ ] Every context pointer states *when* to load its target, not only what the target contains
- [ ] A must-have file behind an unreliable pointer is fixed by sharpening the pointer's wording first; the material is inlined only if sharpening fails
- [ ] File references use relative paths and stay one level deep from SKILL.md — no nested reference chains (open-spec rule)

## Pruning

Run in Phase 3 after drafting, and again whenever reviewing an existing skill.

- [ ] **No-op test** — every sentence changes agent behavior versus the model's default; failing sentences are deleted whole, never trimmed ("handle edge cases carefully" fails; "test the empty string — it classifies as numeric" passes)
- [ ] **Relevance** — every line still bears on what the skill does today; stale accumulated layers (sediment) are removed, not written around
- [ ] **Single source of truth** — each rule, number, and list lives in exactly one file; other files point to it, never restate it

## Required Sections

**Required (7):** Overview · When to Use · Do Not Use When · Workflow · Success Criteria · Common Mistakes · Failure Modes

*Technique skills may present When to Use + Do Not Use When as one combined **Scope** section (see Per-Type Recipe). The content of both is required; the two separate headings are not.*

**Conditional (present when applicable):** Required Context · Tool Guidance · Additional Resources · Quick Reference

## Quality Gate

The eight-point gate. All must be "yes" before a skill ships. `SKILL.md` names these in Success Criteria; the authoritative list — and the order of failure frequency — lives here.

1. **Discoverable** — an agent would find this skill given only the user's natural request
2. **Bounded** — states when NOT to use it, and when to stop
3. **Actionable** — workflow steps are imperative, specific, executable without guessing
4. **Verifiable** — success criteria are measurable and unambiguous
5. **Lean** — body within word target, depth in `references/`
6. **Self-consistent** — the skill follows the rules it teaches (most commonly failed)
7. **Positioned** — collisions with existing skills explicitly addressed in "Do Not Use When"
8. **Evidence-appropriate** — the skill passes the declared Evaluation Tier without making a broader claim; Tiers 2–3 beat the strongest realistic prompt within the declared cost ceiling

## Bulletproofing Requirements

Discipline skills only. `bulletproofing-guide.md` explains the techniques; this is the checklist run in Phase 6.

- [ ] Rationalization table with 5+ entries from actual baseline testing
- [ ] Red flags list with specific self-check thoughts
- [ ] At least 3 explicit loophole closings (specific workarounds forbidden)
- [ ] Foundational principle stated early in the skill
- [ ] Tested under combined pressure (not single-axis)
- [ ] Escalation path for genuine (not rationalized) exceptions
- [ ] Each rationalization stated once (in the Rationalization Table); other sections reference it, never re-argue it
- [ ] Includes a "deliver, don't lecture" instruction — state the rule once, then produce the compliant output and default to the safe pattern silently
- [ ] **Re-tested after adding all bulletproofing — agent still complies**

## Eval Loop Requirements

Run in Phase 7. Proves the skill's *output* works, not just that the document is well-formed. Scale the type-specific method to the declared Evaluation Tier. At Tier 2, these checks reuse the four Phase-8 actor sessions wherever possible; they do not create an additional agent-run suite.

- [ ] **Script or verifiable output** — execute 3 representative fixtures at Tier 1; at Tier 2, cover the normal value case plus the 2 declared regression classes; at Tier 3, execute 8+ adversarial classes (empty/blank, single element, delimiter-in-data, embedded newline, ragged, special chars, unicode/BOM, boundary numbers, type ambiguity). Failures are fixed in the *skill*, never by editing valid fixtures toward buggy output
- [ ] **Discipline skill** — Tier 1 runs its boundary/override smoke; Tier 2 uses the pressure/authority regression as the combined-pressure Bulletproofing re-test; Tier 3 runs the matching combined-pressure re-test
- [ ] **Reference skill** — a fresh agent performs and applies 1 real lookup at Tier 1, the 2 skill-only regression lookups at Tier 2, or 3 real lookups at Tier 3
- [ ] **Pure technique/workflow, no artifact** — a fresh agent executes the declared correctness cases with no critical gap or deviation; at Tier 2 these are the value-pair skill arm and 2 skill-only regressions, not extra sessions
- [ ] A clean known suite requires no additional fresh probe at Tiers 1–2; Tier 3 requires 2 consecutive fresh probe rounds
- [ ] Any input class left untested — and any non-obvious semantic decision the artifact makes on an ambiguous spec (sort order, tie-breaking, type coercion) — is named in the skill's Failure Modes (no silent coverage caps, no silent judgment calls)

## Opportunity Test Requirements

Run before drafting a new skill. Improving an existing skill may reuse preserved evidence when it still matches the current subject, target route, and failure.

- [ ] Execute the declared tier's discovery count for a new skill: Tier 1 uses 1 representative behavioral check (or an explicit user preference for a response-only style); Tier 2 uses 1 representative case; Tier 3 uses 3 covering normal, edge, and ambiguity/pressure
- [ ] Use a confirmed Skill Brief; derive the candidate purpose, target engineering outcome, strongest realistic prompt, acceptable cost, and discovery cases from it
- [ ] At Tier 1, preserve the preference or smoke output that establishes the need; at Tiers 2–3, run each discovery case once with **no special instruction** and once with the **strongest realistic short prompt** an engineer would actually use
- [ ] Tier 1 records the subject hash and outputs; Tiers 2–3 record typed evidence for every discovery arm, including raw output, tool trace, artifacts, tokens, and actor sessions; self-description never counts as behavioral evidence
- [ ] Classify the opportunity: **behavioral residual** when the strong prompt still fails; **delivery residual** when the prompt works but requires repeated recall, wording, or manual application that the confirmed brief intends to remove
- [ ] Name the proposed reusable mechanism, target metric, maximum acceptable cost premium, and total repeated-use comparison: output quality, autonomous recall, consistency, user instruction burden, runtime cost, and collision risk
- [ ] Keep discovery cases out of the held-out suite; they may guide the draft but never score its effectiveness
- [ ] If the strong prompt meets the behavioral target, compare delivery mechanisms instead of automatically stopping. Prefer a skill only when normally installed triggering or explicit invocation removes confirmed recurring burden without unacceptable misses, false triggers, or runtime premium; otherwise deliver the cheaper prompt, template, repository instruction, router, or script
- [ ] Present a cheaper-mechanism result to the user and confirm that it satisfies the brief; revise the brief when the result exposes an unmodeled use case instead of declaring an agent-invented candidate unwanted

## Comparative Effectiveness Requirements

Keep evidence under `evals/` in the skill. Tier 1 needs cases, an executable smoke command or script, the current subject hash, and preserved outputs/results. Tier 2 needs a compact reproducible package: cases, current subject hash, tested route and budget, deterministic checks or scorer, and raw results. Separate rubric, matrix, manifest, and typed schema files are optional unless the cases cannot freeze those facts clearly. Tier 3 requires the full frozen package: rubric, exact matrix, manifest, reproduction instructions, typed score inputs, executable scorer, and deterministic fixtures when the skill emits artifacts.

- [ ] **Tier 1 behavior:** 3 skill-loaded smoke cases cover normal, boundary/override, and pressure/safety when applicable; no prompt arm or repetitions are required
- [ ] **Tier 2 behavior:** run 1 representative held-out value case once with the strongest-prompt arm and once with the force-loaded-skill arm, then run 2 force-loaded-skill regression cases covering edge behavior and pressure/authority. This is 4 actor sessions by default; repeat only a predeclared inconsistent or decision-boundary cell
- [ ] **Tier 3 behavior:** 3+ held-out cases cover normal, edge, and pressure/ambiguity; run strongest-prompt and force-loaded-skill arms 3 times per case
- [ ] **Triggering:** Tier 1 runs 2 positive and 2 adjacent-negative probes only when autonomous discovery or collision risk matters. Tier 2 keeps trigger cases with the skill but normally executes them in the shared portfolio routing suite; run a per-skill set of at least 2 positive and 2 adjacent-negative probes only after a name/description change or known collision. Tier 3 runs 5+5. Use normally installed descriptions and keep triggering separate from body compliance
- [ ] Every case has stable ID, split, setup, request, and assertions whose individual criticality is explicit; trigger cases additionally name the expected skill or no-trigger result
- [ ] Freeze expected downstream outcomes, scoring, minimum meaningful improvement, critical-assertion requirements, maximum cost premium, exact model identifiers, harness launch/installation commands, and numeric iteration plus total-run/cost budgets before the skill arm runs; prefer dated snapshots, or explicitly mark an alias-only authenticated route opaque and time-bounded
- [ ] Prefer mechanical scoring. When judgment is unavoidable, blind the scorer to arm identity and preserve the judge prompt and raw judgment
- [ ] Compare quality plus total repeated-use cost: tokens, latency, tool calls, interruptions, persistent artifacts, user-supplied instruction length, prompt-recall burden, consistency, trigger misses, and false triggers. More process is not automatically a better outcome
- [ ] When evaluating a skill that creates other artifacts or skills, score the downstream artifact on representative work; lifecycle compliance is a correctness check, never the effectiveness metric. Bound recursion with fixture artifacts and at most one full end-to-end nested case
- [ ] Fix failures in the skill, its resources, or its description; never weaken a valid case or rubric to make the skill pass. A legitimate eval correction versions the suite and reruns every arm
- [ ] After every failing eval, report the brief expectation, observed failure, responsible layer, and 1–3 ranked improvements with the recommended option, expected effect, and cost; apply the user's selection
- [ ] After a change, Tier 1 reruns its 3 smoke cases; Tier 2 reruns only the affected value or regression cells and runs routing only when discovery metadata changed; Tier 3 reruns the entire held-out and trigger suites
- [ ] Add every newly discovered failure class as a regression case at Tiers 2–3; Tier 2 keeps the next release's default suite bounded by replacing a weaker regression case unless the added class represents a distinct critical risk, while Tier 3 runs its fresh-probe count after the known suite passes
- [ ] Repeat evaluate → explain → recommend → revise within the frozen iteration and cost budgets; when exhausted, request one bounded extension, a brief revision, or abandonment rather than silently continuing
- [ ] End explicitly in **ship**, **iterate**, or **abandon**. Ship only when the declared behavioral or delivery improvement and cost thresholds pass **and the user explicitly accepts the result**; satisfaction never overrides failing evidence. Abandon when the user stops, total repeated-use utility is equivalent, the budget expires, or revisions only overfit known cases
- [ ] Run the smallest declared tier first. Expand only after it passes; every verdict names the evidence tier and tested route. Cross-model claims require passing Tier 3 on every named harness/model

## Portability (Harness-Neutral)

Every skill must work in any agent harness, not only Claude Code. `references/harness-tools.md` holds the tool-mapping authors and generated skills cite.

- [ ] Harness-specific tools are named with their generic role and a fallback ("use the harness's multi-option question UI; otherwise ask as a numbered list"), never assumed to exist
- [ ] No hard dependency on a harness-only mechanism (plugin packaging, `settings.json` hooks, `${CLAUDE_PLUGIN_ROOT}`) inside the skill body; if one is referenced, it is marked as that harness's path with a neutral alternative
- [ ] The skill's instructions still execute when loaded as a plain instruction document (manual trigger), degrading only the *triggering*, never the steps
- [ ] Any harness-specific helper the skill leans on is mapped in `references/harness-tools.md`

## Other Constants

- Inline code examples: under 50 lines; longer examples move to `examples/`
- One excellent example per concept (no multi-language dilution)
- Cross-references to other skills: by name only, never `@` force-loading
