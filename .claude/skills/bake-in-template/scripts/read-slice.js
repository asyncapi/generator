// Usage: node .claude/skills/bake-in-template/scripts/read-slice.js <jsonFile> <arrayKey[,arrayKey]> <id>...
// Prints only the rows with the given ids. Examples:
//   node .claude/skills/bake-in-template/scripts/read-slice.js <SCRATCH_DIR>/inventory.json rows I4
//   node .claude/skills/bake-in-template/scripts/read-slice.js <SCRATCH_DIR>/api-map.json calls,filters A1 A2 F1
const fs = require('fs');

const [jsonFile, arrayKeys, ...ids] = process.argv.slice(2);
const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
const rows = arrayKeys.split(',').flatMap((key) => data[key] || []);
console.log(JSON.stringify(rows.filter((row) => ids.includes(row.id)), null, 2));
