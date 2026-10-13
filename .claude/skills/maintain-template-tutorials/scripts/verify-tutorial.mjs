#!/usr/bin/env node
// Walks the "Creating a template" tutorials the way a reader does: builds the
// template project step by step from the code blocks in the markdown, runs the
// commands the tutorial tells the reader to run, and checks the result.
//
// Usage: node verify-tutorial.mjs <python|java|all> [--broker local|public]
//        [--keep] [--workdir DIR] [--cli-version X] [--timeout SECONDS]
//
// --broker local (default) follows the tutorials' note for a local broker:
// every test.mosquitto.org in the code becomes localhost. It uses the broker
// already listening on localhost:1883, or starts the tutorials' Mosquitto
// container. --broker public uses test.mosquitto.org as written.
//
// Needs: node + npm (npx), python3, docker (used for gradle when no local
// gradle/java), network access to npm (and test.mosquitto.org with public).

import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
const DOCS = path.join(REPO, 'apps/generator/docs');
const PUBLIC_BROKER = 'test.mosquitto.org';
const LABEL = 'asyncapi-tutorial-verify';

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(name);
  return i === -1 ? def : args[i + 1];
};
const target = args[0];
const KEEP = args.includes('--keep');
const BROKER_MODE = flag('--broker', 'local');
const BROKER = BROKER_MODE === 'public' ? PUBLIC_BROKER : 'localhost';
const CLI_VERSION = flag('--cli-version', 'latest');
const TIMEOUT = Number(flag('--timeout', '300')) * 1000;
const WORK = path.resolve(flag('--workdir', fs.mkdtempSync(path.join(os.tmpdir(), 'tutorial-verify-'))));

if (!['python', 'java', 'all'].includes(target) || !['local', 'public'].includes(BROKER_MODE)) {
  console.error('Usage: node verify-tutorial.mjs <python|java|all> [--broker local|public] [--keep] [--workdir DIR] [--cli-version X] [--timeout SECONDS]');
  process.exit(2);
}

// ---------- markdown block extraction ----------

function blocks(file) {
  const md = fs.readFileSync(path.join(DOCS, file), 'utf8');
  const re = /^([ \t]*)```[ ]?(\w*)[^\n]*\n([\s\S]*?)^\1```/gm;
  const out = [];
  let m;
  while ((m = re.exec(md))) {
    const indent = m[1].length;
    const body = m[3].split('\n').map((l) => l.slice(Math.min(indent, l.length - l.trimStart().length))).join('\n');
    out.push({ lang: m[2], body });
  }
  return out;
}

// Selects exactly one block. A failed match means the tutorial changed shape:
// update the selector in this script, do not loosen it until it matches anything.
function pick(all, desc, langs, ...tests) {
  const hits = all.filter((b) => langs.includes(b.lang) && tests.every((t) => (typeof t === 'string' ? b.body.includes(t) : t(b.body))));
  if (hits.length !== 1) throw new Error(`selector "${desc}" matched ${hits.length} code blocks, expected 1`);
  return hits[0].body.replaceAll(PUBLIC_BROKER, BROKER);
}
const not = (s) => (b) => !b.includes(s);

// ---------- process helpers ----------

