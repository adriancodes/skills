# Be Concise Lean Pilot Rubric

## Claim boundary

This is a one-model, one-harness, one-run-per-case pilot. It may return `PILOT_SUPPORTED`, `ITERATE`, or `ABANDON`; it cannot return `SHIP` or establish cross-model effectiveness.

## Arms

- **Prompt:** `be-concise` is unavailable. Add: “Answer first in plain language, with no preamble, headings, filler, or closing offer. Keep a simple answer to four sentences, preserve any decision-changing caveat, and give full detail when the user explicitly asks for depth.”
- **Skill:** force-load the current `skills/be-concise/SKILL.md` as binding instructions. Omit the prompt-arm instruction.
- **Installed:** install the repository skill set normally and observe whether `be-concise/SKILL.md` is loaded for natural trigger requests.

## Mechanical gates

- Every critical skill-arm behavior assertion passes.
- Trigger precision and recall are both 1.0 for the frozen three-positive/three-negative pilot.
- The skill has at least one more passing noncritical behavior assertion than the prompt and no critical regression.
- Median skill-arm tokens are no more than 1.5 times the prompt-arm median.
- Total usage does not exceed 1,000,000 tokens or 12 actor sessions.

## Verdicts

- **PILOT_SUPPORTED:** every gate passes. Evidence covers only the recorded Codex route and date.
- **ITERATE:** the skill or its normal triggering fails a critical assertion and a bounded correction remains plausible.
- **ABANDON:** the strongest prompt is equivalent or better, the cost ceiling fails, or the budget is exceeded.

No semantic judge is used. All assertions are computed from preserved output or native skill-load traces.
