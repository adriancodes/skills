#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const cases=['discovery-cases.json','cases.json'].flatMap(f=>JSON.parse(fs.readFileSync(path.join(here,f))).cases);
const [phase,selection='all',iteration='1']=process.argv.slice(2);
const selected=c=>selection==='all'||selection.split(',').includes(c.skill);
const specs=[];
const tier3=['prepare-pr','review-session','create-setup-guide','write-agent-instructions'];
const freshManifests=fs.readdirSync(here).filter(f=>f.startsWith('fresh-manifest-')&&f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join(here,f))));
const currentFresh=c=>{
 const evalDir=path.resolve(here,'../../skills',c.skill,'evals');
 const manifests=fs.readdirSync(evalDir).filter(f=>/^suite-manifest-i\d+\.json$/.test(f)).map(f=>JSON.parse(fs.readFileSync(path.join(evalDir,f))));
 const latest=Math.max(...manifests.map(m=>m.iteration));
 return freshManifests.some(m=>(m.iteration??m.known_gate?.iteration??1)===latest&&m.records.some(r=>r.case_id===c.id));
};
for(const c of cases.filter(selected)) {
  if(phase==='current-native') {
    if(c.skill==='review-session'&&c.split.startsWith('trigger-'))specs.push(`${c.id}:native:1:${iteration}`);
    if(c.skill==='write-agent-instructions'&&c.split==='downstream'&&c.parent?.startsWith('write-agent-instructions-fresh-csv-pointer--'))specs.push(`${c.id}:none:1:${iteration}`);
  }
  if(phase==='current-comparison') {
    if(c.skill==='review-session'&&c.split==='heldout')for(const arm of ['prompt','skill'])for(let r=1;r<=3;r++)specs.push(`${c.id}:${arm}:${r}:${iteration}`);
    if(c.skill==='review-session'&&c.split==='regression')specs.push(`${c.id}:skill:1:${iteration}`);
    if(c.skill==='write-agent-instructions'&&c.split==='fresh'&&c.round===1&&currentFresh(c))specs.push(`${c.id}:skill:1:${iteration}`);
  }
  if(phase==='discovery' && c.split==='discovery') for(const arm of ['none','prompt']) specs.push(`${c.id}:${arm}:1:${iteration}`);
  if(phase==='behavior' && c.split==='heldout') {
    const formal=tier3.includes(c.skill);
    for(const arm of formal||c.value?['prompt','skill']:['skill']) for(let r=1;r<=(formal?3:1);r++) specs.push(`${c.id}:${arm}:${r}:${iteration}`);
  }
  if(phase==='native' && c.split.startsWith('trigger-')) specs.push(`${c.id}:native:1:${iteration}`);
  if((phase==='fresh'||phase===`fresh-${c.round}`) && c.split==='fresh'&&currentFresh(c)) specs.push(`${c.id}:skill:1:${iteration}`);
  if(phase==='regression'&&c.split==='regression')specs.push(`${c.id}:skill:1:${iteration}`);
  if(phase==='downstream' && c.split==='downstream') {
    const matches=fs.existsSync(path.join(here,'results'))&&fs.readdirSync(path.join(here,'results')).some(f=>f.startsWith(`${c.id}--`));
    const reuseFile=path.join(here,'recipient-reuse.json');
    const reused=fs.existsSync(reuseFile)&&JSON.parse(fs.readFileSync(reuseFile))[c.id];
    if(!matches&&!reused)specs.push(`${c.id}:none:1:${iteration}`);
  }
}
if(!specs.length) throw new Error('No selected jobs');
process.argv=['node',path.join(here,'run.mjs'),...specs];
await import('./run.mjs');
