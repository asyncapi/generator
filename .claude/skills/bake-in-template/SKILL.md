---
name: bake-in-template
description: Bake an existing standalone AsyncAPI generator template repository (Nunjucks or React engine) into this repo as a baked-in client or server template under packages/templates, ported to the React engine and the v3 Parser API, with any functional changes the user asks for. Use when the user gives a template repository URL and asks to bake it in, bring it into the generator, port or migrate it into the monorepo, or make it a core or baked-in template. Do not use for porting a feature between existing baked-in clients (port-client-component), sharing a component (migrate-component), adding a template type (add-template-type), or docs, config and sdk templates.
---

# Bake an External Template into the Generator

You are turning a standalone AsyncAPI generator template repository into a baked-in template under `packages/templates/clients/` or `packages/templates/servers/`. The new template uses the React engine and the v3 Parser API. It ports the old template's functionality and applies the functional changes the user asks for in Wave 0 (none for a straight port).

The old template's output is captured as **reference material** for the translators. It is never a target, and the new template is not compared against it. Real commands and the user decide when the run is done:

1. build, lint, the import gate and jest pass;
2. the project generated through the baked-in template name installs and starts cleanly in its own run directory, from an AsyncAPI document the user picks, and every change's verification command passes;
3. the user confirms that it works (`Q-does-it-work`).

Only the user can waive 2 and 3, by "accept as-is" at `Q-iterations-used-up` or "Skip the smoke run" at `Q-start-failed`, and the report then says so. Your opinion never decides it. Only report what you saw in tool output.

Read before executing: [AGENTS.md](../../../AGENTS.md) sections 2.5 and 4.7, the [Baked-in Templates guide](../../../apps/generator/docs/baked-in-templates.md), the "Assumptions and Principles" section of [packages/README.md](../../../packages/README.md), the [WebSocket test README](../../../packages/templates/clients/websocket/test/README.md), and [contract.md](contract.md).

## How this skill runs

You are the orchestrator. You own the run variables, every question, `state.json`, `source-index.json`, `inventory.json`, every gate, and every write into `TARGET_PATH` and `packages/helpers/` after Wave 2a, except `test-wirer`'s tests in Wave 3. Specialist work goes to general-purpose subagents, each following one instruction file in `agents/`:

| Agent | Instructions | Wave | Writes |
|---|---|---|---|
| capturer | [agents/capturer.md](agents/capturer.md) | 1 | `golden/`, `capture.json` |
| api-mapper | [agents/api-mapper.md](agents/api-mapper.md) | 1 | `api-map.json` |
| scaffolder | [agents/scaffolder.md](agents/scaffolder.md) | 1 | `TARGET_PATH/package.json`, `.ageneratorrc`, `jest.config.js` |
| translator | [agents/translator.md](agents/translator.md) | 2a, 2b, fixes | `packages/helpers/src/` and `TARGET_PATH/components/` (mode `2a`); `staging/<rowId>/` (modes `2b`, `fix`) |
| test-wirer | [agents/test-wirer.md](agents/test-wirer.md) | 3 | `SUITE_PATH`, fixtures, `TARGET_PATH/test/`, `packages/helpers/test/` |
| smoke-runner | [agents/smoke-runner.md](agents/smoke-runner.md) | 4 | `RUNS_DIR/run-<n>/`, `RUNS_DIR/run-<n>.json`, `RUNS_DIR/run-<n>.log` |

**Spawning rule.** Spawn each agent with the `Agent` tool, `subagent_type: general-purpose`. The prompt has exactly three parts:

1. the run-variable table below, with the current values;
2. `Read .claude/skills/bake-in-template/agents/<agent>.md and .claude/skills/bake-in-template/contract.md, then do the task below.`;
3. the task inputs: file paths and ids, never file contents.

Spawn the agents of one wave in one message, so they run in parallel. Each returns the envelope from `contract.md`; bulk data stays in files.

**Waves.**

```
Wave 0   orchestrator: previous-run check (Q-previous-run) · clean working tree · clone · preconditions (Q-engine) · installs · source-index.json · Q-role, Q-target-path, Q-capture-doc, Q-capture-params, Q-what-to-change, Q-confirm-changes, Q-template-author, Q-config-mapping · changes.md · summary
Wave 1   capturer ∥ api-mapper ∥ scaffolder (writes files only)
         orchestrator: scaffold gate (root npm install + BUILD) · inventory.json · Q-uncovered-files/Q-parser-gap/Q-test-folder if needed
Wave 2a  translator (all shared rows) ∥ orchestrator copies and wraps static files
Wave 2b  translator × N (one per remaining row, into staging/) → merge: collisions (Q-file-collision), dependencies (Q-dependency-range, Q-new-dependency) → root npm install
Wave 3   BUILD → test-wirer → lint → import gate → tests → test coverage
Wave 4   Q-smoke-doc → Q-smoke-params → generate by BAKED_IN_NAME → smoke-runner (start + verifications) → Q-start-failed if unclean · Q-does-it-work → stop PID → fixes (≤3 iterations)
Final    root npm install · BUILD · lint · import gate · tests (CI=true) · ignored-files check · changeset · report.md
```

Rewrite `state.json` after every wave and every question.

**Bundled scripts.** Every script a step runs is in [scripts/](scripts/). Run it with `node` from the repo root, exactly as the step gives it. Never copy a script into `SCRATCH_DIR` or rewrite it. Each script's first line documents its arguments and its output.

**Cleanup.** `SCRATCH_DIR` is scratch space. Each step deletes what no later step reads, and Final leaves only `report.md`:

| What | Deleted when |
|---|---|
| `generator-versions.json` | Wave 0 step 4, once `pick-generator-version.js` has read it |
| `staging/<rowId>/` | right after that row is merged (Wave 2b step 2, and every fix merge) |
| `tmp/<agent>[-<id>]/`, an agent's own throwaway scripts | by that agent, before it returns |
| `RUNS_DIR/run-<n>/`, a generated project with its `node_modules` | before the next run is generated (Wave 4 step 2) |
| everything else, `state.json` included | Final cleanup |

Delete only through the bundled script, never with `rm -rf` or `Remove-Item`:

```bash
node .claude/skills/bake-in-template/scripts/clean.js <path>...
node .claude/skills/bake-in-template/scripts/clean.js --keep <dir> <name>...
```

The first form deletes each path; the second deletes everything in `<dir>` except the named entries. It refuses any path outside `temp/bake-in-template/`, removes the read-only `.git` pack files that make a plain delete fail on Windows, and retries a file a just-stopped process still holds. Delete a run directory only after its process is stopped (rule 4). If the script exits 1, show the paths it printed as `failed:` and go on; a leftover scratch file never blocks the run.

**Build command.** `BUILD` means `(cd apps/generator && npm run build)`. It runs `scripts/build-templates.js`, which:
- rewrites every template's `.ageneratorrc` metadata and `package.json` `name`;
- copies each template into `apps/generator/lib/templates/bakedInTemplates/`;
- rewrites the tracked `apps/generator/lib/templates/BakedInTemplatesList.json`.

It needs `apps/react-sdk/lib/` and `packages/components/lib/`, which precondition 9 builds.

**Design decisions.** These hold for every run:

- **Static JS becomes a verbatim wrapper component**, not a raw file under `nonRenderableFiles`. The React engine renders every `.js`, `.jsx` and `.cjs` file under `template/` as a component. A raw copy of the source's static JS would also have to pass the root lint, and fixing a lint finding would change the generated code. A wrapper written by `wrap-static.js` (Wave 2a) reproduces the file byte for byte, with line endings normalized to LF, and passes the root lint. So the source's `nonRenderableFiles` is dropped: the generator never renders non-JS files anyway, and a glob such as `src/lib/*.js` would also match the wrapper `utils.js.js`, which would then be copied raw as JSX.
- **`--no-eslintrc` is required** in the template's lint scripts when the source `template/` ships `.eslintrc*` files. Without the flag, ESLint 6.8 cascades that config, which was written for the generated project, onto the template's own code. With it, the root config passed through `--config` still applies in full.
- **A process started by a subagent survives the subagent.** So `smoke-runner` leaves the project running for `Q-does-it-work`, and the orchestrator stops it later by its recorded PID (rule 4). On Windows, `taskkill /PID <pid> /T /F` stops its whole process tree. Only the Windows path has been confirmed; the Linux and macOS path (`nohup`, process groups, `kill -- -<pid>`) is untested.
- **The smoke run happens inside the repo** (`RUNS_DIR`). A run directory outside the repo could catch a dependency the generated `package.json` forgot, but Node resolves packages from every ancestor `node_modules`, so a directory elsewhere (such as the system temp folder) isn't guaranteed to be isolated either. So the run stays under `temp/`, and the accepted risk is that the repo's hoisted `node_modules` can hide a missing dependency. To offset it, `smoke-runner` lists the bare packages the generated code requires that its `package.json` doesn't declare, and `Q-does-it-work` shows that list.

## Invocation

The user gives the source repository URL. It's required; if it's missing, ask for it via `AskUserQuestion`. Everything else comes from the source, the repo, or the questions below.

## Run variables

Pass this table, with the current values, to every agent. Commands run from the repo root, and paths are repo-relative.

The examples describe a hypothetical Nunjucks HTTP server template baked in as `servers/http/javascript`. No HTTP template exists in the repo.

