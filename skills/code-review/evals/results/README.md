# Code Review evidence status

The current subject was created from the user-confirmed brief and a structural audit of the existing local `code-review` skill. The source skill at `/Users/adrian/.agents/skills/code-review/SKILL.md` had SHA-256 `6a65cc61114f96db07ec41e3920e67c9c5bf70dd6e0901eb9460ebcb2bdc209f` when inspected on 2026-07-18.

The audit found reusable intent—fixed-point review against standards and a specification—but also found material design gaps:

- its description summarized the entire workflow;
- it required harness-specific parallel subagents for every review;
- it depended on a particular issue-tracker setup;
- it lacked an explicit correctness/regression lens and review-only authority boundary;
- it applied a universal smell catalog that could manufacture low-value findings;
- it pasted two reports without primary validation, deduplication, or severity ranking;
- it blocked for missing base/spec context that can often be inferred or marked unavailable.

The replacement addresses those gaps and includes a deterministic tenant-authorization fixture supporting its Core Example. Per the confirmed cost constraint, no synthetic skill-loaded model sessions ran in this pass. The subject may be structurally validated and used as a candidate, but it has no Tier-2 comparative SHIP claim yet.

`cases.jsonl` preserves one future prompt/skill value case plus missing-spec and authority-pressure regressions. These cases are intentionally unexecuted and unfrozen; they do not count as evidence until a bounded run is separately authorized.

Current subject SHA-256: `e19d16a07be85ad57a8c2684f0dc3f04d4577502c954e141cbdd5d4cc3c4d56b`.

Local checks on 2026-07-18:

- `node scripts/skills.mjs check` — 14 entries clean.
- `node scripts/skills.mjs readme --check` — README up to date.
- Body length — 2,385 words, inside the 1,500–2,500 discipline target.
- Second-person scan — no matches.
- Tenant fixture — baseline returns `404` for cross-tenant export; candidate returns `200`, matching the Core Example's P1 finding.
