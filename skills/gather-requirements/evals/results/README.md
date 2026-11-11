# Gather Requirements evidence status

**Tier 1 smoke: 3 of 3 behaviour cases passed on earlier bodies; the depth regression fails one of three assertions on the current body `074ec9016f02`.** Trigger probes are unrun. The catalog routing check is lexical and is not evidence of model triggering.

## 2026-11-11 smoke run

- **Route:** Claude Code general-purpose subagent, skill force-loaded by path, no option UI (numbered-list fallback). A scripted user answered turn by turn. One run per case; transcripts were not kept in the repository.
- **Limits:** the option-UI path, native triggering, and any other harness or model are untested. Globally installed skills were present in the session and told not to load.

| Case | Subject | Result |
|---|---|---|
| `smoke-boundary-early-stop` | `091dd02755f4` | PASS. Stopped on "stop", carried every unanswered area as ASSUMED or open, reported about 40% confidence. |
| `smoke-pressure-against-recommendation` | `091dd02755f4` | PASS. The user's choice was recorded as decided and the rejected recommendation was not raised again. |
| `smoke-normal-vague-app` | `091dd02755f4` | FAIL `one-question`. Three of four turns closed with an extra request such as "roughly how many people are on the rota would also help". |
| `smoke-normal-vague-app` | second body | FAIL `one-question`. A rule added under Tool Guidance did not stop the trailing request on turn 2. |
| `smoke-normal-vague-app` | `da1a4f002633` | PASS. Thirteen turns, one ask each; tagged read-back; no file changed. |

The passing body moves the rule into step 3 as "One ask per turn". The two cases that passed on `091dd02755f4` were not rerun on `da1a4f002633`; the change touches only how a turn closes.

## 2026-11-11 depth regression

Same route. Body `074ec9016f02` adds "Ask only what shapes the build" to step 3.

| Case | Subject | Result |
|---|---|---|
| `regression-small-request-depth` | `074ec9016f02` | FAIL `proportionate`: nine questions against a limit of eight, down from thirteen. PASS `reversible-assumed`: hosting, stack, shift length and handover time were ASSUMED and not asked. PASS `shape-still-asked`: problem, users, done and scope were each decided by the user. |

All nine questions concerned the shape of the app. The limit of eight was set by the author without a baseline. The three smoke cases were not rerun on this body.

Observations from the smoke run that are not failures:

- Turn 12 of the passing run added "if you pick 1, include the time and time zone". It was scored as part of the same ask.
- The passing run claimed 95% with three open items, judging that none changes what gets built. One of them is the hosting stack.
- Thirteen questions for a one-page rota app. This became `regression-small-request-depth`.
