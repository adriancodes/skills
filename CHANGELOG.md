# Changelog

Skill updates change your agent's behavior — treat them like dependency upgrades. Pin by commit or tag and read this file before updating.

## Unreleased

- Consolidated the remaining thirteen skills: lead with the core method, retain operative gates, and move pressure tables, worked examples, and the exploration frame deck into conditional local references. Their entrypoint bodies fell from 18,116 to 13,574 words (25%); all seventeen bodies are now 27% smaller than the initial comparison snapshot. Names, descriptions, and invocation policies stayed unchanged. Fixed inconsistent brevity/spec examples and reproduced a verifier report that omitted named residual test areas, then corrected and reran it. Eighteen preserved actor records yield 15 usable passes, one retained failure, one automation timeout, and one quiz run excluded for leaked fixture grading guidance. Independent static reviews and CI replay support bounded preservation; these are not full Tier-2/Tier-3 effectiveness results. See `evals/remaining-skills-2026-10-04/README.md`.
- Reworked four skills in a Matt Pocock comparison pilot: `deliver-feature` continues authorized work across stages while honoring narrower requests; `create-tasks` supports bounded wide refactors and genuine one-layer work; `simplify-code` permits scoped local characterization while honoring explicit test restrictions; `implement-task` keeps one-task bounds with proportionate checks for nonbehavior changes. Their entrypoint bodies are 35% shorter, with conditional stage and plan-contract references. Reviewed all 17 names and retained the clear existing names. Preserved 19 scored actor runs, excluded harness failures, and a blinded review: ordinary correctness mostly tied, with a stronger revised delivery handoff. This supports targeted improvements, not overall superiority, lower execution cost, or native discovery. See `evals/pocock-comparison-2026-10-04/README.md`; CI replays provenance and downstream checks. Prior create-tasks review probes now replay against their archived original subject.
- Closed the remaining eight review findings. `tdd` regained its repeat-until-all-behaviors gate and a Genuine Exceptions escalation path, and its three frozen cases were rerun fresh on the restored subject (16/16 PASS, Claude Code / claude-fable-5, raw artifacts preserved); `quiz-changes` regained the merge-base anchor for branch diffs (rehashed; no behavioral rerun). Routing negatives now require the declared owner to rank first (two noisy case prompts rephrased); the persona validator parses folded descriptions and rejects empty ones — both with new test controls. The create-tasks description change is now disclosed with its untested-installed-triggering limit, the Addy Osmani comparison's thirteen local citations are pinned to snapshot commit `84399e7`, and `AGENTS.md` lists the persona validation command.
- Fixed minimal skill authoring: scope content may live under `Scope` or the separate trigger/exclusion headings. Restored create-spec's consecutive-answer threshold and exemption for terse option picks. Corrected the create-tasks no-write oracle while preserving its superseded case, and made the skill's completion text honor the same exception.
- Marked unauditable atomic-rewrite and persona results as unverified historical observations. Preserved original counts without treating them as accepted PASS evidence.
- Added seven current-subject review probes with raw traces, workspace snapshots, and assertion scores. Reproduced and fixed two task-planning failures: an unnamed route blocked a complete plan, and "skip the file" was misread as a preference. The replay check now verifies current hashes and file effects in CI; this is targeted regression evidence, not full-tier validation.
- Reject missing or malformed routing prompt arrays. Added regression checks for omitted, null, non-array, and empty values, plus a broken-description control using unchanged cases.
- Completed the Phase-6 atomic rewrite of the ten remaining prose-metric failures. Their bodies fell from 12,659 to 10,926 words; every active skill now meets the 12-word median and under-2%-long-unit targets. The seven-session be-concise smoke verdict has preserved raw evidence. The other nine reported workflow counts are unverified because their raw audit artifacts are unavailable.
- Added a repository agent guide, toolbox layer map, and first thin persona (`evidence-led-reviewer`). Personas now have a structural validator and CI coverage.
- Reworked skill authoring around the smallest valid body: scope, action, and verification are required; optional sections must change behavior; word targets are ceilings; instructions are atomic; completion criteria use standalone `Done when ...` lines. The repository checker now reports style metrics without blocking legacy skills.
- Added catalog-wide lexical routing cases and a zero-dependency CI preflight. All 51 positive prompts rank their intended skill first, with adjacent negative cases owned by another skill.
- Rewrote `ground-rules`, `improve-prompt`, and `tdd` in short, direct language with the intent to preserve their contracts. The pilot bodies fell from 3,351 to 2,319 words; improve-prompt retains raw behavior evidence; the ground-rules and TDD summaries are unverified historical observations.
- Renamed the always-on layer `work-discipline` to `ground-rules` (dir, file, output-style install path, and all references — replace `~/.claude/output-styles/work-discipline.md` on existing installs) and rebuilt it: vague qualifiers anchored to observable tests, the layered summary-first communication and three-slot safety reply proven in be-concise v2 folded in, and a continuation rule added (never end a turn on a promise of work; idle waiting is a failure). The layer gained its first eval suite and pilot run: 11/11 layer-arm criticals vs 5/11 bare across 5 behavior cases (value concentrated in continuation, handoff shape, and question format; ~5% token overhead; directional, single-rep, non-blind).
- Addressed all four findings from an external adversarial review (Codex): `create-tasks` now honors an explicit no-write boundary (full parseable contract delivered in chat, file offered at implementation time; a mere chat-only preference still writes the file) — both boundary regressions re-run and passing; `migrate-install.mjs` never deletes (relocates to a recoverable `.migrate-trash/` dir, only when the replacement is installed); `be-concise`'s 10-line report cap is now a summary-shaping default that never omits actionable findings; and the be-concise pilot re-ran all 12 cells fresh against the current subject under the pre-synced, frozen 1.2.0 suite — PILOT_SUPPORTED confirmed with zero carried cells (skill 7 critical passes vs prompt 5; triggers 1.0/1.0; token ratio 1.02).
- Added `scripts/migrate-install.mjs`: removes stale old-name skill copies left by renames (dry-run by default, `--apply` to delete; only dirs whose `SKILL.md` frontmatter matches the old name are touched). README gains an "Updating from an older install" section.
- Rebuilt `be-concise` (v2): a three-layer output protocol replaces flat brevity, a reports contract governs agent output (outcome first, ≤10-line body), and the safety exception is now a structural three-slot template with a numeric sentence floor. Inline body cut 1,142→934 words (secondary examples in `references/patterns.md`), reaching token-cost parity with a bare prompt (ratio 1.13→1.01). Its pilot suite was corrected twice by recorded re-freeze (1.1.0: two documented scorer false negatives; 1.2.0: gate 3 now counts critical outcomes) and closed **PILOT_SUPPORTED** — the suite's first passing verdict, directional-pilot evidence only (single route, single runs, non-blind).
- Added `quiz-changes`: model-invoked retrieval-practice quiz on pending changes before shipping — one question per message, lookup-test-banned trivia, evidence-cited grading, adaptive follow-ups, advisory readiness read-back, opt-in flashcard deck. Shipped with Tier-2 evidence (5/5 sessions, discovery pair recorded).
- Added `explore-options`: user-invoked divergent ideation adapted from ADHD (MIT) — 5 parallel isolated cognitive frames, fit-first convergence with a constraint-checked winner and quarantined wild slot, ≤15-line shortlist expanding on demand. Shipped with Tier-2 evidence (4/4 runs).
- Executed Tier-2 eval runs across ten previously unevidenced skills; all now carry recorded verdicts. `create-tasks` initially failed its chat-only-pressure regression, its step-4 file-write was made explicitly unconditional, and the re-run passed against a hardened variant. `build-loop` and `verify-work` ran at Tier-2 scope with claims explicitly capped below their Tier-3 declarations. Recurring honest finding: strong prompts match skills on outcomes but fail contracts and gates; four eval-package defects were documented for re-authoring (code-review's fixture mirrors its own example; engineering-best-practices' no-match edge cannot fire; verify-work's quick-check assertion wording; simplify-code's vacuous scope assertion).
- Authored eval packages (brief, cases, fixtures, reproduction instructions) for the seven skills that had none: `build-loop`, `create-spec`, `create-tasks`, `deliver-feature`, `engineering-best-practices`, `implement-task`, `verify-work`.
- Two-round concision pass across all skill bodies (−1,153 words net) preserving every rule, threshold, table row, and trigger; `implement-task`'s frontmatter and body unified on the slice vocabulary its operational text already used.
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
