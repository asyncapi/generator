// Usage: node .claude/skills/bake-in-template/scripts/write-capture.js <SCRATCH_DIR> <url> <commit> <engine> <apiVersion> <generatorVersion> <runFile>...
// Writes <SCRATCH_DIR>/capture.json from the capture-run-<i>.json files, in the order given.
const fs = require('fs');
const path = require('path');

const [scratchDir, url, commit, engine, apiVersion, generatorVersion, ...runFiles] = process.argv.slice(2);
const runs = runFiles.map((runFile) => JSON.parse(fs.readFileSync(runFile, 'utf8')));
const capture = { source: { url, commit, engine, apiVersion, generatorVersion }, runs };

fs.writeFileSync(path.join(scratchDir, 'capture.json'), JSON.stringify(capture, null, 2));
console.log(`capture.json: ${runs.map((run) => `${run.fixture} (${run.files.length} files)`).join(', ')}`);
