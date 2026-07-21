# Admin cross-workspace export is the one sanctioned exception to workspace isolation

The export feature states two rules that collide: workspace data must *never*
cross a workspace boundary, yet admins must be able to export any workspace
through the same endpoint. We resolve this by treating admin cross-workspace
export as a single, deliberate exception rather than a softening of the rule:
only the **global-admin** role may target another workspace, only by passing an
explicit target workspace id, and every such export is **audit-logged** with
elevated visibility. For all non-admin callers the isolation invariant holds
absolutely — a normal request is always pinned to the caller's own workspace,
and the download endpoint re-verifies authorization so a forwarded link cannot
leak across the boundary.

## Considered Options

- **Audited global-admin exception (chosen)** — keeps the invariant true
  everywhere except one narrow, accountable path.
- **Separate admin-only endpoint** — rejected: the requirement was explicitly
  "the same endpoint," and a second endpoint duplicates the auth surface.
- **Workspace-admin cross-workspace access** — rejected: would let any
  workspace's admin reach into others, gutting isolation.

## Consequences

The download path must re-check authorization at fetch time (not just at
request time), and audit logging is a hard dependency of the exception — the
exception is only acceptable because it is accountable.

status: accepted
