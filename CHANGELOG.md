# Changelog

Skill updates change your agent's behavior — treat them like dependency upgrades. Pin by commit or tag and read this file before updating.

## Unreleased

- Reconciled Work Discipline's authority and execution rules: agents proceed with safe, reversible, in-scope work, while consequential actions and outcome-changing ambiguity still require approval.
- Re-scoped and shipped `understand-codebase` after its original narrow brief was abandoned. Its preserved Tier 2 results support an earlier revision (`663493fa…`), not the current skill body; the current revision and autonomous triggering remain untested.
- Renamed `brevity` to `be-concise` and updated its active documentation and eval harness references.
- Renamed `spec-plan`, `slice-spec`, `implement-slice`, and `ship-feature` to `create-spec`, `create-tasks`, `implement-task`, and `deliver-feature` so the pipeline uses clear verb–object names familiar to engineers.
- Added `simplify-code`, a model-invoked, deletion-first technique for explicit simplification requests. It directly condenses the requested scope, preserves observable contracts, asks before contract changes or scope expansion, reports missing test coverage without generating tests unasked, and provides concrete reduction plus verification evidence. It is locally validated from a confirmed adaptive interview without a Tier-2 comparative claim yet.
- Added `tdd`, a strict red-green-refactor discipline for features, known bug fixes, and every data-changing path. It requires behaviorally valid red output, reverts only premature agent-authored implementation, tests stable public and real data boundaries, creates safe legacy seams, forbids weakened assertions, and records focused plus affected-suite evidence. It is locally validated from a confirmed adaptive interview without a Tier-2 comparative claim yet.
- `create-skill` now requires at least one post-invocation, decision-changing Q&A answer before Skill Brief confirmation for every creation or behavior-changing update. Confirmation alone no longer counts as the interview; only an explicit question waiver can bypass it, and efficiency requests merely narrow questions to decisions that matter.
- Added `code-review`, a findings-first, read-only-by-default discipline that pins the diff, checks correctness, specification compliance, and repository standards, falsifies candidates, deduplicates reviewer output, and reports only evidence-backed P0–P3 findings. It is structurally validated from a confirmed brief and deterministic authorization fixture; no Tier-2 comparative claim is made yet.
- Added `diagnose`, a read-only-by-default debugging discipline that requires an exact reproduction, minimization, ranked falsifiable hypotheses, and evidence-backed root cause before any explicitly authorized fix. Its preserved opportunity run showed the full instruction recovered process omissions from the natural prompt, but exceeded the frozen token cap; the skill is structurally validated without a Tier-2 SHIP claim.
- `create-skill` is now user-invoked so its rigorous maintainer and evaluation workflow runs only when explicitly requested; its behavior when invoked is unchanged.
- `create-skill` now scales evidence to consequence: Tier 1 smoke-tests response-only preferences; Tier 2 uses one prompt/skill value pair plus two skill-only regressions (four actor sessions by default) and pooled portfolio routing; Tier 3 retains formal repeated evaluation for automation, high-stakes behavior, and meta-skills.
- `tldr` is renamed to `brevity`, retaining "tldr" as a natural-language trigger while aligning the library around functional names. The renamed subject passed all 7 Tier-1 behavior and routing probes in 148,346 tokens; historical `tldr` evidence remains preserved against its old subject hashes.
- `verify-work` is read-only by default; artifact fixes require explicit authority. Fresh dry rounds must add new attacks, and catalog exhaustion is reported honestly.
- `improve-prompt` is now a 616-word, user-invoked convenience shortcut around the tested one-line instruction. The earlier model-invoked body received an honest Tier-2 **ABANDON** verdict because the prompt matched it; the replacement **SHIPPED** after 3 explicit-invocation smoke cases passed in 39,910 tokens, including precise-input and execution-authority regressions.
- The README catalog now renders `disable-model-invocation: true` skills as user-invoked and validates that the flag is boolean.
- Pipeline contracts repaired: slices now record bounds and confirmation, hostile verification precedes slice completion, `deliver-feature` handles invalid blocker graphs and runs exactly one stage per invocation, and `create-spec` no longer converts delegated product policy into defaults.
- `build-loop` distinguishes numeric guards from mechanisms and handles unknown costs without invented estimates.
- `be-concise` no longer claims installation makes it always-on; that behavior requires the work-discipline layer or harness-level instructions.
- `create-skill` gains a read-only audit branch, checkable phase criteria, portable eval wording, and reduced self-duplication.
- `create-skill` now owns skill admission and effectiveness: it tests no-instruction vs strongest-prompt opportunity before drafting, generates a held-out `evals/` package, separates force-loaded behavior from normal triggering, iterates against frozen outcome/cost thresholds, and ends in SHIP, ITERATE, or ABANDON. Its own cross-harness/model eval package is included with an honest ITERATE status pending execution.
- The repo checker now enforces the 500-character description limit, 2,500-word hard cap, required sections, and presence of an action section; its success message explicitly describes these as structural checks.
- Evidence claims now distinguish force-loaded process results from untested autonomous triggering, cross-model behavior, and actual handoff success. Future general claims require Codex and Claude Code runs across OpenAI and Anthropic models with reproducible artifacts.

