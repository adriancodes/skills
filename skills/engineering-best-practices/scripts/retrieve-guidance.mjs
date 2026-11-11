#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.join(scriptDirectory, "..", "references", "catalog.json");
let catalog = null;
try {
  catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
} catch {
  // Reported from retrieveGuidance so callers get one clear message instead of a stack trace.
}

const USAGE = `Usage: node retrieve-guidance.mjs --intent <design|implement|review|refactor|simplify|test|operate> --task "<specific engineering problem>" [--max <1-6>] [--books <slugs>] [--principles <ids>] [--format <markdown|json>]`;

const INTENTS = new Set([
  "design",
  "implement",
  "review",
  "refactor",
  "simplify",
  "test",
  "operate",
]);
const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "before", "by", "code", "for",
  "from", "in", "into", "is", "it", "make", "of", "on", "or", "our", "that",
  "the", "their", "this", "to", "use", "with", "without",
]);
// The five query fields SKILL.md asks for. A label, and a "not applicable" value, is structure rather than a search term.
const FIELD_LABELS = /(invariant|concurrency\/distribution scope|atomicity\/consistency mechanism|state owner|failure\/recovery)\s*:(\s*not applicable\b)?/gi;
// Six results at most, and about 1,000 tokens of output: the context budget SKILL.md sets for one lookup.
const MAX_RESULTS = 6;
const MAX_OUTPUT_CHARS = 4_000;

function normalize(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9:-]+/g, " ")
    .trim();
}

function tokenize(value) {
  return [...new Set(normalize(value).split(/\s+/).filter((token) => token.length > 1 && !STOP_WORDS.has(token)))];
}

function splitList(value) {
  if (!value) return [];
  return String(value).split(",").map((item) => item.trim()).filter(Boolean);
}

function scorePrinciple(principle, query) {
  const book = catalog.books[principle.book];
  const directive = normalize(principle.directive);
  const source = normalize(principle.source);
  const topicText = normalize(book.topics.join(" "));
  const title = normalize(book.title);
  const requestedIds = new Set(query.principles.map(normalize));
  const requestedBooks = new Set(query.books.map(normalize));
  // Weights only order results: an explicit request outranks any term match, and a whole-word directive hit outranks topic, substring, and title hits.
  let score = 0;
  const matchedTerms = [];

  if (requestedIds.has(normalize(principle.id)) || requestedIds.has(normalize(principle.localId))) {
    score += 100;
    matchedTerms.push("requested principle");
  }
  if (requestedBooks.has(normalize(principle.book)) || requestedBooks.has(title)) {
    score += 24;
    matchedTerms.push("requested book");
  }

  for (const token of query.tokens) {
    let matched = false;
    if (directive.split(" ").includes(token)) {
      score += 5;
      matched = true;
    } else if (directive.includes(token)) {
      score += 2;
      matched = true;
    }
    if (topicText.includes(token)) {
      score += 4;
      matched = true;
    }
    if (source.includes(token) || title.includes(token)) {
      score += 1;
      matched = true;
    }
    if (matched) matchedTerms.push(token);
  }

  // Intent ranks real matches; it never qualifies a principle on its own.
  if (score === 0) return { score, matchedTerms };

  if (["implement", "design", "refactor", "simplify"].includes(query.intent) && principle.kind === "decision") score += 2;
  if (["review", "test", "operate"].includes(query.intent) && principle.kind === "trigger") score += 2;
  if (query.intent === "operate" && principle.book === "release-it") score += 5;
  if (query.intent === "simplify" && ["refactoring", "a-philosophy-of-software-design"].includes(principle.book)) score += 4;
  if (query.intent === "refactor" && ["refactoring", "working-effectively-with-legacy-code"].includes(principle.book)) score += 4;

  return { score, matchedTerms: [...new Set(matchedTerms)].slice(0, 6) };
}

function diversify(scored, limit) {
  const selected = [];
  const perBook = new Map();

  for (const candidate of scored) {
    const count = perBook.get(candidate.book) ?? 0;
    if (count >= 2) continue;
    selected.push(candidate);
    perBook.set(candidate.book, count + 1);
    if (selected.length === limit) return selected;
  }

  return selected;
}

export function retrieveGuidance({ task, intent, books = [], principles = [], maxResults = 5 }) {
  if (!catalog) throw new Error(`catalog not found or unreadable at ${catalogPath}; continue without retrieval`);
  if (!INTENTS.has(intent)) throw new Error(`invalid intent: ${intent}`);
  if (!Number.isFinite(Number(maxResults))) throw new Error(`--max must be a number from 1 to ${MAX_RESULTS}`);
  if (!String(task ?? "").trim()) throw new Error("task must not be empty");

  const limit = Math.max(1, Math.min(MAX_RESULTS, Number(maxResults)));
  const query = {
    intent,
    books: splitList(books),
    principles: splitList(principles),
    tokens: tokenize(`${String(task).replace(FIELD_LABELS, " ")} ${splitList(books).join(" ")} ${splitList(principles).join(" ")}`),
  };

  const scored = catalog.principles
    .map((principle) => ({ ...principle, ...scorePrinciple(principle, query) }))
    .filter(({ score }) => score > 1)
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));
  const matches = diversify(scored, limit).map((match) => ({
    id: match.id,
    book: catalog.books[match.book].title,
    bookSlug: match.book,
    kind: match.kind,
    directive: match.directive,
    source: match.source,
    sourcePath: catalog.books[match.book].miniPath,
    matchedTerms: match.matchedTerms,
  }));

  return { intent, task: String(task).trim(), matches };
}

export function formatMarkdown(packet) {
  const header = [
    "# Applicable engineering practices",
    "",
    `Intent: ${packet.intent}`,
    `Task: ${packet.task}`,
    "",
  ];
  const blocks = packet.matches.map((match, index) => [
    `## ${index + 1}. ${match.id} — ${match.book}`,
    "",
    match.directive,
    "",
    `Kind: ${match.kind}`,
    `Matched: ${match.matchedTerms.join(", ") || "intent fallback"}`,
    `Source: ${match.source}`,
    "",
  ].join("\n"));

  if (blocks.length === 0) blocks.push("No relevant principles found.\n");

  while ([...header, ...blocks].join("\n").length > MAX_OUTPUT_CHARS && blocks.length > 1) {
    blocks.pop();
  }
  return [...header, ...blocks].join("\n").slice(0, MAX_OUTPUT_CHARS).trimEnd();
}

function parseArguments(argv) {
  const options = { maxResults: 5, format: "markdown" };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith("--")) throw new Error(`unexpected argument: ${argument}`);
    const key = argument.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`missing value for --${key}`);
    index += 1;
    if (key === "max") options.maxResults = value;
    else if (["task", "intent", "books", "principles", "format"].includes(key)) options[key] = value;
    else throw new Error(`unknown option: --${key}`);
  }
  return options;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.includes("--help")) {
      process.stdout.write(`${USAGE}\n`);
    } else {
      const options = parseArguments(process.argv.slice(2));
      if (!["markdown", "json"].includes(options.format)) throw new Error(`invalid format: ${options.format}`);
      const packet = retrieveGuidance(options);
      const output = options.format === "json" ? JSON.stringify(packet, null, 2) : formatMarkdown(packet);
      process.stdout.write(`${output}\n`);
    }
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
