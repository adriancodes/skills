# Canonical SKILL.md Body Template

Copy and adapt this template when creating new skills. Every section exists for a specific reason — omit only with explicit justification.

## Template

```markdown
---
name: kebab-case-skill-name
description: >
  Use when [triggering condition 1], [triggering condition 2],
  or the user asks to "exact phrase 1", "exact phrase 2".
  Also when [symptom or error keyword].
---

# Skill Name

## Overview

[Core principle in 1–2 sentences. What problem does this skill solve and why does it matter?]

## When to Use

- [Trigger scenario A — specific user request or situation]
- [Trigger scenario B — symptom or error message]
- [Trigger scenario C — context that signals this skill applies]

## Do Not Use When

- [Exclusion A — what this skill is NOT for]
- [Exclusion B — adjacent task that requires a different skill]
- [Exclusion C — condition where applying this skill would be harmful]

## Required Context

[What the agent must gather or verify before starting the workflow. Pre-flight checks.]

- [Input 1 — files, logs, or information needed]
- [Input 2 — state that must be true before proceeding]

## Workflow

1. [First step — imperative voice, specific action]
2. [Second step — what to do with the gathered context]
3. [Third step — core execution of the skill's purpose]
4. [Fourth step — validation or verification]
5. [Fifth step — summarize results, communicate to user]

## Tool Guidance

**Prefer:**
- [Tool A — and why it's appropriate here]

**Avoid:**
- [Tool B — and why it's inappropriate or dangerous here]

**Constraints:**
- [Safety rule — e.g., "never force-push without user confirmation"]

## Success Criteria

- [Condition 1 — measurable definition of done]
- [Condition 2 — quality bar that must be met]

## Quick Reference

| Scenario | Action |
|----------|--------|
| [Common case 1] | [What to do] |
| [Common case 2] | [What to do] |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| [Error pattern 1] | [Correct approach] |
| [Error pattern 2] | [Correct approach] |

## Failure Modes

- **[Condition A]:** Stop and escalate to the user. [Why this can't be handled automatically.]
- **[Condition B]:** Ask for more context. [What's missing and why it matters.]
- **[Condition C]:** Known limitation. [What the skill cannot do and what alternatives exist.]

## Additional Resources

- **`references/detailed-guide.md`** — [What it contains and when to consult it]
- **`examples/working-example.sh`** — [What it demonstrates]
- **`scripts/utility.sh`** — [What it does — can be executed without reading]
```

Optional frontmatter per the open Agent Skills spec — `license`, `compatibility` (environment requirements like git or Python versions), `metadata`, `allowed-tools` (experimental) — is defined in `references/rules.md` (Frontmatter Fields). Add `compatibility` whenever the skill ships scripts with tooling dependencies.

## Section Rationale

| Section | Why It Exists | Source |
|---------|---------------|--------|
| Overview | Quick relevance check — should the agent keep reading? | All approaches |
| When to Use | Confirms the description match; adds keyword surface area | All approaches |
| Do Not Use When | Prevents misapplication — most commonly missing section | Codex |
| Required Context | Pre-flight checks prevent wasted work | Gemini, Codex |
| Workflow | The core value of the skill — procedural, not advisory | All approaches |
| Tool Guidance | Prevents unsafe or inefficient tool choices | Codex |
| Success Criteria | Defines "done" — prevents premature completion | Codex, Gemini |
| Quick Reference | Scannable lookup for repeat use | Opus |
| Common Mistakes | Preemptive error correction | Opus |
| Failure Modes | Teaches the agent when to STOP — prevents overreach | Codex |
| Additional Resources | Makes supporting files discoverable | Opus, Gemini |

## Writing Workflow Steps

End every step on a **completion criterion** — the condition that tells the agent the step is done. Two properties make it bind:

- **Checkable** — the agent can tell done from not-done. "All fixtures pass on a full re-run" is checkable; "the output looks right" is not.
- **Exhaustive where thoroughness matters** — "every modified file accounted for" forces the digging; "produce a change list" invites stopping early.

A vague criterion invites **premature completion**: the agent's attention slips from the work to *being done*, and the steps it can see ahead pull it forward. Defend in this order:

1. **Sharpen the criterion first** — cheap and local. A checkable bound resists the pull no matter how many later steps are visible.
2. **Split the sequence only if** the criterion is irreducibly fuzzy *and* the rush is actually observed — move the later steps behind a subagent dispatch or a follow-on skill so they leave the agent's view. Splitting on suspicion alone fragments the skill for nothing.

## Writing Context Pointers

Every entry in "Additional Resources" — and every inline file reference — is a **context pointer**: its *wording*, not its target, decides whether the agent ever loads the material. State when to load, not only what the target contains.

| Weak pointer | Sharp pointer |
|--------------|---------------|
| "`references/eval-loop.md` — the eval loop" | "`references/eval-loop.md` — fixture catalog and stop condition. Load before writing any fixture." |

A must-have target behind a weakly worded pointer is a variance bug: some runs load it, some don't. Fix the wording first; inline the material only if sharpening fails.

## Supporting Directories

Extract into these in Phase 3 — after drafting, never before.

| Resource | When to Extract | Context Cost |
|----------|----------------|--------------|
| `scripts/` | Same code repeated across invocations; deterministic reliability needed | Near-zero (executed, sometimes read first for inspection) |
| `references/` | Detailed docs, schemas, patterns > 500 words | On-demand only |
| `assets/` | Templates, images, boilerplate copied into output | Zero (copied, not read) |
| `examples/` | Complete, runnable demonstrations | On-demand only |
| `evals/` | Comparative cases, rubric, reproduction instructions, and raw results used to decide whether the skill ships | Development-only; never loaded at runtime |

## Adapting the Template

### For Simple Technique Skills

Merge or remove sections:
- Combine "When to Use" and "Do Not Use When" into a single "Scope" section
- Remove "Required Context" if no pre-flight checks needed
- Remove "Tool Guidance" if no specific tool constraints
- Keep "Quick Reference" as the primary reference surface

### For Discipline-Enforcing Skills

Add sections (see `references/bulletproofing-guide.md`):
- **Rationalization Table** after "Common Mistakes"
- **Red Flags** after "Failure Modes"
- **Foundational Principle** in "Overview" (e.g., "Violating the letter IS violating the spirit.")

### For Reference/API Skills

Adjust emphasis:
- "Workflow" becomes "Lookup Procedure" — how to find and apply information
- "Quick Reference" becomes the primary content — tables, syntax, examples
- Most detailed content lives in `references/` files
- "Common Mistakes" focuses on misuse of the API/reference
