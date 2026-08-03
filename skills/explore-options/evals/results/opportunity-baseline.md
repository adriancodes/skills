# Opportunity probe — strong-prompt baseline arm

- Date: 2026-08-01 · Harness: Claude Code · Model: claude-fable-5 (session model)
- Arm: strongest realistic short prompt, single fresh-context subagent, no skill
- Problem (held-out): "A CLI tool syncs a local directory to cloud storage.
  Uploads are slow, and users frequently kill the process mid-sync, corrupting
  sync state. Generate approaches to make sync interruption-safe."

## Verdict

Strong baseline. 10 approaches across 5 genuinely distinct angle-groups
(eliminate state / remote atomicity / local crash-consistency / move the
interruption boundary / attack the human behavior), 5 traps with specific
reasons, sequenced top-3. No "convergence disguised as divergence."

Residual gaps the skill must close:
1. **Novelty**: all 10 ideas are senior-engineer playbook (git/restic model,
   crash-only, leases, daemonize). Zero out-of-playbook ideas.
2. **Anchoring**: single context — the top-3 recommendation composes into one
   coherent design, evidence the ideas informed each other.
3. **Shape**: ~900-word wall of text; no layered output; unusable for a
   skimming reader without post-processing.

## Raw output

(preserved verbatim below)

---

# Making sync interruption-safe: 10 approaches

Framing note before the list: the phrase "corrupting sync state" usually hides two distinct failure modes — (a) torn local metadata (half-written state file) and (b) divergence between recorded state and remote reality. Most teams fix (a) and are surprised when (b) keeps biting them. The groups below attack the problem from five different angles.

## Group 1 — Eliminate the state instead of protecting it

**1. Stateless reconciliation (state file as cache, never truth).** Treat the local directory and the remote listing as the only sources of truth. The state file is a pure performance cache (mtime/size/etag memo). On startup, if the cache is missing, stale, or fails a checksum, throw it away and rebuild by diffing local vs. remote.

**2. Content-addressed storage with a single-pointer commit (the git/restic model).** Upload file chunks keyed by content hash. Uploads become idempotent. The only mutation that changes visible state is writing one small manifest object and flipping a root pointer to it.

**3. Crash-only design: make `kill -9` the normal shutdown path.** Delete cleanup handlers entirely; every startup runs the recovery path. (Candea & Fox, "Crash-Only Software.")

## Group 2 — Move the atomicity to the remote

**4. Staging-area two-phase commit on the server side.** Upload to a staging prefix, publish with a server-side atomic operation. **5. Lease-based sessions with fencing tokens.** Expiring leases + generation numbers; the remote rejects writes from stale generations.

## Group 3 — Crash-consistent local persistence

**6. Append-only intent journal with self-delimiting, checksummed records.** Never update in place; replay on startup; torn final record detected by checksum and truncated.

## Group 4 — Move the interruption boundary

**7. Daemonize the transfer engine; make the CLI a thin client.** Ctrl-C kills a disposable frontend, not in-flight transfers. **8. Snapshot the source before syncing (immutable input).** Sync from a frozen image; resume is deterministic.

## Group 5 — Attack the reason users kill it

**9. Make interruption a supported feature.** `sync pause`/`resume`, real progress, value-first ordering. **10. Continuous verification / self-healing scrub.** Cheap startup pass compares hashes vs. etags and repairs drift.

## Attractive-looking traps

- "Catch SIGINT and flush state on the way out" — SIGKILL/OOM/power loss skip the handler.
- PID lock files — stale locks train users to `rm` them reflexively.
- "Just switch the state file to SQLite" — fixes torn writes, preserves DB-vs-remote divergence forever.
- Storing sync state in the cloud — a third thing that can disagree with the other two.
- fsync after every file — makes the sync slower, which is the root cause of the kills.

## Top 3: content-addressed + staged commit (#2+#4); stateless reconciliation backbone (#1); interruption-as-feature (#9). Sequencing: #9 first, #1 as foundation, #2/#4 long-term, crash-only mindset throughout.
