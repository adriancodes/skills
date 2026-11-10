#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(here,'../..');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const tree=dir=>Object.fromEntries(fs.readdirSync(dir,{recursive:true}).filter(f=>fs.statSync(path.join(dir,f)).isFile()&&!f.split(path.sep).includes('evals')).sort().map(f=>[f,hash(fs.readFileSync(path.join(dir,f)))]));
const cases=['discovery-cases.json','cases.json'].flatMap(f=>JSON.parse(fs.readFileSync(path.join(here,f))).cases);
const [skill,iteration='1']=process.argv.slice(2);assert(skill);
const dir=path.join(repo,'skills',skill,'evals');fs.mkdirSync(dir,{recursive:true});
const manifestFile=path.join(dir,`suite-manifest-i${iteration}.json`);assert(!fs.existsSync(manifestFile),'Refusing to replace frozen evidence');
const selected=cases.filter(c=>c.skill===skill);
const manifest={version:1,frozen:true,skill,iteration:Number(iteration),frozen_at:new Date().toISOString(),subject:tree(path.join(repo,'skills',skill)),matrix_sha256:hash(fs.readFileSync(path.join(here,'matrix.json'))),budget_sha256:hash(fs.readFileSync(path.join(here,'budget.json'))),...(fs.existsSync(path.join(here,'budget-extension.json'))&&JSON.parse(fs.readFileSync(path.join(here,'budget-extension.json'))).skill===skill?{budget_extension:JSON.parse(fs.readFileSync(path.join(here,'budget-extension.json')))}:{}),cases:Object.fromEntries(selected.map(c=>[c.id,{sha256:hash(JSON.stringify(c)),fixture:tree(path.join(here,c.fixture))}])),opportunity_sha256:hash(fs.readFileSync(path.join(here,'opportunities.md'))),opportunity_record:fs.readFileSync(path.join(here,'opportunities.md'),'utf8')};
fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync(path.join(dir,'cases.jsonl'),selected.map(c=>JSON.stringify(c)).join('\n')+'\n');
for(const file of ['matrix.json','budget.json','score-input.schema.json','rubric.md','run.md'])fs.copyFileSync(path.join(here,file),path.join(dir,file));
fs.writeFileSync(path.join(dir,'score.mjs'),`// Shared reproducible scorer; evaluation tooling is not a runtime dependency.\nprocess.argv.push(${JSON.stringify(skill)});\nawait import('../../../evals/gap-skills-2026-10-05/score.mjs');\n`);
for(const sub of ['fixtures','results']) {fs.mkdirSync(path.join(dir,sub),{recursive:true});fs.writeFileSync(path.join(dir,sub,'README.md'),`# ${sub}\n\nFrozen ${sub} and raw evidence live in [the shared suite](../../../../evals/gap-skills-2026-10-05/${sub}/). The manifest hashes each input; the shared runner copies inputs to disposable projects.\n`);}
console.log(`Frozen ${skill} iteration ${iteration}`);
