# Skills Repository Handoff

## Objective

Continue improving and empirically evaluating the repository's `create-skill` skill. A skill must materially improve engineering outcomes over the strongest realistic prompt, not merely add instructions or process noise.

## User Decisions

- Optimize engineering experience and model-output quality equally.
- Verification work is read-only; `improve-prompt` may edit the prompt because that is its purpose.
- Target OpenAI/Codex for the current evaluation.
- Do not interpret the eval token cap as an account-capacity problem. Codex model access worked; the open question is whether to raise the self-imposed eval budget.

## Completed Work

- Redesigned `skills/create-skill/SKILL.md` around opportunity testing, correctness, comparative effectiveness, and `SHIP | ITERATE | ABANDON` decisions.
- Added and hardened the comparative evaluation package under `skills/create-skill/evals/`.
- Added deterministic fixtures, held-out behavior cases, trigger cases, frozen-manifest rules, blinded judging, evidence hashes, fresh-probe chaining, retry ledgers, and an executable scorer.
- Adversarial audit found no remaining blockers in the eval trust model before execution.
- Added honest support for ChatGPT-authenticated Codex routes where a dated backend snapshot is unavailable. Such results must be described as opaque and time-bounded.
- Added `run-codex-opportunity.mjs` and `collect-opportunity.mjs`.
- Ran six isolated Phase-0 actor runs and six arm-blinded judge runs using Codex CLI 0.144.1 and `gpt-5.6-sol`.
- Used an empty temporary `HOME` with the existing `CODEX_HOME` to prove personal `create-skill` was absent from baseline sessions.
- Recorded Phase-0 evidence in `skills/create-skill/evals/suite-manifest.json` and raw results under `skills/create-skill/evals/results/opportunity/`.

## Opportunity Result

Verdict: `PROTOTYPE`.

The strongest realistic prompt:

- Passed cheaper-mechanism selection.
- Failed behavioral opportunity testing (`opportunity`).
- Failed to provide reusable machinery instead of generic advice (`mechanism`).
- Failed to record an evidence-appropriate verdict under pressure (`verdict`).

See `skills/create-skill/evals/results/README.md` and the evidence manifest rather than reproducing raw evidence here.

## Current Budget Decision

- Phase 0 consumed 1,072,496 tokens across 12 actor/judge sessions.
- The planned effectiveness pilot requires 54 task runs plus behavior judges.
- Estimated full-pilot usage is approximately 6–10 million tokens.
- `matrix.json` currently caps the pilot at 5 million tokens.
- The matrix and suite manifest intentionally remain unfrozen; no effectiveness claim has been made.
- The assistant recommended raising the pilot cap to 10 million tokens. The user has not yet authorized that change.
- This is an eval-governance cap, not evidence that the user's account lacks capacity. No capacity or rate-limit error occurred.

## Exact Next Step

Ask whether the user authorizes raising the pilot token cap from 5 million to 10 million. If yes:

1. Update the matrix budget with `apply_patch`.
2. Finish validating the complete OpenAI pilot route and runner before freezing.
3. Compute the canonical inventory hash.
4. Freeze the matrix and suite manifest with a valid timestamp.
5. Run the comparative prompt/skill behavior pilot and normal-trigger experiment without weakening repetitions or assertions.
6. Preserve all raw results and report `SHIP`, `ITERATE`, or `ABANDON` honestly.

If no, leave the verdict `ITERATE` and redesign the matrix without silently weakening evidentiary standards.

## Validation Status

The latest checks passed:

- `node scripts/skills.mjs check`
- `node scripts/skills.mjs readme --check`
- JavaScript syntax checks for the scorer and opportunity scripts
- JSON/JSONL parsing
- `git diff --check` (only the recurring benign fsmonitor warning appeared)

The worktree contains intentional uncommitted changes from the broader skills-repository review. Preserve unrelated user changes and do not reset the worktree.

## Suggested Skills

- `create-skill` — required for continuing the authoring/evaluation lifecycle.
- `openai-docs` — use for current Codex/OpenAI model-route facts; prefer official sources.
- `verify-work` — use read-only before any final effectiveness or shipping claim.
- `handoff` — regenerate this handoff if another interruption occurs.
