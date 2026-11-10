#!/usr/bin/env node
// Offline replay: evidence integrity, exact cells, arm-hidden judgments and cost.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {validateResult,validateJudgment} from './validate-record.mjs';
import {nativeRead} from './native-observation.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(here,'../..');
const json=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const tree=dir=>Object.fromEntries(fs.readdirSync(dir,{recursive:true}).filter(f=>fs.statSync(path.join(dir,f)).isFile()&&!f.split(path.sep).includes('evals')).sort().map(f=>[f,hash(fs.readFileSync(path.join(dir,f)))]));
const cases=['discovery-cases.json','cases.json'].flatMap(f=>json(path.join(here,f)).cases);
const selected=process.argv[2]||'all';
const budget=json(path.join(here,'budget.json'));
const mapping=fs.existsSync(path.join(here,'judgment-mapping.json'))?json(path.join(here,'judgment-mapping.json')):{};
const judged=fs.existsSync(path.join(here,'judgments/outcomes.json'))?json(path.join(here,'judgments/outcomes.json')).observations:{};
const downstream=fs.existsSync(path.join(here,'downstream.json'))?json(path.join(here,'downstream.json')):{};
const all=[];
for(const id of fs.readdirSync(path.join(here,'results'))) {
 const dir=path.join(here,'results',id);if(!fs.existsSync(path.join(dir,'result.json')))continue;
 const result=json(path.join(dir,'result.json')),manifest=json(path.join(dir,'manifest.json')),c=json(path.join(dir,'case.json'));
 validateResult(result,manifest,fs.readFileSync(path.join(dir,'trace.jsonl')),fs.readFileSync(path.join(dir,'output.md')),fs.readFileSync(path.join(dir,'prompt.md')),c);
 for(const field of ['id','completed','wall_ms','tool_calls','changed','output_sha256','trace_sha256'])assert(field in result,`${id}: missing ${field}`);
 assert.equal(typeof result.completed,'boolean');assert(Number.isInteger(result.wall_ms)&&result.wall_ms>=0);assert(Number.isInteger(result.tool_calls)&&result.tool_calls>=0);assert(Array.isArray(result.changed));
 assert.equal(hash(fs.readFileSync(path.join(dir,'output.md'))),result.output_sha256,`${id}: output changed`);
 assert.equal(hash(fs.readFileSync(path.join(dir,'trace.jsonl'))),result.trace_sha256,`${id}: trace changed`);
 assert.equal(hash(fs.readFileSync(path.join(dir,'prompt.md'))),manifest.prompt_sha256,`${id}: prompt changed`);
 assert.equal(hash(JSON.stringify(c)),manifest.case_sha256,`${id}: case changed`);
 const key=Object.keys(mapping).find(key=>mapping[key]===id);
 const observation=key?judged[key]:null;
 const record={id,dir,c,result,manifest,observation};
 all.push(record);
}
const formal=new Set(['prepare-pr','review-session','create-setup-guide','write-agent-instructions']);
const median=xs=>{const sorted=xs.slice().sort((a,b)=>a-b);return sorted.length%2?sorted[(sorted.length-1)/2]:(sorted[sorted.length/2-1]+sorted[sorted.length/2])/2;};
const skills=[...new Set(cases.map(c=>c.skill))].filter(s=>selected==='all'||s===selected);
// Runs under an authorized per-skill extension are held to that extension's limits, not the original ceilings.
const extensionFile=path.join(here,'budget-extension.json');
const extension=fs.existsSync(extensionFile)?json(extensionFile):null;
const inExtension=r=>!!extension&&r.c.skill===extension.skill&&r.manifest.iteration>=extension.iteration;
const usage=rs=>({runs:rs.length,input_tokens:rs.reduce((n,r)=>n+(r.result.usage?.input_tokens||0),0),output_tokens:rs.reduce((n,r)=>n+(r.result.usage?.output_tokens||0),0),unknown_usage_runs:rs.filter(r=>!r.result.usage).map(r=>r.id)});
const base=all.filter(r=>!inExtension(r)),extra=all.filter(inExtension);
const report={generated_at:new Date().toISOString(),route:json(path.join(here,'matrix.json')),budget:usage(base),skills:{}};
if(extra.length){
 const started=Date.parse(json(path.join(here,'results/started-extension.json')).at);
 report.extension={...extension,...usage(extra),actor_elapsed_ms:Math.max(...extra.map(r=>Date.parse(r.manifest.observed_at)+r.result.wall_ms))-started};
 assert(extra.length+extension.judge_turns<=extension.limits.actor_runs,'Extension run ceiling exceeded');
 assert(report.extension.input_tokens<=extension.limits.input_tokens&&report.extension.output_tokens<=extension.limits.output_tokens,'Extension token ceiling exceeded');
 assert(report.extension.actor_elapsed_ms<=extension.limits.elapsed_ms,'Extension elapsed ceiling exceeded');
}
const overheadFile=path.join(here,'judging-overhead.json');
const overhead=fs.existsSync(overheadFile)?json(overheadFile):{judge_turns:{},usage:null};
report.budget.judging_turns=Object.values(overhead.judge_turns).reduce((n,v)=>n+v,0);
report.budget.judging_usage=overhead.usage;
report.budget.accounting='Measured CLI tokens only; incomplete actors and collaboration judging have unknown usage. Full total cost is unproven.';
assert(base.length+report.budget.judging_turns<=budget.actor_runs,'Run ceiling exceeded including judging turns');
assert(report.budget.input_tokens<=budget.input_tokens,'Input ceiling exceeded');
assert(report.budget.output_tokens<=budget.output_tokens,'Output ceiling exceeded');
const startFile=path.join(here,'results/started.json');
const lastActorEnd=Math.max(...base.map(r=>Date.parse(r.manifest.observed_at)+r.result.wall_ms));
report.budget.actor_elapsed_ms=lastActorEnd-Date.parse(json(startFile).at);
assert(report.budget.actor_elapsed_ms<=budget.elapsed_ms,'Actor elapsed ceiling exceeded');
for(const skill of skills) {
 const evalDir=path.join(repo,'skills',skill,'evals');
 const manifests=fs.readdirSync(evalDir).filter(f=>/^suite-manifest-i\d+\.json$/.test(f)).sort((a,b)=>Number(a.match(/i(\d+)/)[1])-Number(b.match(/i(\d+)/)[1]));
 const frozen=json(path.join(evalDir,manifests.at(-1)));assert(frozen.frozen,'Manifest is not frozen');
 assert.deepEqual(tree(path.join(repo,'skills',skill)),frozen.subject,`${skill}: subject drift`);
 assert.equal(hash(fs.readFileSync(path.join(here,'matrix.json'))),frozen.matrix_sha256,`${skill}: matrix drift`);
 assert.equal(hash(fs.readFileSync(path.join(here,'budget.json'))),frozen.budget_sha256,`${skill}: budget drift`);
 const failures=[],baseline_failures=[],missing=[],cost=[];
 const bodyRevisions=new Set(all.filter(r=>r.c.skill===skill&&['skill','native'].includes(r.manifest.arm)).map(r=>{
   const native=r.manifest.arm==='native';
   const subject=native?Object.fromEntries(Object.entries(r.manifest.native_catalog).filter(([f])=>f.startsWith(`${skill}/`)).map(([f,h])=>[f.slice(skill.length+1),h])):{...r.manifest.subject};
   const location=native?path.join(r.dir,'workspace','.agents','skills',skill,'SKILL.md'):path.join(r.dir,'subject','SKILL.md');
   subject['SKILL.md']=hash(fs.readFileSync(location,'utf8').replace(/^---\n[\s\S]*?\n---\n/,''));
   return hash(JSON.stringify(Object.fromEntries(Object.entries(subject).sort(([a],[b])=>a.localeCompare(b)))));
 }));
 assert(bodyRevisions.size<=(extension?.skill===skill?extension.limits.iterations_per_skill:budget.iterations_per_skill),`${skill}: tested body revision ceiling exceeded`);
 const sameRuntime=r=>{
   if(r.manifest.arm!=='skill')return false;
   if(JSON.stringify(r.manifest.subject)===JSON.stringify(frozen.subject))return true;
   if(formal.has(skill))return false;
   const prior=fs.readFileSync(path.join(r.dir,'subject','SKILL.md'),'utf8').replace(/^---\n[\s\S]*?\n---\n/,'');
   const current=fs.readFileSync(path.join(repo,'skills',skill,'SKILL.md'),'utf8').replace(/^---\n[\s\S]*?\n---\n/,'');
   return prior===current && Object.keys({...r.manifest.subject,...frozen.subject}).every(f=>f==='SKILL.md'||r.manifest.subject[f]===frozen.subject[f]);
 };
 const excluded=new Set(extension?.skill===skill?(extension.exclusions||[]).map(e=>e.id):[]);
 const rows=all.filter(r=>r.c.skill===skill && !excluded.has(r.id) && (
   r.manifest.iteration===frozen.iteration ||
   // Immutable prompt baselines and identical Tier-2 runtime text survive metadata-only revisions.
   (frozen.cases[r.c.id]?.sha256===r.manifest.case_sha256 && (r.manifest.arm==='prompt'||sameRuntime(r)))));
 function outcome(r) {
  const errors=r.manifest.arm==='prompt'?baseline_failures:failures;
  if(!r.result.completed||r.result.exit_code!==0){errors.push(`${r.id}: incomplete actor`);return false;}
  if(r.c.split.startsWith('trigger-')) {
   assert(r.manifest.native_catalog,`${r.id}: native catalog missing`);
   const installed=Object.fromEntries(Object.entries(r.manifest.native_catalog).filter(([f])=>f.startsWith(`${skill}/`)).map(([f,h])=>[f.slice(skill.length+1),h]));
   assert.deepEqual(installed,frozen.subject,`${r.id}: native subject drift`);
   const read=nativeRead(r.dir,skill);
   const expected=r.c.split==='trigger-positive';
   if(read!==expected)failures.push(`${r.id}: ${expected?'native trigger miss':'adjacent false trigger'}`);
   if(expected) {
    if(!r.observation)missing.push(`${r.id}: native application judgment`);
    else {validateJudgment(r.c,r.observation);for(const a of r.observation.assertions)if(!a.pass)failures.push(`${r.id}: ${a.id}: ${a.reason}`);}
   }
   return read===expected;
  }
  if(!r.observation){missing.push(`${r.id}: outcome judgment`);return false;}
  validateJudgment(r.c,r.observation);
  if(r.c.split==='fresh')for(const issue of r.observation.additional_failures||[]) {
   if(issue.pass===false)failures.push(`${r.id}: new fresh failure class ${issue.id}: ${issue.reason}`);
  }
  for(const a of r.c.assertions) {
   const score=r.observation.assertions.find(s=>s.id===a.id);
   if(!score){missing.push(`${r.id}: assertion ${a.id}`);continue;}
   assert.equal(typeof score.pass,'boolean');assert(Array.isArray(score.evidence)&&score.evidence.length,`${r.id}: evidence absent`);
   if(!score.pass&&a.critical)errors.push(`${r.id}: ${a.id}: ${score.reason}`);
  }
  if(['create-handoff','write-agent-instructions'].includes(skill)&&(r.c.split==='heldout'||r.c.split==='fresh'&&r.c.child_task)&&r.manifest.arm==='skill') {
   if(!downstream[r.id]?.judged) missing.push(`${r.id}: fresh recipient evidence`);
   else if(!downstream[r.id].pass)failures.push(`${r.id}: downstream failed`);
  }
  if(skill==='create-setup-guide'&&['heldout','fresh'].includes(r.c.split)&&r.manifest.arm==='skill') {
   if(!downstream[r.id]) missing.push(`${r.id}: independent adversarial runner evidence`);
   else if(!downstream[r.id].pass)failures.push(`${r.id}: runner replay failed`);
  }
  return true;
 }
 for(const c of cases.filter(c=>c.skill===skill&&c.split==='heldout')) {
  assert.equal(hash(JSON.stringify(c)),frozen.cases[c.id].sha256,`${c.id}: frozen case changed`);
  assert.deepEqual(tree(path.join(here,c.fixture)),frozen.cases[c.id].fixture,`${c.id}: fixture changed`);
  const reps=formal.has(skill)?3:1;
  const arms=formal.has(skill)||c.value?['prompt','skill']:['skill'];
  for(const arm of arms)for(let rep=1;rep<=reps;rep++){
   const r=rows.find(r=>r.c.id===c.id&&r.manifest.arm===arm&&r.manifest.repetition===rep);
   if(!r){missing.push(`${c.id}: ${arm} repetition ${rep}`);continue;}
   assert.equal(r.manifest.case_sha256,frozen.cases[c.id].sha256,`${r.id}: case/manifest mismatch`);
   if(arm==='skill')assert(sameRuntime(r),`${r.id}: wrong subject/runtime`);
   outcome(r);
  }
  if(arms.includes('prompt')) {
   const paired=arms.map(arm=>rows.filter(r=>r.c.id===c.id&&r.manifest.arm===arm&&r.result.completed));
   if(paired.every(rs=>rs.length===reps&&rs.every(r=>r.result.usage))) {
    const tokens=paired.map(rs=>median(rs.map(r=>r.result.usage.input_tokens+r.result.usage.output_tokens)));
    const wall=paired.map(rs=>median(rs.map(r=>r.result.wall_ms)));
    const calls=paired.map(rs=>median(rs.map(r=>r.result.tool_calls)));
    const reduction=1-median(paired[1].map(r=>r.result.user_instruction_chars))/median(paired[0].map(r=>r.result.user_instruction_chars));
    const pass=tokens[1]/tokens[0]<=budget.cost_premium.total_tokens_ratio&&wall[1]-wall[0]<=budget.cost_premium.wall_ms_addition&&calls[1]-calls[0]<=budget.cost_premium.tool_calls_addition&&reduction>=budget.minimum_improvement.delivery_instruction_reduction;
    cost.push({case_id:c.id,tokens,wall_ms:wall,tool_calls:calls,instruction_reduction:reduction,pass});
    if(!pass)failures.push(`${c.id}: cost/delivery threshold failed`);
   } else missing.push(`${c.id}: complete paired usage`);
  }
 }
 for(const c of cases.filter(c=>c.skill===skill&&c.split.startsWith('trigger-'))) {
  const r=rows.find(r=>r.c.id===c.id&&r.manifest.arm==='native');
  if(r)outcome(r);else missing.push(`${c.id}: native observation`);
 }
 for(const c of cases.filter(c=>c.skill===skill&&c.split==='regression')) {
  const r=rows.find(r=>r.c.id===c.id&&r.manifest.arm==='skill');
  if(!r)missing.push(`${c.id}: regression observation`);
  else {assert.equal(r.manifest.case_sha256,frozen.cases[c.id].sha256);assert(sameRuntime(r));outcome(r);}
 }
 if(formal.has(skill)) {
  const fresh=rows.filter(r=>r.c.split==='fresh');
  if(fresh.length<2)missing.push('Two consecutive fresh rounds');
  for(const r of fresh) {
   const candidates=fs.readdirSync(here).filter(f=>f.startsWith(`fresh-manifest-${skill}`)&&f.endsWith('.json')).map(f=>json(path.join(here,f)));
   const addendum=candidates.find(m=>m.records.some(c=>c.case_id===r.c.id));assert(addendum?.frozen,'Fresh manifest unavailable');
   const input=addendum.records.find(c=>c.case_id===r.c.id);assert(input,'Fresh case is not frozen');
   assert.equal(input.case_sha256,r.manifest.case_sha256,'Fresh case changed');
   assert.deepEqual(input.fixture,r.manifest.fixture,'Fresh fixture changed');
   assert(sameRuntime(r),'Fresh subject differs');
   outcome(r);
  }
  if(fresh.length===2) {
   const ordered=fresh.slice().sort((a,b)=>a.c.round-b.c.round);
   assert.deepEqual(ordered.map(r=>r.c.round),[1,2],'Distinct fresh rounds required');
   assert(Date.parse(ordered[1].manifest.observed_at)>=Date.parse(ordered[0].manifest.observed_at)+ordered[0].result.wall_ms,'Fresh rounds overlapped');
  }
 }
 const comparisons=cases.filter(c=>c.skill===skill&&c.split==='heldout'&&(formal.has(skill)||c.value)).map(c=>{
  const byArm=Object.fromEntries(['prompt','skill'].map(arm=>[arm,rows.filter(r=>r.c.id===c.id&&r.manifest.arm===arm).map(r=>({id:r.id,completed:r.result.completed,critical_pass:r.result.completed&&!!r.observation&&c.assertions.filter(a=>a.critical).every(a=>r.observation.assertions.find(s=>s.id===a.id)?.pass===true)}))]));
  return {case_id:c.id,...byArm,claim:'Observed correctness and delivery; prose length is not a gain.'};
 });
 const native=rows.filter(r=>r.c.split.startsWith('trigger-')).map(r=>({id:r.id,expected:r.c.split==='trigger-positive',observed_read:nativeRead(r.dir,skill),completed:r.result.completed}));
 const history=all.filter(r=>r.c.skill===skill);
 report.skills[skill]={tier:formal.has(skill)?3:2,iteration:frozen.iteration,tested_body_revisions:bodyRevisions.size,behavior_runs:rows.filter(r=>r.c.split==='heldout').length,native_runs:native.length,native_observations:native,comparisons,failures,baseline_failures,missing,cost,history:{runs:history.length,incomplete:history.filter(r=>!r.result.completed).map(r=>r.id),prior_or_ineligible:history.filter(r=>!rows.includes(r)).map(r=>r.id),warning:'Historical failures remain recorded; an untested current revision is incomplete, not a recovery.'},evidence_gate:failures.length||missing.length?'INCOMPLETE':'PASS',acceptance:'Pending user review of concrete result; evidence does not grant SHIP'};
}
const output=path.join(here,selected==='all'?'summary.json':`summary-${selected}.json`);fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
for(const [s,r] of Object.entries(report.skills))console.log(`${s}: ${r.evidence_gate}, ${r.failures.length} failures, ${r.missing.length} missing`);
if(Object.values(report.skills).some(r=>r.evidence_gate!=='PASS'))process.exitCode=1;
