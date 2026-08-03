---
name: understand-codebase
description: >
  Use when the user asks to "understand this codebase", "how does this
  work?", "trace this feature", or needs onboarding, an architecture
  explanation, or answers about unfamiliar code. Also use for read-only
  code-path questions before a change.
license: MIT
metadata:
  category: Planning
  summary: Builds a cited, read-only mental model of an unfamiliar codebase and answers questions with diagrams when they clarify the system.
---

# Understand Codebase

## Overview

Build a *targeted* mental model from inspected evidence, then answer the actual question. Stay read-only: explain the current system without drifting into review, diagnosis, recommendations, or implementation.

## When to Use

- Onboard an engineer to an unfamiliar repository or subsystem.
- Answer "how does this work?", "where does this happen?", or "what calls this?"
- Trace a feature, request, job, data flow, dependency, configuration path, or state transition.
- Establish current-state architecture before a separately requested change.
- Answer follow-up questions from the mental model already built in this conversation.

## Do Not Use When

- The user explicitly asks for `zoom-out`; that skill provides the higher-level contextual map.
- Debugging a failure or performance regression: use `diagnose`.
- Reviewing a diff or branch: use `code-review`.
- Designing or improving module boundaries: use `codebase-design` or `improve-codebase-architecture`.
- External primary-source research or a persistent research report: use `research`.
- Refactoring, recommending changes, implementing, or otherwise acting: use the corresponding action skill — code reading is only its internal prerequisite.

## Required Context

Establish only the context needed to choose a reliable starting seam:

- The question or learning goal
- The repository, package, subsystem, or feature in scope
- Applicable repository instructions and local terminology
- The desired depth when explicitly requested

For a clear question, infer these and begin. For a vague request such as "help me understand this repo," ask at most two pointed questions — one about the goal, one about the relevant area — and wait for answers before inspecting. Done when the exploration has a stated or safely inferred question and boundary.

## Workflow

### 1. Choose the exploration mode

Classify the request as onboarding, architecture Q&A, or change preparation — routing, not a questionnaire:

- **Onboarding:** identify the smallest useful system boundary and its main responsibilities.
- **Architecture Q&A:** start from the named behavior, symbol, boundary, or question.
- **Change preparation:** explain the current path and affected boundaries; leave change design to the follow-on task.

Ask only when two plausible interpretations would drive materially different exploration, and never more than two questions before inspection. Done when exactly one exploration target is selected.

### 2. Find an evidence-bearing starting seam

Read applicable repository instructions first. Inspect manifests, entry points, tests, configuration, glossary entries, and architecture decisions only when they can locate or explain the target. Prefer `rg --files` for file discovery and `rg` for symbols, routes, events, configuration keys, and test names.

Start from the strongest available seam: an externally visible entry point, a caller, a focused test, a configuration key, or the named symbol. Never infer behavior from filenames or directory structure alone. Done when an inspected file or test directly anchors the requested behavior.

### 3. Trace only the relevant path

Follow calls, imports, data transformations, state changes, configuration, and asynchronous boundaries far enough to support the answer. Inspect representative tests to confirm important branches and observable behavior. Stop when a branch no longer affects the question.

Maintain an evidence ledger while reading:

| Claim | Evidence | Status |
|-------|----------|--------|
| Request validation happens before persistence | `src/http/router.ts` → `createReport` | Confirmed |
| The queue is durable across restarts | Queue adapter found; deployment config absent | Unknown |
| Two handlers may share a transaction | Same client is passed through both calls | Inference |

Record file paths plus symbols, and line numbers when the harness exposes stable line references. Mark each material claim as confirmed, inference, or unknown. Done when every part of the answer has inspected evidence or an explicit uncertainty label.

### 4. Explain the system answer-first

