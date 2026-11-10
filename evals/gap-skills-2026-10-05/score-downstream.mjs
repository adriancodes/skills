// Derive parent evidence from actual recipient results and independent judgments.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {sha256,validateJudgment} from './validate-record.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const json=f=>JSON.parse(fs.readFileSync(path.join(here,f)));
const links=json('recipient-links.json'),mapping=json('judgment-mapping.json'),judgments=json('judgments/outcomes.json').observations;
const manifests=fs.readdirSync(here).filter(f=>/^recipient-manifest(?:-[\w-]+)?\.json$/.test(f)).map(json);
for(const m of manifests)assert(m.frozen);
const downstream={},controls={};
const reuseFile=path.join(here,'recipient-reuse.json'),reuse=fs.existsSync(reuseFile)?json('recipient-reuse.json'):{};
const cases=json('cases.json').cases;
for(const [caseId,link] of Object.entries(links)) {
 const id=reuse[caseId]?.source_result||fs.readdirSync(path.join(here,'results')).find(id=>id.startsWith(`${caseId}--`)&&fs.existsSync(path.join(here,'results',id,'result.json')));
 if(!id)continue;
 const result=json(`results/${id}/result.json`),manifest=json(`results/${id}/manifest.json`),original=json(`results/${id}/case.json`),c=cases.find(c=>c.id===caseId);
 const input=manifests.flatMap(m=>m.records).find(r=>r.case_id===caseId);assert(input);
 assert.equal(input.case_sha256,sha256(JSON.stringify(c)));
 const stable=v=>JSON.stringify(Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))));
 assert.equal(stable(input.fixture),stable(manifest.fixture));
 if(reuse[caseId]) {assert.equal(c.request,original.request);assert.deepEqual(c.assertions,original.assertions);assert.equal(stable(input.fixture),stable(json(`results/${id}/before.json`)));}
 const key=Object.keys(mapping).find(k=>mapping[k]===id),score=judgments[key];
 if(score)validateJudgment(c,score);
 const entry={recipient:id,observation:key,reused:!!reuse[caseId],case_id:caseId,completed:result.completed,judged:!!score,pass:result.completed&&result.exit_code===0&&!!score&&c.assertions.filter(a=>a.critical).every(a=>score.assertions.find(s=>s.id===a.id)?.pass===true),evidence:score?.assertions.flatMap(a=>a.evidence)||[],independent_commands:score?.independent_commands||[],limits:score?.limits||['Independent judgment pending']};
 if(link.parent)downstream[link.parent]=entry;else controls[caseId]={control_for:link.control_for,...entry};
}
// Independent generated-runner replay evidence has its own anonymous mapping.
const setupFile=path.join(here,'judgments/setup-replays.json');
if(fs.existsSync(setupFile)) {
 const setup=JSON.parse(fs.readFileSync(setupFile));
 const observations=setup.observations||setup.replays||{};
 for(const [key,entry] of Object.entries(observations))if(mapping[key])downstream[mapping[key]]={...entry,judged:true,observation:key};
}
fs.writeFileSync(path.join(here,'downstream.json'),JSON.stringify(downstream,null,2)+'\n');
fs.writeFileSync(path.join(here,'recipient-controls.json'),JSON.stringify(controls,null,2)+'\n');
console.log(`Derived ${Object.keys(downstream).length} parent evidence records and ${Object.keys(controls).length} before-instruction controls`);
