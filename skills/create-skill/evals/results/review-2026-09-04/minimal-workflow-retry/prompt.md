Apply the supplied skill to the request. Work only inside the current workspace. Do not use external services or other agents. Stop at the next user-input gate; do not invent user replies.

---
name: create-skill
description: Maintainer workflow for creating, improving, reviewing, and evaluating an agent skill.
disable-model-invocation: true
license: MIT
metadata:
  category: Authoring
  summary: Creates skills only when evidence appropriate to their risk justifies them. Smoke-test, compare, iterate, then ship or abandon.
---

# Create Skill

## Overview

Create a skill only when consequence-appropriate evidence justifies its context and maintenance cost. Use a prompt, template, instruction, or script when it has equal utility. Protect predictability with one narrow job, explicit boundaries, progressive disclosure, and no-op pruning.

Load `references/behavioral-force.md` while drafting. Use `references/harness-tools.md` when tool names need a portable mapping. Authoritative rules live in `references/rules.md`.

## When to Use

- User asks to "create a skill", "write a skill", "improve this skill", or to review skill quality
- Skills produce inconsistent results, go undiscovered, or get ignored
- A discipline skill (TDD, code review, verification) is being rationalized around
- Deciding whether a skill should be model-invoked or user-invoked
- Symptoms: "the skill didn't trigger", "the skill is too long", "description is wrong"

## Do Not Use When

- Large-scale benchmarking beyond the declared target matrix: use an external eval harness for the extra runs, keeping this skill's cases, rubric, raw results, and ship decision authoritative
- Claude Code plugin packaging: use `plugin-dev:skill-development`
- A one-off slash command, not a triggered skill: write a slash command instead
- A project document, not an agent instruction
- Harness event hooks: they execute outside the agent and are not skills

## Required Context

Gather via a confirmed Skill Brief before testing or drafting. In read-only review, infer from the existing skill and flag material ambiguity instead:

- Skill type (technique, discipline, reference, or workflow: defined in Phase 1)
- Invocation axis: model-invoked (agent discovers it) or user-invoked (human-only): `references/rules.md`, Invocation
- 3–5 realistic phrasings that should trigger the skill (model-invoked only), and 2–3 adjacent requests that should NOT
- Existing skills that may collide (search local plugins and built-ins first)
- Whether the skill enforces a discipline under pressure: that changes Phase 5
- Evidence tier from `references/rules.md` → Evaluation Tiers; uncertainty selects the higher tier
- The strongest realistic short prompt, target engineering outcome, maximum acceptable cost premium, and target harness/model matrix

## Workflow

For creation and editing, follow the phases in order.

**Reviewing without an edit request?** Load `references/rules.md` and `references/validation-checklist.md`. Inspect the skill, resources, collisions, and eval evidence. Report strengths, failures, likely effects, and prioritized corrections without modifying files. Separate measurements from predictions.

### Phase 0: Interview and Confirm Intent

Do not test, scope, draft, or reject a candidate until intent is confirmed.

Open every creation or behavior-changing update with at least one post-invocation, adaptive, decision-changing question; brief confirmation is a separate gate and never counts as that question.

Ask one question per turn. Use the option UI when available. Otherwise offer 2–4 concrete, mutually exclusive choices plus an Other/free-form option. Put the recommendation first and name its tradeoff in one line. Let each answer select the next question; never use a fixed questionnaire. Speed, efficiency, or “only necessary questions” narrows the interview to design-changing decisions but does not waive it.

Continue while another answer can change the design. Cover the problem, users and context, concrete use cases, trigger phrases, behavior or artifacts, frustrations, non-goals, boundaries, invocation, and observable success. Convert abstract answers into examples.

Restate the result as a Skill Brief with those fields, constraints, evidence tier, cost tolerance, and every unresolved item labeled `ASSUMED`. A detailed opening request is evidence, not confirmation. Only “skip questions,” “use your judgment,” or an equivalent explicit instruction waives the interview; read back every assumption and get acceptance.

