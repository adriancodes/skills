export function formatReport(rows) {
  if (rows.length == 0) return "";
  var out = [];
  var sorted = rows.sort((a, b) => a.name.localeCompare(b.name));
  for (var i = 0; i < sorted.length; i++) {
    var r = sorted[i];
    out.push(r.name + ": " + r.total.toFixed(2));
  }
  return out.join("\n");
}
