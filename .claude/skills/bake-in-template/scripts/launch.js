// Usage: node .claude/skills/bake-in-template/scripts/launch.js <runDir> <logFile> <errFile> <exitFile> <command...>
// Starts <command> in <runDir> through the shell and writes {code, signal} to <exitFile> when it exits.
const { spawn } = require('child_process');
const fs = require('fs');

const [runDir, logFile, errFile, exitFile, ...commandWords] = process.argv.slice(2);
const stdoutFile = fs.openSync(logFile, 'a');
const stderrFile = fs.openSync(errFile, 'a');

// On Linux/macOS, `detached` puts the command in its own process group, so `kill -- -<childPid>` stops all of it.
const child = spawn(commandWords.join(' '), {
  cwd: runDir,
  shell: true,
  stdio: ['ignore', stdoutFile, stderrFile],
  detached: process.platform !== 'win32',
});
fs.writeFileSync(`${exitFile}.child`, String(child.pid));

child.on('exit', (code, signal) => {
  fs.writeFileSync(exitFile, JSON.stringify({ code, signal }));
  process.exit(0);
});