Done when at least one post-invocation design answer exists and the user separately confirms the Skill Brief, or an explicit waiver plus accepted assumptions exists. The confirmed brief is the source of truth for the skill and evals.

### Phase 1: Scope and Test the Opportunity

Scope from the confirmed Skill Brief:

1. Choose the invocation axis (`references/rules.md` → Invocation). Model-invoked is the default; user-invoked (`disable-model-invocation: true`) fits skills fired only by explicit request, and collapses Phase 4 to one line.
2. Identify 3–5 realistic user requests that should trigger this skill, and 2–3 that should NOT.
3. Determine the skill type: **Technique** (concrete repeatable method) · **Discipline** (enforces rules under pressure) · **Reference** (docs, schemas, domain knowledge) · **Workflow** (multi-phase process with decision points)
4. Search existing skills for collisions. State when to defer within either accepted scope structure (`references/rules.md` → Required Sections).
5. Walk each trigger end-to-end; note reusable resources.
6. Derive the strongest realistic prompt, discovery cases, success measures, and cost ceiling from the brief; never substitute an agent-invented use case for a confirmed one.

Conclude with: invocation axis, trigger scenarios, negative boundaries, skill type, planned resources, known collisions, and an eval contract traceable to the brief.

Load `references/eval-loop.md` and run the tier's Opportunity Test. Distinguish a **behavioral opportunity** (the strong prompt still fails) from a **delivery opportunity** (the prompt works but users must keep remembering or supplying it). Compare total repeated-use utility: output quality, autonomous recall, consistency, user instruction burden, runtime cost, and collision risk. If a cheaper mechanism meets the confirmed outcome, show the evidence, recommend it, and ask whether it satisfies the intent or reveals missing value that revises the brief. Never abandon a candidate solely because prompt-loaded output is equivalent when reliable prompt delivery is part of the confirmed job.

Done when evidence rejects the skill against the confirmed brief with the user's acknowledgment, or identifies a residual failure worth prototyping at the declared tier.

### Phase 2: Draft SKILL.md Body

Draft the smallest valid body from `references/body-template.md`. Stay under the matching ceiling in `references/rules.md`. Load the matching example and copy only the structure the skill needs.

For a specialist persona, load `references/persona-template.md`. Keep workflow in a skill.

Write ordinary skill workflows in imperative voice. Reserve second person for personas and always-on identity text. Put one behavioral decision in each sentence or bullet. Put every `Done when …` criterion on its own line.

Done when every section changes behavior, the core example is complete, and each workflow step has a standalone completion criterion.

### Phase 3: Prune, then Extract (only after drafting)

Two passes, in order:

1. **No-op pass.** Test every sentence: does it change agent behavior versus the model's default? Delete failing sentences whole: never trim words from them (examples in `references/rules.md`, Pruning).
2. **Extraction pass.** Move conditional depth beyond the ceiling, dense reference material, and repeated code into supporting directories (`references/body-template.md`, Supporting Directories). Single-file SKILL.md is the default.

Reference every supporting file from the body with a pointer stating *when* to load it. An unreferenced file is invisible (`references/body-template.md` → Writing Context Pointers).

Done when every remaining sentence passes the no-op test and every supporting file has one conditional context pointer.

### Phase 4: Write the Description

User-invoked skill? Set `disable-model-invocation: true`, write a one-line human-facing description, and skip the rest of this phase.

For model-invoked skills the description determines whether the skill loads at all. Two rules dominate:

1. **Triggers only, never workflow.** A process summary makes agents skip the body. See the empirical "one review vs two reviews" failure and skeleton in `references/description-guide.md`.
2. **Quoted user phrases plus symptoms.** Include exact strings users say, plus error messages and symptom keywords. Cover each distinct request branch; cap synonym rewrites of one branch at the 2 strongest (`references/rules.md` → Description Rules).

Smoke-test discoverability before finalizing: check the description alone against the positive and negative phrasings; fix obvious misses or collisions. Phase 8 measures triggering in normally installed conditions.

