import fs from "node:fs";const c=JSON.parse(fs.readFileSync("config.json"));if(!c.region)console.error("Missing region");else console.log("Region accepted");
