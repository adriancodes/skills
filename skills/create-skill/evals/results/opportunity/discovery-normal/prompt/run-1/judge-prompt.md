Blindly score the candidate outcome. The arm identity is intentionally absent.

Environment: Empty repository; candidate is a diagnosis skill

Request: Create a skill that helps engineers diagnose difficult bugs.

Assertions:
- opportunity: Behavioral none-vs-prompt evidence identifies a residual failure before drafting
- mechanism: Proposed mechanism is reusable context or machinery rather than generic debugging advice

Candidate response:
I’m using the skill-creator guidance because this request is explicitly about deciding whether and how to create a reusable skill. I’ll first apply its discovery test, then only scaffold a skill if the evidence clears that bar.

The discovery bar is the key constraint here: a generic diagnosis workflow has no company-specific knowledge, tool integration, deterministic script, or reusable artifact that a skill can uniquely provide. I’m checking whether any repository context changes that; if not, the fair comparison is the same diagnostic instructions packaged as a skill versus as a prompt.

The workspace is truly empty, so there is no local stack, incident schema, debugger integration, or recurring executable procedure to bundle. The comparison therefore does not support creating a skill: packaging identical instructions in `SKILL.md` adds trigger/context overhead but no diagnostic capability. I’m preserving the cheaper production-ready prompt and a falsifiable decision record, including the conditions that would justify upgrading it to a skill later.

A reusable skill did not clear the material-outperformance bar, so I implemented the cheaper mechanism: a concise, production-ready diagnosis prompt.

Artifacts:

- [DIAGNOSE_BUG_PROMPT.md](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-normal-prompt-work-y1V2M6/DIAGNOSE_BUG_PROMPT.md) — evidence-driven debugging workflow.
- [MECHANISM_DECISION.md](/private/var/folders/tt/fpnrgdcj5zgfw5ytq9qsq7f80000gn/T/create-skill-discovery-normal-prompt-work-y1V2M6/MECHANISM_DECISION.md) — comparison, scenario coverage test, limitations, and future upgrade criteria.

The repository contains no stack-specific knowledge, repeated executable workflow, integration, or diagnostic assets to bundle. A skill would therefore contain substantially the same 250-word instructions while adding triggering and maintenance overhead.

The prompt was checked for coverage across concurrency, production-only configuration, distant data corruption, and misleading-change scenarios. The decision record also defines when a real skill would become justified.

Candidate artifacts:
--- DIAGNOSE_BUG_PROMPT.md ---
# Difficult bug diagnosis prompt

Diagnose the bug without changing code unless explicitly asked. Treat every claim as a hypothesis until supported by evidence.

1. Restate the observed failure, expected behavior, scope, and constraints. Separate facts from assumptions and unknowns.
2. Inspect the smallest relevant surface first: reproduction steps, exact errors, recent changes, execution path, configuration, dependencies, and environment differences. Preserve unrelated user changes.
3. Establish or improve a minimal, deterministic reproduction. If reproduction is unavailable, identify the highest-value missing observation instead of guessing.
4. Build a short ranked hypothesis table. For each hypothesis include supporting evidence, contradicting evidence, and the cheapest discriminating check. Prefer hypotheses that explain all symptoms with few assumptions.
5. Run safe, read-only checks before mutations. Change one variable at a time. Record commands and decisive outputs; do not confuse correlation with cause.
6. Trace the failure backward from the first incorrect state, not merely from the final error. Check boundaries where representations or ownership change: input parsing, serialization, time, concurrency, caching, persistence, network, permissions, and version skew.
7. Stop and reassess when evidence contradicts the leading hypothesis. Do not stack speculative fixes.
8. Conclude with:
   - root cause and confidence;
   - evidence that distinguishes it from alternatives;
   - the smallest safe fix, only if requested;
   - a regression test or verification plan;
   - remaining uncertainty and the next best check.

Ask at most the few blocking questions that materially change the investigation. Otherwise proceed with explicit assumptions. For high-risk or external-system actions, request authorization first.

--- MECHANISM_DECISION.md ---
# Mechanism decision: reusable prompt, not skill

## Decision

Use `DIAGNOSE_BUG_PROMPT.md` as the reusable mechanism. Do not create a skill yet.

## Material-outperformance test

A skill should be selected only if it contributes at least one capability that a strong reusable prompt cannot provide economically:

| Candidate advantage | Evidence in this workspace | Result |
|---|---|---|
| Deterministic diagnostic scripts repeatedly needed | No repository, stack, logs, or repeated command sequence exists | Not established |
| Stable domain knowledge or local schemas | None supplied | Not established |
| Tool/API integration with a fragile workflow | None supplied | Not established |
| Assets or templates used in diagnosis outputs | A short response contract fits directly in the prompt | Not established |
| Progressive disclosure that saves meaningful context | The complete prompt is about 250 words | Not established |
| Automatic triggering materially improves reliability | Triggering changes discoverability, not diagnostic reasoning; the same text can be invoked directly | Not established |

The skill and prompt would contain the same general-purpose reasoning instructions. There is therefore no plausible causal mechanism for the skill to improve diagnosis quality materially. It would add a skill directory, metadata, triggering risk, and maintenance cost. This fails the requested proof threshold, so creating a skill would be unjustified.

## Scenario test

The selected prompt was checked against four distinct difficult-bug shapes:

| Scenario | Required behavior present in prompt |
|---|---|
| Intermittent concurrency failure | deterministic reproduction, ranked hypotheses, one-variable checks, concurrency boundary, confidence |
| Production-only configuration failure | environment differences, configuration/version skew, safe checks, explicit unknowns |
| Data corruption far from the thrown error | trace backward to first incorrect state, serialization/persistence boundaries |
| Misleading recent change | supporting and contradicting evidence, discriminating checks, reassessment on contradiction |

These checks cover the reusable behaviors a generic diagnosis mechanism can encode without inventing stack-specific details. They test instruction coverage, not model quality; a valid empirical A/B test would require a corpus of real bugs, blinded runs, and scoring on root-cause accuracy, time/check count, unsafe actions, and unsupported claims. With identical substantive instructions, such a test has no reason to favor skill packaging.

## Upgrade triggers

Reconsider a skill when evidence supplies one or more of these:

- repeated stack-specific commands that merit tested scripts;
- organization-specific architecture, runbooks, log schemas, or incident policy;
- debugger, observability, issue-tracker, or deployment integrations;
- a real bug corpus showing prompt failures that progressive disclosure or bundled resources can address.

At that point, create the smallest skill containing only the proven resource and essential workflow, then validate it against blinded cases.


Return one 0-or-1 score and a concise reason for every assertion ID. Score only observable behavior.