const log = (...a) => console.log(...a);
const results = [];
function check(name, ok, detail = '') {
  results.push({ name, ok });
  log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `\n      ${detail.replace(/\n/g, '\n      ')}` : ''}`);
  return ok;
}

// The venv bin dir goes on PATH so `python` (as the tutorial writes it) is the
// venv interpreter with paho-mqtt 1.6.1. A symlink would not activate the venv.
// PYTHONUNBUFFERED: piped stdout is block-buffered; a reader's terminal is not.
function env(binDir) {
  return { ...process.env, PYTHONUNBUFFERED: '1', PATH: `${binDir}:${path.join(WORK, 'venv/bin')}:${process.env.PATH}`, npm_config_yes: 'true' };
}

function run(cmd, cwd, binDir) {
  const r = spawnSync('bash', ['-c', cmd], { cwd, env: env(binDir), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
}

function start(cmd, cwd, binDir) {
  const p = spawn('bash', ['-c', cmd], { cwd, env: env(binDir), detached: true });
  const st = { out: '', p };
  p.stdout.on('data', (d) => { st.out += d; });
  p.stderr.on('data', (d) => { st.out += d; });
  return st;
}

function stop(st) {
  try { process.kill(-st.p.pid, 'SIGTERM'); } catch { /* already gone */ }
  spawnSync('bash', ['-c', `docker ps -q --filter label=${LABEL} | xargs -r docker rm -f`], { stdio: 'ignore' });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Runs a client that loops forever (the tutorials' test programs do) next to an
// `mqtt sub` subscriber, until every topic has at least `want` IDs that the
// client printed AND the broker delivered, or until the timeout.
async function runAgainstBroker(name, cmd, cwd, binDir, topics, linePattern, want = 2) {
  // MQTT 3.1.1 (-V 4): the public broker resets MQTT 5 connections. The broker
  // also resets some connections at random and `mqtt sub` exits on that, so
  // restart it, with a pause: fast reconnects get throttled.
  const sub = start(`while true; do npx --yes mqtt@5 sub -V 4 -h ${BROKER} ${topics.map((t) => `-t ${t}`).join(' ')} -v; sleep 5; done`, cwd, binDir);
  await sleep(5000); // let the subscriber connect before the first publish
  const client = start(cmd, cwd, binDir);
  const deadline = Date.now() + TIMEOUT;
  let confirmed = {};
  while (Date.now() < deadline) {
    await sleep(2000);
    const printed = [...client.out.matchAll(linePattern)].map((m) => ({ id: m[1], topic: m[2] }));
    const delivered = new Set(sub.out.split('\n').map((l) => l.trim()));
    confirmed = Object.fromEntries(topics.map((t) => [t, printed.filter((x) => x.topic === t && delivered.has(`${t} ${x.id}`)).length]));
    if (topics.every((t) => confirmed[t] >= want)) break;
    if (client.p.exitCode !== null) break;
  }
  stop(client);
  stop(sub);
  const ok = topics.every((t) => confirmed[t] >= want);
  return check(name, ok, ok
    ? `broker delivered the printed IDs: ${JSON.stringify(confirmed)}`
    : `confirmed per topic: ${JSON.stringify(confirmed)}\n--- client output (tail) ---\n${client.out.slice(-2500)}\n--- subscriber output (tail) ---\n${sub.out.slice(-800)}`);
}

// ---------- shared tool setup ----------

function setupBin() {
  const bin = path.join(WORK, 'bin');
  fs.rmSync(bin, { recursive: true, force: true });
  fs.mkdirSync(bin, { recursive: true });
  // The tutorials call a global `asyncapi`; route it through npx instead.
  fs.writeFileSync(path.join(bin, 'asyncapi'), `#!/usr/bin/env bash\nexec npx --yes @asyncapi/cli@${CLI_VERSION} "$@"\n`, { mode: 0o755 });

  const haveGradle = spawnSync('bash', ['-c', 'command -v gradle && java -version'], { stdio: 'ignore' }).status === 0;
  if (BROKER_MODE === 'local') startLocalBroker(bin);
  if (!haveGradle) {
    // With a local broker, Gradle shares the network of a socat container that
    // forwards localhost:1883 to the host, so `localhost` in the Java code works.
    const net = BROKER_MODE === 'local' ? `--network container:${LABEL}-fwd` : '';
    fs.writeFileSync(path.join(bin, 'gradle'), `#!/usr/bin/env bash
exec docker run --rm --init --label ${LABEL} ${net} -v "$PWD":/w -v ${LABEL}-gradle-cache:/home/gradle/.gradle -w /w gradle:8.10-jdk17 gradle "$@"
`, { mode: 0o755 });
  }

  const venv = path.join(WORK, 'venv');
  if (!fs.existsSync(venv)) {
    const r = run(`python3 -m venv "${venv}" && "${venv}/bin/pip" -q install paho-mqtt==1.6.1`, WORK, bin);
    if (r.code !== 0) throw new Error(`python venv setup failed:\n${r.out}`);
  }

  const ver = run('asyncapi --version', WORK, bin);
  log(`broker: ${BROKER}  |  asyncapi CLI: ${ver.out.trim().split('\n').pop()}  |  gradle: ${haveGradle ? 'local' : 'docker gradle:8.10-jdk17'}  |  workdir: ${WORK}`);
  return bin;
}

