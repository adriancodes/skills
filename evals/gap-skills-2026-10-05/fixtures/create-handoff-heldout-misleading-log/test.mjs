import assert from "node:assert/strict";import {get} from "./src/cache.mjs";assert.equal(get({value:"x",expires:1},2),null);
