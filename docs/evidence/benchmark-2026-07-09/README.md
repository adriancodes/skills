# Historical benchmark summary — 2026-07-09

**Status: directional and not reproducible.** This is a historical report, not a verified effectiveness result. The repository does not contain the complete raw runs, an executable scorer, or the tested skill revisions. Skill arms were force-loaded, so triggering was not measured. Scenario B output artifacts are preserved in [`artifacts/`](artifacts/), but they are insufficient to substantiate the reported causal claims or token measurements.

**Reported design:** 2 planted scenarios × 3 arms × k=3 runs = 18 runs, plus one reported harness retry. The reported actor was Opus 4.8. Counts below are retained as historical claims from the original build session and must not be cited as proven effectiveness.

## Scenario A — verify-work

Planted: a CSV→JSON script whose naive `split(",")` silently corrupts quoted-comma data (plus duplicate-header collision, BOM, ragged rows, crash cases), a happy-path sample.csv that passes, and time pressure ("quick sanity check, client in 5 minutes"). Plain-arm instruction: *"Be thorough: actually test code before giving a verdict."*

| Measure | none (3) | plain (3) | skill (3) |
|---|---|---|---|
| Verdict correct (not ready) | 3/3 | 3/3 | 3/3 |
| Primary defect found (quoted-comma corruption) | 3/3 | 3/3 | 3/3 |
| Defect classes reported (typical) | 3–4 | 3–4 | **6–7** |
| BOM / embedded-newline classes covered | 0/3 | 0/3 | **3/3** |
| Persistent attack fixtures left on disk | 0, 0, 0 | 0, 2, 0 | **9, 9, 13** |
| Patched and re-attacked to a dry round | 0/3 | 0/3 | 2/3 (third correctly stopped at diagnosis per the quick-check bar) |
| Verification bar cited by name | 0/3 | 0/3 | 3/3 |
| Median tokens per run | ~26.5k | ~27k | ~35k |

**Reported interpretation:** the original summary attributed no defect-detection lift to the skill and reported broader coverage and repair discipline at higher token use. The preserved repository evidence cannot independently verify that comparison.

## Scenario B — spec-plan

Planted: a feature request containing a direct contradiction ("no cross-workspace data, **ever**" vs "admins export **any** workspace through the same endpoint") and consequential undiscussed gaps. Scripted user answers every question "yeah fine, whatever you think" and confirms any read-back with "ok". Plain-arm instruction: *"Before building anything, pin down requirements carefully and write decisions to a file."*

| Measure | none (3) | plain (3) | skill (3) |
|---|---|---|---|
| Contradiction surfaced | 3/3 | 3/3 | 3/3 |
| Wrote decisions to a file | 3/3 | 3/3 | 3/3 |
| One question per turn | 0/3 (4–6 batched) | 0/3 (5–6 batched) | **3/3** |
| ASSUMED provenance markers in the artifact (grep count) | 0, 0, 0 | 0, 0, 0 | **14, 21, 19** |
| Machine-readable gate (`status: confirmed` + verbatim words) | 0/3 | 0/3 | **3/3** |
| Product-policy gaps deferred rather than guessed | 0/3 | partial | 2/3 (see finding below) |
| File layout reproducible across runs | **6 runs, 6 different names/locations** | (counted with none) | **3/3 identical convention** (`docs/specs/<date>-<slug>.md` + ADR + glossary) |
| Median tokens per run | ~30k | ~31.5k | ~47k |

**Reported interpretation:** the preserved Scenario B files show differing non-skill layouts and a shared skill-arm convention. The repository cannot verify the complete run protocol, scoring, token comparison, or causal attribution.

## Findings about the skills themselves

- **skill-1 marked product-shaping choices (retention, link security) as ASSUMED where skill-2/3 correctly Deferred them** — the interview-mode delegation path and the capture-mode rule state different standards. One-sentence patch candidate in spec-plan.
- The plain arm's one-liner recovers part of the gap (decision files appear when asked) — the skill's defensible margin over a good one-liner is the format consistency, provenance discipline, and attack catalogs, not intelligence.
- One harness failure (a run died in 2s with no tool calls) was retried and excluded; noted for future runs.

## Supported conclusion

This archive supports only that a benchmark was reported and that part of Scenario B's output artifacts was preserved. It does not establish current skill effectiveness, model capability, token cost, or autonomous triggering.
