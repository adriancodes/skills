#!/usr/bin/env node
// One isolated preservation probe; retain inputs, resources, trace, and file effects.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const suite = JSON.parse(fs.readFileSync(path.join(here, 'cases.json'), 'utf8'));
const preflight = process.argv[2] === '--preflight';
const id = process.argv[preflight ? 3 : 2];
const failureFile = path.join(here, 'failure-case.json');
const failureCase = fs.existsSync(failureFile) ? JSON.parse(fs.readFileSync(failureFile,'utf8')) : null;
const testCase = suite.cases[id] || (failureCase?.id === id ? failureCase : null);
const casesFile = suite.cases[id] ? path.join(here,'cases.json') : failureFile;
assert(testCase, 'Unknown frozen probe');
const fixture = path.join(here,'fixtures',id);
for (const file of fs.readdirSync(fixture,{recursive:true})) {
  const input=path.join(fixture,file);
  if(fs.statSync(input).isFile()) assert(!/scorer['’]s key[\s\S]*?withhold from\s+actor/i.test(fs.readFileSync(input,'utf8')),`Actor fixture contains a withheld scorer key: ${file}`);
}
if(preflight) {console.log('Fixture preflight passed; no actor launched.');process.exit(0);}
const results = path.join(here, 'results');
fs.mkdirSync(results, {recursive:true});
assert(fs.readdirSync(results).length < suite.budget.actor_runs, 'Probe budget exhausted');
const resultDir = path.join(results, id);
assert(!fs.existsSync(resultDir), 'Refusing to overwrite evidence');
fs.mkdirSync(resultDir);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const tree = dir => Object.fromEntries(fs.readdirSync(dir, {recursive:true}).filter(file => fs.statSync(path.join(dir, file)).isFile()).sort().map(file => [file, hash(fs.readFileSync(path.join(dir, file)))]));
const save = (file, value) => fs.writeFileSync(path.join(resultDir, file), typeof value === 'string' ? value : JSON.stringify(value, null, 2)+'\n');
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'remaining-skills-probe-'));
fs.cpSync(path.join(here, 'fixtures', id), workspace, {recursive:true});
fs.cpSync(workspace, path.join(resultDir, 'workspace-before'), {recursive:true});
save('before.json', tree(workspace));
const subject = path.join(resultDir, 'subject');
const source = path.join(repo, 'skills', testCase.skill);
fs.cpSync(source, subject, {recursive:true, filter:file => !path.relative(source,file).split(path.sep).includes('evals')});
const instructions = fs.readFileSync(path.join(subject,'SKILL.md'),'utf8');
const prompt = `Apply the supplied skill to this local preservation probe. The project is ${workspace}. You may inspect and edit only that project, according to the user's narrower authority below. Supplied skill resources under ${subject} are authorized read-only inputs: read them only when the skill requires them. Other skills, subagents, network services, and dependency installation are unavailable. Do not inspect parent repositories or other evaluation outputs. Do not invent user answers. Stop at a real decision gate. Do not create a Git commit.\n\nSupplied skill:\n${instructions}\n\nScenario:\n${testCase.setup}\n\nUser request:\n${testCase.request}`;
save('case.json', testCase); save('prompt.md', prompt);
save('runner.mjs', fs.readFileSync(fileURLToPath(import.meta.url),'utf8'));
const args = ['exec','-','--ephemeral','--ignore-user-config','--json','-m','gpt-6.1-sol','-c','model_reasoning_effort="medium"','-s','workspace-write','--skip-git-repo-check','-C',workspace];
save('manifest.json', {id,skill:testCase.skill,subjects:tree(subject),fixtures:tree(path.join(here,'fixtures',id)),cases_file:path.basename(casesFile),cases_sha256:hash(fs.readFileSync(casesFile)),runner_sha256:hash(fs.readFileSync(fileURLToPath(import.meta.url))),prompt_sha256:hash(prompt),observed_at:new Date().toISOString(),harness_version:spawnSync('codex',['--version'],{encoding:'utf8'}).stdout.trim(),args,timeout_ms:suite.budget.timeout_ms,claim:suite.claim});
const started = Date.now();
const actor = spawnSync('codex',args,{cwd:workspace,input:prompt,encoding:'utf8',timeout:suite.budget.timeout_ms,maxBuffer:30*1024*1024});
save('trace.jsonl',actor.stdout || ''); save('stderr.txt',actor.stderr || '');
const events = (actor.stdout || '').split('\n').filter(Boolean).map(line => {try{return JSON.parse(line)}catch{return {type:'unparsed',line}}});
const completed = events.findLast(event => event.type === 'turn.completed');
const output = events.filter(event => event.type === 'item.completed' && event.item?.type === 'agent_message').map(event => event.item.text).join('\n\n');
save('output.md',output); save('after.json',tree(workspace));
fs.cpSync(workspace,path.join(resultDir,'workspace'),{recursive:true});
save('result.json',{exit_code:actor.status,error:actor.error?.message || null,completed:!!completed,wall_ms:Date.now()-started,usage:completed?.usage || null,output_sha256:hash(output),trace_sha256:hash(actor.stdout || ''),scoring:'UNSCORED'});
console.log(JSON.stringify({id,exit_code:actor.status,completed:!!completed,wall_ms:Date.now()-started,usage:completed?.usage || null}));
assert.equal(actor.status,0,'Actor failed; inspect preserved result');
assert(completed && output,'Incomplete actor; inspect preserved result');
