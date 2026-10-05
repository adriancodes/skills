# Tenant Export Authorization

`exportWorkspace(requester, workspaceId)` may return export data only when the requester is authenticated **and** belongs to `workspaceId`. Cross-tenant access must return `404` so workspace existence is not disclosed.
