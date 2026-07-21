# Current Tier-1 Smoke Test

Status: **SHIP — Tier 1 smoke-tested**

Run the three cases with `smoke-codex.mjs`, then execute `node smoke-score.mjs`. Results are stored under the current subject-hash prefix so a changed skill cannot overwrite prior evidence.

Subject `c37a3e23c937880d94cc985f9bcedc9ede1a23d388f03fa6d247e0999fc76bc9` (`brevity`) passed all seven Tier-1 probes on Codex CLI 0.144.1 / `gpt-5.6-sol`:

- normal recommendation, depth override, and destructive safety behavior;
- natural “tldr” and “keep it short” discovery;
- no load for explicit depth or caveman requests when the caveman competitor is installed.

Total usage: 148,346 tokens across 7 actor sessions.

Historical subject `7ed2b05f7477d029e001ef537b01ff2d542787398c35766e17d4e1ac75dad60d` (`tldr`) remains preserved under its own hash.

See `current-verdict.json` and the subject-hash directories for the mechanical result, raw traces, and outputs.
