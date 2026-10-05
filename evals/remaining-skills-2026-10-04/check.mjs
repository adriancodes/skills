#!/usr/bin/env node
// Replay frozen evidence and independent checks; recorded misses remain misses.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url)), repo = path.resolve(here,'../..');
const json = file => JSON.parse(fs.readFileSync(file,'utf8'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const tree = dir => Object.fromEntries(fs.readdirSync(dir,{recursive:true}).filter(file => fs.statSync(path.join(dir,file)).isFile()).sort().map(file => [file,hash(path.join(dir,file))]));
const original = json(path.join(here,'original-manifest.json'));
const revised = json(path.join(here,'revised-manifest.json'));
const suite = json(path.join(here,'cases.json'));
for (const [file,digest] of Object.entries(original.original)) assert.equal(hash(path.join(here,file)),digest,`Original drifted: ${file}`);
for (const [file,digest] of Object.entries(revised.subjects)) assert.equal(hash(path.join(repo,file)),digest,`Current subject changed: ${file}`);
for (const [file,key] of [['cases.json','cases_sha256'],['failure-case.json','failure_case_sha256'],['run.mjs','runner_sha256']]) assert.equal(hash(path.join(here,file)),revised[key],`Frozen input changed: ${file}`);
for (const name of original.skills) {
  const before = fs.readFileSync(path.join(here,'subjects/original',name,'SKILL.md'),'utf8');
  const after = fs.readFileSync(path.join(repo,'skills',name,'SKILL.md'),'utf8');
  assert.equal(before.split('---\n')[1],after.split('---\n')[1],`Discovery or invocation changed: ${name}`);
  assert(after.split('---\n',3)[2].split(/\s+/).length < before.split('---\n',3)[2].split(/\s+/).length,`No entrypoint reduction: ${name}`);
}
const reports = ['outcomes-safety.json','outcomes-interaction.json','outcomes-followup.json'].flatMap(file => {
  const report=json(path.join(here,file));
  return (report.cases || report.runs).map(record=>({...record,checks:record.checks.map(check=>({...check,check:check.check || check.criterion,evidence:Array.isArray(check.evidence)?check.evidence.join(' '):check.evidence}))}));
});
const grades = new Map(reports.map(record => [record.id,record]));
assert.equal(grades.size,reports.length,'Duplicate grade');
const dirs = fs.readdirSync(path.join(here,'results'));
assert.equal(dirs.length,18); assert.equal(dirs.length,suite.budget.actor_runs);
assert.equal(grades.size,dirs.length,'Missing grades');
const exclusions=json(path.join(here,'exclusions.json'));
const expectedMisses = {'verify-work-regression-catalog-exhaustion':'FAIL','build-loop-local-unknown-cost':'INCOMPLETE','quiz-changes-first-question':'EXCLUDED'};
const command = (args,cwd,input) => {
  const result = spawnSync(process.execPath,args,{cwd,input,encoding:'utf8',timeout:30000});
  assert.equal(result.status,0,result.stderr || result.stdout || result.error?.message);return result.stdout;
};
const records=[];
for (const id of dirs.sort()) {
  const dir=path.join(here,'results',id), grade=grades.get(id);
  const manifest=json(path.join(dir,'manifest.json')), result=json(path.join(dir,'result.json'));
  const testCase=json(path.join(dir,'case.json'));
  const casesFile=manifest.cases_file || 'cases.json';
  const source=casesFile==='cases.json'?suite.cases[id]:json(path.join(here,casesFile));
  assert.deepEqual(testCase,source);
  assert.equal(manifest.cases_sha256,hash(path.join(here,casesFile)));
  assert.equal(manifest.runner_sha256,hash(path.join(dir,'runner.mjs')));
  assert.equal(manifest.prompt_sha256,hash(path.join(dir,'prompt.md')));
  assert.equal(result.output_sha256,hash(path.join(dir,'output.md')));
  assert.equal(result.trace_sha256,hash(path.join(dir,'trace.jsonl')));
  assert.deepEqual(tree(path.join(dir,'subject')),manifest.subjects);
  assert.deepEqual(tree(path.join(here,'fixtures',id)),manifest.fixtures);
  const before=json(path.join(dir,'before.json')), after=json(path.join(dir,'after.json'));
  assert.deepEqual(tree(path.join(dir,'workspace-before')),before);
  assert.deepEqual(tree(path.join(dir,'workspace')),after);
  const events=fs.readFileSync(path.join(dir,'trace.jsonl'),'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
  const messages=events.filter(event=>event.type==='item.completed' && event.item?.type==='agent_message').map(event=>event.item.text);
  assert.equal(messages.join('\n\n'),fs.readFileSync(path.join(dir,'output.md'),'utf8'));
  const status=exclusions[id]?'EXCLUDED':grade.status || (grade.pass?'PASS':'FAIL');
  assert.equal(status,expectedMisses[id] || 'PASS',`Unexpected outcome: ${id}`);
  if(status==='INCOMPLETE') {assert(!result.completed);assert(result.error);}
  else {assert.equal(result.exit_code,0);assert(result.completed);}
  assert.deepEqual(grade.checks.map(check=>check.check),testCase.checks,'Frozen checks were changed');
  for(const check of grade.checks) {assert(check.evidence?.length,'Missing evidence');assert(status==='INCOMPLETE' && check.pass===null || typeof check.pass==='boolean','Invalid check score');}
  if(status!=='INCOMPLETE') assert.equal(grade.pass,grade.checks.every(check=>check.pass),'Grade does not match checks');
  const prefix=`skills/${manifest.skill}/`;
  const current=Object.fromEntries(Object.entries(revised.subjects).filter(([file])=>file.startsWith(prefix)).map(([file,digest])=>[file.slice(prefix.length),digest]));
  const currentResources=Object.keys(current).length===Object.keys(manifest.subjects).length && Object.entries(current).every(([file,digest])=>manifest.subjects[file]===digest);
  if(id!=='verify-work-regression-catalog-exhaustion') assert(currentResources,`No current-resource match: ${id}`);
  const workspace=path.join(dir,'workspace');
  const downstream=[];
  if(!['tdd','build-loop'].includes(manifest.skill)) assert.deepEqual(after,before,`Read-only boundary violated: ${id}`);
  if(manifest.skill==='tdd') {
    const changes=Object.keys(after).filter(file=>after[file]!==before[file]);
    assert(changes.every(file=>/^src\/(shipping|migrate-customers)\.js$/.test(file)||/^test\/.*\.test\.js$/.test(file)),'TDD scope expanded');
    assert.equal(after['package.json'],before['package.json']);
    const production=events.findIndex(event=>event.type==='item.completed' && event.item?.type==='file_change' && event.item.changes.some(change=>/\/src\//.test(change.path)));
    assert(production>0);
    assert(events.slice(0,production).some(event=>event.type==='item.completed' && event.item?.type==='command_execution' && /node --test/.test(event.item.command) && event.item.exit_code===1 && /ERR_ASSERTION|AssertionError/.test(event.item.aggregated_output)),'No valid red before production');
    const copy=fs.mkdtempSync(path.join(os.tmpdir(),'remaining-replay-'));
    try {fs.cpSync(workspace,copy,{recursive:true});command(['--test'],copy);downstream.push('Preserved test suite passes in disposable copy');} finally {fs.rmSync(copy,{recursive:true,force:true});}
    if(id.includes('code-first')) {
      command(['--input-type=module','-e',`import assert from 'node:assert/strict';import {qualifiesForFreeShipping as f} from ${JSON.stringify(pathToFileURL(path.join(workspace,'src/shipping.js')).href)};assert.deepEqual([0,4999,5000,5001].map(f),[false,false,true,true]);for(const v of [-1,1.2,'5000',null,NaN])assert.throws(()=>f(v),TypeError);`],workspace);
      downstream.push('Independent threshold and invalid-input checks pass');
    } else {
      const temp=fs.mkdtempSync(path.join(os.tmpdir(),'migration-replay-'));
      try {
        command(['--input-type=module','-e',`import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {migrateCustomers as f} from ${JSON.stringify(pathToFileURL(path.join(workspace,'src/migrate-customers.js')).href)};const dir=${JSON.stringify(temp)},input=path.join(dir,'input.json'),output=path.join(dir,'output.json');const value=[{id:42,fullName:'Éva Žižek'},{id:'b',fullName:'Ada Lovelace'}];const bytes=JSON.stringify(value);fs.writeFileSync(input,bytes);await f(input,output);const first=fs.readFileSync(output,'utf8');assert.deepEqual(JSON.parse(first),[{id:42,firstName:'Éva',lastName:'Žižek'},{id:'b',firstName:'Ada',lastName:'Lovelace'}]);const newline=String.fromCharCode(10);assert(first.endsWith(newline)&&!first.endsWith(newline+newline));await f(input,output);assert.equal(fs.readFileSync(output,'utf8'),first);assert.equal(fs.readFileSync(input,'utf8'),bytes);`],workspace);
        downstream.push('Independent real-filesystem order, IDs, Unicode, newline, input-preservation, and idempotence checks pass');
      } finally {fs.rmSync(temp,{recursive:true,force:true});}
    }
  }
  if(manifest.skill==='verify-work') {
    const probe=spawnSync(process.execPath,['dedupe.js','/dev/stdin','id'],{cwd:workspace,input:'id,value\n1,"x, y"\n',encoding:'utf8'});
    assert.equal(probe.status,0);assert.equal(probe.stdout,'id,value\n1,"x,y"\n');
    downstream.push('Independent quoted-field byte-loss finding reproduced on unchanged artifact');
  }
  if(manifest.skill==='build-loop') {
    assert.equal(after['forum.json'],before['forum.json']);
    for(const file of ['LOOP.md','STATE.md','loop-prompt.md','ROLLOUT.md','automation/manual-measure.sh','automation/runner.py']) assert(after[file],`Missing partial artifact: ${file}`);
    downstream.push('Partial artifact set exists and source forum snapshot is unchanged; actor timed out, no final handover');
  }
  records.push({id,skill:manifest.skill,status,exclusion:exclusions[id] || null,current_resources:currentResources,grade,downstream,wall_ms:result.wall_ms,usage:result.usage});
}
assert.equal(new Set(records.map(record=>record.skill)).size,13);
const badFixture=spawnSync(process.execPath,[path.join(here,'run.mjs'),'--preflight','quiz-changes-first-question'],{encoding:'utf8'});
assert.notEqual(badFixture.status,0);assert.match(badFixture.stderr,/withheld scorer key/);
const cleanQuiz=path.join(repo,'skills/quiz-changes/evals/fixtures/fetch-with-retry');
assert(!/scorer['’]s key[\s\S]*?withhold from\s+actor/i.test(fs.readFileSync(path.join(cleanQuiz,'README.md'),'utf8')));
assert.equal(hash(path.join(cleanQuiz,'fetchWithRetry.diff')),hash(path.join(here,'fixtures/quiz-changes-first-question/fetchWithRetry.diff')),'Quizzed patch changed while withholding its key');
assert(fs.existsSync(path.join(repo,'skills/quiz-changes/evals/scorer-notes.md')));
for(const id of Object.keys(suite.cases).filter(id=>id!=='quiz-changes-first-question')) command([path.join(here,'run.mjs'),'--preflight',id],repo);
const report={claim:suite.claim,counts:{runs:records.length,pass:records.filter(r=>r.status==='PASS').length,fail:records.filter(r=>r.status==='FAIL').length,incomplete:records.filter(r=>r.status==='INCOMPLETE').length,excluded:records.filter(r=>r.status==='EXCLUDED').length},records};
fs.writeFileSync(path.join(here,'replay-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(`${records.length} records replayed across 13 skills: ${report.counts.pass} PASS, ${report.counts.fail} preserved FAIL, ${report.counts.incomplete} INCOMPLETE, ${report.counts.excluded} EXCLUDED. No full-tier or superiority claim.`);
