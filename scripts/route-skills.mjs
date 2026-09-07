#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const valueAfter = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : fallback;
};
const root = path.resolve(valueAfter("--root", path.join(path.dirname(fileURLToPath(import.meta.url)), "..")));
const minimum = Number(valueAfter("--min-rank1", "80"));
const failures = [];
const warnings = [];
const stop = new Set(["a", "an", "and", "are", "for", "from", "in", "is", "it", "of", "on", "or", "that", "the", "this", "to", "use", "user", "when", "with"]);

function stem(word) {
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2);
  if (word.length > 4 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s")) return word.slice(0, -1);
  return word;
}

function tokens(text) {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).map(stem).filter((word) => !stop.has(word));
}

function description(text, file) {
  const block = text.match(/^---\n([\s\S]*?)\n---/);
  if (!block) throw new Error(`${file}: missing frontmatter`);
  const lines = block[1].split("\n");
  const index = lines.findIndex((line) => line.startsWith("description:"));
  if (index < 0) throw new Error(`${file}: missing description`);
  const inline = lines[index].slice("description:".length).trim();
  if (inline && inline !== ">" && inline !== ">-") return inline;
  const folded = [];
  for (const line of lines.slice(index + 1)) {
    if (/^[A-Za-z][A-Za-z0-9_-]*:/.test(line)) break;
    if (line.startsWith("  ")) folded.push(line.trim());
  }
  return folded.join(" ");
}

const skillsDir = path.join(root, "skills");
const documents = new Map();
for (const name of fs.readdirSync(skillsDir).sort()) {
  const file = path.join(skillsDir, name, "SKILL.md");
  if (fs.existsSync(file)) documents.set(name, [...tokens(name), ...tokens(description(fs.readFileSync(file, "utf8"), file))]);
}

const documentFrequency = new Map();
for (const terms of documents.values()) {
  for (const term of new Set(terms)) documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
}

function vector(terms) {
  const counts = new Map();
  for (const term of terms) counts.set(term, (counts.get(term) ?? 0) + 1);
  const result = new Map();
  for (const [term] of counts) {
    const idf = Math.log((documents.size + 1) / ((documentFrequency.get(term) ?? 0) + 1)) + 1;
    result.set(term, idf);
  }
  return result;
}

const skillVectors = new Map([...documents].map(([name, terms]) => [name, vector(terms)]));
function score(prompt, skill) {
  const query = vector(tokens(prompt));
  const target = skillVectors.get(skill);
  let dot = 0;
  let querySize = 0;
  for (const weight of query.values()) querySize += weight ** 2;
  for (const [term, weight] of query) dot += weight * (target.get(term) ?? 0);
  return querySize ? dot / Math.sqrt(querySize) : 0;
}

function rank(prompt) {
  return [...documents.keys()].map((skill) => ({ skill, score: score(prompt, skill) }))
    .sort((a, b) => b.score - a.score || a.skill.localeCompare(b.skill));
}

const casesDir = path.join(root, "evals", "cases");
const caseFiles = fs.existsSync(casesDir) ? fs.readdirSync(casesDir).filter((file) => file.endsWith(".json")).sort() : [];
const coveredSkills = new Set();
let positives = 0;
let rankFirst = 0;

if (!Number.isFinite(minimum) || minimum < 0 || minimum > 100) failures.push("--min-rank1 must be between 0 and 100");

for (const file of caseFiles) {
  const fullPath = path.join(casesDir, file);
  const testCase = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  if (!documents.has(testCase.skill)) failures.push(`${file}: unknown skill ${testCase.skill}`);
  if (coveredSkills.has(testCase.skill)) failures.push(`${file}: duplicate case coverage for ${testCase.skill}`);
  coveredSkills.add(testCase.skill);
  if (file !== `${testCase.skill}.json`) failures.push(`${file}: filename must match skill ${testCase.skill}`);
  if (!Array.isArray(testCase.positive) || testCase.positive.length < 3) failures.push(`${file}: needs at least 3 positive prompts`);
  if (!Array.isArray(testCase.negative) || testCase.negative.length < 2) failures.push(`${file}: needs at least 2 negative prompts`);
  if (!testCase.behavior?.prompt || !testCase.behavior?.expect) failures.push(`${file}: needs one declared behavior case`);
  if (!Array.isArray(testCase.positive) || !Array.isArray(testCase.negative)) continue;
  for (const prompt of testCase.positive ?? []) {
    positives += 1;
    const [first] = rank(prompt);
    if (first?.skill === testCase.skill) rankFirst += 1;
    else failures.push(`${file}: expected ${testCase.skill} for "${prompt}", got ${first?.skill ?? "none"}`);
  }
  for (const negative of testCase.negative ?? []) {
    if (!documents.has(negative.owner)) {
      failures.push(`${file}: negative owner ${negative.owner} does not exist`);
      continue;
    }
    const ranked = rank(negative.prompt);
    const owner = ranked.findIndex((entry) => entry.skill === negative.owner);
    if (owner !== 0) failures.push(`${file}: ${negative.owner} must rank first for "${negative.prompt}" (got ${ranked[0]?.skill})`);
  }
}

for (const [left, leftTerms] of documents) {
  for (const [right, rightTerms] of documents) {
    if (left >= right) continue;
    const a = new Set(leftTerms);
    const b = new Set(rightTerms);
    const intersection = [...a].filter((term) => b.has(term)).length;
    const similarity = intersection / new Set([...a, ...b]).size;
    if (similarity >= 0.75) failures.push(`${left} and ${right}: description collision ${(similarity * 100).toFixed(0)}%`);
    else if (similarity >= 0.5) warnings.push(`${left} and ${right}: description similarity ${(similarity * 100).toFixed(0)}%`);
  }
}

if (coveredSkills.size !== documents.size) failures.push(`case coverage: ${coveredSkills.size}/${documents.size} skills`);
const rate = positives ? (rankFirst / positives) * 100 : 0;
if (rate < minimum) failures.push(`rank-1 rate ${rate.toFixed(0)}% is below ${minimum}%`);

for (const warning of warnings) console.warn(`! ${warning}`);
console.log(`${rankFirst}/${positives} positive prompts rank first (${rate.toFixed(0)}%)`);
console.log(`${coveredSkills.size}/${documents.size} skills have routing cases`);
console.log("Lexical routing is a preflight, not proof of autonomous model triggering.");

if (failures.length) {
  for (const failure of failures) console.error(`✗ ${failure}`);
  process.exit(1);
}
