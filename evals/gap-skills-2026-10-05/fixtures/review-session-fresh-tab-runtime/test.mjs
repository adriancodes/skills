import assert from "node:assert/strict";import {serialize} from "./src/export.mjs";assert.equal(serialize(["a","b"]),"a\\tb");console.log("literal separator unit passed");
