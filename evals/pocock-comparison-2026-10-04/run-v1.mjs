#!/usr/bin/env node
// Run one frozen case in an isolated workspace and preserve all raw evidence.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const [id, arm, label] = process.argv.slice(2);
const suite = JSON.parse(fs.readFileSync(path.join(here, 'cases.json'), 'utf8'));
const testCase = suite.cases[id];
assert(testCase, 'Unknown case');
assert(['original', 'revised', 'prompt', 'matt'].includes(arm), 'Unknown arm');
assert(label && /^[a-z0-9-]+$/.test(label), 'Supply a unique evidence label');
const resultDir = path.join(here, 'results', label);
assert(!fs.existsSync(resultDir), 'Refusing to overwrite evidence');
assert(fs.readdirSync(path.join(here, 'results'), {withFileTypes: true}).filter(e => e.isDirectory()).length < suite.budget.runs, 'Run budget exhausted');
fs.mkdirSync(resultDir, { recursive: true });
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-quality-pilot-'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const save = (name, data) => fs.writeFileSync(path.join(resultDir, name), typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n');
const write = (name, text) => { const p = path.join(workspace, name); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); };
const copyFixture = (skill, fixture) => fs.cpSync(path.join(repo, 'skills', skill, 'evals/fixtures', fixture), workspace, { recursive: true });

if (testCase.fixture === 'delivery' || testCase.fixture === 'open-spec') {
  write('package.json', JSON.stringify({ name: 'shipping-fixture', private: true, type: 'module', scripts: { test: 'node --test test/*.test.js' } }, null, 2) + '\n');
  write('src/shipping.js', 'export function qualifiesForFreeShipping(subtotalCents) { return false; }\n');
  write('src/discount.js', 'export function discountCents(subtotalCents) { return 0; }\n');
  write('test/existing.test.js', "import test from 'node:test';\nimport assert from 'node:assert/strict';\ntest('fixture boots', () => assert.equal(1, 1));\n");
  write('docs/specs/2026-10-04-shipping.md', `---\nstatus: ${testCase.fixture === 'open-spec' ? 'open' : 'confirmed'}\n---\n# Shipping\n\n## Decisions\n1. Pure JavaScript exports, integer cents.\n2. qualifiesForFreeShipping returns true starting at 5,000 cents.\n3. discountCents returns 500 starting at 10,000 cents, otherwise 0.\n4. No external calls, persistence, dependencies, or UI work.\n\n## Confirmation\n${testCase.fixture === 'open-spec' ? 'The discount threshold remains unresolved. The numbered threshold is a proposal, not an accepted decision.' : 'User: "I approve these behaviors and thresholds." 2026-10-04'}\n`);
  if (testCase.fixture === 'delivery') write('docs/specs/2026-10-04-shipping-slices.md', `---\nspec: docs/specs/2026-10-04-shipping.md\nstatus: confirmed\n---\n## Slices\n- [ ] 1. Free-shipping threshold\n  - Layers: pure logic · tests\n  - Bound: src/shipping.js and test/shipping.test.js only\n  - Demo: node --input-type=module -e "import {qualifiesForFreeShipping as f} from './src/shipping.js'; console.log([4999,5000,5001].map(f))" prints [false, true, true]\n  - Blocked by: none\n- [ ] 2. Discount threshold\n  - Layers: pure logic · tests\n  - Bound: src/discount.js and test/discount.test.js only\n  - Demo: node --input-type=module -e "import {discountCents as f} from './src/discount.js'; console.log([9999,10000,10001].map(f))" prints [0, 500, 500]\n  - Blocked by: none\n\n## Verification\n\n## Confirmation\nUser: "I approve both tasks and their bounds." 2026-10-04\n`);
} else if (testCase.fixture === 'wide-refactor') {
  write('docs/specs/2026-10-04-account-id.md', `---\nstatus: confirmed\n---\n# Rename accountId to customerId\n\nA shared public type exposes accountId. Four independently released packages consume it: billing, exports, notifications, and analytics. The rename must preserve all consumers' behavior and keep CI green after every task. Each package has its own compatibility checks. Billing and exports each need one fresh agent session; notifications and analytics each need one. Add the compatible customerId form alongside accountId first, migrate callers in bounded packages, and remove accountId only after every consumer is migrated. No database migration, new behavior, or UI work is included. The user approved these requirements on 2026-10-04.\n`);
  for (const name of ['billing', 'exports', 'notifications', 'analytics']) write(`packages/${name}/README.md`, `This consumer uses the shared accountId identifier. Its package checks exercise compatibility with the public type.\n`);
  write('README.md', 'Public shared identifier package consumed by four independent packages.\n');
} else if (testCase.fixture === 'saved-searches') copyFixture('create-tasks', 'confirmed-spec');
else if (testCase.fixture === 'legacy-flags') copyFixture('simplify-code', 'legacy-flags');
else if (testCase.fixture === 'order-summary') copyFixture('simplify-code', 'order-summary');
else throw new Error('Unknown fixture');