Done when every positive trigger recalls the skill from the description alone and every negative trigger does not.

### Phase 5: Bulletproof (Discipline Skills Only)

Skip for technique, reference, and simple workflow skills: overengineering weakens them. Discipline skills need hardening because agents rationalize around constraints under pressure.

1. Spawn a subagent *without* the skill loaded (mechanism: `references/harness-tools.md`) and give it the discipline's task. Record every rationalization it uses to cut corners.
2. Build a rationalization table pairing every excuse with a direct counter, plus a red-flags list of self-check thoughts.
3. Close loopholes explicitly: forbid specific workarounds, not just the rule.
4. Re-test with the skill loaded under *combined* pressure (time + sunk cost + authority); iterate until compliance is stable.

Required items: `references/rules.md` (Bulletproofing Requirements); techniques: `references/bulletproofing-guide.md`, loaded at phase start.

Done when every bulletproofing requirement passes after the combined-pressure re-test.

### Phase 6: Validate the Document

Load `references/rules.md` and `references/validation-checklist.md`. Run the document checks from Structure through Boundaries and Portability; the later eval sections do not apply yet. Any document failure returns to the responsible phase.

Done when every pre-eval document item is yes and each inapplicable document item has a reason.

### Phase 7: Prove Correctness

Load `references/eval-loop.md` and run the matching type-and-tier method in `references/rules.md` → Eval Loop Requirements. Execute artifacts and fresh-agent probes only to the declared consequence tier. Fix the skill, never a valid fixture, and rerun the affected checks. Done when every tier requirement passes and uncovered limits are explicit.

### Phase 8: Prove Effectiveness, then Decide

Generate only the eval package required by the declared tier before executing the skill arm. Tier 1 runs bounded smoke probes. Tier 2 runs one prompt/skill value pair plus two skill-only regression cases; its trigger cases normally run in the shared portfolio routing suite. Tier 3 runs the full repeated comparative and trigger evaluation.

After every eval, compare the result with the confirmed Skill Brief. On a miss, classify the failure and offer 1–3 ranked improvements — recommended option first, with its expected effect and cost. Ask the user which change to make, apply it, and rerun only the affected frozen checks. Repeat the evaluate → explain → recommend → revise loop until the evidence gate passes and the user explicitly accepts the skill.

Bound the loop by the declared iteration and cost budgets. On exhaustion, explain the remaining gap and ask whether to authorize one bounded extension, revise the brief, or abandon. Never weaken a valid test, silently expand the budget, or treat user satisfaction as evidence that a failing skill works.

Before SHIP, run the validation checklist and state the evidence tier beside the verdict. `ITERATE` returns to the responsible phase. `SHIP` requires passing evidence plus explicit user acceptance; `ABANDON` requires the user to stop or an exhausted/equivalent candidate the user acknowledges.

## Tool Guidance

Never `@` force-load runtime references. Link them conditionally. Cross-reference skills by name, mark required background, and create no empty directory.

Use tables for reference material, code blocks for code, and numbered lists for linear steps.

## Success Criteria

Every gate in `references/rules.md` → Quality Gate must be yes before shipping. Phase 6 checks the document, Phase 7 proves correctness, and Phase 8 proves effectiveness. If any answer is no, iterate or abandon.

## Stop Conditions

- Existing coverage: improve or position the existing skill.
- Unbounded scope: split the job.
- Repeated rationalization: add an evidence-backed structural escape path.
- Body over its ceiling: prune, extract conditional depth, or split.
- Trigger collision: tighten descriptions and boundaries.
- Cheaper mechanism has equal utility: abandon the skill.
- Held-out gain disappears: treat it as overfitting and simplify or abandon.
- Eval fails: show the mismatch and ask the user to select a bounded correction.

## Additional Resources

