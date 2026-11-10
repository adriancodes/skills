import assert from "node:assert/strict"; import {search} from "./src/search.mjs"; assert.deepEqual(search("  "),[]); assert.deepEqual(search(" a "),["a"]);
