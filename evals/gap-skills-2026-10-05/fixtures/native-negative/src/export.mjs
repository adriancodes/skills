export function exportRecords(records) { return records.map(JSON.stringify).join("\n"); }
