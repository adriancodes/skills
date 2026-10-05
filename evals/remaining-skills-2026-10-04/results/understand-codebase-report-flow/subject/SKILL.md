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

Build a *targeted* mental model from inspected evidence, then answer the actual question. Stay read-only: explain the current system without drifting into review, diagnosis, recommendations, or implementation.

## Scope

Use for onboarding, current-state questions, feature tracing, or explanation before a separately requested change.

Do not use when:

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

For a clear question, infer these and begin. For a vague request, ask at most two questions. Ask one about the goal and one about the area. Wait before inspecting.

Done when the exploration has a question and boundary.

## Workflow

### 1. Choose the exploration mode

Classify the request as onboarding, architecture Q&A, or change preparation — routing, not a questionnaire:

- **Onboarding:** identify the smallest useful boundary and its responsibilities.
- **Architecture Q&A:** start from the named behavior, symbol, or boundary.
- **Change preparation:** explain the current path and affected boundaries. Leave design to the follow-on task.

Ask only when plausible interpretations require different exploration. Ask no more than two questions before inspection.

Done when one target is selected.

### 2. Find an evidence-bearing starting seam

Read applicable repository instructions first. Inspect manifests, entry points, tests, configuration, glossary entries, and architecture decisions only when they can locate or explain the target. Prefer `rg --files` for file discovery and `rg` for symbols, routes, events, configuration keys, and test names.

Start from the strongest seam: entry point, caller, focused test, configuration key, or named symbol. Never infer behavior from filenames alone.

Done when an inspected file or test anchors the behavior.

### 3. Trace only the relevant path

Follow calls, imports, data, state, configuration, and asynchronous boundaries. Inspect representative tests for important branches. Stop when a branch no longer affects the question.

Maintain an evidence ledger while reading:

Record each claim with its evidence and status.

Record files and symbols. Add stable line numbers when available. Mark each claim confirmed, inferred, or unknown.

Done when every answer part has evidence or an uncertainty label.

### 4. Explain the system answer-first

Lead with the direct answer. Then show the shortest auditable code path. Name both symbols at every transition. Cite them as `caller` (`path`) → `callee` (`path`). Filename-only citations are incomplete. Include only relevant entry points, state effects, async work, and visible outcomes.

Use a diagram when it materially clarifies at least three components or a state sequence. Use Mermaid plus compact ASCII for simple flows. Use an available visualization tool for complex relationships. Keep diagrams in chat unless persistence was requested.

Ground every diagram node and edge in inspected code cited in the surrounding prose; remove decorative or speculative elements.

Complete the answer with:

1. The direct answer
2. The relevant code path with file and symbol citations
3. A diagram only when it earns its space
4. Confirmed facts, consequential inferences, and remaining unknowns
5. Relevant tests or configuration that substantiate the explanation

Done when the prose stands alone, citations are auditable, and scope matches the question.

### 5. Reuse and revise the mental model

Keep the mental model in the current conversation. Reuse confirmed evidence on follow-ups. Inspect only newly relevant paths. Correct contradicted claims explicitly.

Do not write repository maps, architecture documents, or notes unless the user starts a separate documentation task. Done when the follow-up is answered from current evidence plus the smallest necessary additional inspection.

## Core Example

For report generation, trace the inspected entry, validation, service, storage, queue, and notification symbols. Cite transitions and label unverified deployment behavior unknown. Read [references/examples.md](references/examples.md) for an onboarding example.

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

## Failure Modes

- **No reliable starting seam:** Report what was searched and ask one targeted question that can locate the behavior.
- **Generated, vendored, or inaccessible implementation:** Explain the visible boundary and mark behavior beyond it unknown.
- **Conflicting code and tests:** Present the conflict with both citations; never choose a truth without runtime evidence.
- **Question requires execution to resolve:** Ask permission for the smallest read-only or safely isolated observation, or leave the claim unknown.
- **Request crosses into action:** finish the current-state explanation. Then route the new work and stop.

## Verification

Answer the actual question with cited symbols and transitions. Label consequential uncertainty and leave the workspace and external systems unchanged.
