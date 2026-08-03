#!/usr/bin/env node
// csv-dedupe: keep the first row for each key; drop later duplicates.
// Usage: node dedupe.js <input.csv> <key-column>
// Writes the deduplicated CSV to stdout.
"use strict";
const fs = require("fs");

const [, , inputPath, keyColumn] = process.argv;
if (!inputPath || !keyColumn) {
  console.error("usage: node dedupe.js <input.csv> <key-column>");
  process.exit(2);
}

const text = fs.readFileSync(inputPath, "utf8");
const headerLine = text.match(/^(.*)\r?\n/)[1];
const header = headerLine.split(",").map((h) => h.trim());
const keyIndex = header.indexOf(keyColumn);
if (keyIndex < 0) {
  console.error(`unknown key column: ${keyColumn}`);
  process.exit(2);
}

const lines = text.split(/\r?\n/);
const seen = new Set();
const out = [header.join(",")];
for (let i = 1; i < lines.length - 1; i += 1) {
  const fields = lines[i].split(",").map((f) => f.trim());
  const key = fields[keyIndex];
  if (seen.has(key)) continue;
  seen.add(key);
  out.push(fields.join(","));
}
process.stdout.write(out.join("\n") + "\n");
