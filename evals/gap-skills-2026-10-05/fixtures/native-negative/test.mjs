import assert from "node:assert/strict";import {exportRecords} from "./src/export.mjs";assert.equal(exportRecords([{id:1}]),'{"id":1}\n');
