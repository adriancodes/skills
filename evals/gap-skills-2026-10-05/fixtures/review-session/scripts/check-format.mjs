import fs from "node:fs";
JSON.parse(fs.readFileSync("config.json","utf8"));
console.log("JSON syntax valid");
