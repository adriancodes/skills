// Verify saved evidence without launching a model or modifying a snapshot.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {sha256,validateMixedCommandEvidence} from './validate-record.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const json=f=>JSON.parse(fs.readFileSync(f));
const tree=dir=>Object.fromEntries(fs.readdirSync(dir,{recursive:true}).filter(f=>!f.split(path.sep).includes('.git')&&fs.statSync(path.join(dir,f)).isFile()).sort().map(f=>[f,sha256(fs.readFileSync(path.join(dir,f)))]));
const provenance=json(path.join(here,'runner-provenance.json'));
assert.equal(sha256(fs.readFileSync(path.join(here,provenance.snapshot))),provenance.body_batch_loaded_runner_sha256);
const repo=path.resolve(here,'../..');
for(const name of fs.readdirSync(path.join(repo,'skills'))) {
 const dir=path.join(repo,'skills',name,'evals');if(!fs.existsSync(dir))continue;
 const versions=fs.readdirSync(dir).filter(f=>/^suite-manifest-i\d+\.json$/.test(f)).sort((a,b)=>Number(a.match(/i(\d+)/)[1])-Number(b.match(/i(\d+)/)[1]));
 if(!versions.length)continue;
 const frozen=json(path.join(dir,versions.at(-1)));if(frozen.skill!==name)continue;
 const runtime=Object.fromEntries(Object.entries(tree(path.join(repo,'skills',name))).filter(([f])=>!f.split(path.sep).includes('evals')));
 assert.deepEqual(runtime,frozen.subject,`${name}: current runtime differs from latest frozen subject`);
}
let verified=0,legacy=0;
for(const id of fs.readdirSync(path.join(here,'results'))) {
 const dir=path.join(here,'results',id);
 if(!fs.existsSync(path.join(dir,'result.json')))continue;
 const m=json(path.join(dir,'manifest.json')),c=json(path.join(dir,'case.json'));
 for(const [snapshot,record] of [['workspace-before','before.json'],['workspace','after.json']])assert.deepEqual(tree(path.join(dir,snapshot)),json(path.join(dir,record)),`${id}: ${snapshot} changed`);
 const before=json(path.join(dir,'before.json')),after=json(path.join(dir,'after.json'));
 const changed=[...new Set([...Object.keys(before),...Object.keys(after)])].filter(f=>before[f]!==after[f]).sort();
 assert.deepEqual(json(path.join(dir,'result.json')).changed.slice().sort(),changed,`${id}: effects differ from snapshots`);
 if(m.subject)assert.deepEqual(tree(path.join(dir,'subject')),m.subject,`${id}: subject snapshot changed`);
 if(m.native_catalog) {
  const before=json(path.join(dir,'before.json'));
  const catalog=Object.fromEntries(Object.entries(before).filter(([f])=>f.startsWith('.agents/skills/')).map(([f,h])=>[f.slice('.agents/skills/'.length),h]));
  assert.deepEqual(catalog,m.native_catalog,`${id}: native catalog capture differs`);
 }
 if(fs.existsSync(path.join(dir,'runner.mjs')))assert.equal(sha256(fs.readFileSync(path.join(dir,'runner.mjs'))),m.runner_sha256,`${id}: runner changed`);
 else if(c.split==='heldout'&&m.iteration===1)legacy++;
 for(const snapshot of ['workspace-before','workspace']) {
  const record=path.join(dir,`${snapshot}-git-archive.json`);
  if(fs.existsSync(record)) {const a=json(record);assert.equal(sha256(fs.readFileSync(path.join(dir,a.archive))),a.sha256,`${id}: Git archive changed`);}
 }
 verified++;
}
const mapping=json(path.join(here,'judgment-mapping.json'));let mixed=0;
for(const [key,id] of Object.entries(mapping)) {
 const file=path.join(here,'judgments',key,'mixed-command-evidence.json');if(!fs.existsSync(file))continue;
 const dir=path.join(here,'results',id),raw=fs.readFileSync(path.join(dir,'trace.jsonl'),'utf8');
 const bodies=[];const subject=path.join(dir,'subject','SKILL.md');if(fs.existsSync(subject))bodies.push(fs.readFileSync(subject,'utf8'));
 const catalog=path.join(dir,'workspace','.agents','skills');if(fs.existsSync(catalog))for(const name of fs.readdirSync(catalog)){const f=path.join(catalog,name,'SKILL.md');if(fs.existsSync(f))bodies.push(fs.readFileSync(f,'utf8'));}
 for(const evidence of json(file).evidence){
  validateMixedCommandEvidence(evidence,raw,bodies);mixed++;
 }
}
console.log(`PASS: ${verified} snapshot/subject records; ${legacy} initial batch runners covered by preserved provenance; ${mixed} mixed-command excerpts bound to raw traces`);
