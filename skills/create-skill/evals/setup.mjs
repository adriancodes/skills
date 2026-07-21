#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const [fixture, target] = process.argv.slice(2);
const allowed = new Set(["review", "reference", "abandon", "migration"]);

if (!allowed.has(fixture) || !target) {
  console.error("usage: node setup.mjs <review|reference|abandon|migration> <empty-target-directory>");
  process.exit(1);
}
if (fs.existsSync(target) && fs.readdirSync(target).length > 0) {
  console.error(`target must be empty: ${target}`);
  process.exit(1);
}

fs.mkdirSync(target, { recursive: true });
fs.cpSync(path.join(root, "fixtures", fixture), target, { recursive: true });
console.log(path.resolve(target));
