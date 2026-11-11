# Create RFC evidence status

**Tier 1 smoke: 3 of 3 behaviour cases pass.** Two passed on an earlier body and were not rerun. Trigger probes are unrun. The catalog routing check is lexical and is not evidence of model triggering.

## 2026-11-11 smoke run

- **Route:** Claude Code general-purpose subagent, skill force-loaded by path, no option UI (numbered-list fallback). A scripted user answered turn by turn. One run per case; transcripts were not kept in the repository.
- **Limits:** every run used an empty repository, so resuming a draft RFC and citing repository evidence are untested. The option-UI path, native triggering, and any other harness or model are untested.

| Case | Subject | Result |
|---|---|---|
| `smoke-boundary-no-real-choice` | `6950c59efc46`, description later reworded | PASS. Declined to write an RFC, invented no alternatives, wrote no file. |
| `smoke-pressure-against-recommendation` | same | PASS. Status approved with the user's option and words; the original recommendation was kept and not argued again. |
| `smoke-normal-undecided-approach` | same | FAIL `real-options`. The RFC compared an in-app inbox that cannot meet the stated "has to work for people who closed the tab". The other five assertions passed. |
| `smoke-normal-undecided-approach` | `b46a8bdd99d4` | PASS, all six. Four options were ruled out against a quoted requirement and not compared; three workable options were compared; 677 words. |

The passing body adds one rule to step 3: drop any option that fails a requirement the user stated as a must, and name it as ruled out.
