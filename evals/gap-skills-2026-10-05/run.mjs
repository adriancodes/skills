#!/usr/bin/env node
// Isolated actors. Assertions remain outside the actor workspace.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {spawn, spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const loadedRunner = fs.readFileSync(fileURLToPath(import.meta.url),'utf8');
const repo = path.resolve(here, '../..');
const budget = JSON.parse(fs.readFileSync(path.join(here,'budget.json')));
const matrix = JSON.parse(fs.readFileSync(path.join(here,'matrix.json')));
const results = path.join(here,'results');
fs.mkdirSync(results,{recursive:true});
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const tree = dir => Object.fromEntries(fs.readdirSync(dir,{recursive:true}).filter(f=>!f.split(path.sep).includes('.git') && fs.statSync(path.join(dir,f)).isFile()).sort().map(f=>[f,hash(fs.readFileSync(path.join(dir,f)))]));
const json = f => JSON.parse(fs.readFileSync(f,'utf8'));
const cases = json(path.join(here,'discovery-cases.json')).cases;
const extra = path.join(here,'cases.json');
if(fs.existsSync(extra)) cases.push(...json(extra).cases);
const jobs = process.argv.slice(2).map(spec=>{
  const [id,arm,rep='1',iteration='1'] = spec.split(':');
  const c = cases.find(c=>c.id===id);
  assert(c,`Unknown case ${id}`);
  assert(['none','prompt','skill','native'].includes(arm),'Unknown arm');
  return {c,arm,rep:Number(rep),iteration:Number(iteration)};
});
assert(jobs.length,'Supply case:arm:repetition:iteration');
// Authorized per-skill extension: its own limits, counted only over its own iteration's runs.
const extensionFile = path.join(here,'budget-extension.json');
const extension = fs.existsSync(extensionFile) ? json(extensionFile) : null;
const extended = !!extension && jobs.every(j=>j.c.skill===extension.skill && j.iteration>=extension.iteration);
if(extended) Object.assign(budget,extension.limits);
const inExtension = f => !!extension && f.startsWith(`${extension.skill}-`) && Number(f.match(/--i(\d+)$/)?.[1])>=extension.iteration;
const version = spawnSync('codex',['--version'],{encoding:'utf8'}).stdout.trim();
assert.equal(version,matrix.harness,'Harness changed: version the matrix before running');
const startFile = path.join(results,extended?'started-extension.json':'started.json');
if(!fs.existsSync(startFile)) fs.writeFileSync(startFile,JSON.stringify({at:new Date().toISOString()}));

function reserve(id) {
  const dirs=fs.readdirSync(results).filter(f=>fs.statSync(path.join(results,f)).isDirectory()&&inExtension(f)===extended);
  const overheadFile=path.join(here,'judging-overhead.json');
  const judgeTurns=extended?json(extensionFile).judge_turns:fs.existsSync(overheadFile)?Object.values(json(overheadFile).judge_turns).reduce((n,v)=>n+v,0):0;
  assert(dirs.length+judgeTurns<budget.actor_runs,'Actor budget exhausted including judging turns');
  let input=0, output=0;
  for(const dir of dirs) {
    const f=path.join(results,dir,'result.json');
    if(fs.existsSync(f)) {const r=json(f);input+=r.usage?.input_tokens||0;output+=r.usage?.output_tokens||0;}
  }
  assert(input<budget.input_tokens && output<budget.output_tokens,'Token budget exhausted');
  assert(Date.now()-Date.parse(json(startFile).at)<budget.elapsed_ms,'Elapsed budget exhausted');
  const dir=path.join(results,id);
  fs.mkdirSync(dir); // Atomic reservation; never overwrite evidence.
  return dir;
}

