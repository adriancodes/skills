export function exportRecords(records) {
  return records.length ? records.map(JSON.stringify).join("\n") + "\n" : "";
}