## 0.7.0 — 2026-07-10

Retroactive scope interview (15 user-answered questions; docs/specs/2026-07-10-retro-interview.md) applied across three skills:

- `tldr` is now ON BY DEFAULT where installed ("go long" lifts it; "normal mode" disables) — implemented as work-discipline rule 5; vocabulary now matches the asker instead of always translating; scope extended to commits, PR bodies, and reports; the "be brief" trigger collision with caveman resolved (caveman only when named).
- `improve-prompt`: user-named pipe targets win with inference as fallback and multi-matches shown; assumptions pipe as a labeled block above a clean prompt (never inline in the payload); the clarifying question resets the assumption budget; corrected improvements are logged to docs/prompt-corrections.md.
- `build-loop`: ships a wired runner adapter alongside the portable artifacts; gains the audit/repair branch its description always promised; anti-gaming and the pattern table generalized beyond repos; deterministic-verifier carve-out for tamper-proof machine-checkable goals.

## 0.6.2 — 2026-07-10

- `create-skill`: Phase 1 raised from "at least one scope question" to a restatement gate — the interview continues until the full scope (purpose, triggers, non-triggers, done-criteria) is restated back and the user confirms it, with residual guesses enumerated as user-accepted ASSUMED items. Confidence is demonstrated, never claimed.

## 0.6.1 — 2026-07-10

- `tldr`: good-vs-bad example pairs for the three brevity failure modes.
- `create-skill`: the Phase-1 interview is now the hard default — at least one option-UI scope question before drafting, skipped only by an explicit user waiver (previously the "reasonable choices" escape hatch swallowed the interview in practice).

## 0.6.0 — 2026-07-09

- New skill: `tldr` (Communication) — answer-first plain-language replies at ~1/4 default length, detail on "more", session-persistent via /tldr, clarity exception for warnings and destructive ops. Behaviorally baseline-probed (150-word essays with hedges and offers → 52–81 word answers in the dry-run) and adversarially evaluated (compound-question loophole and ask-vs-offer ambiguity found and patched). Inspired by juliusbrussee/caveman; keeps whole sentences where caveman compresses grammar.

## 0.5.0 — 2026-07-09

- Added a directional round-two benchmark summary. Its raw runs, scorer, and tested revision identities were not preserved, so it supports no effectiveness claim. The exercise still prompted CONTRIBUTING to require behavioral rather than self-report baselines.

## 0.4.1 — 2026-07-09

- Every skill now carries `license: MIT` frontmatter (cherry-picked skills travel without the repo LICENSE); enforced by `check`.
- CONTRIBUTING.md: the probe-before-draft, eval-after, evidence-or-silence process, written down so it survives the founding session.
- README: the pipeline explained as an optional composition and linked to the then-current benchmark archive.

## 0.4.0 — 2026-07-09

- New skill: `improve-prompt` (Authoring) — sharpens a rough ask into what the user meant, marks every invention `[assumed: …]` inline (max 3, else one clarifying question), shows the result, and pipes it to the matching skill or plain task. Baseline-probed (the baseline invented a 7-detail spec, marked nothing, and executed it) and adversarially dry-run (register loophole, human-text marking rule, and an example self-consistency bug found and patched).