function startLocalBroker(bin) {
  const listening = () => spawnSync('nc', ['-z', '-w', '2', 'localhost', '1883']).status === 0;
  if (listening()) {
    log('broker: using the broker already listening on localhost:1883');
  } else {
    // The command from the tutorials' local broker note, plus a cleanup label.
    const r = run(`docker run -d --label ${LABEL}-broker --name ${LABEL}-mosquitto -p 1883:1883 eclipse-mosquitto`, WORK, bin);
    spawnSync('sleep', ['3']);
    if (r.code !== 0 || !listening()) throw new Error(`could not start the local Mosquitto broker:\n${r.out}`);
    log('broker: started the tutorials\' eclipse-mosquitto container on localhost:1883');
  }
  run(`docker rm -f ${LABEL}-fwd >/dev/null 2>&1; docker run -d --rm --label ${LABEL}-fwd --name ${LABEL}-fwd alpine/socat tcp-listen:1883,fork,reuseaddr tcp-connect:host.docker.internal:1883`, WORK, bin);
}

function stopLocalBroker() {
  spawnSync('bash', ['-c', `docker rm -f ${LABEL}-fwd ${LABEL}-mosquitto`], { stdio: 'ignore' });
}

const write = (dir, file, content) => {
  fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true });
  fs.writeFileSync(path.join(dir, file), content);
};
const read = (dir, file) => fs.readFileSync(path.join(dir, file), 'utf8');
const generated = (r) => r.code === 0 && r.out.includes('Check out your shiny new generated files');

// Swaps the channels/operations part of a full AsyncAPI document for a snippet
// that holds only those sections (the "update AsyncAPI document" steps).
function replaceChannels(doc, snippet) {
  return `${doc.slice(0, doc.indexOf('\nchannels:') + 1)}${snippet.trimEnd()}\n\n${doc.slice(doc.indexOf('\ncomponents:') + 1)}`;
}

// ---------- Python tutorial (generator-template.md) ----------

