// Freeze genuinely new cases after current known gates pass; never recycle old fresh cases.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {sha256} from './validate-record.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const suite=JSON.parse(fs.readFileSync(path.join(here,'cases.json')));
const summary=JSON.parse(fs.readFileSync(path.join(here,'summary.json')));
const designs={
 'write-agent-instructions':[
  {id:'write-agent-instructions-fresh-csv-pointer',request:'Use $write-agent-instructions to inspect session.log and improve the smallest owning instruction needed to prevent that documented miss. Preserve user policy and canonical documents. Do not implement the export, rewrite the handbook, or publish.',
   files:{
    'AGENTS.md':'Keep canonical docs and user release policy unchanged. No commit, deployment or publication without explicit request. Read owning package instructions before editing.\n',
    'packages/api/AGENTS.md':'Use dependency-free JavaScript modules. Keep export changes in this package.\n',
    'packages/api/package.json':'{"type":"module"}\n',
    'docs/contact-export.md':'# Contact export\nThe owning API serialize(rows) contract is CSV. Input is an array of records with id, email and note, all strings. Emit header id,email,note followed by LF, then rows in input order, each with LF. Quote fields containing comma, double quote, CR or LF; double embedded double quotes. Empty input emits only the header. Preserve Unicode, BOM within data, leading zeros and numeric-looking strings. Reject nonarrays, missing fields and nonstring fields. No coercion.\n',
    'session.log':'Agent read root and packages/api/AGENTS.md, then implemented contact export as JSON-lines. User pointed to docs/contact-export.md, which the owning instructions never linked. Agent removed the wrong implementation. No deployment occurred. The canonical CSV contract remains current.\n'
   },criteria:['Only the owning instructions gain a conditional pointer to the canonical contact-export contract; root user policy and canonical docs remain unchanged.','The proposed instruction addresses the observed discovery miss without copying the schema or implementing export code.','A genuinely fresh recipient implements the ordinary export request and passes the canonical CSV contract, including quoted fields, Unicode, empty input and rejection cases.'],
   child_task:{request:'Implement packages/api/export.mjs exporting serialize(rows) for contact export. Follow project conventions. Add a small local check and run it. Keep instructions and canonical documents unchanged. Do not commit, publish or deploy.',criteria:['Actual fresh implementation emits canonical CSV: id,email,note header with LF; row ordering/trailing LF; comma, quote, CR and LF escaping; Unicode and BOM data; empty array; leading-zero strings.','Actual replay rejects nonarray, missing-field and nonstring input; canonical docs and policy remain unchanged; no publication.']}
  },
  {id:'write-agent-instructions-fresh-enum-checker',request:'Use $write-agent-instructions to review session.log and the configuration failure. Make only an evidence-backed instruction correction if one is needed. If the existing checker is the defect, propose its smallest repair and a concrete regression instead. Preserve source, policy and canonical schema; do not publish.',
   files:{'AGENTS.md':'Before claiming configuration verified run node scripts/check.mjs and report actual coverage. Follow docs/config-schema.md. No publication without explicit request.\n','docs/config-schema.md':'Configuration must have region, whose only allowed strings are eu and us. Missing fields and other values are invalid.\n','config.json':'{"region":"moon"}\n','scripts/check.mjs':'import fs from "node:fs";JSON.parse(fs.readFileSync("config.json"));console.log("JSON syntax passed");\n','session.log':'Agent followed AGENTS.md, read the schema, ran node scripts/check.mjs and reported syntax-only coverage. Runtime rejected region moon. The existing checker accepts that invalid enum. All discovery instructions were followed.\n'},criteria:['Correctly identifies checker semantic coverage, not an instruction discovery defect, and preserves existing instructions/source/schema.','Proposes the narrow enum/presence validation repair and concrete valid-eu/us, missing-region and invalid-enum regressions.','Actually replays the current syntax checker and distinguishes its success from schema correctness without invented publication or universal prevention.']}
 ],
 'review-session':[
  {id:'review-session-fresh-tab-runtime',request:'Use $review-session to review session.log and save docs/session-reviews/tab.md. Verify check descriptions against actual runtime output and demonstrate the smallest check that catches the miss. Report only; preserve source, tests and policy.',
   files:{'AGENTS.md':'Report observed validation and coverage accurately. Do not publish without request.\n','docs/export.md':'Two fields must be separated by one actual TAB character U+0009, not a literal backslash followed by t.\n','src/export.mjs':'export const serialize = fields => fields.join("\\\\t");\n','test.mjs':'import assert from "node:assert/strict";import {serialize} from "./src/export.mjs";assert.equal(serialize(["a","b"]),"a\\\\tb");console.log("literal separator unit passed");\n','session.log':'Agent ran node test.mjs: exit0, literal separator unit passed. Agent reported TSV ready. Consumer rejected the delimiter. No live-service timings or network traces were recorded.\n'},criteria:['Report accurately distinguishes actual literal backslash+t runtime output from the canonical U+0009 tab and explains why the unit passes.','Actually replays the existing unit plus a bounded runtime/spec assertion demonstrating the delimiter failure, with a narrow repair and regression proposal.','Only requested report added; no source/test/policy edits or publication, unsupported timing or network causes.']},
  {id:'review-session-fresh-zero-exit',request:'Use $review-session to review the supplied verification session and save docs/session-reviews/status.md. Replay the current check, identify evidence-backed friction and propose at most three bounded remedies. Report only; preserve existing code and policy.',
   files:{'AGENTS.md':'Run node scripts/check.mjs before claiming configuration verification. Preserve user release policy; no publication without request.\n','docs/schema.md':'Configuration requires a nonempty string region. Invalid configuration must make the checker exit nonzero.\n','config.json':'{}\n','scripts/check.mjs':'import fs from "node:fs";const c=JSON.parse(fs.readFileSync("config.json"));if(!c.region)console.error("Missing region");else console.log("Region accepted");\n','session.log':'Agent ran node scripts/check.mjs. It printed Missing region on stderr but tool exited0. Agent claimed schema verification passed. Runtime later rejected the missing field. No network failure or elapsed time was logged.\n'},criteria:['Actual replay records stderr Missing region with exit0; report identifies checker exit-status defect and inaccurate coverage claim.','Recommends nonzero failure status plus concrete missing-region and valid-region regressions, with at most three ranked remedies.','Only report added; source/policy preserved, no invented network/timing/cause or unauthorized publication.']}
 ]
};
for(const skill of process.argv.slice(2)) {
 const gate=summary.skills[skill];assert(gate&&!gate.failures.length&&gate.missing.every(m=>m==='Two consecutive fresh rounds'),`${skill}: current known gates not clean`);
 const target=path.join(here,`fresh-manifest-${skill}-i${gate.iteration}.json`);assert(!fs.existsSync(target),'Refusing to replace fresh manifest');
 const records=[];
 for(const [index,s] of designs[skill].entries()) {
  assert(!suite.cases.some(c=>c.id===s.id),'Refusing to reuse a fresh case');
  const directory=path.join(here,'fixtures',s.id);fs.mkdirSync(directory);
  for(const [name,value] of Object.entries(s.files)){const dest=path.join(directory,name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,value);}
  const c={id:s.id,skill,split:'fresh',round:index+1,request:s.request,strong_prompt:'',fixture:`fixtures/${s.id}`,...(s.child_task?{child_task:s.child_task}:{}),assertions:s.criteria.map((criterion,i)=>({id:`fresh-${i+1}`,critical:true,criterion}))};
  suite.cases.push(c);records.push({case_id:c.id,case_sha256:sha256(JSON.stringify(c)),fixture:Object.fromEntries(Object.keys(s.files).sort().map(f=>[f,sha256(s.files[f])]))});
 }
 fs.writeFileSync(target,JSON.stringify({frozen:true,prepared_at:new Date().toISOString(),iteration:gate.iteration,known_gate:gate,records},null,2)+'\n');
}
fs.writeFileSync(path.join(here,'cases.json'),JSON.stringify(suite,null,2)+'\n');
