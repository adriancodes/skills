#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {nativeRead} from './native-observation.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const packs=path.join(here,'judgments');fs.mkdirSync(packs,{recursive:true});
const mapping={};
for(const id of fs.readdirSync(path.join(here,'results'))) {
 const dir=path.join(here,'results',id),r=path.join(dir,'result.json');
 if(!fs.existsSync(r)) continue;
 const result=JSON.parse(fs.readFileSync(r)),c=JSON.parse(fs.readFileSync(path.join(dir,'case.json')));
 if(c.split==='trigger-negative') continue;
 if(!result.completed && result.changed.length===0)continue;
 if(c.skill==='research-question' && c.split==='discovery' && !id.includes('--r3--')) continue;
 const key=`observation-${hash(id).slice(0,12)}`;mapping[key]=id;
 const dest=path.join(packs,key);
 if(fs.existsSync(dest)) {
  if(fs.existsSync(path.join(dir,'git-before.json'))&&!fs.existsSync(path.join(dest,'git-state.json')))fs.copyFileSync(path.join(dir,'git-before.json'),path.join(dest,'git-state.json'));
  continue;
 }
 fs.mkdirSync(dest);
 const filter=f=>!f.split(path.sep).some(p=>['.git','.agents'].includes(p));
 for(const [from,to] of [['workspace-before','before'],['workspace','after']])fs.cpSync(path.join(dir,from),path.join(dest,to),{recursive:true,filter});
 const task={id:key,request:c.request,assertions:c.assertions,completed:result.completed,changed:result.changed,observed_commands:result.commands.filter(c=>!c.command.includes('SKILL.md')),judgment_limit:'Arm and prompt withheld; outputs or command style may still reveal instruction use. Evaluate actual outcomes, not prose length.',...(c.split==='trigger-positive'?{native_read_observed:nativeRead(dir,c.skill),native_limit:'Read verified by exact installed body in raw command output; evaluate actual requested work separately. Body/prompt remain withheld.'}:{})};
 fs.writeFileSync(path.join(dest,'task.json'),JSON.stringify(task,null,2)+'\n');fs.copyFileSync(path.join(dir,'output.md'),path.join(dest,'output.md'));
 if(fs.existsSync(path.join(dir,'git-before.json')))fs.copyFileSync(path.join(dir,'git-before.json'),path.join(dest,'git-state.json'));
}
// Preserve actual checks sharing a shell command with a withheld body display.
// Existing task packets stay immutable; a trace-bound addendum repairs lost evidence.
for(const [key,id] of Object.entries(mapping)) {
 const dir=path.join(here,'results',id),result=JSON.parse(fs.readFileSync(path.join(dir,'result.json')));
 const bodies=[];
 const subject=path.join(dir,'subject','SKILL.md');if(fs.existsSync(subject))bodies.push(fs.readFileSync(subject,'utf8'));
 const catalog=path.join(dir,'workspace','.agents','skills');
 if(fs.existsSync(catalog))for(const name of fs.readdirSync(catalog)){const file=path.join(catalog,name,'SKILL.md');if(fs.existsSync(file))bodies.push(fs.readFileSync(file,'utf8'));}
 const events=new Map();
 for(const line of fs.readFileSync(path.join(dir,'trace.jsonl'),'utf8').split('\n')){
  if(!line.trim())continue;const item=JSON.parse(line).item;
  if(item?.type==='command_execution'&&Number.isInteger(item.exit_code))events.set(item.id,item);
 }
 const evidence=[];
 for(const item of events.values()){
  if(!item.command.includes('SKILL.md'))continue;
  const match=item.command.match(/;\s*((?:node|python3?)\b[\s\S]*)/);if(!match)continue;
  const excerpt=match[1];if(/SKILL\.md|\/subject\/|\.agents\/skills/.test(excerpt))continue;
  let output=item.aggregated_output||'',removed=false;
  for(const body of bodies)if(output.includes(body)){output=output.replace(body,'');removed=true;}
  if(!removed)continue;
  evidence.push({trace_event_id:item.id,command_excerpt:excerpt,excerpt_encoding:'Verbatim suffix within the original serialized shell wrapper; not a standalone executable string.',exit_code:item.exit_code,output_excerpt:output,original_command_sha256:hash(item.command),trace_sha256:result.trace_sha256});
 }
 if(evidence.length){const file=path.join(packs,key,'mixed-command-evidence.json'),text=JSON.stringify({provenance:'Actual raw trace events; resource body and preceding display command withheld. Existing task packet is unchanged.',evidence},null,2)+'\n';if(fs.existsSync(file)){if(fs.readFileSync(file,'utf8')!==text)throw new Error('Mixed-command evidence changed');}else fs.writeFileSync(file,text);}
}
// Link separately executed recipients to anonymous parent packets.
for(const [key,id] of Object.entries(mapping)) {
 const c=JSON.parse(fs.readFileSync(path.join(here,'results',id,'case.json')));
 if(c.control_for)fs.writeFileSync(path.join(packs,key,'snapshot-role.json'),JSON.stringify({control:true,snapshot:'before',scope:'Before-instruction comparison only; cannot substantiate revised-parent behavior.'},null,2)+'\n');
 if(!c.parent)continue;
 const parent=Object.keys(mapping).find(k=>mapping[k]===c.parent);
 if(parent)fs.writeFileSync(path.join(packs,key,'parent-observation.json'),JSON.stringify({parent_observation:parent,scope:'Actual fresh task evidence; no parent arm or prompt exposed.'},null,2)+'\n');
}
const reuseFile=path.join(here,'recipient-reuse.json');
if(fs.existsSync(reuseFile)) {
 const cases=JSON.parse(fs.readFileSync(path.join(here,'cases.json'))).cases;
 for(const [caseId,proof] of Object.entries(JSON.parse(fs.readFileSync(reuseFile)))) {
  const c=cases.find(c=>c.id===caseId),parent=Object.keys(mapping).find(k=>mapping[k]===c.parent);
  if(parent)fs.writeFileSync(path.join(packs,parent,'reused-fresh-evidence.json'),JSON.stringify({source_observation:proof.source_observation,request:c.request,assertions:c.assertions,fixture:proof.fixture,case_sha256:proof.case_sha256,reason:proof.reason,excluded_from_parent:['session.log','.git','.agents','__pycache__']},null,2)+'\n');
 }
}
fs.writeFileSync(path.join(here,'judgment-mapping.json'),JSON.stringify(mapping,null,2)+'\n');
console.log(`Prepared ${Object.keys(mapping).length} arm-hidden packets`);
