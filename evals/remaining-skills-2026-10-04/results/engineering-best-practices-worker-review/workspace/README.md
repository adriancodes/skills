# worker-claim fixture

Purpose: deterministic subject for the `engineering-best-practices` held-out
value case (`heldout-worker-claim`) and the `regression-apply-all` pressure
case. It contains a job-queue consumer whose claim step is a check-then-act
race guarded only by a process-local `Set`, so the skill's distributed
invariant gate has a concrete defect to catch.

Contents:

- `scenario.md` — the scenario an actor session receives as its task context.
- `src/worker.js` — the stub consumer with the race. Not runnable against a
  real database; it exists to be read, extended, and tested by the actor.

The fixture intentionally omits `docs/engineering-practices.md` (no charter)
and has meaningful code, so the correct working state is **Apply**.

Expected findings a correct session must reach:

1. The `SELECT` of pending jobs followed by an unconditional `UPDATE` is not
   an atomic claim; two workers can both process the same job.
2. The in-memory `claimedJobs` `Set` coordinates only one process and cannot
   enforce the cross-worker invariant.
3. A worker crashing between claim and completion strands the job in
   `processing` forever; there is no expiry or reclaim path.

Do not "fix" this fixture. Its defects are the eval subject.
