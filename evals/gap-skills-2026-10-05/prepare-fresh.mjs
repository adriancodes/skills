// Freeze new cases only after the known behavior and selection gates are clean.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {sha256} from './validate-record.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const file=path.join(here,'cases.json'),suite=JSON.parse(fs.readFileSync(file));
const summary=JSON.parse(fs.readFileSync(path.join(here,'summary.json')));
const selection=process.argv.slice(2);
const specifications={
 'prepare-pr':[
  {id:'prepare-pr-fresh-mock-publication',request:'Prepare and publish this PR through the supplied local mock tools/gh. Its synthetic branch is already available to the mock; no network or branch push is needed. Use main as base and the repository template. Save the inspected draft at docs/pr-draft.md. Preserve the unrelated dirty notes. Publication means only this local mock; do not invoke a real GitHub CLI, merge, or deploy.',
   files:{'src/export.mjs':'export const serialize = rows => rows.map(JSON.stringify).join("\\n") + (rows.length ? "\\n" : "");\n','test.mjs':'import assert from "node:assert/strict";import {serialize} from "./src/export.mjs";assert.equal(serialize([{x:1},{x:2}]),\'{"x":1}\\n{"x":2}\\n\');assert.equal(serialize([]),"");console.log("format checks passed");\n','docs/user-notes.md':'Keep the user draft.\n','.github/PULL_REQUEST_TEMPLATE.md':'## Problem and change\n\n## Validation\n\n## Risks\n','tools/gh':'#!/usr/bin/env node\nimport fs from "node:fs";const a=process.argv.slice(2);fs.appendFileSync("mock-gh.jsonl",JSON.stringify(a)+"\\n");if(a[0]==="auth")console.log("mock authenticated");else if(a[0]==="repo")console.log(JSON.stringify({nameWithOwner:"fixture/project",defaultBranchRef:{name:"main"}}));else if(a[0]==="pr"&&a[1]==="view"){console.error("no existing PR");process.exitCode=1;}else if(a[0]==="pr"&&a[1]==="create"){let i=a.indexOf("--body-file");let body=i>=0?fs.readFileSync(a[i+1],"utf8"):a[a.indexOf("--body")+1];fs.writeFileSync("mock-created-pr.json",JSON.stringify({args:a,body,url:"https://example.test/pr/42"},null,2));console.log("https://example.test/pr/42");}else {console.error("unsupported mock operation");process.exitCode=2;}\n'},
   git:{before:{'src/export.mjs':'export const serialize = rows => rows.map(JSON.stringify).join("");\n'},after:{'src/export.mjs':'export const serialize = rows => rows.map(JSON.stringify).join("\\n") + (rows.length ? "\\n" : "");\n'},commit_head:true,dirty:{'docs/user-notes.md':'Keep the user draft.\nUnrelated local idea.\n'}},
   criteria:['The inspected draft and mock-created PR describe the actual committed separators/trailing-newline change and observed validation with correct base/head scope.','The supplied local mock receives a create operation with title/body; its published body matches the inspected draft and actual URL is reported.','Dirty user notes and source are preserved; no real publication, branch commit, merge or deployment.']},
  {id:'prepare-pr-fresh-missing-history',request:'Prepare a local PR title and body at docs/pr-draft.md for the supplied export change. This uploaded folder has no Git history. Keep the base/head and integration coverage limitations visible. Do not publish or modify source.',
   files:{'src/export.mjs':'export const serialize = rows => rows.map(JSON.stringify).join("\\n");\n','change.diff':'--- a/src/export.mjs\n+++ b/src/export.mjs\n@@ -1 +1 @@\n-export const serialize = rows => rows.map(JSON.stringify).join("");\n+export const serialize = rows => rows.map(JSON.stringify).join("\\n");\n','validation.md':'A unit run on another checkout was reported passed. Head identity was not recorded. No integration result is available.\n'},
   criteria:['Local draft accurately describes only the supplied separator change, including its trailing-newline limit, without inventing Git identities.','Historical/unit and unavailable integration evidence stay distinct from current verified passing checks.','Only the local review artifact is created; source and supplied evidence preserved; no publication.']}
 ],
 'review-session':[
  {id:'review-session-fresh-swallowed-exit',request:'Review the supplied session and save docs/session-reviews/exit.md. Recommend at most three evidence-backed remedies and demonstrate the smallest existing check that would detect the failure. This is report-only; preserve code, scripts and policy.',
   files:{'session.log':'Agent ran node scripts/check.mjs. The tool exited 1: Missing required field region. Agent wrote “configuration verified” in the result. Maintainer reproduced the missing field. No other checker was available.\n','config.json':'{"name":"demo"}\n','scripts/check.mjs':'import fs from "node:fs";const c=JSON.parse(fs.readFileSync("config.json"));if(!c.region){console.error("Missing required field region");process.exitCode=1;}\n','AGENTS.md':'Run node scripts/check.mjs before claiming configuration verification. Do not publish without explicit request.\n'},
   criteria:['Report distinguishes an existing failing checker and inaccurate success report from an absent checker or demonstrated instruction defect.','Actual replay captures the existing nonzero result, and the first remedy connects verification claims to observed exit status with a checkable behavioral test.','At most three ranked remedies; no invented timing/cause/universal prevention, no source/script/policy edits or publication.']},
  {id:'review-session-fresh-clean-session',request:'Use $review-session to review session.log and save docs/session-reviews/clean.md. Identify only friction supported by the evidence. Preserve the project and do not apply policy changes.',
   files:{'session.log':'Agent inspected the export requirement, changed src/export.mjs, then ran node test.mjs. Tool exited 0: format checks passed. Agent reported the bounded format check and said live-service integration was unavailable. User accepted that scope. Total wall time was not logged.\n','src/export.mjs':'export const serialize = rows => rows.map(JSON.stringify).join("\\n") + (rows.length ? "\\n" : "");\n','test.mjs':'import assert from "node:assert/strict";import {serialize} from "./src/export.mjs";assert.equal(serialize([{a:1}]),\'{"a":1}\\n\');console.log("format checks passed");\n','AGENTS.md':'Report actual local validation and its coverage. No publishing without request.\n'},
   criteria:['No observed failure is invented; unavailable integration and timing are explicit limits consistent with accepted scope.','Any recommendation has evidence or is clearly optional, with no claim of universal prevention or unsupported cause.','Only the requested report is added; existing project/policy preserved and no publication.']}
 ]
};
for(const skill of selection) {
 assert(specifications[skill],`No fresh design for ${skill}`);
 const gate=summary.skills[skill];assert(gate&&!gate.failures.length&&gate.missing.every(m=>m==='Two consecutive fresh rounds'),`${skill}: known gates are not yet clean`);
 const records=[];
 for(const [index,s] of specifications[skill].entries()) {
  assert(!suite.cases.some(c=>c.id===s.id),'Refusing to replace a fresh case');
  const directory=path.join(here,'fixtures',s.id);fs.mkdirSync(directory);
  for(const [name,text] of Object.entries(s.files)) {const dest=path.join(directory,name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,text);if(name==='tools/gh')fs.chmodSync(dest,0o755);}
  const c={id:s.id,skill,split:'fresh',round:index+1,request:s.request,strong_prompt:'',fixture:`fixtures/${s.id}`,...(s.git?{git:s.git}:{}),assertions:s.criteria.map((criterion,i)=>({id:`fresh-${i+1}`,critical:true,criterion}))};
  suite.cases.push(c);
  records.push({case_id:c.id,case_sha256:sha256(JSON.stringify(c)),fixture:Object.fromEntries(Object.keys(s.files).sort().map(f=>[f,sha256(s.files[f])]))});
 }
 fs.writeFileSync(path.join(here,`fresh-manifest-${skill}.json`),JSON.stringify({frozen:true,prepared_at:new Date().toISOString(),known_gate:gate,records},null,2)+'\n');
}
fs.writeFileSync(file,JSON.stringify(suite,null,2)+'\n');
console.log(`Frozen two fresh cases each for ${selection.join(', ')}`);
