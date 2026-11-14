// Usage: node .claude/skills/bake-in-template/scripts/start-check.js <exitFile> <errFile>  → {"exited","exitCode","errorLines","ignoredLines"}
// errorLines: stderr lines that count as error output. npm warn/notice lines and Node deprecation warnings don't.
const fs = require('fs');

const MAX_LINES = 20;
const [exitFile, errFile] = process.argv.slice(2);

// launch.js writes the exit file only when the command has exited.
const exitInfo = fs.existsSync(exitFile) ? JSON.parse(fs.readFileSync(exitFile, 'utf8')) : null;
const stderrText = fs.existsSync(errFile) ? fs.readFileSync(errFile, 'utf8') : '';
const stderrLines = stderrText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

function isIgnorable(line) {
  const isNpmNotice = /^npm (warn|notice)\b/i.test(line);
  const isNodeWarning = line.startsWith('(node:') && /DeprecationWarning|ExperimentalWarning/.test(line);
  const isWarningHint = line.includes('--trace-deprecation') || line.includes('--trace-warnings');
  return isNpmNotice || isNodeWarning || isWarningHint;
}

console.log(JSON.stringify({
  exited: Boolean(exitInfo),
  exitCode: exitInfo ? exitInfo.code : null,
  errorLines: stderrLines.filter((line) => !isIgnorable(line)).slice(0, MAX_LINES),
  ignoredLines: stderrLines.filter(isIgnorable).slice(0, MAX_LINES),
}));
