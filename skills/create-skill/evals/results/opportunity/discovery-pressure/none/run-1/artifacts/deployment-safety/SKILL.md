---
name: deployment-safety
description: Assess, plan, execute, and verify safe software deployments and releases. Use for production or staging rollouts, release readiness reviews, deployment checklists, migrations, feature-flag launches, hotfixes, rollback planning, canaries, incident-prone changes, and requests to deploy or validate a deployment.
---

# Deployment Safety

Reduce deployment risk while preserving delivery speed. Base decisions on repository and environment evidence, not generic ceremony.

## Establish scope and authority

1. Identify the artifact, target environment, deployment mechanism, owners, and requested outcome.
2. Distinguish planning, review, execution, and monitoring. Treat a request to review or plan as read-only; do not deploy, merge, publish, change flags, or alter infrastructure without explicit authorization.
3. Check repository instructions, deployment configuration, CI status, change history, and current environment state when accessible.
4. State important unknowns. Ask only when an answer would materially change safety or authorization; otherwise make a conservative, reversible assumption and label it.

## Assess risk

Inspect the actual diff and operational surface. Consider:

- data loss or irreversible schema and storage changes;
- compatibility across old and new application versions, APIs, events, and clients;
- authentication, authorization, secrets, privacy, and network exposure;
- capacity, latency, dependencies, rate limits, and cost;
- cache, queue, retry, idempotency, and ordering behavior;
- configuration, infrastructure, packaging, and runtime changes;
- observability coverage and the time needed to detect harm;
- blast radius, affected users, and rollback feasibility.

Classify the deployment as low, medium, or high risk and give concrete reasons. Do not use the label as a substitute for analysis.

## Build the release plan

Define verifiable items for each phase:

1. **Preflight:** required tests and CI checks, artifact identity, configuration validation, backups or snapshots, migration compatibility, owner availability, and baseline health metrics.
2. **Rollout:** exact order, commands or automation entry points, canary or staged percentages, wait periods tied to traffic volume, and approval gates.
3. **Verification:** user-visible smoke tests plus service-level signals such as errors, latency, saturation, queue depth, data correctness, and business-critical flows. Include queries or dashboards when known.
4. **Rollback or roll-forward:** trigger thresholds, decision owner, exact mechanism, expected recovery time, and treatment of data written after rollout. Never claim rollback is safe when a change is irreversible or backward-incompatible.
5. **Communication:** record the release, status, deviations, and final outcome in the project’s normal channel when authorized.

Prefer automated, idempotent, non-interactive procedures. Rehearse destructive or unfamiliar operations in a representative non-production environment when feasible.

## Execute safely

Before mutating an environment, re-check the target, artifact version, authorization, health baseline, rollback readiness, and active incidents. Use the project’s established deployment path.

Pause rather than improvise when:

- the target or authorization is ambiguous;
- a required gate fails;
- observed state differs materially from the plan;
- rollback is unavailable for a high-impact failure mode;
- credentials, approvals, or environment access are missing.

During rollout, make one attributable change at a time. Record timestamps and versions. Evaluate gates using observed evidence. Stop, roll back, or roll forward according to the declared thresholds; do not continue merely because the deployment has started.

## Verify and report

Confirm the deployed version and target environment, then observe long enough to cover meaningful traffic and delayed failure modes. Compare post-deploy signals with the preflight baseline and perform smoke tests.

Report:

- deployed artifact and environment;
- completed gates and evidence;
- rollout and verification results;
- deviations, unresolved risks, and monitoring window;
- rollback status or follow-up owner.

Never describe a deployment as successful solely because the deployment command exited successfully.

## Handle urgent releases

For hotfixes, reduce scope and shorten gates only when urgency justifies it. Preserve the minimum controls: known artifact, explicit target, authorization, focused validation, observable health signals, rollback or containment plan, and post-release review. State which controls were deferred and why.
