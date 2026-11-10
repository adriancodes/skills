import assert from "node:assert/strict";import {serialize} from "./src/export.mjs";assert.equal(serialize([{a:1}]),'{"a":1}\n');console.log("format checks passed");
