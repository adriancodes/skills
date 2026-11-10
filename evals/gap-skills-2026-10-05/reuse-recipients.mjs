// Reuse independently judged fresh work only for byte-identical task inputs.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {sha256} from './validate-record.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const json=f=>JSON.parse(fs.readFileSync(path.join(here,f)));
const file=path.join(here,'recipient-reuse.json'),reuse=fs.existsSync(file)?json('recipient-reuse.json'):{};
const cases=json('cases.json').cases.filter(c=>c.split==='downstream');
const mapping=json('judgment-mapping.json'),judged=json('judgments/outcomes.json').observations;
const completed=fs.readdirSync(path.join(here,'results')).flatMap(id=>{
 if(!fs.existsSync(path.join(here,'results',id,'result.json')))return [];
 const c=json(`results/${id}/case.json`),r=json(`results/${id}/result.json`);
 const key=Object.keys(mapping).find(k=>mapping[k]===id),score=judged[key];
 return c.split==='downstream'&&r.completed&&score&&score.assertions.every(a=>a.pass)?[{id,c,key,before:json(`results/${id}/before.json`)}]:[];
});
const canonical=v=>JSON.stringify(Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))));
for(const c of cases) {
 if(reuse[c.id]||completed.some(r=>r.c.id===c.id))continue;
 const dir=path.join(here,c.fixture),fixture=Object.fromEntries(fs.readdirSync(dir,{recursive:true}).filter(f=>fs.statSync(path.join(dir,f)).isFile()).map(f=>[f,sha256(fs.readFileSync(path.join(dir,f)))]));
 const prior=completed.find(r=>r.c.request===c.request&&JSON.stringify(r.c.assertions)===JSON.stringify(c.assertions)&&canonical(r.before)===canonical(fixture));
 if(prior)reuse[c.id]={source_result:prior.id,source_observation:prior.key,case_sha256:sha256(JSON.stringify(c)),fixture,request_sha256:sha256(c.request),reason:'Byte-identical disposable project, request and assertions; existing independent fresh result applies unchanged.'};
}
fs.writeFileSync(file,JSON.stringify(reuse,null,2)+'\n');
console.log(`Reused ${Object.keys(reuse).length} identical recipient contexts`);
