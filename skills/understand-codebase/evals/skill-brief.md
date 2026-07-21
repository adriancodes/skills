# Confirmed Skill Brief: understand-codebase

Confirmed by the user on 2026-07-17.

- **Problem:** Engineers need reliable codebase understanding without remembering and rewriting a detailed exploration prompt.
- **Users:** Engineers onboarding to, investigating, or preparing to change an unfamiliar codebase.
- **Core job:** Build an evidence-backed mental model at the depth implied by the request, then answer questions from it.
- **Modes:** Onboarding, architecture questions, and change preparation. Infer the mode; ask only when genuinely ambiguous.
- **Vague invocation:** Ask at most two pointed questions about the goal and relevant area before inspection.
- **Exploration:** Follow only the paths, dependencies, configuration, and tests needed for a reliable answer.
- **Answer:** Answer first, then show the relevant code path with file and symbol citations. Separate confirmed facts, inference, and unknowns.
- **Visuals:** Prefer diagrams when they materially clarify relationships, flows, boundaries, or state changes. Use Mermaid with an ASCII fallback for simple diagrams and an available visualization tool for complex diagrams. Support every node and edge with inspected code.
- **Boundary:** Remain read-only. Do not recommend, review, debug, refactor, implement, or create persistent documentation unless the user starts another task.
- **Invocation:** Conservatively model-invoked for clear exploration requests and explicitly invokable as `/understand-codebase`.
- **Non-triggers:** Action-oriented work where code reading is only an internal prerequisite.
- **Success:** Correct cited answers, relevant paths traced far enough to support them, no unsupported claims, no unrelated repository crawl, and no workspace changes.
- **Evidence:** Tier 2 targeted comparative support on Codex.
- **Cost:** Prefer no more than 50% runtime premium. Prompt-equivalent output may still win when reliable invocation removes repeated prompt-recall and instruction burden.
- **Assumption accepted:** The mental model lasts for the current conversation; no persistent artifact is created by default.
