---
status: evaluation-report
observed: 2026-10-05
---

# Eight original gap skills

The user approved the [gap map](../skill-gap-map.md) and full evaluation. These are original runtime designs with short literal names and standalone resources. The existing seventeen skills are preserved. Two conditional additions and the separate scheduler remain deferred.

PASS below means the declared evidence gate passed on the observed local route. It is not SHIP: user acceptance of the concrete result, installation and publication remain separate. Full evaluation can produce a provisional candidate when a critical case fails. Current limitations are retained rather than converted into passes.

| Skill | Tier | Evidence gate | Held-out sessions | Native sessions and observations | Less caller instruction; maximum paired token ratio |
|---|---|---|---:|---|---|
| [research-question](../../skills/research-question/SKILL.md) | 2 | PASS | 4 | 4/4; 2 positive reads, 0 false reads | 64–64%; 1.08× |
| [build-prototype](../../skills/build-prototype/SKILL.md) | 2 | PASS | 4 | 4/4; 2 positive reads, 0 false reads | 57–57%; 1.07× |
| [create-handoff](../../skills/create-handoff/SKILL.md) | 2 | PASS | 4 | 4/4; 2 positive reads, 0 false reads | 69–69%; 1.04× |
| [prepare-pr](../../skills/prepare-pr/SKILL.md) | 3 | PASS | 18 | 10/10; 5 positive reads, 0 false reads | 65–71%; 1.30× |
| [review-session](../../skills/review-session/SKILL.md) | 3 | PASS | 18 | 10/10; 5 positive reads, 0 false reads | 77–82%; 1.25× |
| create-setup-guide (withdrawn) | 3 | INCOMPLETE | 27 | 10/10; 5 positive reads, 0 false reads | 69–75%; 1.00× |
| [map-decisions](../../skills/map-decisions/SKILL.md) | 2 | PASS | 4 | 4/4; 2 positive reads, 0 false reads | 70–70%; 0.90× |
| [write-agent-instructions](../../skills/write-agent-instructions/SKILL.md) | 3 | PASS | 18 | 10/10; 5 positive reads, 0 false reads | 73–79%; 1.09× |

## What the comparison supports

Ordinary correctness mostly ties a strong repeated prompt. The principal tested benefit is delivery: shorter user requests and correct selection from the normal project registry. Extra prose is not scored as a gain. Total input includes cached tokens. Runtime premiums are checked against the frozen limits; the table does not claim lower model cost. Fresh recipients execute handoffs and instruction-generated conventions. Before-instruction controls are scored separately. Eleven byte-identical revised recipient contexts reuse independently judged earlier execution, including six unchanged checker contexts reused from a before control. Full file hashes, requests and criteria must match; this reuse establishes parity and is not a new execution.

Before-instruction controls: 3 observed, 3 passing. A passing control and passing revised result show parity on that task; they do not establish incremental prevention from the edit.

## Tested route and limits

Codex CLI 0.160.0, authenticated `gpt-6.1-sol` alias, medium reasoning, disposable workspace-write projects, no external services. The provider exposes no dated model snapshot. Native actors see the project registry of these 25 skills; unrelated globally installed skills are disabled only in those CLI processes. Coexistence with the entire global installation is untested. Natural positives and explicit-only positives are separate from force-loaded correctness. Native reads require the actual installed body in raw command output; semantic application is independently judged. No cross-model, cross-harness, live-vendor retrieval, real authentication or real-publication claim is supported. Vendor documents and credentials are synthetic. Mock publication tests only the local requested boundary.

Arm-hidden evaluators see requests, assertions, files, output and commands. Prompts, candidate bodies and arm mapping remain withheld. Style may reveal instruction use. Independent runner replay distinguishes declared-reader compatibility, safe rejection, consumer incompatibility and incomplete sessions. Exact old failures and judgment corrections remain in raw evidence.

CLI records: 296 sessions, 20,196,710 measured input tokens, 298,441 measured output tokens; 45 sessions have unknown usage. 17 collaboration judging turns also count toward the actor ceiling; their token usage is not exposed. Measured totals are not complete total-cost accounting. The frozen ceiling is 320 actor sessions, 30M input tokens, 1M output tokens, three concurrent CLI actors and three hours. The default session deadline is three minutes; no extension is inferred from silence.

## Remaining evidence

Setup was withdrawn on 2026-11-10 with its gate incomplete; the skill is no longer in the toolbox. A setup-only extension on 2026-11-10 raised the session limit to six minutes and revised the skill to store values through its bundled helper. All eighteen comparison sessions then completed. All nine force-loaded sessions used the helper and passed the three frozen assertions under independent replay; five of nine strong-prompt sessions did. Native selection read the skill in five of five positive requests and none of five negative ones. Two failures remain: one force-loaded pressure runner saved a key with CI set, and the edge scenario used four more tool calls than its baseline against a limit of three. Application judgments for the five native positives and the two fresh rounds were not run. Three native sessions lost to host sleep are retained and excluded with their replacements, which raised the extension's session ceiling from 33 to 36. The read-back check used each runner's bundled reader in sixteen of eighteen packets, so it is not independent of the generated code. See the [extension record](../specs/2026-10-05-skill-gap-implementation.md).

### create-setup-guide

2 current failures and 6 missing evidence items. Historical incomplete sessions: 46.

- create-setup-guide-heldout-edge: cost/delivery threshold failed
- create-setup-guide-heldout-pressure--skill--r1--i5: runner replay failed
- create-setup-guide-trigger-positive-1--native--r2--i5: native application judgment
- create-setup-guide-trigger-positive-2--native--r2--i5: native application judgment
- create-setup-guide-trigger-positive-3--native--r2--i5: native application judgment
- create-setup-guide-trigger-positive-4--native--r1--i5: native application judgment
- create-setup-guide-trigger-positive-5--native--r1--i5: native application judgment
- Two consecutive fresh rounds

## Reproduce and audit

See the [raw suite and methods](../../evals/gap-skills-2026-10-05/README.md), [typed summary](../../evals/gap-skills-2026-10-05/summary.json), [frozen rubric](../../evals/gap-skills-2026-10-05/rubric.md) and [runner provenance correction](../../evals/gap-skills-2026-10-05/runner-provenance.json). Run the scorer for the evidence verdict; use integrity and scorer controls for deterministic CI validation. A CI integrity pass does not imply a provisional skill passes its behavioral tier.
