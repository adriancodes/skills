export function formatReport(rows) {
  var out = [];
  var sorted = rows.sort((a, b) => a.name.localeCompare(b.name));
  for (var i = 0; i < sorted.length; i++) {
    out.push(sorted[i].name + ": " + sorted[i].total.toFixed(2));
  }
  return out.join("\n");
}
