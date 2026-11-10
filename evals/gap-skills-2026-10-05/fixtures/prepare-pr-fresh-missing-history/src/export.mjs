export const serialize = rows => rows.map(JSON.stringify).join("\n");
