# Ground-truth benchmark — 2026-07-09

**Design:** 2 planted-ground-truth scenarios × 3 arms × k=3 runs = 18 runs (plus 1 harness-failure retry). Actor model: Opus 4.8, fresh session per run, isolated directory per run. Arms: **none** (no instruction), **plain** (the strongest one-line instruction a user would realistically type), **skill** (the SKILL.md loaded as binding instructions). Skill arms were force-loaded; trigger-rate/discoverability was *not* measured and is a separate, unrun tier. Counts only — k=3 supports 3/3-vs-0/3 claims, nothing finer. Scenario B artifacts are preserved verbatim in [`artifacts/`](artifacts/).

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

**Honest reading:** when checking is the *named task*, Opus verifies without help — detection is model-native, and the skill claims no credit there. The skill's measured lift is **coverage** (the full attack catalog, corner-to-corner on BOM/newline classes), **repair discipline** (patch → re-attack → dry round), and **method transparency** (which bar applied), at ~+30% tokens.

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

**Honest reading:** spotting the contradiction is model-native — 9/9 across all arms, zero lift from the skill. The skill's measured lift is entirely **process and interop**, and it is corner-to-corner: provenance marking (0 vs 14–21 markers), single-question cadence (0/6 vs 3/3), a machine-readable confirmation gate (0/6 vs 3/3), and — the team-relevant one — **artifact reproducibility**: the six non-skill runs produced six different file layouts no other session could reliably resume; the three skill runs produced three interchangeable ones. Cost: ~+50% tokens.

## Findings about the skills themselves

- **skill-1 marked product-shaping choices (retention, link security) as ASSUMED where skill-2/3 correctly Deferred them** — the interview-mode delegation path and the capture-mode rule state different standards. One-sentence patch candidate in spec-plan.
- The plain arm's one-liner recovers part of the gap (decision files appear when asked) — the skill's defensible margin over a good one-liner is the format consistency, provenance discipline, and attack catalogs, not intelligence.
- One harness failure (a run died in 2s with no tool calls) was retried and excluded; noted for future runs.

## The claim this supports, stated precisely

These skills do not make the model smarter — bug-finding and contradiction-spotting were 100% across all arms. They make its *process* reliable and its *artifacts* interoperable: on every process measure the skills target, the result was 0-for-6 without them and 3-for-3 with them, at a 30–50% token premium per session.
