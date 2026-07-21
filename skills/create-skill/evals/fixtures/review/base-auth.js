export function exportWorkspace(requester, workspaceId, store) {
  if (!requester) return { status: 401 };
  if (!requester.workspaceIds.includes(workspaceId)) return { status: 404 };
  return { status: 200, body: store.export(workspaceId) };
}