## 0.3.0 — 2026-07-09

- Added a directional benchmark summary and a partial set of Scenario B outputs. The complete raw runs, scorer, tested revisions, and triggering evidence were not preserved, so the archive does not prove effectiveness or token cost.

## 0.2.1 — 2026-07-09

Fixes from the production-readiness audit — its top blockers were regressions the 0.2.0 remediation itself introduced:

- Restored the correct name of Anthropic's `skill-creator` plugin in create-skill's deferral lines (the 0.2.0 rename had over-rotated them into self-reference).
- Actually implemented verify-work's quick-check dial (1 dry round for a named throwaway, 2 for anything shipping) — 0.2.0's changelog claimed it while a failed text replacement had silently dropped the edit.
- plugin.json version now matches the release tag.
- Added CI (GitHub Actions running `skills.mjs check` + `readme --check`) and smoke tests for the remaining four deliverables.

## 0.2.0 — 2026-07-08

Remediation release from a four-lens adversarial review (craft, consumer, skeptic, architecture).

- **Renamed** `skill-creator` → `create-skill` — the old name broke the naming convention it ships and collided with Anthropic's upstream `skill-creator` plugin (which it defers to); all rename sediment purged (`skill-forge`, "Skillforge" in references).
- **Merged** `capture-spec` into `spec-plan` as capture mode — one skill, two entry modes, and the forked "identical" spec format (which had already drifted) is gone.
- **Defined the pipeline handshakes** — slices file now has a concrete format (frontmatter `spec:`/`status:`, `[x]` ticks with outcome notes, a `## Verification` section the conductor writes); `ship-feature` routes `confirmed-by-override`, gates on slices confirmation, and may chain planning stages on request while implementation stays one-slice-per-invocation.
- **Evidence honesty** — `verify-work` gained the rationalization table its baseline probes had already earned; README and evidence doc now state probe scope plainly (single-run, self-generated, directional).
- **Proportionality** — verify-work: 1 dry round for quick checks, 2 for shipping; spec-plan: small reversible changes exempted; probes may ride the option question when trivial.
- Deferred deliberately: halving `create-skill`'s reference architecture (it tracks upstream skillforge; slimming belongs upstream first).

## 0.1.0 — 2026-07-08

Initial release.

- `scripts/skills.mjs` — repo CLI: `table` (markdown catalog), `readme` (regenerates the README skills section from SKILL.md frontmatter; `--check` for CI), `check` (agentskills.io spec + toolbox validation). Skill installation is delegated to the vercel `skills` CLI (`npx skills add adriancodes/skills`).

- `spec-plan` — requirements interview with incremental decision log, glossary/ADR capture, and a confirmation gate. Hardened through 15 adversarial probe rounds (13 loopholes found and patched).
- `verify-work` — adversarial verification loop: executed attack fixtures, patch-the-artifact rule, two-dry-rounds stop condition.
- `work-discipline` — always-on layer carrying the four behaviors Opus 4.8 failed in baseline A/B probes ([evidence](docs/evidence/opus-ab-probes.md)).
- `skill-creator` — skill-authoring workflow, imported from [adriancodes/skillforge](https://github.com/adriancodes/skillforge).
- `slice-spec` — breaks a confirmed spec into tracer-bullet vertical slices, sized to one agent session, with blocking edges (baseline-probed and dry-run evaled).
- `capture-spec` — synthesizes an already-held conversation into a confirmed spec on disk: zero questions, gaps flagged never invented, one read-back gate.
- `implement-slice` — builds exactly one slice to its literally-executed demo criterion: test-first, bound held (corrections shrink, never widen), slices file ticked before done is claimed.
- `ship-feature` — the pipeline conductor: detects the stage from the artifacts (spec status, slices, ticks), runs one stage through its sibling skill, exits at the gate saying what's next.
- `build-loop` — designs continuous self-directed agent loops as runnable artifacts (LOOP.md, STATE.md, loop prompt, L1→L3 rollout) with verifiable goals, fresh-eyes verification, budget/breaker/lock/gate guards, and externally-certified promotion. Synthesized from Osmani's loop-engineering post and cobusgreyling/loop-engineering; baseline-probed, pressure-tested, and adversarially audited.
