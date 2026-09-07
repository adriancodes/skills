#!/usr/bin/env node
// Repo CLI: keeps the skills catalog honest.
//   table          print a markdown table of all skills
//   readme         verify every current skill is linked from README
//   readme --check same check; retained for CI compatibility
//   check          validate every skill against the agentskills.io spec
//                  and this repo's rules; exit 1 on any failure — CI mode
//   style          report non-blocking instruction-unit metrics
//   route          run the catalog-wide lexical routing preflight
// Zero dependencies. Frontmatter is parsed minimally: top-level `key: value`,
// folded scalars (`key: >`), and one level of nesting under `metadata:`.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const README = path.join(ROOT, "README.md");

function parseFrontmatter(text, file) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error(`${file}: no frontmatter block`);
  const fm = {};
  let currentKey = null;
  let folded = false;
  let nest = null;
  for (const line of m[1].split("\n")) {
    const top = line.match(/^([A-Za-z][A-Za-z0-9_-]*):(?:\s+(.*))?$/);
    if (top) {
      nest = null;
      currentKey = top[1];
      const value = (top[2] ?? "").trim();
      folded = value === ">" || value === ">-";
      if (folded) fm[currentKey] = "";
      else if (value === "") {
        fm[currentKey] = {};
        nest = currentKey;
      } else fm[currentKey] = value;
      continue;
    }
    const nested = line.match(/^  ([A-Za-z][A-Za-z0-9_-]*):\s+(.*)$/);
    if (nest && nested) {
      fm[nest][nested[1]] = nested[2].trim();
      continue;
    }
    if (folded && line.startsWith("  ")) {
      fm[currentKey] = (fm[currentKey] + " " + line.trim()).trim();
      continue;
    }
  }
  return fm;
}

function discover() {
  const items = [];
  const skillsDir = path.join(ROOT, "skills");
  for (const name of fs.readdirSync(skillsDir).sort()) {
    const file = path.join(skillsDir, name, "SKILL.md");
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    let fm = null;
    let parseError = null;
    try {
      fm = parseFrontmatter(text, file);
    } catch (err) {
      parseError = err.message;
    }
    items.push({ dir: name, kind: "skill", file, text, fm, parseError, rel: `skills/${name}/SKILL.md` });
  }
  const layerFile = path.join(ROOT, "ground-rules", "ground-rules.md");
  if (fs.existsSync(layerFile)) {
    const text = fs.readFileSync(layerFile, "utf8");
    items.push({ dir: "ground-rules", kind: "layer", file: layerFile, text, fm: parseFrontmatter(text, layerFile), rel: "ground-rules/ground-rules.md" });
  }
  return items;
}

function renderTable(items) {
  const lines = ["| Skill | Category | Summary |", "|-------|----------|---------|"];
  for (const it of items) {
    lines.push(`| [\`${it.dir}\`](${it.rel}) | ${it.fm.metadata?.category ?? "—"} | ${it.fm.metadata?.summary ?? "—"} |`);
  }
  return lines.join("\n");
}

function updateReadme(items) {
  const readme = fs.readFileSync(README, "utf8");
  const missing = items.filter((it) => !readme.includes(`](${it.rel})`));
  if (missing.length > 0) fail(`README.md is missing: ${missing.map((it) => it.dir).join(", ")}`);
  console.log("README links every current entry.");
}

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function realH2Headings(text) {
  const headings = new Set();
  let fence = null;
  for (const line of text.split("\n")) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      const candidate = { char: marker[1][0], length: marker[1].length };
      if (!fence) fence = candidate;
      else if (candidate.char === fence.char && candidate.length >= fence.length) fence = null;
      continue;
    }
    if (fence) continue;
    const heading = line.match(/^## ([^#].*)$/);
    if (heading) headings.add(heading[1].trim());
  }
  return headings;
}

function bodyText(text) {
  return text.replace(/^---\n[\s\S]*?\n---\n?/, "");
}

function styleMetrics(text) {
  const units = [];
  let fence = null;
  for (const rawLine of bodyText(text).split("\n")) {
    const marker = rawLine.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      const candidate = { char: marker[1][0], length: marker[1].length };
      if (!fence) fence = candidate;
      else if (candidate.char === fence.char && candidate.length >= fence.length) fence = null;
      continue;
    }
    if (fence) continue;
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith("|") || /^[-*_]{3,}$/.test(line)) continue;
    const prose = line.replace(/^(?:[-*+] |\d+\. |>)\s*/, "");
    for (const sentence of prose.split(/(?<=[.!?])\s+/)) {
      const words = sentence.match(/\b[\w’-]+\b/g)?.length ?? 0;
      if (words) units.push(words);
    }
  }
  const sorted = [...units].sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
  const long = units.filter((words) => words > 30).length;
  return {
    units: units.length,
    median,
    longShare: units.length ? long / units.length : 0,
    bodyWords: bodyText(text).trim().split(/\s+/).filter(Boolean).length,
  };
}