const tree = directory => Object.fromEntries(fs.readdirSync(directory, { recursive: true }).filter(name => fs.statSync(path.join(directory, name)).isFile()).sort().map(name => [name, hash(fs.readFileSync(path.join(directory, name)))]));
save('before.json', tree(workspace));
fs.cpSync(workspace, path.join(resultDir, 'workspace-before'), { recursive: true });
const subjects = {};
let instruction = testCase.prompt || 'Complete the user request accurately within its stated scope, using existing project tools and verification.';
if (arm !== 'prompt') {
  const source = arm === 'revised' ? path.join(repo, 'skills', testCase.skill) : path.join(here, 'subjects', arm, testCase.skill);
  assert(fs.existsSync(path.join(source, 'SKILL.md')), 'No counterpart for this arm; do not invent one');
  const copied = path.join(resultDir, 'subject');
  fs.cpSync(source, copied, { recursive: true, filter: file => !path.relative(source, file).split(path.sep).includes('evals') });
  instruction = fs.readFileSync(path.join(copied, 'SKILL.md'), 'utf8');
  subjects['SKILL.md'] = hash(instruction);
  // This standalone arm exposes only the selected skill. Read its local references on demand.
  instruction += `\n\nSupporting references for this skill, if requested by its body: ${copied}. Other skills are unavailable in this evaluation; use the supplied skill's standalone fallback. The issue tracker, if a tracker is needed, is local Markdown under docs/specs/; no external services are authorized.\n`;
}
const prompt = `Apply the supplied instructions to the user request. Work only inside ${workspace}. Do not use external services, install dependencies, or delegate. Do not inspect other evaluation results or the parent repository. Do not invent user replies. Stop if a real user decision is needed.\n\nInstructions:\n${instruction}\n\nUser request:\n${testCase.request}`;
save('prompt.md', prompt);
save('case.json', testCase);
const args = ['exec', '-', '--ephemeral', '--ignore-user-config', '--json', '-m', 'gpt-6.1-sol', '-c', 'model_reasoning_effort="medium"', '-s', 'workspace-write', '--skip-git-repo-check', '-C', workspace];
save('manifest.json', {case_id: id, arm, skill: testCase.skill, subjects, cases_sha256: hash(fs.readFileSync(path.join(here, 'cases.json'))), runner_sha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))), prompt_sha256: hash(prompt), observed_at: new Date().toISOString(), harness_version: spawnSync('codex', ['--version'], {encoding: 'utf8'}).stdout.trim(), args, timeout_ms: suite.budget.timeout_ms, claim: 'Single explicit-load local actor; no native discovery or cross-model claim. Global harness instructions may be present equally across arms.'});
const started = Date.now();
const actor = spawnSync('codex', args, {cwd: workspace, input: prompt, encoding: 'utf8', timeout: suite.budget.timeout_ms, maxBuffer: 30 * 1024 * 1024});
save('trace.jsonl', actor.stdout || '');
save('stderr.txt', actor.stderr || '');
const events = (actor.stdout || '').split('\n').filter(Boolean).map(line => {try {return JSON.parse(line);} catch {return {type: 'unparsed', line};}});
const completed = events.findLast(e => e.type === 'turn.completed');
const output = events.filter(e => e.type === 'item.completed' && e.item?.type === 'agent_message').map(e => e.item.text).join('\n\n');
save('output.md', output);
save('after.json', tree(workspace));
fs.cpSync(workspace, path.join(resultDir, 'workspace'), { recursive: true });
save('result.json', {exit_code: actor.status, error: actor.error?.message || null, completed: !!completed, usage: completed?.usage || null, wall_ms: Date.now() - started, output_sha256: hash(output), trace_sha256: hash(actor.stdout || ''), scoring: 'UNSCORED'});
console.log(JSON.stringify({label, exit_code: actor.status, completed: !!completed, wall_ms: Date.now() - started, usage: completed?.usage || null}));
assert.equal(actor.status, 0, `Actor failed; inspect ${resultDir}`);
assert(completed && output, `Incomplete actor; inspect ${resultDir}`);
