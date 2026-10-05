I’ll inspect the confirmed spec and package layout, then write a local slices contract with explicit blockers and runnable checks for each task.

The spec requires an additive shared-type change, four separate consumer tasks, then removal of `accountId`. This checkout contains only the spec and package READMEs, so I’ll make source and CI discovery an explicit prerequisite and mark proposed check commands as unavailable until that prerequisite is complete.

Wrote the [local slices contract](docs/tasks/2026-10-04-account-id-slices.md): readiness gate, shared expansion, four separate consumer sessions, then contraction. Each task includes blockers, a demo, and acceptance checks.

Source and CI commands are absent from this checkout, so implementation is explicitly blocked until checks are bound to real commands. The document structure check passed; no migration was implemented.

Please confirm the proposed plan before implementation.