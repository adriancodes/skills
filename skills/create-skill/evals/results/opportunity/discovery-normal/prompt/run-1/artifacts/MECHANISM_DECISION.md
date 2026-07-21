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
