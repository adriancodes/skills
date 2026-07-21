# Contributing a skill

Every skill in this toolbox was built the same way, and new ones follow suit. The bar exists because the evidence says it works — see [docs/evidence/](docs/evidence/).

## The process

1. **Spec it.** Run `create-spec` on the idea; the decision log lands in `docs/specs/`. Name per the convention: short verb–object, 1–4 words, literal, no metaphor.
2. **Choose the evidence tier.** Tier 1 covers response-only style and formatting; Tier 2 covers reversible local workflows; Tier 3 covers external mutation, automation, high-stakes behavior, and meta-skills. Uncertainty selects the higher tier.
3. **Test the opportunity.** Run `create-skill` Phase 0 at that tier. Tier 1 may start from an explicit user preference. A new Tier-2 skill uses one no-instruction/prompt discovery pair; Tier 3 uses its full discovery set. If the cheaper mechanism meets the target, stop and keep it. Existing skills may reuse preserved opportunity evidence that still matches the subject and route.
4. **Draft the minimum skill** around the observable need or residual failure. Required frontmatter: `name` (must match the directory), trigger-only `description`, `license: MIT`, `metadata.category`, and `metadata.summary` (≤160 chars).
5. **Create tier-appropriate evidence under `evals/`.** Tier 1 keeps three smoke cases, an executable command or script, the current subject hash, and outputs. Tier 2 keeps compact cases, subject hash, tested route and budget, deterministic checks or a scorer, and raw results. Tier 3 adds the full frozen comparative package: rubric, matrix, manifest, fixtures, typed scoring, budgets, and raw results.
6. **Prove the tier.** Execute the tier's correctness cases. Tier 1 stops after clean smoke probes. Tier 2 uses one prompt/skill value pair plus two skill-only regressions—four actor sessions by default—and normally uses the shared portfolio routing suite. Tier 3 runs the full repeated comparison and trigger evaluation. End in SHIP, ITERATE, or ABANDON and state the tier beside the verdict.
7. **Validate and record.** Run `node scripts/skills.mjs check` and `readme --check`, update the CHANGELOG, and preserve the evidence required by the tier. A claim broader than its evidence is a failed release even when the tests pass.

## House rules

- **Self-contained, soft references only** ([ADR-0001](docs/adr/0001-self-contained-skills.md)): a cherry-picked skill works alone; mentions of siblings carry an inline fallback.
- **Harness-neutral**: tools named by role with fallbacks; the skill must work as a plain instruction document.
- **Evidence or silence**: no rule ships on vibes. If you can't show the baseline failing, delete the rule.
- **Cross-harness, cross-model claims require both.** Before claiming general effectiveness, run the same held-out suite in Codex and Claude Code on at least one current OpenAI model and one current Anthropic model. Force-loaded results do not establish autonomous triggering; measure trigger precision/recall separately.
- **Deprecate, never delete**: a superseded skill moves to `skills/deprecated/` with a pointer to its successor — teams pin versions.
- **Re-prune on every edit**: run the no-op test over the whole body, not just the new lines; skills accumulate sediment.

## Verifying your edit didn't regress

Scripted text replacements silently no-op when their target drifted. Before claiming any fix: grep for the new text, run both check commands, and quote the evidence in your PR. This repo's own history has two incidents of claiming unexecuted fixes — the rule exists because it was needed.