- **`references/rules.md`**: the rule registry, single source of truth. Load in Phase 6 and for any authoritative value.
- **`references/behavioral-force.md`**: the six levers, before/after rewrites. Load while drafting (Phase 2).
- **`references/harness-tools.md`**: tool mapping and fallbacks. Load when the harness is not Claude Code.
- **`references/body-template.md`**: body template, step and pointer guidance, extraction table. Load at Phase 2 start.
- **`references/description-guide.md`**: description skeleton and anti-patterns. Load in Phase 4.
- **`references/bulletproofing-guide.md`**: six hardening techniques. Load in Phase 5.
- **`references/validation-checklist.md`**: the binary gate. Load in Phase 6.
- **`references/eval-loop.md`**: opportunity, correctness, comparative eval, anti-gaming, and user-acceptance loop. Load in Phase 1 and keep through Phase 8.
- **`examples/simple-skill-example.md`**: load at Phase 2 start when drafting a technique.
- **`examples/complex-skill-example.md`**: load at Phase 2 start when drafting a workflow.

A confirmed Skill Brief defines the hypothesis. Never call SHIP until proportionate evidence passes and the user accepts the result.

# The Rule Registry

Single source of truth for every invariant a skill is checked against. **Change a rule here and nowhere else.**

`SKILL.md` and `references/validation-checklist.md` cite this file for authoritative values. The guides (`description-guide.md`, `bulletproofing-guide.md`, `body-template.md`) explain *why* each rule exists — they must not restate the rules themselves. If a number or list appears in two files, this one wins.

Phase 6 loads this file alongside the validation checklist; the checklist's items resolve their values here.

## Word Targets

No minimum length. Stop when every remaining line changes behavior.

Use these ceilings to trigger pruning or extraction, not as quotas:

| Skill Type | SKILL.md Ceiling |
|-----------|------------------|
| Simple technique | 500 words |
| Standard workflow | 1,000 words |
| Complex domain | 1,800 words |
| Discipline (with bulletproofing) | 2,000 words |

Move genuinely conditional depth to `references/`. **Hard cap:** 2,500 words for every skill.

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

| Type | Body ceiling | Section changes | Bulletproofing | Primary guide |
|------|--------------|-----------------|----------------|---------------|
| Technique | Simple technique | Use Scope, action, and verification; add Quick Reference only when choices need it | No | `body-template.md` → Simple Technique |
| Workflow | Standard workflow → Complex domain | Add only context, tools, mistakes, and failures that change execution | No | `body-template.md` |
| Reference | Complex domain | Use Lookup Procedure as the action section; make Quick Reference primary when needed | No | `body-template.md` → Reference/API |
| Discipline | Discipline | Add evidence-backed Rationalization Table, Red Flags, and Foundational Principle | **Yes** — all Bulletproofing Requirements | `bulletproofing-guide.md` |

## Behavioral-Force Rules

The six levers that decide whether an agent obeys a skill. Apply all six to every skill. `behavioral-force.md` explains and demonstrates each.

- [ ] **Imperative force** — instructions are verb-first commands (Always / Never / `<verb>`), never observations ("is helpful", "consider", "usually")
- [ ] **Positive specification** — behavioral guidance states the action to take; every prohibition is paired with its replacement ("Never X; do Y instead"). Scope boundaries ("Do Not Use When") are the one allowed exception
- [ ] **Load-bearing example** — at least one concrete, complete, runnable example demonstrates the core behavior
- [ ] **Concrete anchors** — vague qualifiers are replaced with measurable anchors where a limit is meant ("3 sentences or fewer", not "concise")
- [ ] **Position** — the most critical instruction sits in the first fifth and the last fifth of the body, and is restated at the end
- [ ] **Leading words** — each behavioral concept is named with a compact term the model already holds from pretraining (*adversarial*, *tight*, *red/green*) and repeated as that term, never re-explained; a leading word too weak to change behavior ("be thorough") is replaced with a stronger word ("relentless"), not with a longer sentence
- [ ] **Atomic steering** — write one behavioral decision per sentence or bullet; put rationale in the next sentence instead of packing commands, exceptions, and explanation together

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
- [ ] Put each `Done when …` criterion on its own line after the action it closes
- [ ] Criteria that gate thoroughness are **exhaustive** ("every modified file accounted for", not "produce a change list")
- [ ] Every context pointer states *when* to load its target, not only what the target contains
- [ ] A must-have file behind an unreliable pointer is fixed by sharpening the pointer's wording first; the material is inlined only if sharpening fails
- [ ] File references use relative paths and stay one level deep from SKILL.md — no nested reference chains (open-spec rule)

