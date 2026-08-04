#!/usr/bin/env node
// Migrates installs that predate this toolbox's skill renames. Old-name
// copies shadow the current skills; this script finds them and — only with
// --apply — moves them into a recoverable trash directory. It never deletes.
//
// Safety model (provenance of an installed dir cannot be verified, so):
//   - default: report only
//   - --apply: RELOCATES (never deletes) a dir to <skills-dir>/.migrate-trash/<ts>/,
//     and only when BOTH hold:
//       (a) the dir's SKILL.md frontmatter name matches the old skill name
//       (b) the current replacement skill is already installed beside it
//     Anything else is left untouched with a manual instruction printed.
//
// Usage:
//   node scripts/migrate-install.mjs                # dry run, default dirs
//   node scripts/migrate-install.mjs --apply        # move stale dirs to trash
//   node scripts/migrate-install.mjs --dir <path>   # check a specific skills dir
//
// One-liner without cloning:
//   curl -fsSL https://raw.githubusercontent.com/adriancodes/skills/main/scripts/migrate-install.mjs | node - --apply

import { existsSync, readFileSync, readdirSync, mkdirSync, renameSync } from "node:fs";
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
const stamp = new Date().toISOString().replace(/[:.]/g, "-");

function frontmatterName(skillDir) {
  const f = join(skillDir, "SKILL.md");
  if (!existsSync(f)) return null;
  const m = readFileSync(f, "utf8").slice(0, 500).match(/^name:\s*(\S+)\s*$/m);
  return m ? m[1] : null;
}

let found = 0;
let moved = 0;
for (const dir of dirs) {
  if (!dir || !existsSync(dir)) continue;
  for (const entry of readdirSync(dir)) {
    const target = RENAMES[entry];
    if (!target || entry.startsWith(".")) continue;
    const path = join(dir, entry);
    const name = frontmatterName(path);
    if (name !== entry) {
      console.log(
        `skip    ${path} — SKILL.md name is ${JSON.stringify(name)}, not "${entry}": not this toolbox's copy; remove manually if it is yours`,
      );
      continue;
    }
    found++;
    const replacementInstalled = existsSync(join(dir, target, "SKILL.md"));
    if (!replacementInstalled) {
      console.log(
        `hold    ${path} — replacement "${target}" is not installed yet; run \`npx skills add adriancodes/skills\` first, then re-run this script`,
      );
      continue;
    }
    if (apply) {
      const trash = join(dir, ".migrate-trash", stamp);
      mkdirSync(trash, { recursive: true });
      renameSync(path, join(trash, entry));
      moved++;
      console.log(
        `moved   ${path} -> ${join(trash, entry)} — superseded by "${target}"; restore by moving it back, or delete the trash dir when satisfied`,
      );
    } else {
      console.log(`stale   ${path} — superseded by installed "${target}"; --apply moves it to a recoverable trash dir`);
    }
  }
}

if (found === 0) {
  console.log("clean — no stale old-name skills found");
} else if (!apply) {
  console.log(`\n${found} stale dir(s) found. Re-run with --apply to move them to trash (nothing is ever deleted).`);
} else {
  console.log(`\n${moved} dir(s) moved to trash. Restart your agent session so descriptions reload.`);
}
