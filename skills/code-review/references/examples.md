# Worked example

Specification: “Export data only when the requester belongs to the workspace; return `404` for cross-tenant access.”

Scoped diff:

```diff
 export function exportWorkspace(requester, workspaceId, store) {
   if (!requester) return { status: 401 };
-  if (!requester.workspaceIds.includes(workspaceId)) return { status: 404 };
   return { status: 200, body: store.export(workspaceId) };
 }
```

Report:

> ### [P1][Correctness, Spec] Workspace export loses tenant authorization: `candidate-auth.js:3`
>
> Any authenticated requester can now export an arbitrary workspace because the changed path reaches `store.export(workspaceId)` without verifying membership. The removed condition enforced the specification's cross-tenant `404` requirement, so this change creates cross-tenant data exposure. Restore ownership enforcement at this boundary and add a cross-tenant regression test.

Do not add generic naming, abstraction, or style findings: the authorization regression is the evidence-backed review result.