## Pruning

Run in Phase 3 after drafting, and again whenever reviewing an existing skill.

- [ ] **No-op test** — every sentence changes agent behavior versus the model's default; failing sentences are deleted whole, never trimmed ("handle edge cases carefully" fails; "test the empty string — it classifies as numeric" passes)
- [ ] **Relevance** — every line still bears on what the skill does today; stale accumulated layers (sediment) are removed, not written around
- [ ] **Single source of truth** — each rule, number, and list lives in exactly one file; other files point to it, never restate it
- [ ] **Atomic prose** — one behavioral decision per sentence or bullet; split compound instructions before shortening their words

## Required Sections

**Required core:** scope, action, and verification.

- **Scope:** `Scope`, or both `When to Use` and `Do Not Use When`. Include positive triggers, specific exclusions, and boundaries with colliding skills in either form.
- **Action:** `Workflow`, `Rules`, or `Lookup Procedure`.
- **Verification:** `Success Criteria` or `Verification`.

**Conditional:** Overview · Required Context · Tool Guidance · Quick Reference · Common Mistakes · Failure Modes · Additional Resources.

Add a conditional section only when it changes execution. Keep a boundary or stop condition inside Scope or the action section when a separate Failure Modes section would repeat it.

## Quality Gate

The eight-point gate. All must be "yes" before a skill ships. `SKILL.md` names these in Success Criteria; the authoritative list — and the order of failure frequency — lives here.

1. **Discoverable** — an agent would find this skill given only the user's natural request
2. **Bounded** — states when NOT to use it, and when to stop
3. **Actionable** — workflow steps are imperative, specific, executable without guessing
4. **Verifiable** — success criteria are measurable and unambiguous
5. **Lean** — no minimum length, body under its ceiling, conditional depth in `references/`
6. **Self-consistent** — the skill follows the rules it teaches (most commonly failed)
7. **Positioned** — collisions with existing skills explicitly addressed within either accepted scope structure
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

# Skill Validation Checklist

Run every item before finalizing a skill. A single "no" means the skill is not ready.

**Run with `references/rules.md` loaded.** Items below that concern word targets, description rules, required sections, the quality gate, or bulletproofing resolve their authoritative values from the rule registry — they are not restated here, so the gate and the rules can never disagree.

## Intent and Skill Brief

- [ ] Every item in `references/rules.md` (Confirmed Skill Brief) passed before scoping, opportunity testing, or drafting
- [ ] Interview questions were adaptive, asked one per turn, and used recommended-first multiple choice with a free-form path
- [ ] At least one post-invocation, decision-changing answer preceded the Skill Brief; the later confirmation question was not counted as the interview
- [ ] Any zero-question path records an explicit interview waiver plus the user's acceptance of every `ASSUMED` item; speed or “only necessary questions” was not treated as a waiver
- [ ] The user explicitly confirmed the restated Skill Brief, including every labeled assumption
- [ ] Scope and eval cases trace to confirmed use cases and success measures rather than an agent-invented interpretation

## Opportunity Test

- [ ] The Evaluation Tier in `references/rules.md` was chosen from consequence before testing; uncertainty selected the higher tier
- [ ] Every item in `references/rules.md` (Opportunity Test Requirements) passed before drafting, or current preserved evidence validly covers an existing-skill improvement
- [ ] The opportunity record identifies an observable behavioral residual or a confirmed delivery residual; otherwise the candidate stopped in favor of the cheaper mechanism
- [ ] Prompt-loaded output parity was not treated as automatic abandonment; total repeated-use utility includes instruction burden, autonomous recall, consistency, runtime cost, and collision risk
- [ ] Discovery cases are labeled and excluded from held-out scoring

