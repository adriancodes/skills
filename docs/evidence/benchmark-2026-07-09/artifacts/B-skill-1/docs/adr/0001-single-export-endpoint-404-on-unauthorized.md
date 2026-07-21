# One export endpoint, 404 on unauthorized workspace

Both self-service and admin exports go through a single endpoint that takes an explicit `workspace_id` (defaulting to the caller's active workspace). Authorization is resolved server-side from the session — membership or platform-admin role — never from a client-supplied field. A caller authorized for neither receives a **404**, not a 403, so the endpoint never confirms the existence of workspaces the caller may not see.

Considered options:
- Two endpoints (self vs. admin) — rejected: duplicates the generation path and still needs the same server-side check.
- Return 403 on unauthorized — rejected: a 403 distinguishes "exists but forbidden" from "does not exist", leaking workspace existence across the tenant boundary the feature exists to protect.

Consequence: clients cannot tell an unknown `workspace_id` from a forbidden one; admin tooling must rely on the audit trail, not endpoint responses, to know a cross-workspace export occurred.
