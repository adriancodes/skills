#!/usr/bin/env node
// Replay preserved provenance and downstream checks; keep manual judgments explicit.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const exclusions = json(path.join(here, 'exclusions.json'));
const scores = json(path.join(here, 'scores.json'));
const tree = directory => Object.fromEntries(fs.readdirSync(directory, {recursive: true}).filter(name => fs.statSync(path.join(directory, name)).isFile()).sort().map(name => [name, hash(path.join(directory, name))]));
const revisedManifest = json(path.join(here, 'revised-manifest.json'));
for (const [file, digest] of Object.entries(revisedManifest.subjects)) assert.equal(hash(path.join(repo, file)), digest, `Current subject changed: ${file}`);
for (const [file, key] of [['cases.json', 'cases_sha256'], ['failure-case.json', 'failure_case_sha256'], ['run.mjs', 'runner_sha256']]) assert.equal(hash(path.join(here, file)), revisedManifest[key], `Frozen input changed: ${file}`);
for (const [file, digest] of Object.entries(json(path.join(here, 'original-manifest.json')).frozen_subjects)) assert.equal(hash(path.join(here, file)), digest, `Archived subject changed: ${file}`);
const command = (args, cwd) => {
  const result = spawnSync(process.execPath, args, {cwd, encoding: 'utf8', timeout: 30000});
  assert.equal(result.status, 0, result.stderr || result.stdout || result.error?.message);
  return result.stdout.trim();
};
const contract = text => {
  for (const field of ['spec:', 'status: open', 'Layers:', 'Bound:', 'Demo:', 'Blocked by:', '## Verification', '## Confirmation']) assert(text.includes(field), `Contract missing ${field}`);
  const tasks = [...text.matchAll(/^- \[ \] (\d+)\. ([\s\S]*?)(?=^- \[ \] |^## |$(?![\s\S]))/gm)];
  assert(tasks.length, 'No tasks');
  const ids = new Set(tasks.map(m => m[1]));
  assert.equal(ids.size, tasks.length, 'Duplicate task IDs');
  const graph = new Map();
  for (const [, id, block] of tasks) {
    for (const field of ['Layers:', 'Bound:', 'Demo:', 'Blocked by:']) assert(block.includes(field), `Task ${id} missing ${field}`);
    const blockers = block.match(/Blocked by:\s*([^\n]*)/)[1];
    const dependencies = blockers.toLowerCase().includes('none') ? [] : [...blockers.matchAll(/\d+/g)].map(m => m[0]);
    assert(dependencies.every(dep => ids.has(dep)), 'Missing blocker ID');
    graph.set(id, dependencies);
  }
  const visited = new Set(), active = new Set();
  const visit = id => { assert(!active.has(id), 'Dependency cycle'); if (visited.has(id)) return; active.add(id); graph.get(id).forEach(visit); active.delete(id); visited.add(id); };
  ids.forEach(visit);
  assert([...graph.values()].some(deps => deps.length === 0), 'No unblocked task');
};
const records = [];
for (const [label, judgments] of Object.entries(scores.runs)) {
  assert(!exclusions[label], `Excluded run cannot be scored: ${label}`);
  const dir = path.join(here, 'results', label);
  const manifest = json(path.join(dir, 'manifest.json'));
  const result = json(path.join(dir, 'result.json'));
  const testCase = json(path.join(dir, 'case.json'));
  const fixture = path.join(dir, 'workspace');
  const before = json(path.join(dir, 'before.json'));
  const after = json(path.join(dir, 'after.json'));
  assert.equal(result.exit_code, 0); assert(result.completed);
  assert.equal(result.output_sha256, hash(path.join(dir, 'output.md')));
  assert.equal(result.trace_sha256, hash(path.join(dir, 'trace.jsonl')));
  assert.equal(manifest.prompt_sha256, hash(path.join(dir, 'prompt.md')));
  assert.deepEqual(tree(path.join(dir, 'workspace-before')), before);
  assert.deepEqual(tree(fixture), after, 'Preserved actor workspace drifted');
  const casesFile = manifest.cases_file || 'cases.json';
  assert.equal(manifest.cases_sha256, hash(path.join(here, casesFile)));
  const currentCase = casesFile === 'cases.json' ? json(path.join(here, casesFile)).cases[manifest.case_id] : json(path.join(here, casesFile));
  assert.deepEqual(testCase, currentCase, 'Case drifted after actor run');
  const runnerCandidates = ['runner.mjs', '../run-v1.mjs', '../run-v2.mjs', '../run.mjs'];
  assert(runnerCandidates.some(relative => {
    const candidate = relative === 'runner.mjs' ? path.join(dir, relative) : path.join(here, relative.slice(3));
    return fs.existsSync(candidate) && hash(candidate) === manifest.runner_sha256;
  }), 'Recorded runner source unavailable');
  let currentBody = null, currentResources = null;
  if (manifest.arm !== 'prompt') {
    for (const [file, digest] of Object.entries(manifest.subjects)) assert.equal(hash(path.join(dir, 'subject', file)), digest, 'Preserved subject drifted');
    if (manifest.arm === 'revised') {
      currentBody = hash(path.join(repo, 'skills', manifest.skill, 'SKILL.md')) === manifest.subjects['SKILL.md'];
      const prefix = `skills/${manifest.skill}/`;
      const current = Object.fromEntries(Object.entries(revisedManifest.subjects).filter(([file]) => file.startsWith(prefix)).map(([file, digest]) => [file.slice(prefix.length), digest]));
      const preserved = tree(path.join(dir, 'subject'));
      currentResources = Object.keys(current).length === Object.keys(preserved).length && Object.entries(current).every(([file, digest]) => preserved[file] === digest);
    }
  }
  for (const [criterion, check] of Object.entries(judgments)) {
    assert.equal(typeof check.pass, 'boolean'); assert(check.evidence?.length, `${label}/${criterion} lacks evidence`);
    if (manifest.arm === 'revised') assert(check.pass, `${label}/${criterion}: ${check.evidence}`);
  }
  const output = fs.readFileSync(path.join(dir, 'output.md'), 'utf8');
  const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(file => before[file] !== after[file]);
  const probeResults = [];
  if (testCase.fixture === 'delivery') {
    const one = manifest.case_id !== 'delivery-complete';
    const shipping = pathToFileURL(path.join(fixture, 'src/shipping.js')).href;
    const discount = pathToFileURL(path.join(fixture, 'src/discount.js')).href;
    probeResults.push(command(['--input-type=module', '-e', `import assert from 'node:assert/strict'; import {qualifiesForFreeShipping as f} from ${JSON.stringify(shipping)}; assert.deepEqual([4999,5000,5001].map(f),[false,true,true]); console.log('shipping boundaries pass')`], fixture));
    const plan = fs.readFileSync(path.join(fixture, 'docs/specs/2026-10-04-shipping-slices.md'), 'utf8');
    const markersPresent = /- \[x\] 1\./.test(plan) && (one || /- \[x\] 2\./.test(plan));
    assert.equal(markersPresent, judgments['completion-markers'].pass, 'Completion marker judgment disagrees with preserved plan');
    const completedTasks = [...plan.matchAll(/^- \[x\] (\d+)\.([\s\S]*?)(?=^- \[|^## |$(?![\s\S]))/gm)];
    const notesPresent = completedTasks.length === (one ? 1 : 2) && completedTasks.every(([, , block]) => /(?:Done:\s*\d{4}-\d{2}-\d{2}|Outcome\s*\(\d{4}-\d{2}-\d{2}\))/.test(block));
    assert.equal(notesPresent, judgments['task-records'].pass, 'Task-record judgment disagrees with preserved plan');
    probeResults.push(`Per-task completion records: ${notesPresent ? 'PASS' : 'FAIL (comparison arm)'}`);
    if (one) {
      assert.match(plan, /- \[ \] 2\./);
      assert.equal(after['src/discount.js'], before['src/discount.js']);
      assert(!after['test/discount.test.js']);
    } else {
      probeResults.push(command(['--input-type=module', '-e', `import assert from 'node:assert/strict'; import {discountCents as f} from ${JSON.stringify(discount)}; assert.deepEqual([9999,10000,10001].map(f),[0,500,500]); console.log('discount boundaries pass')`], fixture));
      const verificationPresent = Boolean(plan.split('## Verification')[1].split('## Confirmation')[0].trim());
      assert.equal(verificationPresent, judgments['verification-records'].pass, 'Verification record judgment disagrees with preserved plan');
      probeResults.push(`Whole-feature verification record: ${verificationPresent ? 'PASS' : 'FAIL (comparison arm)'}`);
    }
    assert(changed.every(file => ['src/shipping.js', 'src/discount.js', 'test/shipping.test.js', 'test/discount.test.js', 'docs/specs/2026-10-04-shipping-slices.md'].includes(file)), 'Scope expansion');
    probeResults.push(command(['--test'], fixture).split('\n').slice(-7).join('\n'));
  } else if (['wide-refactor', 'saved-searches'].includes(testCase.fixture)) {
    if (manifest.case_id === 'tasks-no-write') { assert.deepEqual(after, before); contract(output); }
    else {
      const plans = changed.filter(file => /^docs\/.*\.md$/.test(file));
      assert.equal(plans.length, 1); assert.equal(changed.length, 1, 'Planning modified unrelated files');
      let compatible = true;
      try { contract(fs.readFileSync(path.join(fixture, plans[0]), 'utf8')); } catch { compatible = false; }
      assert.equal(compatible, judgments['plan-contract'].pass, 'Plan-contract judgment disagrees with preserved plan');
      probeResults.push(`Toolbox-specific plan contract: ${compatible ? 'PASS' : 'FAIL (comparison arm; not a generic planning defect)'}`);
    }
    probeResults.push('Open plan contract and valid blocker graph pass');
  } else if (testCase.fixture === 'open-spec') {
    assert.deepEqual(after, before); probeResults.push('Unconfirmed-spec case changed no files');
  } else if (testCase.fixture === 'verification-failure') {
    assert.deepEqual(changed, ['docs/specs/2026-10-04-shipping-slices.md']);
    const plan = fs.readFileSync(path.join(fixture, changed[0]), 'utf8');
    assert.match(plan, /Status:\s*incomplete/i); assert.doesNotMatch(plan, /Status:\s*complete\b/i);
    probeResults.push('Failed verification recorded as incomplete; source and tests unchanged');
  } else if (testCase.fixture === 'legacy-flags') {
    assert.equal(after['package.json'], before['package.json']);
    if (manifest.case_id === 'simplify-no-tests') assert(changed.every(file => file === 'src/legacy-flags.js'), 'No-test/no-new-file request violated');
    else assert(changed.every(file => file === 'src/legacy-flags.js' || /^test\/.*\.(?:js|mjs)$/.test(file)), 'Cleanup scope expanded');
    const original = pathToFileURL(path.join(dir, 'workspace-before/src/legacy-flags.js')).href;
    const revised = pathToFileURL(path.join(fixture, 'src/legacy-flags.js')).href;
    probeResults.push(command(['--input-type=module', '-e', `import assert from 'node:assert/strict'; import {enabledFlagNames as before} from ${JSON.stringify(original)}; import {enabledFlagNames as after} from ${JSON.stringify(revised)};
const samples = [[], [{name:' beta ',enabled:true}], [{name:'off',enabled:1}], [{name:undefined,enabled:true}], [{name:null,enabled:true}], [{name:42,enabled:true}], [{name:'a',enabled:true},{name:'b',enabled:false},{name:'c',enabled:true}], new Set([{name:' x ',enabled:true}]), null, [null], [undefined]];
const observe = (f,input) => {try {return {value:f(input)}} catch(e) {return {error:e.name,message:e.message}}};
for(const input of samples) assert.deepEqual(observe(after,input),observe(before,input));
const ordering = f => {const log=[]; const flags=[{get enabled(){log.push('enabled-a');return true},get name(){log.push('name-a');return ' a '}},{get enabled(){log.push('enabled-b');return true},get name(){log.push('name-b');return ' b '}}];return {value:f(flags),log}};
assert.deepEqual(ordering(after),ordering(before));
assert.deepEqual(after([{name:' beta ',enabled:true},{name:'off',enabled:1}]),['beta']); console.log('11 differential inputs, getter order, and independent strict-boolean check pass');`], fixture));
    assert(fs.readFileSync(path.join(fixture, 'src/legacy-flags.js'), 'utf8').length < fs.readFileSync(path.join(dir, 'workspace-before/src/legacy-flags.js'), 'utf8').length, 'No reduction');
  }
  records.push({label, case_id: manifest.case_id, skill: manifest.skill, arm: manifest.arm, current_body: currentBody, current_resources: currentResources, manual: judgments, downstream: probeResults, wall_ms: result.wall_ms, usage: result.usage});
}
for (const skill of ['deliver-feature', 'create-tasks', 'simplify-code', 'implement-task']) assert(records.some(run => run.skill === skill && run.current_body && run.current_resources), `No scored run matches current resources: ${skill}`);
const total = records.reduce((sum, run) => sum + (run.usage?.input_tokens || 0) + (run.usage?.output_tokens || 0), 0);
fs.writeFileSync(path.join(here, 'replay-results.json'), JSON.stringify({claim: 'Targeted explicit-load outcomes and preserved evidence; no statistical superiority, native discovery, or cross-model claim.', records, total_reported_tokens: total}, null, 2) + '\n');
console.log(`${records.length} scored runs: provenance, scopes, and downstream checks replayed; comparison-arm record failures remain scored failures. Current-body and current-resource matches are reported separately.`);
