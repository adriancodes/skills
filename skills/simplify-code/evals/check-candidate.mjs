import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));

function readJsonLines(name, expectedCount) {
  const lines = readFileSync(resolve(here, name), "utf8").trim().split("\n");
  assert.equal(lines.length, expectedCount, `${name} case count`);
  return lines.map((line) => JSON.parse(line));
}

const cases = readJsonLines("cases.jsonl", 3);
assert.deepEqual(cases.map(({ split }) => split), [
  "heldout-value",
  "regression-pressure",
  "regression-edge",
]);

const triggers = readJsonLines("trigger-cases.jsonl", 4);
assert.equal(triggers.filter(({ expected }) => expected === "trigger").length, 2);
assert.equal(triggers.filter(({ expected }) => expected === "no-trigger").length, 2);

const fixture = resolve(here, "fixtures/order-summary");
const test = spawnSync(process.execPath, ["--test"], { cwd: fixture, encoding: "utf8" });
assert.equal(test.status, 0, test.stderr || test.stdout);

const legacy = resolve(here, "fixtures/legacy-flags");
assert.equal(existsSync(resolve(legacy, "test")), false, "legacy fixture must remain untested");
const { enabledFlagNames } = await import(resolve(legacy, "src/legacy-flags.js"));
assert.deepEqual(enabledFlagNames([{ name: " beta ", enabled: true }]), ["beta"]);
assert.deepEqual(enabledFlagNames([{ name: "off", enabled: 1 }]), []);

const skill = readFileSync(resolve(here, "../SKILL.md"));
const hash = createHash("sha256").update(skill).digest("hex");
console.log(`candidate checks passed; subject sha256 ${hash}`);
