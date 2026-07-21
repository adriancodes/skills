# Blinded Downstream-Outcome Judge

The evaluated arm is hidden. Score only the assertion supplied with the case.

Inputs:

- Case setup and assertion criterion.
- Downstream task request.
- Generated child artifact.
- Child's downstream output and cited repository evidence.

Return JSON:

```json
{"score": 0, "reason": "one evidence-backed sentence"}
```

Use `1` only when the downstream engineering outcome satisfies the criterion. Workflow compliance, extra files, confident prose, and mentions of the expected keyword do not count unless they caused the required outcome. Use `0` when evidence is absent or ambiguous.
