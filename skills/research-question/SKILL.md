---
name: research-question
description: Use when the user asks "research this question", "does this version support it", or "what evidence supports this claim" about external facts, compatibility, or documented behavior. Also use for conflicting sources or uncertain applicability.
license: MIT
metadata:
  category: Research
  summary: Resolves a factual question with applicable sources, explicit unknowns, and a bounded decision implication.
---

# Research Question

Answer the exact question from applicable evidence. Keep facts, inference, and unknowns distinguishable.

## Scope

Use for external factual questions that affect a decision.

Do not use for:

- Understanding repository behavior: use `understand-codebase`; inspect the relevant code and trace its behavior if unavailable.
- Diagnosing a reproducible failure: use `diagnose`; reproduce and discriminate causal hypotheses if unavailable.
- Choosing a product strategy or writing a feature specification: return the research evidence to the owning decision workflow.

## Workflow

### 1. Bound the question

Translate the request into one answerable question.
Inspect supplied version, environment, date, and region constraints before searching.
Name the decision the answer will affect.
Ask for a missing fact only when it changes the answer and cannot be inspected.

Done when the question and applicability constraints are explicit.

### 2. Gather applicable evidence

Use supplied primary documents when the request limits research to them.
Otherwise retrieve current primary sources for unstable facts.
Read the supporting passage rather than treating a search snippet as evidence.
Match each source's version and scope to the actual target.
Keep outdated or conflicting evidence visible when it explains a different answer.
Record the source URL or local path, revision when available, and observation date.
Label offline or inaccessible evidence precisely.

Done when every material claim has an applicable source or an explicit evidence gap.

### 3. Resolve the answer

Lead with the supported answer or the precise condition preventing one.
Link each material claim to its source.
Explain conflicts through version, scope, date, or remaining uncertainty.
Label reasoning beyond a source as inference.
Translate the answer into the requested decision implication.
Name the smallest next lookup for any decision-changing unknown.

Done when the reader can distinguish the answer from its conditions and limits.

### 4. Save the result

Follow the requested location or existing research convention.
Use `docs/research/<topic>.md` only when a saved report is requested without a convention.
Leave code, dependencies, and settled product decisions untouched unless separately authorized.
Report the artifact and remaining evidence gap.

Done when the answer is inspectable and its authority stays within research.

## Worked example

A project declares upload SDK 1.4; its newer 2.0 guide describes byte-offset resume.
The 1.4 guide only supports restarting the whole file.

> SDK 1.4 restarts uploads from byte zero according to `vendor/sdk-1.4.md`.
> The resume API in `vendor/sdk-2.0.md` does not apply to the installed dependency.
> Promise whole-file retries until a deliberate upgrade verifies both client and server compatibility.

## Verification

Check every conclusion against the actual version and supporting passage.
Check that citations resolve and no unavailable lookup is described as completed.
Remove claims that outrun the sources.
Keep the final answer bounded by applicable evidence.