## Structure

- [ ] Skill lives in its own directory: `skill-name/SKILL.md`
- [ ] SKILL.md has valid YAML frontmatter with `---` delimiters
- [ ] Frontmatter contains `name` and `description` fields; optional fields (`license`, `compatibility`, `metadata`, `allowed-tools`) appear only when applicable (`references/rules.md`, Frontmatter Fields)
- [ ] Name meets every rule in `references/rules.md` (Naming) — including the open-spec constraints: lowercase, 1–64 chars, no leading/trailing/consecutive hyphens, matches the parent directory name
- [ ] Every file referenced in SKILL.md body actually exists, via a relative path one level deep
- [ ] No empty directories (only create directories with content)
- [ ] If the `skills-ref` CLI is available, `skills-ref validate <skill-dir>` passes — a mechanical frontmatter/naming check; skip only when the tool is not installed

## Invocation

- [ ] The invocation axis was chosen deliberately in Phase 0 (`references/rules.md` → Invocation): model-invoked by default; user-invoked (`disable-model-invocation: true`) when the skill only fires by explicit request
- [ ] A user-invoked skill carries a one-line human-facing description — Description Quality below then does not apply

## Description Quality

- [ ] Every rule in `references/rules.md` (Description Rules) holds (model-invoked skills only)

## Body: Sections

- [ ] The required core in `references/rules.md` is present: scope, action, and verification
- [ ] Optional sections appear only when they change behavior
- [ ] Required Context appears for pre-flight inputs; Tool Guidance appears for tool constraints; Additional Resources appears when runtime resources exist

## Writing Style

- [ ] Workflow skills use imperative/infinitive voice ("Parse the file", not "You should parse")
- [ ] Second person is reserved for personas and always-on identity text; ordinary skill workflows remain verb-first
- [ ] Objective, instructional language — focuses on WHAT to do, not WHO does it
- [ ] Bullet points and numbered steps, not dense paragraphs
- [ ] Each sentence or bullet carries one behavioral decision; rationale follows separately
- [ ] Code examples well-commented explaining WHY, not WHAT

## Behavioral Force

- [ ] All six levers in `references/rules.md` (Behavioral-Force Rules) hold: imperative force, positive specification, a load-bearing example, concrete anchors, front/end positioning, and leading words

## Steps and Pointers

- [ ] Every rule in `references/rules.md` (Steps and Pointers) holds — each workflow step ends with a standalone `Done when …` criterion, and each context pointer states when to load its target

## Pruning

- [ ] Every rule in `references/rules.md` (Pruning) holds — the sentence-level no-op pass was run, stale lines removed, each meaning lives in exactly one file

## Word Count

- [ ] SKILL.md body has no filler added to meet a minimum and stays under its type ceiling (`references/rules.md` → Word Targets)
- [ ] No SKILL.md body exceeds the hard cap (`references/rules.md` → Word Targets)
- [ ] Content beyond target moved to `references/`

## Progressive Disclosure

- [ ] Core concepts and essential workflow in SKILL.md
- [ ] Detailed patterns, schemas, API docs in `references/`
- [ ] Complete, runnable demonstrations in `examples/`
- [ ] Reusable utilities in `scripts/` (executable and documented)
- [ ] Output resources in `assets/` (templates, images, boilerplate)
- [ ] Every runtime supporting resource referenced explicitly in SKILL.md body; development-only `evals/` files remain outside runtime context

## Code Examples

- [ ] One excellent example per concept (not multi-language dilution)
- [ ] Examples are complete and runnable as-is
- [ ] Examples comment the WHY, not the WHAT
- [ ] Inline examples under 50 lines; longer examples in `examples/`
- [ ] No fill-in-the-blank templates; no contrived scenarios

