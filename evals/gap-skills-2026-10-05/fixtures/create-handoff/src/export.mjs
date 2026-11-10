export function exportRecords(records) {
  // Current work in progress: record separators are still missing.
  return records.map(record => JSON.stringify(record)).join("");
}
