// Workspace export endpoint.
//
// July refactor: exports now STREAM directly to the HTTP response.
// Nothing is written to disk; var/exports/ has been removed entirely
// and there is no stored file to re-download after the request ends.
export function exportWorkspace(workspace, res) {
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${workspace.slug}.csv"`
  );
  for (const row of workspace.rows()) {
    res.write(toCsvLine(row));
  }
  res.end();
}

function toCsvLine(row) {
  return row.map((cell) => JSON.stringify(String(cell))).join(",") + "\n";
}