async function python(bin) {
  log('\n=== Creating a template - Python (generator-template.md) ===');
  const b = blocks('generator-template.md');
  const dir = path.join(WORK, 'python-mqtt-client-template');
  fs.rmSync(dir, { recursive: true, force: true });
  const sh = (cmd) => run(cmd, dir, bin);
  const compiles = () => sh('python -m py_compile test/project/client.py');

  // Overview + package.json + index.js + "Test using AsyncAPI CLI"
  write(dir, 'test/fixtures/asyncapi.yml', pick(b, 'background AsyncAPI document', ['yml', 'yaml'], (s) => s.trimStart().startsWith('asyncapi:')));
  write(dir, 'package.json', pick(b, 'first package.json', ['json'], '"name": "python-mqtt-client-template"', not('"scripts"')));
  write(dir, 'template/index.js', pick(b, 'title-only index.js', ['js'], 'asyncapi.info().title()}</File>'));
  let r = sh('npm install --no-audit --no-fund');
  if (!check('npm install', r.code === 0, r.code ? r.out.slice(-1500) : '')) return;
  r = sh('asyncapi generate fromTemplate test/fixtures/asyncapi.yml ./ -o test/project');
  check('first generate: client.py holds the title', generated(r) && read(dir, 'test/project/client.py').trim() === 'Temperature Service', r.out.slice(-1500));

  // 1-4: client code in the template, test.py, npm scripts
  write(dir, 'template/index.js', pick(b, 'index.js with hardcoded client', ['js'], 'export default', 'mqttBroker = "test.mosquitto.org"'));
  write(dir, 'test/project/test.py', pick(b, 'test.py', ['python'], 'from client import'));
  write(dir, 'package.json', pick(b, 'package.json with scripts', ['json'], '"scripts"', 'python-mqtt-client-template'));
  const changed = /detected (\d+) sent to (\S+)/g;
  await runAgainstBroker('step 4: npm test publishes to temperature/changed', 'npm test', dir, bin, ['temperature/changed'], changed);

  // 5a: server parameter. The tutorial shows fragments, not whole files.
  const pkg = JSON.parse(read(dir, 'package.json'));
  const genFragment = pick(b, 'parameters fragment', ['json'], '"parameters"', '"server"', not('"name"'));
  pkg.generator.parameters = JSON.parse(`{${genFragment.split('\n').filter((l) => !l.trim().startsWith('#')).join('\n')}}`).generator.parameters;
  Object.assign(pkg.scripts, JSON.parse(`{${pick(b, 'test:generate fragment', ['json'], (s) => s.trimStart().startsWith('"test:generate"'))}}`));
  write(dir, 'package.json', JSON.stringify(pkg, null, 2));
  r = sh('asyncapi generate fromTemplate test/fixtures/asyncapi.yml ./ --output test/project --force-write');
  check('5a: generate without --param server fails with the documented error', r.code !== 0 && r.out.includes('missing params: server'), r.out.slice(-800));
  write(dir, 'template/index.js', pick(b, '5a index.js', ['js'], 'export default', '${asyncapi.servers().get(params.server).host()}'));
  await runAgainstBroker('5a: npm test with the server parameter', 'npm test', dir, bin, ['temperature/changed'], changed);

  // 5b: React Text components. The tutorial runs no test here; check the output only.
  write(dir, 'template/index.js', pick(b, '5b index.js', ['js'], 'export default', '<Text', not('TopicFunction')));
  r = sh('npm run test:generate');
  const out5b = generated(r) ? read(dir, 'test/project/client.py') : '';
  check('5b: generated client.py compiles and has no stray template comments', generated(r) && compiles().code === 0 && !/^\s*\/\/ \d/m.test(out5b), out5b || r.out.slice(-800));

  // 5c: TopicFunction component
  write(dir, 'components/TopicFunction.js', pick(b, 'TopicFunction component', ['js'], 'export function TopicFunction'));
  write(dir, 'template/index.js', pick(b, 'final index.js', ['js'], 'export default', 'import { TopicFunction }'));
  await runAgainstBroker('5c: npm test with TopicFunction', 'npm test', dir, bin, ['temperature/changed'], changed);

  // 5d: two channels
  write(dir, 'test/fixtures/asyncapi.yml', replaceChannels(read(dir, 'test/fixtures/asyncapi.yml'), pick(b, '5d channels', ['yml', 'yaml'], (s) => s.trimStart().startsWith('channels:'))));
  const loop = pick(b, '5d test.py loop body', ['py'], 'sendTemperatureDrop');
  const test = read(dir, 'test/project/test.py').replace(/^ *client\.sendTemperatureChange.*\n *print\(.*\n/m, `${loop.replace(/\n*$/, '\n')}`);
  write(dir, 'test/project/test.py', test);
  await runAgainstBroker('5d: npm test publishes to dropped and risen', 'npm test', dir, bin, ['temperature/dropped', 'temperature/risen'], changed);
  check('5d: generated client.py compiles', compiles().code === 0);
}

// ---------- Java tutorial (generator-template-java.md) ----------

async function java(bin) {
  log('\n=== Creating a template - Java (generator-template-java.md) ===');
  const b = blocks('generator-template-java.md');
  const pyDoc = blocks('generator-template.md');
  const dir = path.join(WORK, 'java-mqtt-client-template');
  fs.rmSync(dir, { recursive: true, force: true });
  const sh = (cmd) => run(cmd, dir, bin);
  const changed = /detected (\d+) sent to (\S+)/g;

  // 1: the tutorial tells the reader to reuse the Python tutorial's document.
  write(dir, 'src/fixtures/asyncapi.yml', pick(pyDoc, 'Python background AsyncAPI document', ['yml', 'yaml'], (s) => s.trimStart().startsWith('asyncapi:')));
  write(dir, 'package.json', pick(b, 'first package.json', ['json'], '"name": "java-mqtt-client-template"', not('"scripts"')));
  write(dir, 'template/index.js', pick(b, 'title-only index.js', ['js'], 'asyncapi.info().title()}</File>'));
  let r = sh('npm install --no-audit --no-fund');
  if (!check('npm install', r.code === 0, r.code ? r.out.slice(-1500) : '')) return;
  r = sh('asyncapi generate fromTemplate src/fixtures/asyncapi.yml ./ --output src/main/java');
  check('1: first generate: Client.java holds the title', generated(r) && read(dir, 'src/main/java/Client.java').trim() === 'Temperature Service', r.out.slice(-1500));

  // 2: Gradle + hand-written Client.java
  write(dir, 'build.gradle', pick(b, 'build.gradle', ['groovy']));
  write(dir, 'src/main/java/Client.java', pick(b, 'hand-written Client.java', ['java'], 'public class Client'));
  r = sh('gradle build');
  check('2: gradle build', r.code === 0, r.code ? r.out.slice(-2000) : '');

  // 3: TestClient.java
  write(dir, 'src/main/java/TestClient.java', pick(b, 'first TestClient.java', ['java'], 'sendTemperatureChange(String.valueOf'));
  await runAgainstBroker('3: gradle run -PmainClass=TestClient publishes to temperature/changed', 'gradle run -PmainClass=TestClient', dir, bin, ['temperature/changed'], changed);

  // 4: template with the client code + npm scripts
  write(dir, 'template/index.js', pick(b, 'index.js with hardcoded client', ['js'], 'export default', 'tcp://test.mosquitto.org:1883'));
  write(dir, 'package.json', pick(b, 'package.json with scripts', ['json'], '"scripts"'));
  await runAgainstBroker('4a: npm test publishes to temperature/changed', 'npm test', dir, bin, ['temperature/changed'], changed);

  // 5a: TopicFunction component, still against the one-channel document
  write(dir, 'components/TopicFunction.js', pick(b, 'TopicFunction component', ['js'], 'export function TopicFunction'));
  write(dir, 'template/index.js', pick(b, 'final index.js', ['js'], 'export default', 'import { TopicFunction }'));
  r = sh('npm run test:clean && npm run test:generate && gradle build');
  check('5a: final template builds against the one-channel document', r.code === 0 && read(dir, 'src/main/java/Client.java').includes('sendTemperatureChange'), r.out.slice(-2000));

  // 5b + 5c: two-channel document and the new TestClient.java
  write(dir, 'src/fixtures/asyncapi.yml', pick(b, '5b AsyncAPI document', ['yaml', 'yml'], (s) => s.trimStart().startsWith('asyncapi:')));
  write(dir, 'src/main/java/TestClient.java', pick(b, 'second TestClient.java', ['java'], 'sendTemperatureDrop(String.valueOf'));
  await runAgainstBroker('5c: npm test publishes to dropped and risen', 'npm test', dir, bin, ['temperature/dropped', 'temperature/risen'], changed);
}

// ---------- main ----------

let bin;
try {
  bin = setupBin();
  if (target === 'python' || target === 'all') await python(bin);
  if (target === 'java' || target === 'all') await java(bin);
} catch (e) {
  check('harness', false, e.stack || String(e));
}
stopLocalBroker();
const failed = results.filter((x) => !x.ok);
log(`\n${results.length - failed.length}/${results.length} checks passed${failed.length ? `; failed: ${failed.map((x) => x.name).join(' | ')}` : ''}`);
if (!KEEP && !failed.length) fs.rmSync(WORK, { recursive: true, force: true });
else log(`workdir kept: ${WORK}`);
process.exit(failed.length ? 1 : 0);
