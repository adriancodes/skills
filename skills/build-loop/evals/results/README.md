# build-loop evidence status

One bounded partial pass has been recorded:
[`tier2scope-2026-08-01.md`](tier2scope-2026-08-01.md) — Tier-2-scope
evidence against the Tier-3 declaration (1 value pair on
`heldout-audit-repair`, both regressions; `heldout-docs-sync` not run;
non-blind scorer). Its claim is capped at targeted comparative support;
**the full Tier-3 suite remains outstanding**, so the skill still carries
no SHIP claim at any tier.

The eval package (brief, cases, fixture) was authored on 2026-08-01 from
the shipped skill; beyond the recorded pass above, the cases are
unexecuted and unfrozen and count as no evidence until a bounded run is
separately authorized.

Subject at authoring time:

- `SKILL.md` — SHA-256
  `64a60e87f8514363b20e71f1fda5e2a61e432c8be53e73cff3504a72ade4a0eb`
- `references/loop-formats.md` — SHA-256
  `797065b680ad5928b612c4d4af4027d3c31bf300f0a651359115030f8d69ebb5`

## Declared tier

**Tier 3 (formal)** — build-loop designs unattended automation, the
Tier-3 consequence class by definition. Until a full Tier-3 suite passes,
the skill carries no SHIP claim at any tier; partial runs may be
recorded here but claimed only as what they are.

## Arms required

- **Discovery** (new-skill): no-instruction vs strongest-prompt on a
  held-out loop-design request — 3 discovery cases for Tier 3.
- **Value**: `prompt` (the baseline comparator in `../skill-brief.md`)
  vs `skill` on each held-out case (`heldout-docs-sync`,
  `heldout-audit-repair`, plus a third held-out case still to be
  authored for full Tier 3).
- **Regression**: `skill` arm only (`regression-unknown-cost`,
  `regression-skip-l1-pressure`).
- **Trigger**: installed-description routing arm for the
  `trigger-positive-*` / `trigger-negative-*` cases; the current 3+2 set
  must grow to 5+5 for a Tier-3 claim.

## Sessions per arm

3 repetitions per arm per held-out case (Tier 3), so 6 actor sessions
per value case; 3 sessions per regression case; 1 session per trigger
case per routing pass. Two fresh adversarial probe rounds follow any
passing suite before a SHIP claim.

## Preserve when runs happen

For every session, under `results/<case-id>/<arm>/run-N/`:

- `actor-prompt.md` — the exact prompt handed to the actor
- `actor-output.md` — full final output, including the produced
  LOOP.md/STATE.md/loop-prompt/adapter texts
- `actor-trace.jsonl` and `actor-stderr.txt`
- `result.json` — per-assertion verdicts from the executable scorer,
  blinded to arm wherever judgment is involved

Plus, per suite run: the frozen `cases.jsonl` hash, subject SHA-256s,
model and harness identifiers, run date, per-session and total cost, and
the scorer version. Evidence claims never exceed the recorded tier,
harness, model, and date.