Lead with the direct answer, then the shortest code path that makes it auditable. Name both symbols at every material transition and cite each symbol's implementation file, in the form `caller` (`path`) → `callee` (`path`). A filename-only citation or an unnamed helper call is incomplete. Include the entry point, storage or state effects, asynchronous work, and externally visible outcomes that matter to the question.

Use a diagram when three or more components, a non-linear boundary, or a state sequence is materially clearer visually. For a simple flow, emit Mermaid with a compact ASCII fallback. For a complex relationship, use an available visualization tool if clearer than Mermaid; otherwise use Mermaid. Keep diagrams in the conversation unless the user explicitly requests a persistent artifact.

Ground every diagram node and edge in inspected code cited in the surrounding prose; remove decorative or speculative elements.

Complete the answer with:

1. The direct answer
2. The relevant code path with file and symbol citations
3. A diagram only when it earns its space
4. Confirmed facts, consequential inferences, and remaining unknowns
5. Relevant tests or configuration that substantiate the explanation

Done when the answer is understandable without the diagram, auditable from its citations, and no broader than the question requires.

### 5. Reuse and revise the mental model

Keep the mental model in the current conversation. For follow-ups, reuse confirmed evidence, inspect only newly relevant paths, and revise earlier claims when evidence contradicts them — stating corrections explicitly, never silently changing the explanation.

Do not write repository maps, architecture documents, or notes unless the user starts a separate documentation task. Done when the follow-up is answered from current evidence plus the smallest necessary additional inspection.

## Core Example

Request: "Help me understand this repository."

Ask before inspection:

1. "What is the goal: onboarding, an architecture answer, or preparation for a change?"
2. "Which feature or area should I use as the starting point?"

If the answers are "onboard" and "report generation," trace the report entry point through validation, service calls, storage, queued work, and notification side effects. Answer with the main flow first, cite every transition, show a small Mermaid flow when the boundaries would otherwise be hard to scan, and label any unverified deployment behavior as unknown. Make no workspace changes and offer no refactor advice.

## Tool Guidance

**Prefer:**

- Read-only file inspection, `rg --files`, and `rg`
- Focused test source and existing test results as behavioral evidence
- Version-control history only when the question is historical
- Mermaid for simple flows and an available visualization tool for complex relationships

**Avoid:**

- Whole-repository crawls before a target exists
- Broad file dumps that replace tracing with summarization
- Guessing runtime behavior from names, types, or folder layout
- Running commands that mutate files, dependencies, caches, generated output, or external systems

## Success Criteria

- Answer the user's actual question before presenting background.
- Cite every material behavioral claim to an inspected file and symbol.
- Trace all relevant synchronous, asynchronous, state, configuration, and test boundaries.
- Separate confirmed facts, inferences, and unknowns.
- Use visuals only when they materially improve comprehension; ground every node and edge.
- Leave the workspace and external systems unchanged.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Touring the entire repository | Trace only the paths supporting one question. |
| Answering a vague request immediately | Ask at most two pointed orientation questions, then wait. |
| Listing files without explaining behavior | Connect cited symbols into a causal path. |
| Presenting assumptions as architecture facts | Label inference and unknowns explicitly. |
| Drawing a generic diagram | Include only inspected, cited nodes and edges. |
| Adding improvement advice | Explain current behavior; leave action to a follow-on task. |

## Failure Modes

- **No reliable starting seam:** Report what was searched and ask one targeted question that can locate the behavior.
- **Generated, vendored, or inaccessible implementation:** Explain the visible boundary and mark behavior beyond it unknown.
- **Conflicting code and tests:** Present the conflict with both citations; never choose a truth without runtime evidence.
- **Question requires execution to resolve:** Ask permission for the smallest read-only or safely isolated observation, or leave the claim unknown.
- **Request crosses into action:** Finish the current-state explanation, then stop and route the new work to the appropriate skill or task.

## Summary

Build the smallest evidence-backed mental model that answers the question. Stay read-only, cite the path, distinguish facts from uncertainty, and stop when the explanation is complete.
