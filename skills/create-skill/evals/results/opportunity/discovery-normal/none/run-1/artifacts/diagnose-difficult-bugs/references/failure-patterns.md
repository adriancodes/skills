# Failure-class playbooks

Read only the section matching the observed failure. These are diagnostic prompts, not substitutes for evidence.

## Intermittent and concurrency failures

- Preserve ordering, thread or task identity, correlation IDs, clock source, and synchronization events.
- Check shared mutable state, atomicity boundaries, lock ordering, cancellation, duplicate work, and lifecycle races.
- Control scheduling or inject deterministic synchronization when possible; avoid assuming that added logging merely observes rather than changes timing.
- Treat sleeps and repeated runs as symptom detectors, not causal tests.

## Production-only and distributed failures

- Compare deployed artifact digests, runtime versions, flags, configuration sources, topology, identity and permissions, data shape, traffic, and regional dependencies.
- Build a time-aligned request path using trace or request IDs. Account for clock skew and sampling gaps.
- Examine timeout budgets, retry multiplication, idempotency, partial failure, stale discovery, replication lag, and split-brain assumptions.
- Distinguish application errors from proxy, queue, database, dependency, and observability artifacts.

## Regressions

- Establish the last known good and first known bad artifacts, not merely dates or branch names.
- Bisect only with a reliable oracle. Track coupled changes in schema, configuration, dependencies, generated files, and deployment environment.
- Verify that reverting a change removes the failure under the same inputs and state; a revert result alone may still reflect interaction effects.

## Performance and resource failures

- Define the metric and baseline: latency distribution, throughput, CPU, allocation, resident memory, I/O, queue depth, or saturation.
- Separate demand growth from per-operation regression. Compare normalized work, warm-up, cache state, and concurrency.
- Prefer profiles, traces, allocation data, and wait breakdowns over intuition. Check coordinated omission and sampling bias.
- For leaks, distinguish retained memory from allocator behavior and temporary peaks; identify the retaining path or unreleased resource lifecycle.

## Data-dependent failures

- Minimize the failing input while preserving its semantics and original copy.
- Inspect encoding, locale, time zone, numeric boundaries, nullability, ordering, normalization, schema version, and historical migrations.
- Trace provenance and transformation steps. Identify where valid data becomes invalid, or where an undocumented precondition is first assumed.
- Never expose sensitive payloads in logs or reports; use hashes, shapes, or redacted samples when sufficient.

## Build, dependency, and environment failures

- Compare lockfiles, resolved dependency graphs, compiler and runtime versions, platform and architecture, environment variables, filesystem semantics, and generated artifacts.
- Reproduce from a clean environment only after preserving the failing environment. A clean build can erase the evidence.
- Check undeclared dependencies, path and case sensitivity, nondeterministic generation, stale outputs, and network-sourced artifacts.

## State-machine and lifecycle failures

- Write the allowed states and transitions explicitly.
- Capture the actual transition sequence with entity identity and version.
- Look for duplicate, skipped, reordered, or post-terminal transitions; initialization and teardown asymmetry; cancellation; and reuse after disposal.
- Locate the first transition that violates an invariant rather than focusing on the later exception.
