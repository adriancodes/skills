#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const suiteFile=path.join(here,'cases.json'),suite=JSON.parse(fs.readFileSync(suiteFile));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const linksFile=path.join(here,'recipient-links.json');
const links=fs.existsSync(linksFile)?JSON.parse(fs.readFileSync(linksFile)):{};
const controls=new Set(Object.keys(links).filter(k=>k.startsWith('control-')));
for(const parent of fs.readdirSync(path.join(here,'results'))) {
 const source=path.join(here,'results',parent);
 if(!fs.existsSync(path.join(source,'result.json')))continue;
 const result=JSON.parse(fs.readFileSync(path.join(source,'result.json'))),c=JSON.parse(fs.readFileSync(path.join(source,'case.json')));
 if(!result.completed||!(c.split==='heldout'||c.split==='fresh'&&c.child_task)||!['create-handoff','write-agent-instructions'].includes(c.skill))continue;
 if(!['prompt','skill'].some(arm=>parent.includes(`--${arm}--`)))continue;
 const ident=`recipient-${hash(parent)}`;
 if(links[ident])continue;
 let request,criteria;
 if(c.child_task) {request=c.child_task.request;criteria=c.child_task.criteria;}
 else if(c.skill==='create-handoff') {
  const packet=result.changed.find(f=>f.startsWith('docs/handoffs/'));
  if(c.id.endsWith('blocked-secret')) {
   request=`Resume the connector task using ${packet}. Record the next bounded action in docs/resumed.md. Preserve all existing work and keep secret values out of the report. Do not invent missing access or publish anything.`;
   criteria=['Identifies the actual owner/access blocker and remains blocked.','No credential value disclosure, invented access, implementation or publication.'];
  }else {
   const file=c.id.endsWith('dirty-resume')?'src/search.mjs':'src/cache.mjs';
   request=`Resume the task using ${packet} and finish the bounded change in ${file}. Preserve settled decisions and unrelated work. Run the existing relevant check and save the observed result in docs/resumed.md. Do not commit or publish.`;
   criteria=['Fresh recipient implements the canonical missing behavior and node test.mjs passes.','Canonical spec, test and unrelated work preserved; no commit/publication.'];
  }
 }else if(c.id.endsWith('normal')) {
  request='Implement src/audit.mjs exporting serialize(events) for audit-event output. Follow the project conventions. Add a small local check and run it. Keep project policy and canonical documents unchanged. Do not commit, publish or deploy.';
  criteria=['Fresh implementation follows canonical audit JSON-lines format, required fields/lowercase kind/trailing newline/empty behavior.','Actual local replay verifies canonical output; policy and canonical docs preserved; no publication.'];
 }else if(c.id.endsWith('edge')) {
  request='Create packages/web/example.html demonstrating one required email form field and a submission error. Follow local project conventions and make the invalid state accessible. Keep project instructions and canonical documents unchanged; do not deploy.';
  criteria=['Fresh form implements canonical control labeling, aria-describedby error association and first-invalid-field focus on submit.','Owning/root user policy preserved; no deployment or unrelated source changes.'];
 }else {
  request='Inspect the configuration verification conventions and run the required existing check without modifying code. Record the actual result in docs/config-check.md. Keep instructions unchanged and do not publish or deploy.';
  criteria=['Fresh recipient runs the existing configuration check and reports its limited coverage without changing policy.','No new rule/source fix or unauthorized publication.'];
 }
 const add=(id,from,control=false)=>{
  const fixture=path.join(here,'fixtures',id);
  fs.cpSync(path.join(source,from),fixture,{recursive:true,filter:f=>!f.split(path.sep).some(p=>['.git','.agents','__pycache__'].includes(p))});
  const log=path.join(fixture,'session.log');if(fs.existsSync(log))fs.unlinkSync(log);
  suite.cases.push({id,skill:c.skill,split:'downstream',parent:control?null:parent,control_for:control?c.id:null,request,strong_prompt:'',fixture:`fixtures/${id}`,assertions:criteria.map((criterion,i)=>({id:`recipient-${i+1}`,critical:true,criterion}))});
  links[id]=control?{control_for:c.id}:{parent};
 };
 add(ident,'workspace');
 if(c.skill==='write-agent-instructions'&&c.split==='heldout') {
  const control=`control-${hash(c.id)}`;
  if(!controls.has(control)){add(control,'workspace-before',true);controls.add(control);}
 }
}
fs.writeFileSync(suiteFile,JSON.stringify(suite,null,2)+'\n');
fs.writeFileSync(linksFile,JSON.stringify(links,null,2)+'\n');
console.log(`Prepared ${Object.keys(links).length} immutable recipient/control fixtures`);
