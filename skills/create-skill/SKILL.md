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
