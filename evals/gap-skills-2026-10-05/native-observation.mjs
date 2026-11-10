import fs from 'node:fs';
import path from 'node:path';
export function nativeRead(dir,skill) {
 const body=fs.readFileSync(path.join(dir,'workspace-before','.agents','skills',skill,'SKILL.md'),'utf8').trim();
 const events=fs.readFileSync(path.join(dir,'trace.jsonl'),'utf8').split('\n').flatMap(l=>{try{return [JSON.parse(l)]}catch{return []}});
 return events.some(e=>e.type==='item.completed'&&e.item?.type==='command_execution'&&
  (e.item.command||'').includes(`/skills/${skill}/`)&&/\b(cat|sed|head|read|python|node)\b/.test(e.item.command||'')&&
  (e.item.aggregated_output||'').includes(body));
}
