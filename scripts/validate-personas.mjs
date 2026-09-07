#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const rootArg = process.argv.indexOf("--root");
const root = rootArg >= 0 ? path.resolve(process.argv[rootArg + 1]) : path.resolve(here, "..");
const agents = path.join(root, "agents");
const failures = [];

if (!fs.existsSync(agents)) failures.push("agents/: directory is missing");

for (const file of fs.existsSync(agents) ? fs.readdirSync(agents).filter((name) => name.endsWith(".md")) : []) {
  const relative = `agents/${file}`;
  const text = fs.readFileSync(path.join(agents, file), "utf8");
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) {
    failures.push(`${relative}: missing frontmatter`);
    continue;
  }
  const name = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const fmLines = frontmatter[1].split("\n");
  const descIndex = fmLines.findIndex((line) => line.startsWith("description:"));
  let description = descIndex >= 0 ? fmLines[descIndex].slice("description:".length).trim() : "";
  if (description === ">" || description === ">-") description = "";
  if (!description && descIndex >= 0) {
    const folded = [];
    for (const line of fmLines.slice(descIndex + 1)) {
      if (/^[A-Za-z][A-Za-z0-9_-]*:/.test(line)) break;
      if (line.startsWith("  ")) folded.push(line.trim());
    }
    description = folded.join(" ");
  }
  if (name !== path.basename(file, ".md")) failures.push(`${relative}: name must match filename`);
  if (!description) failures.push(`${relative}: missing description`);
  if (!/^You are\b/m.test(text)) failures.push(`${relative}: missing concrete 'You are' role`);
  for (const heading of ["Output Contract", "Rules", "Composition"]) {
    if (!text.includes(`## ${heading}`)) failures.push(`${relative}: missing ${heading}`);
  }
  if (!/Do not invoke from another persona/i.test(text)) {
    failures.push(`${relative}: Composition must forbid persona-to-persona invocation`);
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`✗ ${failure}`);
  process.exit(1);
}

console.log(`✓ ${fs.readdirSync(agents).filter((name) => name.endsWith(".md")).length} persona(s) clean`);
