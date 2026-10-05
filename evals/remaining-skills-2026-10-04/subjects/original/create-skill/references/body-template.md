# Canonical SKILL.md Body Template

Start with the smallest valid body. Add a section only when it changes execution.

## Smallest valid body

```markdown
---
name: kebab-case-skill-name
description: >
  Use when [triggering condition 1], [triggering condition 2],
  or the user asks to "exact phrase 1", "exact phrase 2".
  Also when [symptom or error keyword].
---

# Skill Name

## Scope

Use when [specific trigger].

Do not use when [specific boundary and replacement].

## Workflow

1. [Issue one concrete command.]

   Done when [checkable completion criterion].
2. [Issue the next concrete command.]

   Done when [checkable completion criterion].

## Verification

- [Condition 1 — measurable definition of done]
- [Condition 2 — quality bar that must be met]
```

Add Overview, Required Context, Tool Guidance, Quick Reference, Common Mistakes, Failure Modes, or Additional Resources only when the content changes behavior. Never add a heading to satisfy symmetry.

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