| Variable | Meaning | Example |
|---|---|---|
| `SOURCE_URL` | the source repository URL | `https://github.com/<org>/<repo>` |
| `SOURCE_NAME` | the last URL path segment, without `.git` | `<repo>` |
| `SCRATCH_DIR` | `temp/bake-in-template/<SOURCE_NAME>`, gitignored like every `temp` directory. Holds the clone, the handoff files, the golden output and `state.json` | `temp/bake-in-template/<repo>` |
| `RUNS_DIR` | `SCRATCH_DIR/runs`, where the orchestrator generates each project and `smoke-runner` installs and starts it. It sits inside the repo, so the project can also resolve the repo's hoisted `node_modules`: a dependency missing from the generated `package.json` may go unnoticed (accepted risk, see "Design decisions") | `temp/bake-in-template/<repo>/runs` |
| `ENGINE` | `nunjucks` or `react`, from the source config's `renderer`, its `generator` range, or `Q-engine` (precondition 3) | `nunjucks` |
| `SOURCE_API_VERSION` | `source-index.json` `apiVersion`, the source config's `apiVersion`: `none`, `v1`, `v2` or `v3` (precondition 5) | `none` |
| `DETECTED_PROTOCOL` | `source-index.json` `detectedProtocol` (precondition 5): the protocol folder for `config.supportedProtocols[0]`, or `null`. An alias maps to the repo's folder (e.g. `ws` → `websocket`, `kafka-secure` → `kafka`); the full list is in `contract.md`. Only seeds `Q-target-path` | `http` (from `https`) |
| `CAPTURE_GENERATOR_VERSION` | derived from the source's `generator` range (precondition 4) | the highest published `2.x` that satisfies the range |
| `ROLE` | `client` or `server` (`Q-role`): what the generated project is | `server` |
| `PROTOCOL` | the protocol segment of `TARGET_SEGMENTS` | `http` |
| `TARGET_SEGMENTS` | the path under `packages/templates/` (`Q-target-path`): `<type>/<protocol>/<target>[/<stack>]` | `servers/http/javascript` |
| `TARGET_PATH` | `packages/templates/<TARGET_SEGMENTS>` | `packages/templates/servers/http/javascript` |
| `FIXTURES` | the capture fixtures, as local paths (`Q-capture-doc`) | `temp/bake-in-template/<repo>/source/test/fixtures/asyncapi.yml` |
| `CAPTURE_PARAMS` | template parameters for the capture (`Q-capture-params`) | `{"server":"<server id>"}` |
| `CHANGES` | `SCRATCH_DIR/changes.md`, or `none` for a straight port | `none` |
| `AUTHOR` | the `author` of the new template's `package.json` (`Q-template-author`) | `<name> <<email>>` |
| `BAKED_IN_NAME` | `core-template-<type value>-<protocol>-<target>[-<stack>]`, lowercased, built the way `getTemplateName` in `apps/generator/scripts/build-templates.js` builds it. `<type value>` is the `type:` of the `TEMPLATE_TYPES` row whose `dir:` is the first segment | `core-template-server-http-javascript` |
| `SUITE_PATH` | `packages/templates/<type>/<protocol>/test/integration-test` | `packages/templates/servers/http/test/integration-test` |
| `SUITE_EXISTS` | whether `SUITE_PATH` exists | `false` |
| `INTEGRATION_KEY` | the segments after the protocol, joined with `-` | `javascript` (`java/quarkus` → `java-quarkus`) |
| `SCAFFOLD_BASE` | a template under `packages/templates/<type>/<protocol>/` if one exists, else `packages/templates/clients/websocket/javascript` | `packages/templates/clients/websocket/javascript` (no HTTP server template exists yet) |
| `GENERATOR_DEPS` | the `dependencies` keys of `apps/generator/package.json`. Template code may import only these, Node builtins and relative paths: baked-in templates are never installed, and they resolve bare imports from the generator's own `node_modules` | `@asyncapi/generator-components, @asyncapi/generator-helpers, …` |
| `SMOKE_DOC`, `SMOKE_PARAMS` | the Wave 4 document and parameters (`Q-smoke-doc`, `Q-smoke-params`). `SMOKE_DOC` is the document the user gives at `Q-smoke-doc`; a fallback fixture only when the user gives none | `<path to the user's document>`, `{"server":"<server id>"}` |
| `RUN_COMMAND` | `npm start` when the generated `package.json` has a `start` script, else the `Q-start-command` answer | `npm start` |
| `ITERATIONS` | Wave 4 fix iterations used, max 3 | `0` |

`TARGET_SEGMENTS` is the single source of every protocol-dependent value: `TARGET_PATH`, `PROTOCOL`, `SUITE_PATH`, `INTEGRATION_KEY`, `BAKED_IN_NAME`, `SCAFFOLD_BASE` and the `Q-smoke-doc` fallbacks. `DETECTED_PROTOCOL` only proposes `Q-target-path`'s answer and feeds the protocol-mismatch check.

## Run state and rules

`SCRATCH_DIR/state.json` holds:
- `completedWave`;
- the variables;
- every question with its answer;
- `iterations` and `gateAttempts`;
- `runningPids[]`.

Its shape is in `contract.md`. It lets precondition 0 find an interrupted run, and abort cleanup find the processes to stop. Take every timestamp from `node -e "console.log(new Date().toISOString())"`, never from memory.

