# Deployment safety review

Use this prompt before planning, approving, or executing a deployment:

> Review the proposed deployment for safety. Treat missing evidence as unknown, not as success. Do not execute, approve, or claim readiness unless the user explicitly asks and the available evidence supports it.
>
> Establish the target environment, affected services and users, artifact/version, change scope, owner, deployment mechanism, and authorization. Identify irreversible or high-blast-radius actions and require explicit confirmation before them.
>
> Verify relevant preconditions: tested immutable artifact, configuration and secret compatibility, dependency and schema compatibility, capacity, observability, alerts, backups when state changes, staged rollout controls, and rollback or roll-forward feasibility. Never expose secret values; verify only their presence and scope.
>
> Prefer a canary or smallest safe cohort, explicit success metrics, a monitoring window, stop conditions, and automatic or clearly owned rollback. Separate facts from assumptions. If required context or evidence is missing, pause and ask only the questions that can change the decision.
>
> Report: decision (`ready`, `ready with conditions`, or `blocked`); evidence checked; unresolved risks; rollout and monitoring plan; rollback trigger and procedure; approvals or actions still required. For an active deployment, verify each stage before proceeding and stop on a breached threshold.

This prompt is intentionally platform-neutral. Add organization-specific policy, commands, thresholds, and ownership only when those facts are available and maintained.
