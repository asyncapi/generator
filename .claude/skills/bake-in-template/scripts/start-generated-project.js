// Usage: node .claude/skills/bake-in-template/scripts/start-generated-project.js <runDir> <logFile> <errFile> <exitFile> <command...>
// Starts <command> in <runDir> through the shell and writes {code, signal} to <exitFile> when it exits.
const { spawn } = require('child_process');
const fs = require('fs');

const [runDir, logFile, errFile, exitFile, ...commandWords] = process.argv.slice(2);
const stdoutFile = fs.openSync(logFile, 'a');
const stderrFile = fs.openSync(errFile, 'a');

// The shell splits the joined line on spaces, so a word that contains one (e.g. the path "config files/dev.json")
// gets its quotes back and stays one argument.
function quoteIfSpaced(word) {
  return /\s/.test(word) ? `"${word}"` : word;
}

// On Linux/macOS, `detached` puts the command in its own process group, so `kill -- -<childPid>` stops all of it.
const child = spawn(commandWords.map(quoteIfSpaced).join(' '), {
  cwd: runDir,
  shell: true,
  stdio: ['ignore', stdoutFile, stderrFile],
  detached: process.platform !== 'win32',
});
fs.writeFileSync(`${exitFile}.child`, String(child.pid));

child.on('exit', (code, signal) => {
  // Written under another name and then renamed, so check-clean-start.js never reads a half-written exit file.
  fs.writeFileSync(`${exitFile}.tmp`, JSON.stringify({ code, signal }));
  fs.renameSync(`${exitFile}.tmp`, exitFile);
  process.exit(0);
});
