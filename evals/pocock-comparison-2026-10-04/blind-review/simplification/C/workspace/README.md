# Legacy flags fixture

No reliable tests exist. `enabledFlagNames(flags)` is the documented public export. It returns trimmed names for entries whose `enabled` value is exactly `true`, preserving input order.

Examples:

- `[{ name: " beta ", enabled: true }]` returns `["beta"]`.
- `[{ name: "off", enabled: 1 }]` returns `[]`.
