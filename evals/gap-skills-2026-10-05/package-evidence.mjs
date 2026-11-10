#!/usr/bin/env node
// Keep disposable Git metadata as lossless archives, never embedded gitlinks.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
for(const id of fs.readdirSync(path.join(here,'results'))) {
 const dir=path.join(here,'results',id);if(!fs.existsSync(path.join(dir,'result.json')))continue;
 for(const snapshot of ['workspace-before','workspace']) {
  const project=path.join(dir,snapshot),gitDir=path.join(project,'.git');if(!fs.existsSync(gitDir))continue;
  const archive=path.join(dir,`${snapshot}-git.tar`);assert(!fs.existsSync(archive),'Existing Git archive; inspect before retrying');
  const pack=spawnSync('tar',['-cf',archive,'-C',project,'.git'],{encoding:'utf8'});assert.equal(pack.status,0,pack.stderr);
  const list=spawnSync('tar',['-tf',archive],{encoding:'utf8'});assert.equal(list.status,0,list.stderr);assert(list.stdout.includes('.git/HEAD'));
  fs.writeFileSync(path.join(dir,`${snapshot}-git-archive.json`),JSON.stringify({archive:path.basename(archive),sha256:crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex'),entries:list.stdout.trim().split('\n').length,reason:'Lossless transport packaging; source snapshots and effect hashes exclude .git. Original metadata remains recoverable from this archive.'},null,2)+'\n');
  fs.rmSync(gitDir,{recursive:true});
 }
}
console.log('Completed Git fixture metadata archived without embedded repositories');