## Discoverability (Keyword Optimization)

- [ ] Relevant error messages and symptoms appear within an accepted scope structure (`references/rules.md` → Required Sections)
- [ ] Synonyms for key concepts used throughout
- [ ] Tool names and CLI commands mentioned where relevant
- [ ] User-phrasing variations in description and body

## Cross-References

- [ ] Other skills referenced by name only (not file path)
- [ ] Required skills marked with "REQUIRED BACKGROUND:" prefix
- [ ] No `@` force-loading of external files
- [ ] Dependencies clearly stated as required vs. optional

## Bulletproofing (Discipline Skills Only)

- [ ] Every item in `references/rules.md` (Bulletproofing Requirements) is satisfied — including the final re-test after hardening

## Boundaries

- [ ] Scope contains specific exclusions and collision boundaries (`references/rules.md` → Required Sections)
- [ ] Failure modes documented with clear escalation guidance
- [ ] Success criteria are measurable and unambiguous
- [ ] Skill scope is narrow — one job, not a whole profession

## Correctness Eval (Phase 7)

- [ ] Every item in `references/rules.md` (Eval Loop Requirements) is satisfied for the matching skill type and Evaluation Tier

## Comparative Effectiveness (Phase 8)

- [ ] Every item in `references/rules.md` (Comparative Effectiveness Requirements) is satisfied
- [ ] The skill's `evals/` package contains the evidence required by its tier: Tier 1 stays minimal, Tier 2 keeps a compact reproducible package, and Tier 3 carries the full frozen comparative machinery
- [ ] Tier 1 smoke behavior passes; Tier 2's paired value case improves the declared behavioral or delivery outcome and both skill-only regressions pass within the declared cost ceiling; Tier 3 passes its full comparison; triggering is tested to the tier required by any delivery claim
- [ ] Every failed iteration was shown to the user with ranked corrections; the selected correction was applied and the tier-required checks rerun within budget
- [ ] SHIP includes explicit user acceptance; user satisfaction never overrides failing evidence
- [ ] The final verdict is SHIP or ABANDON; ITERATE is never a shipping state

## Portability

- [ ] Every Portability rule in `references/rules.md` (Portability) holds — harness-specific tools named with a generic role + fallback, no hard harness-only dependency, runs as a plain instruction document

## Eight-Point Quality Gate

- [ ] All eight gates in `references/rules.md` (Quality Gate) answer "yes" — including #8 Evidence-appropriate, with the tier and claim scope stated

A single "no" means iterate. The registry notes the most commonly failed gate — #6, Self-consistent: skills that teach a structure they don't follow.


Candidate document:
---
name: minimal-workflow
description: Use when the user asks to "summarize this incident" or "write the incident handoff" from a completed incident timeline.
license: MIT
metadata:
  category: Communication
  summary: Converts a completed incident timeline into a factual handoff.
---

# Minimal Workflow

## Scope

Use when a completed incident timeline needs a handoff.

Do not use for active incident diagnosis. Use `diagnose` when installed; otherwise establish the cause before writing the handoff.

## Workflow

1. Extract the impact, recovery action, and unresolved follow-up from the timeline. Mark absent facts unknown.

   Done when every statement traces to a timeline entry or is marked unknown.
2. Write one sentence for each extracted item.

   Done when the handoff includes impact, recovery, and follow-up without inventing facts.

   Example: Given "09:00 login errors; 09:10 rollback restored login; cause unknown", write "Login failed from 09:00 to 09:10. A rollback restored login. The cause remains unknown."

## Verification

- Every factual statement matches the supplied timeline.
- Missing facts remain unknown.


Scenario:
Use the supplied fixture.

User request:
Evaluate only Required Sections, Discoverability, Boundaries, and Quality Gate 7 against the supplied rules and checklist. Report PASS or FAIL for each of those four checks and explain any failure. Do not run authoring, rewrite the candidate, or evaluate unrelated gates.