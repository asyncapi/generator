// Usage: node .claude/skills/bake-in-template/scripts/check-verbatim.js <SCRATCH_DIR> <generatedDir>  → {mismatches, notGenerated} as JSON
// Exit 1 only when a generated file differs from its golden file. A golden file the smoke run didn't generate is listed in
// notGenerated, not counted as a mismatch: the golden output came from the capture document and parameters, and the
// smoke document or parameters may rightly turn that file off.
const fs = require('fs');
const path = require('path');

const [scratchDir, generatedDir] = process.argv.slice(2);
const inventory = require(path.resolve(scratchDir, 'inventory.json'));
const verbatimRows = inventory.rows.filter((row) => ['copy', 'verbatim-component'].includes(row.becomes));

function readWithLf(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}

// "golden/asyncapi/src/lib/utils.js" → "src/lib/utils.js": drop the "golden/<fixture>/" prefix.
function pathInsideGolden(referencePath) {
  return referencePath.split('/').slice(2).join('/');
}

const mismatches = [];
const notGenerated = [];
for (const row of verbatimRows) {
  for (const referencePath of row.referenceOutput) {
    const file = pathInsideGolden(referencePath);
    const generatedFile = path.join(generatedDir, file);
    if (!fs.existsSync(generatedFile)) {
      notGenerated.push({ row: row.id, file });
    } else if (readWithLf(generatedFile) !== readWithLf(path.join(scratchDir, referencePath))) {
      mismatches.push({ row: row.id, file, problem: 'differs' });
    }
  }
}

console.log(JSON.stringify({ mismatches, notGenerated }, null, 2));
process.exit(mismatches.length ? 1 : 0);
