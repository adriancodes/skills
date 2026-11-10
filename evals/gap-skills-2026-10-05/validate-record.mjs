import assert from 'node:assert/strict';
import crypto from 'node:crypto';
export const sha256=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
export function validateResult(result,manifest,trace,output,prompt,testCase) {
 for(const field of ['id','completed','wall_ms','usage','tool_calls','changed','output_sha256','trace_sha256'])assert(field in result,`Missing ${field}`);
 assert.equal(result.id,manifest.id);
 assert.equal(typeof result.completed,'boolean');
 assert(Number.isInteger(result.wall_ms)&&result.wall_ms>=0);
 assert(Number.isInteger(result.tool_calls)&&result.tool_calls>=0);
 assert(Array.isArray(result.changed)&&result.changed.every(f=>typeof f==='string'));
 assert.equal(sha256(output),result.output_sha256,'Output changed');
 assert.equal(sha256(trace),result.trace_sha256,'Trace changed');
 assert.equal(sha256(prompt),manifest.prompt_sha256,'Prompt changed');
 assert.equal(sha256(JSON.stringify(testCase)),manifest.case_sha256,'Case changed');
 const events=trace.toString().split('\n').filter(Boolean).flatMap(line=>{try{return [JSON.parse(line)]}catch{return []}});
 const completed=events.findLast(e=>e.type==='turn.completed');
 assert.equal(result.completed,!!completed,'Completion differs from raw trace');
 assert.deepEqual(result.usage,completed?.usage||null,'Usage differs from raw trace');
 if(result.usage) {
  for(const field of ['input_tokens','output_tokens'])assert(Number.isInteger(result.usage[field])&&result.usage[field]>=0,`Invalid ${field}`);
  if('cached_input_tokens' in result.usage)assert(Number.isInteger(result.usage.cached_input_tokens)&&result.usage.cached_input_tokens>=0&&result.usage.cached_input_tokens<=result.usage.input_tokens,'Invalid cached input');
 }
 const commands=events.filter(e=>e.type==='item.completed'&&e.item?.type==='command_execution').map(e=>e.item);
 assert.equal(result.tool_calls,commands.length,'Tool count differs from raw trace');
 if(result.commands)assert.deepEqual(result.commands,commands.map(c=>({command:c.command,exit_code:c.exit_code})),'Commands differ from raw trace');
 const observedOutput=events.filter(e=>e.type==='item.completed'&&e.item?.type==='agent_message').map(e=>e.item.text).join('\n\n');
 assert.equal(output.toString(),observedOutput,'Output differs from raw trace');
}
export function validateJudgment(testCase,observation) {
 assert(observation&&Array.isArray(observation.assertions),'Judgment missing');
 assert.deepEqual(observation.assertions.map(a=>a.id).sort(),testCase.assertions.map(a=>a.id).sort(),'Wrong assertion dispatch');
 for(const assertion of observation.assertions) {
  assert.equal(typeof assertion.pass,'boolean');
  assert(Array.isArray(assertion.evidence)&&assertion.evidence.length&&assertion.evidence.every(e=>typeof e==='string'&&e.length),'Concrete evidence missing');
 }
}
export function validateMixedCommandEvidence(evidence,raw,bodies) {
 const events=raw.toString().split('\n').filter(Boolean).map(line=>JSON.parse(line)).filter(e=>e.type==='item.completed'&&e.item?.type==='command_execution');
 const item=events.find(e=>e.item.id===evidence.trace_event_id)?.item;assert(item,'Mixed command event absent');
 assert.equal(evidence.trace_sha256,sha256(raw));assert.equal(evidence.original_command_sha256,sha256(item.command));
 const suffix=item.command.match(/;\s*((?:node|python3?)\b[\s\S]*)/);assert(suffix,'Mixed check suffix absent');
 assert.equal(evidence.command_excerpt,suffix[1]);assert.equal(evidence.exit_code,item.exit_code);
 assert(!/SKILL\.md|\/subject\/|\.agents\/skills/.test(evidence.command_excerpt),'Resource display leaked');
 let expected=item.aggregated_output||'',removed=false;
 for(const body of bodies)if(expected.includes(body)){expected=expected.replace(body,'');removed=true;}
 assert(removed,'No complete withheld body found');assert.equal(evidence.output_excerpt,expected,'Mixed output differs from raw evidence');
}