function check(items) {
  const problems = [];
  const warnings = [];
  const p = (file, msg) => problems.push(`${file}: ${msg}`);
  for (const it of items) {
    const { fm, text, rel } = it;
    if (!fm) {
      p(rel, it.parseError ?? "unparseable frontmatter");
      continue;
    }
    if (!fm.name) p(rel, "missing `name` in frontmatter");
    else if (it.kind === "skill") {
      // Spec name rules apply to skills only; a layer's name is an
      // output-style display name (e.g. "Work Discipline").
      if (!NAME_RE.test(fm.name) || fm.name.length > 64) {
        p(rel, `name \`${fm.name}\` breaks the spec (lowercase/digits/single-hyphens, ≤64 chars)`);
      }
      if (fm.name !== it.dir) p(rel, `name \`${fm.name}\` does not match directory \`${it.dir}\``);
    }
    if (!fm.description || fm.description.length < 1) p(rel, "missing `description`");
    else if (fm.description.length > 1024) p(rel, `description is ${fm.description.length} chars (spec max 1024)`);
    else if (it.kind === "skill" && fm.description.length > 500) {
      p(rel, `description is ${fm.description.length} chars (collection max 500)`);
    }
    if (fm["disable-model-invocation"] && !["true", "false"].includes(fm["disable-model-invocation"])) {
      p(rel, "`disable-model-invocation` must be `true` or `false`");
    }
    if (fm.license !== "MIT") p(rel, "missing or non-MIT `license` frontmatter (collection rule — cherry-picked skills travel without the repo LICENSE)");
    if (!fm.metadata?.category) p(rel, "missing `metadata.category` (collection rule)");
    if (!fm.metadata?.summary) p(rel, "missing `metadata.summary` (collection rule)");
    else if (fm.metadata.summary.length > 160) p(rel, `summary is ${fm.metadata.summary.length} chars (collection max 160)`);
    const bodyLines = text.split("\n").length;
    if (bodyLines > 500) p(rel, `${bodyLines} lines (spec recommends ≤500)`);
    if (it.kind === "skill") {
      const body = bodyText(text);
      const bodyWords = body.trim().split(/\s+/).filter(Boolean).length;
      const headings = realH2Headings(body);
      if (bodyWords > 2500) p(rel, `${bodyWords} body words (collection hard cap 2500)`);
      const separateScope = headings.has("When to Use") && headings.has("Do Not Use When");
      if (!separateScope && !headings.has("Scope")) {
        p(rel, "missing required core: Scope, or When to Use + Do Not Use When");
      }
      if (!["Workflow", "Rules", "Lookup Procedure"].some((section) => headings.has(section))) {
        p(rel, "missing required core action: Workflow, Rules, or Lookup Procedure");
      }
      if (!["Success Criteria", "Verification"].some((section) => headings.has(section))) {
        p(rel, "missing required core verification: Success Criteria or Verification");
      }
      const metrics = styleMetrics(text);
      if (metrics.median > 12 || metrics.longShare > 0.02) {
        warnings.push(`${rel}: style warning — median ${metrics.median} words/unit; ${(metrics.longShare * 100).toFixed(1)}% over 30 words`);
      }
    }
    // Every references/… path named in the body must exist (a broken pointer
    // is invisible to the agent — it just silently never loads).
    for (const refMatch of text.matchAll(/`?(references\/[A-Za-z0-9._-]+)`?/g)) {
      const refPath = path.join(path.dirname(it.file), refMatch[1]);
      if (!fs.existsSync(refPath)) p(rel, `references missing file: ${refMatch[1]}`);
    }
    if (it.kind === "skill") {
      // Every file that exists under references/ must be mentioned in the body
      // (an unreferenced file is dead weight nobody will ever load).
      const refsDir = path.join(path.dirname(it.file), "references");
      if (fs.existsSync(refsDir)) {
        for (const f of fs.readdirSync(refsDir)) {
          if (!text.includes(`references/${f}`)) p(rel, `references/${f} exists but is never mentioned in SKILL.md`);
        }
      }
    }
  }
  for (const warning of warnings) console.warn(`! ${warning}`);
  if (problems.length > 0) {
    for (const prob of problems) console.error(`✗ ${prob}`);
    fail(`${problems.length} problem${problems.length === 1 ? "" : "s"} found`);
  }
  console.log(`✓ ${items.length} entries clean (structural spec + collection checks)`);
}

function printStyle(items) {
  console.log("skill\twords\tmedian words/unit\tunits >30 words");
  for (const it of items) {
    if (it.kind !== "skill") continue;
    const metrics = styleMetrics(it.text);
    console.log(`${it.dir}\t${metrics.bodyWords}\t${metrics.median}\t${(metrics.longShare * 100).toFixed(1)}%`);
  }
}

function fail(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

const [cmd] = process.argv.slice(2);
const items = discover();
if (items.length === 0) fail("no skills found — is the repo intact?");
// table/readme render from frontmatter, so a parse failure is fatal for them;
// check reports it as a finding instead.
if (cmd !== "check") {
  const broken = items.filter((it) => !it.fm);
  if (broken.length > 0) fail(`unparseable frontmatter in: ${broken.map((b) => b.rel).join(", ")} — run: node scripts/skills.mjs check`);
}

switch (cmd) {
  case "table":
    console.log(renderTable(items));
    break;
  case "readme":
    updateReadme(items);
    break;
  case "check":
    check(items);
    break;
  case "style":
    printStyle(items);
    break;
  case "route": {
    const result = spawnSync(process.execPath, [path.join(ROOT, "scripts", "route-skills.mjs"), ...process.argv.slice(3)], { stdio: "inherit" });
    process.exitCode = result.status ?? 1;
    break;
  }
  default:
    fail(`usage: skills.mjs <table | readme [--check] | check | style | route>`);
}
