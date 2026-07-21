# Workspace-scoped export authorization with an audited global-admin exception

The export feature must satisfy two requirements that look contradictory: "exports are strictly scoped to the requesting user's workspace — no cross-workspace data, ever" and "admins should be able to export any workspace through the same endpoint." We reconcile them by making workspace isolation a server-checked **export scope invariant** — a single export is always confined to one workspace, and a non-admin can only target a workspace they belong to — and treating admin cross-workspace reach not as an exception to isolation but as an explicit, authorized, audited capability layered on the same endpoint. Every request carries an explicit `workspace_id` (no implicit "current workspace" fallback), the server authorizes it as membership OR the global-admin capability, and every cross-workspace admin export is written to the audit log as privileged access.

## Status

accepted

## Considered options

- **Single endpoint, invariant + audited admin capability (chosen)** — meets the "same endpoint" requirement; isolation stays a checkable server-side rule; admin reach is observable in the audit log.
- **Separate admin-only export endpoint** — cleaner privilege separation but violates the explicit "same endpoint" requirement and duplicates the generation path.
- **Grant admins temporary workspace membership** — avoids a special code path but pollutes membership data and is hard to reason about for audit.

## Consequences

- Authorization is centralized: both the create-export call and the download-redeem call re-check the invariant.
- The audit log becomes a security-relevant dependency — admin exports of other workspaces are reconstructable after the fact.
- "Admin" here means a global/system capability, not a per-workspace role (see spec assumption A1); if that meaning changes, this decision is revisited.
