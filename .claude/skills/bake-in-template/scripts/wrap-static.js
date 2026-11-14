// Usage: node .claude/skills/bake-in-template/scripts/wrap-static.js <sourceFile> <componentFile> <outputName>
// Writes a React component whose output is <sourceFile>, byte for byte (line endings normalized to LF).
const fs = require('fs');
const path = require('path');

const [sourceFile, componentFile, outputName] = process.argv.slice(2);
const sourceText = fs.readFileSync(sourceFile, 'utf8').replace(/\r\n/g, '\n');

// Escape what is special inside a JS template literal, so the output matches the source exactly.
const escapedText = sourceText
  .replaceAll('\\', '\\\\') // backslashes first, so the escapes added below aren't escaped again
  .replaceAll('`', '\\`')
  .replaceAll('${', '\\${');

const componentLines = [
  "import { File } from '@asyncapi/generator-react-sdk';",
  '',
  'export default function () {',
  '  return (',
  `    <File name="${outputName}">`,
  `      {\`${escapedText}\`}`,
  '    </File>',
  '  );',
  '}',
  '',
];
fs.mkdirSync(path.dirname(componentFile), { recursive: true });
fs.writeFileSync(componentFile, componentLines.join('\n'));
