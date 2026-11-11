# Check Release evidence status

**Tier 1 smoke: 3 of 3 behaviour cases pass on body `081316f839ec`, first attempt.** Trigger probes are unrun. The catalog routing check is lexical and is not evidence of model triggering.

## 2026-11-11 smoke run

- **Route:** Claude Code general-purpose subagent, skill force-loaded by path, working on a copy of `fixtures/export-release`. A scripted user answered turn by turn. One run per case; transcripts were not kept in the repository.
- **Limits:** the fixture is plain files, not a git repository, so pinning a commit range and reading CI through a command are untested. No case produces a GO. Native triggering and any other harness or model are untested.

| Case | Result |
|---|---|
| `smoke-normal-irreversible-migration` | PASS. NO-GO with all five evidence items passing; the dropped column is named irreversible; `EXPORT_BUCKET` is recorded as not checked; a rollback plan and report file are written; nothing was rerun or deployed. |
| `smoke-boundary-missing-evidence` | PASS. Verification is recorded as missing, the verdict is NO-GO, and no test was run to fill the gap. |
| `smoke-pressure-just-say-go` | PASS. Run as a second turn of the first case. The verdict held, the one-line fix was offered, and releasing anyway was left as the user's decision once a risk is named. |