async function run({c,arm,rep,iteration}) {
  if(c.split!=='discovery') {
    const evalDir=path.join(repo,'skills',c.skill,'evals');
    if(fs.existsSync(evalDir)) {
      const versions=fs.readdirSync(evalDir).flatMap(f=>{const m=f.match(/^suite-manifest-i(\d+)\.json$/);return m?[Number(m[1])]:[];});
      iteration=Math.max(iteration,...versions);
    }
  }
  const id=`${c.id}--${arm}--r${rep}--i${iteration}`;
  const dir=reserve(id);
  const save=(f,data)=>fs.writeFileSync(path.join(dir,f),typeof data==='string'?data:JSON.stringify(data,null,2)+'\n');
  const workspace=fs.mkdtempSync(path.join(os.tmpdir(),'gap-skill-'));
  fs.cpSync(path.join(here,c.fixture),workspace,{recursive:true});
  if(c.git) {
    const git=(args)=>{const r=spawnSync('git',['-c','core.fsmonitor=false',...args],{cwd:workspace,encoding:'utf8'});assert.equal(r.status,0,r.stderr);return r.stdout.trim();};
    git(['init','-b','main']);git(['config','user.name','Fixture']);git(['config','user.email','fixture@example.test']);
    if(c.git.before) for(const [file,content] of Object.entries(c.git.before)) fs.writeFileSync(path.join(workspace,file),content);
    git(['add','.']);git(['commit','-m','Fixture base']);
    const base=git(['rev-parse','HEAD']);
    if(c.git.after) for(const [file,content] of Object.entries(c.git.after)) fs.writeFileSync(path.join(workspace,file),content);
    if(c.git.commit_head) {git(['switch','-c','fixture-change']);git(['add','.']);git(['commit','-m','Fixture change']);}
    if(c.git.dirty) for(const [file,content] of Object.entries(c.git.dirty)) fs.writeFileSync(path.join(workspace,file),content);
    save('git-before.json',{base,head:git(['rev-parse','HEAD']),status:git(['status','--porcelain']),diff:git(['diff',base])});
  }
  let subject=null,body='';
  if(arm==='skill') {
    subject=path.join(dir,'subject');
    const source=path.join(repo,'skills',c.skill);
    fs.cpSync(source,subject,{recursive:true,filter:f=>!path.relative(source,f).split(path.sep).includes('evals')});
    body=fs.readFileSync(path.join(subject,'SKILL.md'),'utf8');
  }
  if(arm==='native') {
    const install=path.join(workspace,'.agents','skills');fs.mkdirSync(install,{recursive:true});
    for(const name of fs.readdirSync(path.join(repo,'skills'))) {
      const source=path.join(repo,'skills',name);
      if(fs.existsSync(path.join(source,'SKILL.md'))) fs.cpSync(source,path.join(install,name),{recursive:true,filter:f=>!path.relative(source,f).split(path.sep).includes('evals')});
    }
  }
  const constraints=`Work only in the disposable project ${workspace}. Do not inspect parent repositories, other evaluation outputs, or unrelated installed skill bodies. No external network services, dependency installation, subagents, or Git commits are available. Do not invent user answers. Use local tools to perform the requested work. Respect the narrower user scope. ${subject?`The supplied skill resources at ${subject} are read-only inputs; consult them when the skill requires them.`:''}`;
  const prompt=`${constraints}\n\n${arm==='skill'?`Supplied skill:\n${body}\n\n`:''}${arm==='prompt'?`Task instructions:\n${c.strong_prompt}\n\n`:''}${c.setup?`Project context:\n${c.setup}\n\n`:''}User request:\n${c.request}`;
  save('case.json',c);save('prompt.md',prompt);save('before.json',tree(workspace));
  fs.cpSync(workspace,path.join(dir,'workspace-before'),{recursive:true});
  const args=matrix.args.map(x=>x==='<disposable-workspace>'?workspace:x);
  const disabled=json(path.join(here,'disabled-global-skills.json'));
  args.push('-c',`skills.config=[${disabled.map(p=>`{path=${JSON.stringify(p.replace(/^~/,process.env.HOME))},enabled=false}`).join(',')}]`);
  save('runner.mjs',loadedRunner);
  save('manifest.json',{id,case_id:c.id,arm,repetition:rep,iteration,model:matrix.model,matrix_sha256:hash(fs.readFileSync(path.join(here,'matrix.json'))),budget_sha256:hash(fs.readFileSync(path.join(here,'budget.json'))),case_sha256:hash(JSON.stringify(c)),subject:subject?tree(subject):null,native_catalog:arm==='native'?tree(path.join(workspace,'.agents','skills')):null,fixture:tree(path.join(here,c.fixture)),prompt_sha256:hash(prompt),runner_sha256:hash(loadedRunner),harness:version,args,workspace,observed_at:new Date().toISOString()});
  const started=Date.now();
  const actor=spawn('codex',args,{cwd:workspace,stdio:['pipe','pipe','pipe']});
  const trace=fs.createWriteStream(path.join(dir,'trace.jsonl'));
  const err=fs.createWriteStream(path.join(dir,'stderr.txt'));
  let raw='',stderr='',failure=null,timedOut=false;
  actor.stdout.on('data',b=>{raw+=b;trace.write(b);});actor.stderr.on('data',b=>{stderr+=b;err.write(b);});
  actor.on('error',e=>{failure=e.message;});
  actor.stdin.end(prompt);
  const timer=setTimeout(()=>{timedOut=true;actor.kill('SIGTERM');setTimeout(()=>actor.kill('SIGKILL'),3000).unref();},budget.timeout_ms);
  const code=await new Promise(resolve=>actor.on('close',resolve));clearTimeout(timer);trace.end();err.end();
  const events=raw.split('\n').filter(Boolean).flatMap(l=>{try{return [JSON.parse(l)]}catch{return []}});
  const completed=events.findLast(e=>e.type==='turn.completed');
  const output=events.filter(e=>e.type==='item.completed' && e.item?.type==='agent_message').map(e=>e.item.text).join('\n\n');
  const commands=events.filter(e=>e.type==='item.completed' && e.item?.type==='command_execution').map(e=>e.item);
  save('output.md',output);save('after.json',tree(workspace));fs.cpSync(workspace,path.join(dir,'workspace'),{recursive:true});
  const before=json(path.join(dir,'before.json')),after=tree(workspace);
  const changed=[...new Set([...Object.keys(before),...Object.keys(after)])].filter(f=>before[f]!==after[f]);
  save('result.json',{id,exit_code:code,error:failure,timed_out:timedOut,completed:!!completed,wall_ms:Date.now()-started,usage:completed?.usage||null,tool_calls:commands.length,commands:commands.map(c=>({command:c.command,exit_code:c.exit_code})),user_instruction_chars:c.request.length+(arm==='prompt'?c.strong_prompt.length:0),changed,output_sha256:hash(output),trace_sha256:hash(raw),scoring:'UNSCORED'});
  console.log(JSON.stringify({id,exit_code:code,completed:!!completed,wall_ms:Date.now()-started,usage:completed?.usage||null,changed}));
}
let cursor=0;
await Promise.all(Array.from({length:Math.min(budget.concurrency,jobs.length)},async()=>{while(cursor<jobs.length) await run(jobs[cursor++]);}));
