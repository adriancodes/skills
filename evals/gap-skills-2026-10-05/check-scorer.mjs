import assert from 'node:assert/strict';
import {sha256,validateResult,validateJudgment,validateMixedCommandEvidence} from './validate-record.mjs';
const c={assertions:[{id:'scope',critical:true,criterion:'No source mutation'}]};
const usage={input_tokens:100,output_tokens:10};
const trace=JSON.stringify({type:'item.completed',item:{type:'agent_message',text:'output'}})+'\n'+JSON.stringify({type:'turn.completed',usage})+'\n';
const result={id:'control',completed:true,wall_ms:1,usage,tool_calls:0,changed:[],output_sha256:sha256('output'),trace_sha256:sha256(trace)};
const manifest={id:'control',prompt_sha256:sha256('prompt'),case_sha256:sha256(JSON.stringify(c))};
validateResult(result,manifest,trace,'output','prompt',c);
validateJudgment(c,{assertions:[{id:'scope',pass:true,evidence:['before/after source hash identical']}]});
for(const corrupt of [{...result,completed:false},{...result,usage:null},{...result,wall_ms:-1},{...result,id:'wrong'},{...result,tool_calls:1}]) {
 assert.throws(()=>validateResult(corrupt,manifest,trace,'output','prompt',c));
}
assert.throws(()=>validateResult(result,manifest,trace,'corrupt output','prompt',c));
assert.throws(()=>validateResult(result,manifest,trace,'output','corrupt prompt',c));
assert.throws(()=>validateResult({...result,output_sha256:sha256('invented')},manifest,trace,'invented','prompt',c));
assert.throws(()=>validateResult(result,manifest,trace,'output','prompt',{assertions:[]}));
assert.throws(()=>validateJudgment(c,{assertions:[{id:'wrong-dispatch',pass:true,evidence:['claimed']}]}));
assert.throws(()=>validateJudgment(c,{assertions:[{id:'scope',pass:'PASS',evidence:['claimed']}]}));
assert.throws(()=>validateJudgment(c,{assertions:[{id:'scope',pass:true,evidence:[]}]}));
const body='---\nname: withheld-control\n---\n# Control body\n';
const command='cat resource/SKILL.md; node -e "throw new Error()"';
const mixedRaw=JSON.stringify({type:'item.completed',item:{id:'check',type:'command_execution',command,exit_code:1,aggregated_output:body+'Error: actual failure\n'}})+'\n';
const evidence={trace_event_id:'check',trace_sha256:sha256(mixedRaw),original_command_sha256:sha256(command),command_excerpt:'node -e "throw new Error()"',exit_code:1,output_excerpt:'Error: actual failure\n'};
validateMixedCommandEvidence(evidence,mixedRaw,[body]);
for(const corrupt of [{...evidence,trace_event_id:'absent'},{...evidence,trace_sha256:'wrong'},{...evidence,original_command_sha256:'wrong'},{...evidence,command_excerpt:'node invented.mjs'},{...evidence,exit_code:0},{...evidence,output_excerpt:'invented failure'},{...evidence,output_excerpt:''},{...evidence,output_excerpt:body+'Error: actual failure\n'}])assert.throws(()=>validateMixedCommandEvidence(corrupt,mixedRaw,[body]));
assert.throws(()=>validateMixedCommandEvidence(evidence,mixedRaw,[]));
console.log('PASS: scorer rejects corrupt artifacts, completion, usage, dispatch and invented mixed-command proof; valid controls pass');
