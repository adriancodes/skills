#!/usr/bin/env node
// Removes stale old-name copies of this toolbox's skills left behind by
// renames across versions. Dry-run by default; pass --apply to delete.
//
// Usage:
//   node scripts/migrate-install.mjs                # dry run, default dirs
//   node scripts/migrate-install.mjs --apply        # delete verified stale dirs
//   node scripts/migrate-install.mjs --dir <path>   # check a specific skills dir
//
// One-liner without cloning:
//   curl -fsSL https://raw.githubusercontent.com/adriancodes/skills/main/scripts/migrate-install.mjs | node - --apply

import { existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// old install-dir name -> current skill name (full rename history)
const RENAMES = {
  tldr: "be-concise",
  brevity: "be-concise",
  "spec-plan": "create-spec",
  "slice-spec": "create-tasks",
  "implement-slice": "implement-task",
  "ship-feature": "deliver-feature",
  "diagnosing-bugs": "diagnose",
};

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const dirFlag = args.indexOf("--dir");
const dirs =
  dirFlag !== -1
    ? [args[dirFlag + 1]]
    : [join(homedir(), ".claude", "skills"), join(homedir(), ".agents", "skills")];

// A dir counts as ours only when its SKILL.md frontmatter carries the old
// name — that confirms a skill dir (not user data) matching the rename map.
function frontmatterName(skillDir) {
  const f = join(skillDir, "SKILL.md");
  if (!existsSync(f)) return null;
  const head = readFileSync(f, "utf8").slice(0, 500);
  const m = head.match(/^name:\s*(\S+)\s*$/m);
  return m ? m[1] : null;
}

let found = 0;
let removed = 0;
for (const dir of dirs) {
  if (!dir || !existsSync(dir)) continue;
  for (const entry of readdirSync(dir)) {
    const target = RENAMES[entry];
    if (!target) continue;
    const path = join(dir, entry);
    const name = frontmatterName(path);
    if (name !== entry) {
      console.log(`skip    ${path} — SKILL.md name is ${JSON.stringify(name)}, not "${entry}"; not touching it`);
      continue;
    }
    found++;
    const current = join(dir, target);
    const note = existsSync(current)
      ? `current "${target}" already installed`
      : `install "${target}" via: npx skills add adriancodes/skills`;
    if (apply) {
      rmSync(path, { recursive: true });
      removed++;
      console.log(`removed ${path} — renamed to "${target}" (${note})`);
    } else {
      console.log(`stale   ${path} — renamed to "${target}" (${note})`);
    }
  }
}

if (found === 0) {
  console.log("clean — no stale old-name skills found");
} else if (!apply) {
  console.log(`\n${found} stale dir(s) found. Re-run with --apply to remove them.`);
} else {
  console.log(`\n${removed} stale dir(s) removed. Restart your agent session so descriptions reload.`);
}
