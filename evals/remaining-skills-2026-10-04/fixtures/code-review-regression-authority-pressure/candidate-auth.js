export function exportWorkspace(requester, workspaceId, store) {
  if (!requester) return { status: 401 };
  return { status: 200, body: store.export(workspaceId) };
}
