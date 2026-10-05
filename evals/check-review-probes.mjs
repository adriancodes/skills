#!/usr/bin/env node
// Recheck provenance and file effects; language scores remain non-blind manual judgments.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJSON = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const tree = (dir) => Object.fromEntries(fs.readdirSync(dir, { recursive: true }).filter((file) => fs.statSync(path.join(dir, file)).isFile()).sort().map((file) => [file, hash(path.join(dir, file))]));
const report = readJSON(path.join(repo, "evals/review-results.json"));
const expected = new Set([
  "create-skill:minimal-workflow", "create-skill:missing-boundary",
  "create-spec:regression-terse-option-picks", "create-spec:regression-explicit-pace-complaint",
  "create-tasks:regression-chat-only-pressure", "create-tasks:regression-no-write-boundary", "create-tasks:regression-chat-preference",
]);
let assertions = 0;
let archived = 0;
for (const run of report.current) {
  const dir = path.join(repo, "skills", run.skill, "evals/results/review-2026-09-04", run.label);
  const manifest = readJSON(path.join(dir, "manifest.json"));
  const result = readJSON(path.join(dir, "result.json"));
  const testCase = readJSON(path.join(dir, "case.json"));
  assert(expected.delete(`${run.skill}:${manifest.case_id}`), "Unexpected or duplicate case");
  assert.equal(manifest.case_id, testCase.id);
  assert.equal(result.exit_code, 0);
  assert.equal(result.completed, true);
  assert.equal(result.output_sha256, hash(path.join(dir, "output.md")));
  assert.equal(result.trace_sha256, hash(path.join(dir, "trace.jsonl")));
  assert.equal(manifest.prompt_sha256, hash(path.join(dir, "prompt.md")));
  assert.equal(manifest.runner_sha256, hash(path.join(repo, "evals/run-review-probe.mjs")));
  const subjectRoot = run.archived_subject ? path.join(repo, run.archived_subject) : path.join(repo, "skills", run.skill);
  if (run.archived_subject) {
    const archives = {
      "create-tasks": "evals/pocock-comparison-2026-10-04/subjects/original/create-tasks",
      "create-spec": "evals/remaining-skills-2026-10-04/subjects/original/create-spec",
      "create-skill": "evals/remaining-skills-2026-10-04/subjects/original/create-skill",
    };
    assert.equal(run.archived_subject, archives[run.skill], "Only explicitly preserved subjects may be archived");
    archived++;
  }
  for (const [file, digest] of Object.entries(manifest.subjects)) assert.equal(hash(path.join(subjectRoot, file)), digest, `Stale subject: ${run.skill}/${file}`);
  const casesName = run.skill === "create-skill" ? "scope-cases.jsonl" : "cases.jsonl";
  const casesFile = run.archived_subject ? path.join(subjectRoot, casesName) : path.join(repo, "skills", run.skill, "evals", casesName);
  assert.equal(manifest.cases_sha256, hash(casesFile), "Stale cases");
  const sourceCase = fs.readFileSync(casesFile, "utf8").trim().split("\n").map(JSON.parse).find((item) => item.id === testCase.id);
  assert.deepEqual(testCase, sourceCase, "Run used a different case");
  if (run.skill === "create-skill") {
    let candidate = fs.readFileSync(path.join(repo, "skills/create-skill/evals", testCase.fixture), "utf8");
    if (testCase.omit_boundary) candidate = candidate.replace(/^Do not use for active incident diagnosis\..*\n/m, "");
    const prompt = fs.readFileSync(path.join(dir, "prompt.md"), "utf8");
    const marker = "\n\nCandidate document:\n";
    assert.equal(prompt.slice(prompt.indexOf(marker) + marker.length, prompt.lastIndexOf("\n\nScenario:\n")), candidate, "Stale candidate fixture");
  }
  assert.deepEqual(Object.keys(run.checks).sort(), testCase.assertions.map((item) => item.id).sort(), "Missing assertion scores");
  assert.deepEqual(tree(path.join(dir, "workspace-before")), run.workspace_before);
  assert.deepEqual(tree(path.join(dir, "workspace-after")), run.workspace_after);
  for (const check of Object.values(run.checks)) {
    assert.equal(check.pass, true, check.evidence);
    assert(check.evidence.length > 0, "Manual scores need evidence");
    assertions++;
  }
  if (run.skill === "create-tasks") {
    assert.equal(run.workspace_before["docs/specs/2026-07-28-saved-searches.md"], hash(path.join(repo, "skills/create-tasks/evals/fixtures/confirmed-spec/2026-07-28-saved-searches.md")), "Stale spec fixture");
    if (testCase.id === "regression-chat-preference") {
      const added = Object.keys(run.workspace_after).filter((file) => !(file in run.workspace_before));
      assert.equal(added.length, 1, "Expected only the slices file");
      assert.match(added[0], /^docs\/specs\/.*-slices\.md$/);
      for (const [file, digest] of Object.entries(run.workspace_before)) assert.equal(run.workspace_after[file], digest, `Changed fixture: ${file}`);
      const contract = fs.readFileSync(path.join(dir, "workspace-after", added[0]), "utf8");
      for (const field of ["status: open", "Layers:", "Bound:", "Demo:", "Blocked by:", "## Verification", "## Confirmation"]) assert(contract.includes(field), `Missing ${field}`);
    } else {
      assert.deepEqual(run.workspace_after, run.workspace_before, "No-write case changed files");
      const output = fs.readFileSync(path.join(dir, "output.md"), "utf8");
      for (const field of ["status: open", "Layers:", "Bound:", "Demo:", "Blocked by:", "## Verification", "## Confirmation"]) assert(output.includes(field), `Chat contract missing ${field}`);
      const events = fs.readFileSync(path.join(dir, "trace.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
      assert(!events.some((event) => event.type === "item.completed" && event.item?.type === "file_change"), "No-write trace contains a file change");
    }
  }
}
assert.equal(expected.size, 0, `Missing current cases: ${[...expected].join(", ")}`);
console.log(`${report.current.length - archived} current-subject and ${archived} archived-subject probes; ${assertions} recorded assertions pass; hashes and file effects verified. Manual language scoring is non-blind.`);
