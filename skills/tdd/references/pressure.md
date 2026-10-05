# Pressure and troubleshooting

Use when urgency, authority, sunk cost, or an uncertain shortcut threatens the workflow. The main skill retains its governing rules.

## Common Rationalizations

| Shortcut | Reality |
|---|---|
| “The implementation is tiny; test afterward.” | First-run green does not prove sensitivity to missing behavior. |
| “Existing tests are green.” | They do not encode the new contract. |
| “The test failed, so red counts.” | Only the expected behavioral assertion counts. |
| “A database mock is enough.” | A mock does not prove persistence. |
| “Reverting code wastes time.” | Restore causal evidence by reverting only premature agent work. |
| “Refactor while making it pass.” | Reach minimal green first. |
| “Relaxing the assertion is equivalent.” | The contract controls the expectation. |

## Red Flags

- “Tests can come after this small part.”
- “Any failure counts as red.”
- “Keep the implementation nearby as reference.”
- “Update the snapshot and inspect it later.”
- “This mock is close enough to the real boundary.”
- “The deadline overrides test order.”

Return to the unfinished workflow step when any red flag appears.