1. **Ask only what neither the repo nor the source answers.** Apply any value that a repo convention or the source config decides, and show it in the Wave 0 summary instead of asking. Examples: the suite location, and whether to have a suite at all (always yes); the `package.json` base; which hooks to keep (the source's); the capture generator version.
2. **Never apply a fallback silently.** When a value is only a best guess, ask. Make the guess the first option, marked "(Recommended)", and cite the evidence in the question.
3. **How to ask.** Use `AskUserQuestion`, at most 4 questions per call. The user may see only the dialog, so each question repeats the detected value and its evidence. Record every question and answer in `state.json` `questions[]`.

   Every question has a name, `Q-<what it asks>` (e.g. `Q-role`), used as its `id` in `state.json` and in every reference to it. A question defined once per item adds the item: `Q-config-mapping:<key>`.
4. **Verify a PID before stopping it.** A PID recorded earlier may belong to an unrelated process by now. Read the live command line and compare it with the recorded `commandLine`, both trimmed of surrounding whitespace (Windows adds a trailing space):
   - Windows: `powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter 'ProcessId=<pid>').CommandLine"`
   - elsewhere: `ps -o args= -p <pid>`

   On a match, stop the process:
   - Windows: `taskkill /PID <pid> /T /F` (`/T` also stops its child processes);
   - elsewhere: `kill -TERM -- -<childPid>; kill -TERM <pid>`, where `<childPid>` is in `RUNS_DIR/run-<n>.exit.child`.

   If they don't match, stop nothing, remove the entry and say so. In both cases, remove the entry from `runningPids[]`.
5. **Stop processes by PID only.** Never stop one by image name (`taskkill /IM node.exe`, `pkill node`): that kills unrelated Node processes on the user's machine.
6. **The run owns the working tree.** It starts from a clean working tree (precondition 0) and never commits. So every repo change it makes shows in `git status`, and abort cleanup can discard them all with one `git stash`, without tracking paths. `SCRATCH_DIR` is gitignored, so the stash never touches it.
7. **Bounded loops.** Wave 4 allows 3 fix iterations (`ITERATIONS`), and each Wave 3 and Final gate allows 3 fix attempts (`gateAttempts`). After that, ask `Q-iterations-used-up` or `Q-gate-attempts-used-up`.

## Preconditions (Wave 0)

Checks 1–3 stop and report at the first failure.

### 0. Previous run and clean working tree

A run never resumes: an interrupted run is discarded and started over.

If `SCRATCH_DIR/state.json` has `completedWave: "final"`, the previous run finished and only its Final cleanup was interrupted. Never offer to discard a finished run: its files may be committed by now. Run Final cleanup steps 1–2, then go on to the working-tree check below.

Otherwise, if `SCRATCH_DIR/state.json` exists, ask **`Q-previous-run`** before anything else:

> A previous bake-in run of `<SOURCE_NAME>` stopped after Wave `<completedWave>` on `<updatedAt>`, and can't be resumed. What should I do?

When `completedWave` is `"none"`, say "stopped during Wave 0" instead. Options:
- **Discard it and start over (Recommended):** run abort cleanup with "discard them" (see "Abort cleanup"), then delete the whole folder with `node .claude/skills/bake-in-template/scripts/clean.js <SCRATCH_DIR>`.
- **Abort:** stop, and change nothing.

Then check the working tree. This must print nothing:

```bash
git status --porcelain
```

If it prints anything, stop: ask the user to commit or stash those changes, ideally on a fresh branch for the template. The run starts only from a clean tree (rule 6).

### 1. Clone

```bash
git clone -c core.autocrlf=false --depth 1 <SOURCE_URL> <SCRATCH_DIR>/source
```

`core.autocrlf=false` keeps the upstream bytes, so the golden output and the verbatim wrappers see the same line endings.

Then write `state.json` with `completedWave: "none"`. From here on, precondition 0 finds a stopped run.

### 2. Is a template

The source has a `.ageneratorrc`, or its `package.json` has a `generator` block:

```bash
test -f <SCRATCH_DIR>/source/.ageneratorrc || grep -q '"generator" *:' <SCRATCH_DIR>/source/package.json
```

### 3. Engine

Find out whether the old template is written in Nunjucks or React. That decides `ENGINE`.

The old template says which engine it uses in the `renderer` setting of its config. The config is in `.ageneratorrc` (YAML) or in the `generator` block of `package.json`. If both exist, use `.ageneratorrc`.

| `renderer` | `ENGINE` |
|---|---|
| `nunjucks` | `nunjucks` |
| `react` | `react` |
| not set | decided by the `generator` range, below |
| any other value | stop: this skill handles only Nunjucks and React templates |

**`renderer` not set.** The generator version decides the engine: generator 2.x and older render such a template with Nunjucks, and 3.x renders only React. So check which versions the config's `generator` range allows (`*` when it has none):

```bash
node -e "console.log(require('semver').intersects(process.argv[1], '<3.0.0'))" "<range>"
node -e "console.log(require('semver').intersects(process.argv[1], '>=3.0.0'))" "<range>"
```

| Allows below 3.0.0 | Allows 3.0.0 and above | `ENGINE` |
|---|---|---|
| `true` | `false` | `nunjucks` |
| `false` | `true` | `react` |
| `true` | `true` | ask **`Q-engine`** |

**`Q-engine`:** "The old template doesn't set `renderer`, and its `generator` range `<range>` allows both 2.x (which renders it as Nunjucks) and 3.x (which renders only React). Which engine is it written for?" As a hint, say whether the source `package.json` depends on `@asyncapi/generator-react-sdk`. Options: Nunjucks · React.

### 4. Install source dependencies and the capture generator

```bash
(cd <SCRATCH_DIR>/source && npm install --omit=dev --ignore-scripts --no-audit --no-fund)
npm view @asyncapi/generator versions --json > <SCRATCH_DIR>/generator-versions.json
```

Resolve `CAPTURE_GENERATOR_VERSION` with the repo's `semver`. `<range>` is the source config's `generator` value, or `*` when it has none. The script prints the highest published version that satisfies `<range>`, and only 2.x for a Nunjucks source, because generator 3.0.0 removed Nunjucks:

```bash
node .claude/skills/bake-in-template/scripts/pick-generator-version.js <SCRATCH_DIR>/generator-versions.json "<range>" <ENGINE>
node .claude/skills/bake-in-template/scripts/clean.js <SCRATCH_DIR>/generator-versions.json
```

If the first command exits 1, stop and show its message: no published generator satisfies the range. The value is derived, not asked; show it in the Wave 0 summary and the report. Install it:

```bash
mkdir -p <SCRATCH_DIR>/oldgen
(cd <SCRATCH_DIR>/oldgen && npm init -y >/dev/null && npm install --ignore-scripts --no-audit --no-fund @asyncapi/generator@<CAPTURE_GENERATOR_VERSION>)
```

These installs run here, not inside a Wave 1 agent, for two reasons. `capturer` and `api-mapper` both read `SCRATCH_DIR/source/node_modules`, so installing from either agent would race the other. And the source index needs the Nunjucks built-in filter names from `SCRATCH_DIR/oldgen`.

### 5. Source index

Run:

```bash
node .claude/skills/bake-in-template/scripts/scan.js <SCRATCH_DIR> <ENGINE>
```

It writes `SCRATCH_DIR/source-index.json` (fields in `contract.md`) and prints a one-line summary. It resolves fixtures to local paths (a URL to a file of this repo becomes that repo path, any other URL is downloaded once to `SCRATCH_DIR/fixtures/`), reads `templateParams` passed as a variable, and finds included files anywhere in the source. Each `missing:` line names an include, fixture or parameter variable it couldn't find: show these in the Wave 0 summary. A missing fixture or parameter is covered by `Q-capture-doc` or `Q-capture-params`.

Set `SOURCE_API_VERSION` from its `apiVersion`, and `DETECTED_PROTOCOL` from its `detectedProtocol`.

#### The `fixture-info.js` script

This step, check 7, `Q-smoke-doc` and `test-wirer` use this script. It parses AsyncAPI documents the way the generator does for `apiVersion: v3` templates, including schema parsers such as Avro. Run it from the repo root with one or more files:

```bash
node .claude/skills/bake-in-template/scripts/fixture-info.js <file>...
```

It prints one JSON line per file, and exits 1 when any file fails to parse:

```json
{"file":"asyncapi.yml","version":"2.6.0","title":"Chat","send":2,"receive":1,"servers":["production"]}
{"file":"broken.yml","error":["<parser message>"]}
```

#### Usable capture documents

`testFixtures` holds every quoted `.yml`, `.yaml` or `.json` path in the source tests, so some entries may not be AsyncAPI documents at all. When it isn't empty, run `fixture-info.js` on all of its files. Keep the files that parse with a `version` allowed for `SOURCE_API_VERSION` (the table in `Q-capture-doc`): these are the usable fixtures `Q-capture-doc` offers. Here an `error` line, and the exit code 1 it causes, only means that file isn't usable.

### 6. Questions

Ask the questions in two rounds, once `source-index.json` exists. Each round is one `AskUserQuestion` call, which takes at most 4 questions. Put the recommended option first and mark it "(Recommended)".

```
Round 1:  Q-role · Q-target-path · Q-capture-doc (only if needed)
             └─ check the Q-capture-doc answer (step 8 check 7), re-ask Q-capture-doc alone until it passes
Round 2:  Q-capture-params · Q-what-to-change · Q-template-author · Q-config-mapping (only if any config keys)
             └─ Q-what-to-change described changes → Q-confirm-changes, repeated until "Correct" → write changes.md
```

#### Round 1: where the template goes and how to capture the old output

**`Q-role`: Is the generated project a server or a client?**
- Recommend the role the source README and files suggest, and quote the line that shows it.
- Options: that role · the other role.
- If the user answers neither (through Other, e.g. "a library" or "both"), stop. This skill bakes in only clients and servers.

**`Q-target-path`: Where should the new template live, under `packages/templates/`?**
- Recommend `<type>/<protocol>/<target>[/<stack>]`. The type is `clients` for a client and `servers` for a server; say that no other type is supported. Give the evidence, e.g. "the source declares `supportedProtocols: [\"ws\"]`".
- Check the path before you offer it, with step 8 checks 2–5: the repo supports the type, the path is new, its absolute path has no `test`, and no template sits above it. If it fails a check, try a different `target` or `stack` segment, and say why you skipped the first path (e.g. "`clients/websocket/javascript` already exists"). If nothing passes (e.g. a server, and the repo has no `servers` type), mark no option "(Recommended)" and say why.
- Options: the checked path · Other.
- The recommendation assumes the role `Q-role` recommends. If the user picks the other role, re-ask `Q-target-path` for that role.

**`Q-capture-doc`: Which AsyncAPI document should the old template run on, to capture its reference output?**
- Skip this question when step 5 found exactly one usable fixture, and use that fixture.
- Say which versions are allowed:

  | `SOURCE_API_VERSION` | Allowed documents |
  |---|---|
  | `none` or `v1` | 2.x only, because old templates reject 3.0 documents |
  | `v2` or `v3` | 2.x or 3.x |
- Options: the usable fixtures from step 5 · an existing repo fixture of an allowed version · Other (path or URL).
- Before Round 2, resolve the answer to a local path (a URL to a file of this repo becomes that repo path; any other URL is downloaded once to `SCRATCH_DIR/fixtures/<basename>`) and run step 8 check 7 on it. If it fails, re-ask `Q-capture-doc` on its own. `Q-capture-params` needs the settled document.

#### Round 2: capture parameters, what should change, and the author

**`Q-capture-params`: Which template parameters should the capture use?**
- List every required parameter that has no default, with the detected value and where it came from: `testParams`, or, for a `server` parameter, the `servers` ids that `fixture-info.js` prints for `FIXTURES`.
- Options: the detected values · Other (edit).
- Step 8 check 8 checks the answer. Whenever `Q-capture-doc` is answered again, ask `Q-capture-params` again.

**`Q-what-to-change`: What do you want to change in the template's functionality?**
- Start with one line on what the old template generates, from its README and `source-index.json`, e.g. "a `<language>` `<protocol>` `<role>` with one handler per channel, plus a README and a Dockerfile".
- Options: No changes, straight port (Recommended) · Other (describe the changes).

**`Q-template-author`: Who should be the `author` in the new template's `package.json`?**
- Always ask. Quote the source `package.json` `author` and the `author` of `SCAFFOLD_BASE/package.json`, which follows from the `Q-target-path` answer, and say which is which.
- Options: the source's author, when it has one · the base's author · Other (your name and email).
- Mark no option "(Recommended)". This is an exception to rule 2, because the author is the user's decision, not a best guess.

**`Q-config-mapping`: A source config key has no automatic mapping. What should happen to it?**
- Ask one `Q-config-mapping` for each key in `source-index.json` `otherConfigKeys`, except `nonRenderableFiles`, which is always dropped (see "Design decisions").
- Say the key, its value, and what it did in the old generator: "`<key>: <value>`, which `<what it did>`".
- Options: the proposed mapping (e.g. `conditionalFiles` → `conditionalGeneration`, AGENTS.md §4.1) · drop it · Other.
- Ask `Q-capture-params`, `Q-what-to-change`, `Q-template-author` and 1 key in this round, and any remaining keys in a follow-up call.
- Save each answer in `state.json` with `id` `Q-config-mapping:<key>`. `scaffolder` looks it up by that id.

**`Q-confirm-changes`: Did I understand your changes correctly?** Ask only when `Q-what-to-change` described changes.
- Restate each change as `C1`, `C2`, …, in a testable form, with how it will be verified. For example: "C1: `GET /health` answers 200 (verify: `curl … /health` → `200`). C2: no Dockerfile (verify: `test ! -f {RUN_DIR}/Dockerfile` → exit code `0`). C3: log lines start with a timestamp (verify: manual). Correct?"
- Options: Correct · Other (fix the list or the verifications).
- Repeat until the user picks "Correct". Then write `SCRATCH_DIR/changes.md` (format and example in `contract.md`).

Each verification is one of:
- **command:** a shell command with the expected stdout or exit code. Use the placeholders `{HOST}`, `{PORT}` and `{RUN_DIR}`; `smoke-runner` fills them in and runs the command.
- **manual:** something only a person can judge (e.g. "nicer log output"). The user checks it at `Q-does-it-work`. Use this only when no command can check the change.

### 7. Derived values

Work these out without asking. The checks in step 8 and every later wave use them. The rule for each one is in the "Run variables" table.

- **Straight from the answers:** `ROLE` (`Q-role`), `TARGET_SEGMENTS` (`Q-target-path`), `FIXTURES` (`Q-capture-doc`), `CAPTURE_PARAMS` (`Q-capture-params`), `CHANGES` (`changes.md`, or `none`), and `AUTHOR` (`Q-template-author`).
- **From the path (`TARGET_SEGMENTS`):** `PROTOCOL`, `TARGET_PATH`, `SUITE_PATH`, `SUITE_EXISTS`, `INTEGRATION_KEY`, `BAKED_IN_NAME` and `SCAFFOLD_BASE`. Work them out again whenever `Q-target-path` is re-asked.
- **From the repo:** `GENERATOR_DEPS`, printed by:

  ```bash
  node -e "console.log(Object.keys(require('./apps/generator/package.json').dependencies).join(','))"
  ```

### 8. Mechanical checks on the answers

Run these checks after step 7, before writing anything. Each one catches an answer that would otherwise fail much later with an unrelated-looking error. When a check fails, tell the user which check failed and why, then do what its **On failure** line says: re-ask the question, or stop.

#### Checks on `Q-target-path` (the path)

**1. The type matches the role.** `TARGET_SEGMENTS` starts with `clients/` for a client, or `servers/` for a server.
- On failure: re-ask `Q-target-path`, quoting `ROLE`.

**2. The repo supports the type.** `Grep` for `dir: '<first segment>'` in `apps/generator/scripts/build-templates.js`.
- On failure: stop with "server templates need the `servers` type in the repo first (add-template-type skill)". Never add the type yourself.

**3. The path is new.** `TARGET_PATH` doesn't exist.
- On failure: re-ask `Q-target-path`.

**4. The absolute path has no `test`.** The build copies templates with the filter `!src.includes('test')` on the absolute path, so a template at e.g. `clients/websocket/latest` would be copied as nothing. This exits 1 when the path contains `test`:

```bash
node -e "process.exit(require('path').resolve(process.argv[1]).includes('test')?1:0)" "<TARGET_PATH>"
```
- On failure: re-ask `Q-target-path`. If `test` is in the repo checkout path itself, no answer can pass: stop and say so.

**5. No template sits above it.** No directory between `packages/templates/` and `TARGET_PATH` holds both `package.json` and `.ageneratorrc`. The build stops at the first template directory it finds, so it would never find a template nested inside another.
- On failure: re-ask `Q-target-path`.

**6. The protocol matches the source.** `DETECTED_PROTOCOL` is `null`, or equals `PROTOCOL`.
- On failure: re-ask `Q-target-path`, quoting both values. The user may confirm their path anyway. Never fix a mismatch silently, in either direction.

#### Check on `Q-capture-doc` (the capture document)

**7. The old template can read the capture document.** Run `fixture-info.js` on every file in `FIXTURES`. Each `version` it prints must be allowed for `SOURCE_API_VERSION` (the table in `Q-capture-doc`). An `error` line fails the check too. Step 6 already runs this check right after Round 1; here it confirms the final answer.
- On failure: re-ask `Q-capture-doc`, then `Q-capture-params`.

#### Check on `Q-capture-params` (the capture parameters)

**8. The old generator accepts the parameters.** The capture generator validates them before it renders anything, and rejects each case below. Without this check, the rejection only shows up as a failed capture (`Q-capture-failed`) in Wave 1. Compare `CAPTURE_PARAMS` with `source-index.json` `config.parameters`:
- every parameter name is declared in `config.parameters`;
- every required parameter that has no default has a value;
- when a `server` parameter is set, every file in `FIXTURES` lists that id in the `servers` that `fixture-info.js` prints.
- On failure: re-ask `Q-capture-params`, naming the parameter and the reason.

### 9. Prepare and summarize

Once every check passes, do these without asking:

1. **Create `RUNS_DIR`** (`SCRATCH_DIR/runs`). Wave 4 generates and starts the projects there.
2. **Build what the new template runs on.** The template is rendered by the React SDK and imports the shared components, both from their built `lib/` folders, and `BUILD` needs them too. Always build both: a `lib/` left over from an older checkout may not match `src/`, and its errors would show up in Wave 3 as unrelated failures.

   ```bash
   (cd apps/generator && npm run build:reactsdk)
   npm run components:build
   ```
3. **Print the Wave 0 summary:**
   - every run variable, and where its value came from;
   - every answer, and `changes.md`;
   - the `missing:` lines from `scan.js` (step 5);
   - the hooks kept;
   - `CAPTURE_GENERATOR_VERSION`;
   - the dropped config keys, with the reason: `generator`, because baked-in templates take none; `supportedProtocols`, because no baked-in `.ageneratorrc` declares it; and `nonRenderableFiles`, when the source has it (see "Design decisions").
4. **Save progress.** Write `state.json` with `completedWave: "0"`.

## Wave 1

Spawn three agents in one message:

- **capturer.** Inputs: `FIXTURES`, `CAPTURE_PARAMS`, `CAPTURE_GENERATOR_VERSION`.
- **api-mapper.** Inputs: `SCRATCH_DIR/source-index.json`, `CHANGES`, `FIXTURES`, `CAPTURE_PARAMS`.
- **scaffolder.** Inputs: `TARGET_PATH`, `TARGET_SEGMENTS`, `SCAFFOLD_BASE`, `BAKED_IN_NAME`, `INTEGRATION_KEY`, `AUTHOR`, `SCRATCH_DIR/source-index.json`, `CHANGES`, and `SCRATCH_DIR/state.json` for the `Q-config-mapping` answers.

When all three have returned:

1. **capturer failed** (`unresolved: ["capture:<fixture>"]`): ask **`Q-capture-failed`** (see "Failure handling").
2. **scaffolder `unresolved`:**
   - `hook-package:<pkg>`: ask **`Q-new-dependency`**. A config hook has no owning row, so on "rewrite the code without it", remove that hook from `TARGET_PATH/.ageneratorrc` yourself;
   - `license:<value>`: stop, and ask the user how to proceed (the repo is Apache-2.0);
   - `config-key:<key>`: ask `Q-config-mapping` for that key, then re-dispatch `scaffolder`.

### Scaffold gate

Run it only now. A root install while `api-mapper` greps the root `node_modules/@asyncapi/parser` could change files under it mid-read.

The gate changes `apps/generator/lib/templates/BakedInTemplatesList.json` and `package-lock.json`. The template's PR includes both.

```bash
npm install --no-audit --no-fund
<BUILD>
grep -q '"name": "<BAKED_IN_NAME>"' apps/generator/lib/templates/BakedInTemplatesList.json
```

If the name is missing, stop before translation and show the build output.

### `inventory.json`

Build it from `source-index.json`, `capture.json`, `api-map.json` and `changes.md`, and write it with the Write tool. Field definitions are in `contract.md`. The rows are:
- one per scanned source file;
- one per `api-map.json` filter whose `replacement` is `new-helper`. Built-in filters with `inline` or `none` get no row; translators apply them straight from `api-map.json`;
- one per `Q-parser-gap` "new helper";
- one per new file a change requires (`kind: new`, with `newPath`).

| What the row is | `wave` | `becomes` | `plannedPath` (under `TARGET_PATH`) |
|---|---|---|---|
| used filter with `replacement: new-helper`, `Q-parser-gap` new helper, each function a source `helpers/` file exports | `2a` | `shared-helper` | `packages/helpers/src/<module>.js` (repo-relative) |
| source `partials/` file or other included partial; source `components/` file used by two or more rows | `2a` | `shared-component` | `components/<Name>.js` |
| static non-JS template file that no change touches | `copy` | `copy` | `template/<path>` |
| static JS (`.js`, `.jsx` or `.cjs`) template file, or static `package.json`, that no change touches (the root `packages/**` workspace rule would treat a raw `package.json` as a workspace); for a React source, also a `template/` file its `nonRenderableFiles` globs match (the old generator copied it raw) | `copy` | `verbatim-component` | `template/<path>.js` |
| dynamic template file, or static file a change touches | `2b` | `component` | `template/<path>.js` |
| `filenameTemplated` file (`$$channel$$`) | `2b` | `component-file-array` | `template/<dir>/<name without the $$ markers>`, plus `.js` unless it already ends in `.js` (the generator copies any other file raw instead of rendering it) |
| React `.js` / `.jsx` template file not matched by `nonRenderableFiles` | `2b` | `component` | `template/<path>` |
| source `components/` file used by one row | `2b` | `component` | `components/<path>` |
| source `hooks/` file | `2b` | `local-hook` | `hooks/<path>` |
| new file a change requires | `2b` | `component` | `template/<newPath>.js` |
| output of a config-declared hook (e.g. `asyncapi.yaml`) | `-` | `keep-hook` | `null` |
| file a change removes; filter defined but never used in `template/` or a partial; `package-lock.json`, `yarn.lock` or `pnpm-lock.yaml` under `template/` | `-` | `dropped` | `null` |

A source `filters/` file gets no row of its own: each filter it defines becomes a `2a` row when used, or a `dropped` row when not.

A baked-in template has no `helpers/` folder of its own: every helper function becomes an export of `@asyncapi/generator-helpers` (`packages/README.md` principles 4–5). For each `shared-helper` row, set:
- `exportName`: the filter or function name, unless `packages/helpers/src/index.js` already exports that name; then a free, descriptive name;
- `plannedPath`: the existing `packages/helpers/src/` module whose topic fits (`servers.js` for server data, `operations.js` for operations and messages, `bindings.js` for bindings, `utils.js` for string and naming functions), or a new module named after the topic when none fits.

A `component-file-array` row also gets the `api-map.json` rows for iterating its `$$<var>$$` collection and naming each item (for `$$channel$$`: the `channels().all()` and `channel.id()` rows), even though their `foundIn` doesn't list the file: the old generator ran that loop itself. It named each file `filenamify(<name>, { replacement: '-', maxLength: 255 })` plus the extension, unless the source has a `setFileTemplateName` hook. `filenamify` is in `GENERATOR_DEPS`.

A component's file name is its output name plus `.js` (`index.js` → `template/src/index.js.js`), as in the existing templates (`client.js.js`, `README.md.js`). The React renderer writes `<File name>` into the component's own directory.

When `TARGET_PATH/.ageneratorrc` has a `conditionalGeneration` key that names a source file, rewrite the key to that file's row `plannedPath` without `template/` (`src/server.js` → `src/server.js.js`), and remove it when the row is `dropped`. The generator looks keys up by the new template's file path, and `scaffolder` wrote them before the paths existed. A key naming a top-level folder stays as it is.

Then set the remaining fields:
- **`referenceOutput`:** for `template/<path>`, the files `golden/<fixture>/<path>`, with `{.gitignore}` → `.gitignore` and `{.npmignore}` → `.npmignore` (the generator renames those on output). For a `$$<var>$$` file: every golden file in that directory that no other row claims.
- **`uncovered`:** `true` for a template row that has no reference output and that no change drops. Triggers `Q-uncovered-files`.
- **`test` in a `plannedPath`.** The build skips any path containing `test`, so the file would be missing from `bakedInTemplates/`. Only `TARGET_PATH/test/` is meant to be left out.
  - **Only the file name contains `test`:** replace `test` with `spec` in `plannedPath`. For a `template/` row, set `outputName` to the real output name, so the generated file keeps its name. A `copy` row becomes `verbatim-component`, with `.js` added to its `plannedPath`.
  - **A folder contains `test`:** set `excludedByBuild: true`. Triggers `Q-test-folder`.
- **`usedBy`** (`2a` rows): the ids of the rows that import it.
- **`apiMapIds`:** the `calls[]` rows whose `foundIn` lists the row's source file or whose `forChange` is one of its changes, plus the `filters[]` rows for the filters that file uses. A filter's `2a` row gets its own `filters[]` row and that row's `callIds`.
- **`outputs`:** start empty. Fill them in from each translator's `files_written`; Wave 4 routes failures through them.

### Questions before Wave 2

Ask only the questions that apply, in one call. Apply each answer to `inventory.json`.

| # | Ask when | Question | Options |
|---|---|---|---|
| `Q-uncovered-files` | rows with `uncovered: true` | These files generated nothing in the capture, so there is no example to compare with: … | translate anyway · drop them |
| `Q-parser-gap` | `api-map.json` rows with `v3: "NONE"` | These old Parser calls have no replacement: … (each with its `foundIn`) | write a new helper in `@asyncapi/generator-helpers` (adds a `2a` row) · abort · Other (give the replacement; re-dispatch `api-mapper` with it, so the row gets grep evidence) |
| `Q-test-folder` | rows with `excludedByBuild: true` | The build skips any path containing `test`, so these files would be lost: … | drop them · abort · Other (give a new path; add it to `changes.md` as a new change with a file check) |

Two cases need no question. Tell the user about both:
- files renamed because their file name contains `test`. The generated files keep their names;
- dropped lockfiles. `npm install` creates a new one in the generated project.

Write `state.json` with `completedWave: "1"`.

## Wave 2a — shared code first

Do these in one message:

- **translator, mode `2a`**, only if `2a` rows exist. Inputs: the `2a` row ids, their `apiMapIds`, `CHANGES`. It writes into `packages/helpers/src/` and `TARGET_PATH/components/`, and returns `files_written` keyed by row id.
- **You, meanwhile:**
  - each `copy` row: copy `SCRATCH_DIR/source/<source>` to `TARGET_PATH/<plannedPath>`;
  - each `verbatim-component` row: run `node .claude/skills/bake-in-template/scripts/wrap-static.js <SCRATCH_DIR>/source/<source> <TARGET_PATH>/<plannedPath> <output basename>`, using the row's `outputName` as `<output basename>` when it has one. The wrapper escapes `\`, `` ` `` and `${`, so the output is byte-identical to the source file, with line endings normalized to LF.

  You write only under `template/`. The translator writes only `packages/helpers/src/` and `components/`, so the two can run in parallel.

Record each row's `outputs`. Write `state.json` with `completedWave: "2a"`.

## Wave 2b — one translator per row

Dispatch one **translator, mode `2b`**, per row with `wave: "2b"`, all in one message. Each agent gets:
- its row id and its `apiMapIds`;
- its `referenceOutput` paths;
- the change ids in its row (it reads their full text and verifications from `changes.md`);
- the Wave 2a rows' `source`, `outputs` and `exportName`, from `inventory.json`.

Each writes only into `SCRATCH_DIR/staging/<rowId>/`, which mirrors `TARGET_PATH`.

When all have returned, merge:

0. **Unresolved Parser calls.** For each `unresolved` call that has an `api-map.json` row with a `v3` other than `NONE`, add that row's id to the translator row's `apiMapIds`. If the agent says its staged file already uses it, accept the file; otherwise re-dispatch the row once. For a call with no `api-map.json` row, re-dispatch `api-mapper` for that call, then the row.
1. **Collisions.** List every staged relative path across rows, plus the files already in `TARGET_PATH` (a row's own earlier output doesn't count). A file already in `TARGET_PATH` always keeps its path. When two staged rows produce the same path, the lower row id keeps it (compare the numbers: `I3` < `I10`). Re-dispatch the other staged row's translator **once**, naming the conflicting file read-only: it either imports that file or renames its own. If the paths still collide, ask **`Q-file-collision`**. Also re-check every staged path for the substring `test`, and re-dispatch any violation to its row.
2. **Copy** each `staging/<rowId>/` into `TARGET_PATH` (a `shared-helper` row's `packages/helpers/…` into the repo root), and record the row's `outputs` as the final repo-relative paths (not the staging paths). Then delete the staged copy, so a later `fix` starts from the merged file: `node .claude/skills/bake-in-template/scripts/clean.js <SCRATCH_DIR>/staging/<rowId>`.
3. **Dependencies.** For every `dependencies` entry from Wave 2a and 2b:
   - a package not in `GENERATOR_DEPS` would break the published generator, whose users never install a baked-in template: ask **`Q-new-dependency`** before merging it. On "rewrite the code without it", write the answer to `SCRATCH_DIR/feedback-new-dependency.md`, dispatch one **translator, mode `fix`**, per owning row with that file, and merge it as in steps 1–2;
   - merge the others into `TARGET_PATH/package.json` `dependencies`, at the range `apps/generator/package.json` pins, so ranges never conflict. **`Q-dependency-range`** applies only to packages that `Q-new-dependency` is adding to the generator, when two rows request different ranges. Never pick a range silently.
4. **Install.** If step 3 changed any `package.json`, run `npm install --no-audit --no-fund` from the root, so the Wave 3 build sees the change. In a fix merge, after the tests have run, first delete their output with `node .claude/skills/bake-in-template/scripts/clean.js --test-output <TARGET_PATH>`, as Final "Gates" explains.

Write `state.json` with `completedWave: "2b"`. Wave 4 fixes and gate fixes use the same staging, merge, collision and dependency rules. Step 0 can re-dispatch `api-mapper` in any of those fix merges, so `oldgen/` and `source/node_modules/`, which it reads, stay until Final cleanup.

## Wave 3 — build, tests, lint, import gate

The orchestrator runs these steps in order. Only `test-wirer` and any `fix` translators are subagents.

1. **Build.** Run `BUILD`.
2. **Write the tests.** Spawn **test-wirer**. Inputs: `TARGET_PATH`, `TARGET_SEGMENTS`, `SUITE_PATH`, `SUITE_EXISTS`, `INTEGRATION_KEY`, `ROLE`, `PROTOCOL`, `FIXTURES`, `SCRATCH_DIR/inventory.json`, and the `ROLE`-matching fixture (rule in Wave 4), or `none` when the rule picks none. Don't ask `Q-smoke-doc` here: the smoke-run document is the user's, and the tests need a fixture committed to the repo.
3. **When `test-wirer` returns,** for each row id in its `unresolved` (a snapshot showed a template bug): write its notes to `SCRATCH_DIR/feedback-wave3.md`, dispatch one **translator, mode `fix`**, per row with that file, merge as in Wave 2b, then regenerate the snapshots with `(cd <SUITE_PATH> && npm run test:<INTEGRATION_KEY>:update)` and `(cd <TARGET_PATH> && npm run test:update)`.
4. **Lint.** Run the template lint, `(cd <TARGET_PATH> && npm run lint)`, and, if `shared-helper` rows exist, the helpers lint, `(cd packages/helpers && npm run lint)`.
5. **Import gate** (below).
6. **Tests.** Run the template tests, `(cd <TARGET_PATH> && npm test)`, and, if `shared-helper` rows exist, the helpers tests, `(cd packages/helpers && npm test)`.
7. **Test coverage.** The tests above can pass with a test missing (the template's script uses `--passWithNoTests`), so check:
   - every row with `hasConditionals: true` whose `plannedPath` starts with `components/` has the file `TARGET_PATH/test/components/<base>.test.js`. `<base>` is the `plannedPath` basename up to its first `.`. Components with no logic and files under `template/` need no test of their own;
   - every `shared-helper` row's `exportName` appears in `packages/helpers/test/<module>.test.js`. `<module>` is the `plannedPath` basename without `.js`.

**If a step fails,** handle it like a failed Final gate (see "Final, Gates"), with the gate keys `build`, `templateLint`, `importGate`, `templateTest` and `helpers`, then repeat that step. If a test is missing, re-dispatch `test-wirer` once, naming the missing test; if it's still missing, ask **`Q-gate-attempts-used-up`**.

### Import gate

Every bare import in the template's own code must be a Node builtin or in `GENERATOR_DEPS`. Every bare import a run adds to a `packages/helpers/src` file must be a Node builtin or a `packages/helpers` dependency (packages the file already imported at HEAD aren't the run's to fix): monorepo hoisting lets anything else pass every local test, then the published `@asyncapi/generator-helpers` fails to load it. Run, with each `shared-helper` row's `plannedPath` as a `<helper file>` (none when there are no such rows):

```bash
node .claude/skills/bake-in-template/scripts/import-gate.js <TARGET_PATH> [<helper file>...]
```

The script:
- reads the JS files under `template/`, `components/` and `hooks/`, and each `<helper file>`;
- parses each file with `@babel/parser`, so `require(...)` text inside generated-code strings doesn't count;
- strips `node:` prefixes and subpaths;
- prints `{ checked, violations }` as JSON and exits 1 on any violation.

Route each violation to the row that owns the file.

Wave 3 is done when the build, the template lint, the import gate, the template tests, the helpers lint and tests (when they apply) and the test-coverage check have all passed. Reset every `gateAttempts` counter to 0, so Final gets its own 3 attempts per gate, and write `state.json` with `completedWave: "3"`.

## Wave 4 — smoke run

### 1. Document and parameters (`Q-smoke-doc`, then `Q-smoke-params`)

Ask the user for their own document first. A repo fixture is only a fallback, used when the user gives none.

**`Q-smoke-doc` asked alone.** `Q-smoke-params` depends on the document's `servers` ids, so ask it in the next call.

| # | Question | Options | Asked when |
|---|---|---|---|
| `Q-smoke-doc` | "Which AsyncAPI document should the new template generate from for the final run? Type the path or URL of your own document in Other. The generated project is a `<ROLE>`, and AsyncAPI 3 operations are written from the application's perspective, so a document written for the other role swaps `send` and `receive`. Pick a fallback only if you have no document." | up to 3 fallbacks, each labeled "No document: use `<path>`" with its `title` and `send` / `receive` counts: the `ROLE`-matching fixtures first, then the capture fixture (`FIXTURES[0]`), then other fixtures of the protocol · Other (your path or URL) | once. Reruns reuse `SMOKE_DOC` |
| `Q-smoke-params` | Template parameters for `SMOKE_DOC` | the detected values, with `server` checked against `SMOKE_DOC`'s `servers` ids · Other (edit) | once, in the call after `Q-smoke-doc`. Reruns reuse `SMOKE_PARAMS` |

Mark no `Q-smoke-doc` option "(Recommended)". This is an exception to rule 2, because the user's own document comes before any fallback.

**The user's document.** Resolve a URL: a URL to a file in this repo becomes that repo path, and any other URL is downloaded once to `SCRATCH_DIR/smoke/<basename>`. Not `fixtures/`, where a capture fixture with the same name may already sit. Then run `node .claude/skills/bake-in-template/scripts/fixture-info.js <SMOKE_DOC>`. If it prints an `error`, show the error and ask `Q-smoke-doc` again. Show its `title`, `send` / `receive` counts and `servers` ids in `Q-smoke-params`.

**The parameters.** Check the `Q-smoke-params` answer before using it: every name is declared in `TARGET_PATH/.ageneratorrc`, every required parameter without a default has a value, and a `server` value is one of `SMOKE_DOC`'s `servers` ids. If not, ask `Q-smoke-params` again, naming the parameter. Otherwise a wrong answer would look like a template bug and use up a fix attempt.

**Fallbacks** apply the `ROLE`-matching fixture rule below. After Wave 3, at least one fixture matches, because `test-wirer` writes `asyncapi-<ROLE>.yml` when none did.

**`ROLE`-matching fixture rule** (`test-wirer` uses it too). The candidates are the `.yml`, `.yaml` and `.json` files directly inside every `packages/templates/*/<PROTOCOL>/test/__fixtures__/` directory, so a new `servers/` template can reuse a server-perspective fixture kept beside the protocol's clients (e.g. `clients/websocket/test/__fixtures__/asyncapi-hoppscotch-server.yml`). Subfolders such as `__fixtures__/commons/` hold `$ref` fragments (e.g. `commons/servers.yml`), not documents, so leave them out. Keep only files git tracks (`git ls-files -- <dir>`): a gitignored file such as websocket's `bundled.yml` exists only locally, so a test using it would fail in CI. Run `node .claude/skills/bake-in-template/scripts/fixture-info.js <candidates>`, and keep only the files it parses with a `version` of `3.0.0` or later. It prints an `error` line and exits 1 for anything else, which is expected here. A candidate matches when its file name or its `title` names `ROLE`, ignoring case. For `ROLE` `client`, every candidate under `clients/<PROTOCOL>/test/__fixtures__/` also matches unless its file name or `title` names `server`: the protocol's clients already share that fixture whatever its name (e.g. kafka's `asyncapi-adeo.yml`), and the repo keeps one fixture per protocol (AGENTS.md §4.7). AsyncAPI 3 operations are written from the application's perspective, so a client document fed to a server template inverts `send` and `receive`.

### 2. Generate by name

The run number `n` is `ITERATIONS + 1`. When `n` is above 1, first delete the previous generated project, whose process step 5 or `smoke-runner` has stopped. Its `run-<n-1>.json` and log files sit beside the folder, not inside it, so they stay as the fix translators' failure file:

```bash
node .claude/skills/bake-in-template/scripts/clean.js <RUNS_DIR>/run-<n-1>
```

Run `BUILD`, write `SMOKE_PARAMS` to `SCRATCH_DIR/smoke-params.json` with the Write tool, and run:

```bash
node .claude/skills/bake-in-template/scripts/generate.js <BAKED_IN_NAME> <RUNS_DIR>/run-<n> <SMOKE_DOC> <SCRATCH_DIR>/smoke-params.json
```

The script empties `RUNS_DIR/run-<n>` first. Generating by name exercises the built `bakedInTemplates/` copy that npm users get. Files dropped by the build's `test` filter, and local hooks loaded from the baked-in location, show up here and not in the integration suite, which loads templates from their source path. If generation throws, save its output to `SCRATCH_DIR/gate-generate-<n>.log`; that run has failed (step 6).

On the first run that generates without throwing, also check the verbatim rows:

```bash
node .claude/skills/bake-in-template/scripts/check-verbatim.js <SCRATCH_DIR> <RUNS_DIR>/run-<n>
```

It compares the generated file of every `copy` and `verbatim-component` row with its golden file, line endings normalized, prints `{ mismatches, notGenerated }` as JSON, and exits 1 on any mismatch. `notGenerated` lists golden files this run didn't produce. That isn't a failure, because `SMOKE_DOC` and `SMOKE_PARAMS` may rightly turn a file off, but show the list at `Q-does-it-work` so the user can say if one should be there. A mismatch routes to its row: redo the copy or the `wrap-static.js` call, then generate again. If it still mismatches, that run has failed (step 6).

### 3. Run

If the generated project has no `package.json`, or its `package.json` has no `start` script, first ask **`Q-start-command`** (once; reruns reuse `RUN_COMMAND`): "How do I start the generated project?", with options the command found in its README · Other (your command). Then delete the files an earlier attempt with the same `n` may have left (a retry after `Q-start-failed`), because `launch.js` appends to the logs and `start-check.js` trusts any exit file:

```bash
node .claude/skills/bake-in-template/scripts/clean.js <RUNS_DIR>/run-<n>.json <RUNS_DIR>/run-<n>.log <RUNS_DIR>/run-<n>.err.log <RUNS_DIR>/run-<n>.exit <RUNS_DIR>/run-<n>.exit.child
```

Then spawn **smoke-runner** with inputs `n`, `RUNS_DIR`, `RUN_COMMAND` and `CHANGES`.

When it returns, read `RUNS_DIR/run-<n>.json`. If `running` is `true`, add `{ pid, commandLine }` to `runningPids[]`, and write `state.json`.

### 4. Ask `Q-does-it-work`

When the start was clean and every verification command passed, show the log excerpt, the verification results, the URL, the manual checks from `changes.md`, any undeclared packages `smoke-runner` listed, and any `notGenerated` files from the verbatim check, then ask **`Q-does-it-work`**:

> The project is running at `<url>` (PID `<pid>`). Run log: … Verification results: C1 ✅, … Manual checks for you: C2 — …. Does it work, including your changes C1…Cn?

For a short-running project (`running` is `false`), say that it ran and exited with code 0, instead of naming a URL and a PID.

Options: Works · Other (describe what's wrong) · abort. While `Q-does-it-work` is open, the user can try the running project themselves.

If a verification command failed after a clean start, skip `Q-does-it-work` and go to step 6.

If the install failed or the start wasn't clean, the cause may be the machine, not the template: a server the client needs isn't running, a runtime such as Python or Java is missing, or the port is taken. Show the `log` excerpt from `run-<n>.json` (it starts with the install output) and the last 40 lines of `RUNS_DIR/run-<n>.err.log` when that file exists, then ask **`Q-start-failed`**: "The generated project didn't start cleanly. Is this a template bug?" Options:
- **Template bug, fix it (Recommended):** go to step 6.
- **Environment problem, I fixed it, retry:** run step 3 again with the same `n`. It doesn't count as an iteration.
- **Skip the smoke run:** go to Final, with a note in the report that the project was never confirmed running.
- **abort:** run abort cleanup.

### 5. After `Q-does-it-work`

Whatever the answer, if `running` is `true`, stop the process by its PID (rules 4 and 5) and remove it from `runningPids[]`. Then:
- **Works:** go to Final.
- **A described problem:** write it to `SCRATCH_DIR/feedback-<n>.md` and handle it as a failure (step 6).
- **abort:** run abort cleanup.

### 6. Failure, failed verification, or reported problem

- **Count first.** `ITERATIONS += 1`, so the rerun gets a new run number and no leftover files from this run. When that takes it past 3, ask **`Q-iterations-used-up`** before fixing: give guidance · accept as-is, with a note in the report (go to Final) · abort.
- **Find the owner.** A failed verification routes to the rows that list that change id. For a file named in a stack trace or by the user, use `inventory.json`:
  - a generated file `RUNS_DIR/run-<n>/<path>` belongs to the row with a `referenceOutput` ending in `<path>`, or with the `plannedPath` `template/<path>.js` or `template/<path>`;
  - a file in the build, `bakedInTemplates/<BAKED_IN_NAME>/__transpiled/<path>`, is `TARGET_PATH/<path>` when `<path>` starts with `components/`, else `TARGET_PATH/template/<path>`;
  - a template or helper file belongs to the row whose `outputs` list it.

  If no owner is found, ask **`Q-owner-unclear`**, with options the candidate files from `inventory.json` · Other.
- **Fix.** Dispatch one **translator, mode `fix`**, per owning row. Inputs: its row id, the failure file (`RUNS_DIR/run-<n>.json`, `SCRATCH_DIR/feedback-<n>.md`, or a gate output saved as `SCRATCH_DIR/gate-<name>-<attempt>.log`), and the usual 2b inputs. Merge as in Wave 2b, including the root `npm install` when dependencies changed.
- **Rerun.** The import gate, regenerate by name (step 2, which runs `BUILD`), `smoke-runner` again (step 3), then `Q-does-it-work` again.

The orchestrator never reports "works" itself; only the user's "Works", "accept as-is" at `Q-iterations-used-up`, or "Skip the smoke run" at `Q-start-failed`, ends Wave 4. Write `state.json` with `completedWave: "4"`.

## Final

### Gates

First regenerate the snapshots with `(cd <SUITE_PATH> && npm run test:<INTEGRATION_KEY>:update)` and `(cd <TARGET_PATH> && npm run test:update)`, never by hand. Wave 4 fixes and verbatim redos change the generated output after Wave 3 wrote the snapshots, and the user has since accepted that output. When nothing changed, the commands rewrite the same snapshots.

Then delete the test output with `node .claude/skills/bake-in-template/scripts/clean.js --test-output <TARGET_PATH>`. The integration tests generate projects into the gitignored `TARGET_PATH/test/temp/`, and the root workspaces glob `packages/**` would record any generated `package.json` there in `package-lock.json`, which then fails `npm ci` in CI. Then run `npm install --no-audit --no-fund` from the root, so `package-lock.json` includes every workspace the run added, such as a new suite. CI runs `npm ci`, which fails on a stale lockfile.

Run every gate. After any fix, run all of them again. When the fix changed template or helper files, first regenerate the snapshots the same way, then delete the test output again; the report lists that code as changed after the user's "Works". Test gates run with `CI=true`, which makes jest fail on a missing snapshot instead of writing it, as CI does.

| Gate (`gateAttempts` key) | Command |
|---|---|
| build (`build`) | `<BUILD>` |
| template lint (`templateLint`) | `(cd <TARGET_PATH> && npm run lint)` |
| suite lint (`suiteLint`) | `(cd <SUITE_PATH> && npm run lint)`. `test-wirer` changed the suite, and CI's `npm run lint` covers every workspace |
| import gate (`importGate`) | `node .claude/skills/bake-in-template/scripts/import-gate.js <TARGET_PATH> [<helper file>...]`, with the helper files as in Wave 3 |
| template test (`templateTest`) | `(cd <TARGET_PATH> && CI=true npm test)` |
| helpers lint and test (`helpers`), only if `shared-helper` rows exist | `(cd packages/helpers && npm run lint && CI=true npm test)` |
| full suite (`suiteTest`) | `(cd <SUITE_PATH> && CI=true npm test)`, so every client in it still passes. `test-wirer` always edits the shared suite files and scripts, which CI runs for every client. It includes `test:<INTEGRATION_KEY>`, so the new template's integration tests run here too |

- Save the output of a failing gate to `SCRATCH_DIR/gate-<name>-<attempt>.log`, then find the owning row and fix it, using the **Find the owner** and **Fix** bullets of Wave 4 step 6. A failure inside a test file goes back to `test-wirer` instead. Each gate allows 3 fix attempts (`gateAttempts`), then ask **`Q-gate-attempts-used-up`**: give guidance · skip, with a note in the report · abort.
### Ignored files

The root `.gitignore` ignores names such as `.env`, `coverage` and `temp` at any depth, and a copied `template/.gitignore` applies its own patterns to the template's files. An ignored file works locally and passes every gate, but `git add` leaves it out of the PR. List the ignored files in the paths the run writes:

```bash
git ls-files --others --ignored --exclude-standard --directory -- <TARGET_PATH> packages/templates/<type>/<protocol>/test packages/helpers
```

Leave out `node_modules/` entries. Any other line is a file the template or its tests need: tell the user, and list it in the report as a file to add with `git add -f`.

### Changeset

Write `.changeset/bake-in-<SOURCE_NAME>.md`, or, if that file already exists (e.g. an earlier bake of the same source still awaits release), `.changeset/bake-in-<SOURCE_NAME>-<TARGET_SEGMENTS joined by ->.md`, so the run never overwrites a changeset it didn't write. Baked-in templates are private and ship through `@asyncapi/generator`, so the changeset names that package, at `minor` for a new template (AGENTS.md §2.5). When `shared-helper` rows exist, the same changeset also names `@asyncapi/generator-helpers` at `minor`: the template imports its new exports, and releasing it bumps the helpers version that `apps/generator/package.json` pins.

```markdown
---
'@asyncapi/generator': minor
'@asyncapi/generator-helpers': minor
---

Add the baked-in template `<BAKED_IN_NAME>`, ported from <SOURCE_URL> to the React engine and the v3 Parser API. New `@asyncapi/generator-helpers` exports: `<exportName>`, ….
```

Leave out the `@asyncapi/generator-helpers` line and the last sentence when no `shared-helper` rows exist.

### Report

Write `SCRATCH_DIR/report.md`, and print it. It contains:
- the run variables, every question with the user's answer, and every derived value with where it came from;
- `changes.md`, with the files each change was applied to and its verification result;
- whether the integration suite was extended, newly scoped or created;
- `inventory.json` and `api-map.json`, rendered as Markdown tables;
- the smoke runs: document, parameters, adjustments, verification results, iterations used, the verbatim check's `notGenerated` files, and the user's final confirmation, or that the user skipped the smoke run at `Q-start-failed`;
- uncovered, dropped and unused source files, including filters defined but never used, and files renamed because their file name contains `test`;
- the new `@asyncapi/generator-helpers` exports, each with the source filter or function it came from;
- the gate results, and any code a Final gate fix changed after the user's "Works", because no smoke run covered that change;
- the run's repo changes, from `git status --porcelain`. Note that `BakedInTemplatesList.json` and `package-lock.json` belong in the template's PR, as does `apps/generator/package.json` if `Q-new-dependency` added a dependency. List any files from "Ignored files" here, to add with `git add -f`;
- the dropped config keys (`generator`, `supportedProtocols`, `nonRenderableFiles`) and the `Q-config-mapping` answers;
- manual follow-ups: Microcks acceptance tests, and the template's README.

Write `state.json` with `completedWave: "final"`. Never commit anything under `SCRATCH_DIR`.

### Cleanup

The report holds everything a later reader needs: the variables, every answer, `changes.md`, `inventory.json` and `api-map.json` as tables, the smoke runs and every created or modified repo path. So delete the rest of `SCRATCH_DIR`, including `state.json`. A leftover `state.json` would make a later run on the same source offer `Q-previous-run`, whose "Discard it" would stash the finished template.

1. Stop every process still in `runningPids[]` (rule 4). Normally there is none: Wave 4 step 5 stopped it.
2. Keep only the report, and delete the test output the gates regenerated after the root install, so the user's next root `npm install` doesn't record a generated `package.json` in `package-lock.json`:

   ```bash
   node .claude/skills/bake-in-template/scripts/clean.js --test-output <TARGET_PATH>
   node .claude/skills/bake-in-template/scripts/clean.js --keep <SCRATCH_DIR> report.md
   ```

   This removes the clone, the golden output, the handoff files, `RUNS_DIR` with every generated project and log, the feedback and gate logs, and any file an agent left behind.
3. Tell the user that `SCRATCH_DIR` now holds only `report.md`, or list the paths the script couldn't delete.

## Failure handling

Each of these either stops the run with a stated reason or asks the user. Never retry silently. Questions quote the error or the evidence.

| Failure | Action |
|---|---|
| Preconditions 1–3 (clone, is a template, engine) | Stop, and report which check failed and why |
| A mechanical check on an answer (precondition 8), including a protocol mismatch | State the failed check, and re-ask that question |
| No published generator satisfies the source's `generator` range (precondition 4) | Stop, and show the script's message |
| The working tree isn't clean at start (precondition 0) | Stop; ask the user to commit or stash the changes first |
| `ROLE` is `server` and the repo has no `servers` type | Stop. The type must be added to the repo first (add-template-type skill); never add it yourself |
| A kept config hook (Wave 1) or a translator (Wave 2a/2b merge, fixes) needs a package not in `GENERATOR_DEPS` | **`Q-new-dependency`:** quote the package, the rows and the files that import it, and say that npm users of `@asyncapi/generator` won't have it. Options: rewrite the code without it (Recommended; re-dispatches the owning rows once) · add it to `apps/generator/package.json` `dependencies` (named in the report as a generator dependency change) · abort. When any owning row is a `shared-helper` row, leave out the "add it" option: the import gate checks helper files against `packages/helpers` dependencies, not `GENERATOR_DEPS`, so it could never pass. A config hook has no owning rows and always keeps the option |
| Import gate fails (Wave 3, Final) | Route each violation to its owning row (see "Final, Gates"). It counts against the gate's 3 attempts |
| `capturer` error | **`Q-capture-failed`:** print the error verbatim. Options: another fixture · different parameters · continue without reference output · abort |
| Scaffold gate: `BAKED_IN_NAME` missing from `BakedInTemplatesList.json` | Stop before translation, and show the build output |
| A smoke-run problem whose owning file is unclear | **`Q-owner-unclear`** (Wave 4 step 6) |
| Wave 4, 3 iterations used | **`Q-iterations-used-up`** (Wave 4 step 6) |
| A Wave 3 or Final gate, 3 attempts used | **`Q-gate-attempts-used-up`** (Final, Gates) |
| Adding scoping to a single-client suite changed its existing snapshots | Stop and report the diff. Never update the existing client's snapshots |
| Staged files still collide after one re-dispatch | **`Q-file-collision`:** quote the path and both rows. Options: keep row A's file · keep row B's file · Other (guidance) |
| Two rows request different ranges of a package `Q-new-dependency` is adding | **`Q-dependency-range`:** quote both ranges and the rows. Options: each range · Other |
| `SCRATCH_DIR/state.json` exists at start | **`Q-previous-run`** (precondition 0) |
| Any abort (`Q-parser-gap`, `Q-does-it-work`, `Q-start-failed`, `Q-capture-failed`, `Q-iterations-used-up`, `Q-gate-attempts-used-up`, `Q-test-folder`, `Q-new-dependency`), or a stop after Wave 1 started | **`Q-keep-or-revert`** (Abort cleanup) |

## Abort cleanup

1. Stop every process in `runningPids[]`, by PID only, after the PID check (rule 4).
2. Show the repo changes: `git status --porcelain`. If it prints nothing, skip to step 4.
3. Ask **`Q-keep-or-revert`**: "The run made these repo changes: …". Options:
   - **keep them (Recommended):** leave them in the working tree to inspect. A later run needs a clean tree, so the user commits, stashes or discards them first;
   - **discard them:** stash every change, untracked files included, so nothing is lost for good:

     ```bash
     git stash push --include-untracked -m "bake-in-template: discarded run of <SOURCE_NAME>"
     ```

     Then tell the user the stash name, that `git stash pop` brings the changes back, and that their next root `npm install` and `BUILD` drop the template from `node_modules` and the built baked-in templates.
4. **Clean `SCRATCH_DIR`**, once step 1 has stopped every process. Delete `state.json`, the generated projects and the large folders:

   ```bash
   node .claude/skills/bake-in-template/scripts/clean.js <SCRATCH_DIR>/state.json <RUNS_DIR>/run-1 … <RUNS_DIR>/run-<ITERATIONS+1> <SCRATCH_DIR>/oldgen <SCRATCH_DIR>/source <SCRATCH_DIR>/staging <SCRATCH_DIR>/tmp <SCRATCH_DIR>/golden
   ```

   The small handoff, feedback and gate-log files stay, and so do the `RUNS_DIR/run-<n>.json` records and logs, so the user can see why the run stopped.

## Reference materials

- `apps/generator/scripts/build-templates.js`: `TEMPLATE_TYPES` (allowed type folders), `IGNORED_DIRS` (`helpers` and `components` are never mistaken for templates), `collectTemplates` (stops at the first directory holding both `package.json` and `.ageneratorrc`), `getTemplateName` (`BAKED_IN_NAME`), and `transpileTemplate` (the `!src.includes('test')` copy filter).
- `apps/generator/lib/generator.js`: `isCoreTemplate` (baked-in templates are never installed), `compile` defaulting to `true` (a baked-in template is transpiled again from its copied directory), and `maybeRenameSourceFile` (`{.gitignore}`, `{.npmignore}`).
- `apps/generator/lib/hooksRegistry.js`: `registerLocalHooks` (a template's `hooks/` directory) and `registerConfigHooks`.
- `apps/generator/lib/renderer/react.js`: `saveContentToFile` (`<File name>` replaces the component's basename in its own directory; plain `writeFile`).
- `apps/generator/lib/parser.js`: how the generator parses (`NewParser(apiVersion, { includeSchemaParsers: true })`), which `fixture-info.js` mirrors.
- `packages/templates/clients/websocket/test/integration-test/`: the per-client scoped suite (`TEST_CLIENT`, `runTestSuiteForClient`, `snapshotResolver.js`).
- `packages/templates/clients/kafka/test/integration-test/`: the single-client suite (nested `languageConfig`, one `integration.test.js.snap`).
- `packages/templates/clients/websocket/test/__fixtures__/`: protocol fixtures, including `asyncapi-hoppscotch-server.yml`, the server-perspective document.
- `@asyncapi/parser@3.6.0` `cjs/models/v2/operation.js`: `isSend()` is `action() === 'subscribe'`, and `isReceive()` is `action() === 'publish'`.

## Non-goals

- **sdks, docs and configs templates.** `TARGET_SEGMENTS` must start with `clients/` or `servers/`. The repo marks `sdk`, `docs` and `config` as not yet implemented, and the suite-path and integration-key rules assume a protocol segment.
- **Adding the `servers` type to the repo.** That's a prerequisite, done with the add-template-type skill; this skill only checks for it.
- Comparing old and new behavior automatically, or matching output byte for byte. The old output is reference only, and the user confirms the final run.
- Changes the user didn't ask for in `Q-what-to-change`/`Q-confirm-changes`.
- Microcks acceptance tests.
- Promoting components to `packages/components` (use migrate-component afterwards).
- Modifying the source repository.
- Writing docs pages, or the template's README.
- Committing `SCRATCH_DIR` artifacts.
