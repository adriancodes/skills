export const serialize = rows => rows.map(JSON.stringify).join("\n") + (rows.length ? "\n" : "");
