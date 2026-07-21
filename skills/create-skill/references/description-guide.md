# Writing Effective Skill Descriptions

The description field is the highest-leverage component of any skill. It determines whether the skill is ever triggered. An excellent skill with a poor description is an invisible skill.

**This guide applies to model-invoked skills only.** A user-invoked skill (`disable-model-invocation: true` — see `references/rules.md`, Invocation) strips the description from the agent's reach: write a one-line human-facing summary instead, with trigger lists omitted.

## Format Rules

- **Max length:** capped — see `references/rules.md` (the description is loaded into every conversation, so its length is bounded)
- **Voice:** Third person ("This skill should be used when..." or "Use when...")
- **Content:** Triggering conditions ONLY — never workflow, process, or capability summaries
- **Keywords:** Include quoted trigger phrases, symptoms, and error messages

## Skeleton Template

Copy and fill in. The structure handles every required element:

```yaml
description: >
  Use when [primary trigger condition], [secondary trigger condition],
  or the user asks to "<exact phrase 1>", "<exact phrase 2>",
  "<exact phrase 3>". Also when [symptom keyword]
  or [error message string].
```

Fill rules:
- `[primary trigger condition]` — the typical situation that should invoke the skill
- `[secondary trigger condition]` — an adjacent but related situation
- `"<exact phrase>"` — words users actually type, in quotes. Include casual phrasings, abbreviations, typos if realistic
- `[symptom keyword]` — what the problem looks like ("flaky", "hanging", "wrong format")
- `[error message string]` — exact error text agents will encounter ("ENOTEMPTY", "Hook timed out")

## The Critical Anti-Pattern: Workflow Summaries

**Never describe what the skill DOES in the description. Only describe WHEN to use it.**

This was discovered through empirical testing, not theory. When a description summarizes the skill's workflow, agents treat the summary as the complete instruction and skip reading the body.

### What Happened

A skill for executing implementation plans had this description:

```yaml
description: Use when executing plans - dispatches subagent per task with code review between tasks
```

The skill's body contained a detailed flowchart specifying TWO code reviews: one for spec compliance, one for code quality. But agents consistently performed only ONE review — because the description said "code review" (singular) and the agent treated that as sufficient.

When the description was changed to:

```yaml
description: Use when executing implementation plans with independent tasks in the current session
```

Agents correctly read the full flowchart and performed both reviews.

### Why This Happens

Agents optimize for efficiency. A description that summarizes the process provides a "good enough" shortcut. The agent concludes it already knows what to do and skips the body entirely — or reads it superficially, anchored to the summary it already absorbed.

## Examples

### Bad Descriptions

```yaml
# Too vague, no triggers
description: Provides guidance for working with hooks.

# Wrong person
description: I can help you with async tests when they're flaky.

# Summarizes workflow — agent will follow this instead of the body
description: Use for TDD - write test first, watch it fail, write minimal code, refactor.

# Summarizes capability, not triggers
description: Diagnose and fix backend API failures safely and minimally.

# Technology-specific when skill is general
description: Use when tests use setTimeout/sleep and are flaky.
```

### Good Descriptions

```yaml
# Trigger-focused, specific phrases, symptoms — synonym variants capped at 2
description: >
  Use when creating a new skill, improving an existing skill,
  or the user asks to "create a skill", "write a skill",
  "improve this skill". Also when skills produce inconsistent
  or low-quality results.

# Trigger conditions only, no process summary
description: >
  Use when implementing any feature or bugfix, before writing
  implementation code.

# Specific triggers with quoted phrases and symptoms
description: >
  This skill should be used when the user asks to "create a hook",
  "add a PreToolUse hook", "validate tool use", or mentions
  hook events (PreToolUse, PostToolUse, Stop).

# Error-message and symptom keywords for discovery
description: >
  Use when tests have race conditions, timing dependencies,
  or pass/fail inconsistently. Also when encountering
  "timeout", "flaky", or "hanging" test behavior.
```

## Synonym Budget

Each quoted phrase is a retrieval key, but every phrase also spends always-loaded context. Spend the budget on **distinct request branches** (create, improve, review), not on rewrites of one branch: "create a skill" and "write a skill" both earn their keep as separate keys; adding "build a skill" and "make a skill" pays permanent context for marginal recall. Cap synonym variants of a single branch at the 2 strongest (`references/rules.md`, Description Rules).

## Description Checklist

The authoritative checklist lives in `references/rules.md` (Description Rules). This guide explains *why* each rule matters; the registry owns the rules themselves. Run them from the registry, not from a copy here.

## Keyword Placement Strategy

The description is the primary discovery surface, but it has a 500-character limit. Distribute keywords across the full SKILL.md:

| Keyword Type | Primary Location | Secondary Location |
|-------------|-----------------|-------------------|
| Trigger phrases | Description | "When to Use" section |
| Error messages | "When to Use" | "Failure Modes" |
| Symptoms | Description | "Common Mistakes" |
| Synonyms | "When to Use" | Throughout body |
| Tool/library names | Description (if tech-specific) | "Tool Guidance" |
