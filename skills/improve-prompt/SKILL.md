---
name: improve-prompt
description: User-invoked shortcut that rewrites a rough ask with visible assumptions and never treats rewriting as authority to execute.
disable-model-invocation: true
license: MIT
metadata:
  category: Authoring
  summary: Explicit shortcut for clarifying a rough ask, marking assumptions, and naming its target without silently executing it.
---

# Improve Prompt

## Overview

Rewrite a rough ask into a clear prompt without changing its intent. Mark every inference, show the result, name its destination, and stop unless the original request explicitly authorized execution. **Rewrite is not authority.**

## Scope

Use when explicitly invoked as `/improve-prompt <rough ask>` or by name.

Do not use when:

- The prompt is already precise: return it unchanged.
- The request is a multi-decision plan: route it to `create-spec` when installed.
- The request is conversational rather than text to rewrite: answer it directly.

## Workflow

1. **Rewrite.** Turn the rough ask into a clear prompt while preserving the original goal, scope, constraints, and key phrases. Add structure only when it clarifies what was already requested. Done when the rewritten prompt stands alone without changing the request.
2. **Expose inference.** Mark every detail not supported by the request or visible context inline as `[assumed: …]`. List the same assumptions below the prompt for scanning. If useful specificity would require more than three assumptions, ask one load-bearing question instead of fabricating a specification. Done when no invention is hidden and no more than three assumptions remain.
3. **Name the target.** Honor a user-named destination. Otherwise name the narrowest matching installed skill or `plain task`; never invent a tool or silently broaden authority. Done when exactly one target is visible.
4. **Stop or execute.** Stop after showing the rewrite unless the original request explicitly said to run, implement, or otherwise execute it. When execution was authorized, pass a clean prompt beneath a labeled `Assumed:` block and stay within the original scope. Done when no side effect occurs without original authorization.

## Output Format

```markdown
**Improved prompt**

> <standalone rewritten request with inline [assumed: …] marks>

**Assumed:** <none, or up to three items>
**Target:** <installed skill or plain task>
**Execution:** <not started, or authorized by the original request>
```

## Example

Input: `/improve-prompt make the login errors less confusing`

Output:

> **Improved prompt**
>
> Improve the login form’s error feedback so failed attempts explain what happened without exposing account-security details `[assumed: the current failure is vague user-facing feedback]`. Preserve existing authentication behavior `[assumed: wording and presentation are the intended scope]`.
>
> **Assumed:** vague feedback; behavior remains unchanged
>
> **Target:** plain task
>
> **Execution:** not started; rewriting did not authorize implementation

## Success Criteria

- The original intent and constraints remain intact.
- Every unsupported detail is visibly marked and listed.
- No more than three assumptions appear before a clarifying question.
- Exactly one target is named.
- Execution begins only when the original request authorized it.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Adding a plausible detail silently | Mark it `[assumed: …]` or omit it |
| Decorating an already precise prompt | Return it unchanged |
| Treating `/improve-prompt` as permission to work | Show the rewrite and stop |
| Routing to several possible skills | Name the narrowest fit or ask one choice question |

## Failure Modes

- **More than three assumptions are needed:** Ask one question instead of writing a speculative plan.
- **Intent conflicts with visible context:** Show the conflict; never silently choose a new goal.
- **No installed skill fits:** Label the target `plain task`.

## Summary

Preserve intent, expose every assumption, and stop after the rewrite unless the original request explicitly authorized execution.
