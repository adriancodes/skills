import fs from "node:fs";
import assert from "node:assert/strict";
const config=JSON.parse(fs.readFileSync("config.json","utf8"));
assert.deepEqual(Object.keys(config).sort(), ["retries"]);
assert(Number.isInteger(config.retries) && config.retries >= 0);
console.log("Config contract valid");
