# Skill Brief — verify-work

Authored 2026-08-01 from `SKILL.md`, `references/attacks.md`, and `CONTEXT.md`. Not confirmed through a user interview; every inference is marked `ASSUMED`.

## Job

Prove a finished artifact against its own promise by executing rounds of adversarial attacks — hostile fixtures run against scripts, fresh-agent probes run against rule documents, boundary values fed to configs — reporting every failure with an executed reproducer, and stopping only at 2 consecutive fresh dry rounds (1 for a named quick check), explicit catalog exhaustion, or an announced early stop that names every untested attack class. Per `CONTEXT.md`, this session is a **Verification**: executed adversarial attack rounds, never testing, QA, or review.

- **Users:** Engineers with a finished script, agent skill, prompt, config, schema, or rule document that must survive hostile input before shipping.
- **Type:** Discipline (ASSUMED — matches the classification of `tdd` and `code-review`, the toolbox's other behavior-governing quality skills).
- **Invocation:** Model-invoked; triggers "verify this", "is this ready to ship", "test this properly", "find the loopholes", plus shipped-artifact-failed and happy-path-only-verification situations (from the frontmatter description).
- **Authority:** Read-only by default. A verification request authorizes attacks and a findings report; patches require explicit fix authority, and fixtures are never edited toward buggy output.
- **Collisions:** code quality/style/maintainability → `code-review`; an unbuilt plan → a spec session (`create-spec` soft reference); tests-as-you-build → `tdd`; statistical pass rates → an eval harness; live-system pentesting → out of scope entirely.

## Declared tier: 3

- **Tier 2 reading:** a verification session's mistakes are local and reversible — wasted attack rounds, a noisy report — which alone would justify Tier 2.
- **Tier 3 reading:** the skill's output is a ship/no-ship verdict. A false "verified — two dry rounds, ready to ship" is exactly the **high-stakes guidance** named in the Tier-3 row: the blessed artifact ships to third parties and fails on hostile input downstream, where the damage is no longer reversible by the author. The skill also runs unattended subagent probe rounds against rule documents (evaluating durable behavior).
- **Verdict:** the two readings disagree, and the tier rule says uncertainty selects the higher tier. **Tier 3.** Evidence claims never exceed what is actually recorded: until a full Tier-3 package runs, the subject is a candidate, not "formally supported".

## Baseline comparator (strongest realistic prompt)

> "Test this script properly against hostile inputs and report what breaks."

This is what a capable user actually types today. The skill must beat it on: promise-anchored attacks, executed (not reasoned) findings with reproducers, the explicit stop rule, the bounded report, and the authority boundary — the prompt arm predictably smoke-tests a few obvious inputs, reports prose without reproducers, stops after one pass, and sometimes helpfully "fixes" the script.

## Success measures (traced to the skill's gates)

1. **Promise ≤ 5 bullets** written before any attack (Workflow step 1).
2. **Every catalog attack executed with a recorded result** — output, error, or diff; "this would probably break" is not a finding (step 2, `attacks.md`).
3. **Every finding carries an executed reproducer** — the exact input and command (step 3).
4. **Stop bar stated:** 2 consecutive fresh dry rounds for anything shipping, 1 for a named quick check, with the applied bar stated; catalog exhaustion reported separately from a dry-round claim; early stops name every untested class (step 4, stop rule).
5. **Report ≤ 10 lines**, naming authority mode, findings, rounds, and residual risk, without process narration (step 5).
6. **Zero unauthorized edits:** artifact and fixtures byte-identical in read-only mode; when fixes are authorized, patches land in the artifact, never the fixture (step 3, Success Criteria).

## Eval contract

- **Cases:** `cases.jsonl` — 3 positive triggers, 2 adjacent negatives, 1 held-out value case, 2 regressions (edge: catalog exhaustion before 2 dry rounds; pressure: "quick check, just confirm it works").
- **Arms:** held-out runs prompt-vs-skill (baseline above); regressions are skill-only; trigger cases run in the shared portfolio routing suite (`arms: ["routing"]`), per the Tier-2/3 trigger-case convention in `create-skill/references/rules.md`.
- **Fixture:** `fixtures/csv-dedupe/` — a deliberately flawed script whose three planted flaws (confirmed by execution) are the ground truth for the find-* assertions; its `README.md` is the scorer's key and is withheld from actor sessions.
- **Scoring:** all `critical` assertions must pass; the fixture invariant (no byte changes) is checked mechanically by hashing the fixture before and after each session.
- **Full Tier-3 evidence** additionally requires 3 discovery cases, 3+ held-out cases × prompt/skill × 3 repetitions, 5 positive and 5 negative trigger cases, 2 fresh probe rounds, a frozen package with hashes and budgets, and an executable scorer. The current package is the authored scaffold, not that evidence (ASSUMED and accepted: no costly synthetic model sessions launch in this pass, matching the tdd/code-review precedent; a bounded run needs separate authorization).
