# bake-in-template: handoff contract

This file defines what passes between the orchestrator ([SKILL.md](SKILL.md)) and the agents ([agents/](agents/)), and the envelope every agent returns. `SCRATCH_DIR` is `temp/bake-in-template/<SOURCE_NAME>`. Every command runs from the repo root.

## Rules

- **One writer per JSON file.** Everyone else only reads it.

  | File | Writer |
  |---|---|
  | `SCRATCH_DIR/source-index.json`, `inventory.json`, `state.json` | orchestrator |
  | `SCRATCH_DIR/capture.json` | `capturer` |
  | `SCRATCH_DIR/api-map.json` | `api-mapper` |
  | `RUNS_DIR/run-<n>.json` | `smoke-runner` |

- **Structured handoffs are JSON; prose is Markdown.** The orchestrator checks the JSON files mechanically: `v3: "NONE"` triggers `Q-parser-gap`, `uncovered` triggers `Q-uncovered-files`, `outputs` routes Wave 4 failures, and `state.json` drives the previous-run check and process cleanup. Agents receive single slices of them by id. `changes.md`, `feedback-<n>.md` and `report.md` hold the user's wording and the human-facing report, so they stay Markdown.
- **Read JSON with `scripts/read-slice.js`, never `jq`.** `jq` may not be installed on Windows. Read only the rows you need, by id:

  ```bash
  node .claude/skills/bake-in-template/scripts/read-slice.js <SCRATCH_DIR>/api-map.json calls A1 A2
  ```

  `read-slice.js` reads rows that have an `id`. To read one top-level field that isn't a row array (e.g. `source-index.json` `config`), a short read-only `node -e` is fine: `node -e "console.log(JSON.stringify(require('./<file>').config, null, 2))"`.
- **Return the envelope, never file contents.** Bulk data stays in files.
- **Staging.** A translator in mode `2b` or `fix` writes only into `SCRATCH_DIR/staging/<rowId>/`, which mirrors `TARGET_PATH` (`template/`, `components/`, `hooks/`); a `shared-helper` row stages its repo-relative path instead (`staging/<rowId>/packages/helpers/…`). After Wave 2a, only the orchestrator writes into `TARGET_PATH` and `packages/helpers/`, except `test-wirer`, which writes `TARGET_PATH/test/` and `packages/helpers/test/` in Wave 3.
- **Paths inside JSON** use forward slashes. They are relative to `SCRATCH_DIR` (`golden/<fixture>/src/index.js`), to `SCRATCH_DIR/source` (`template/src/index.js`, `filters/index.js`), or to the repo root when they start with `packages/`, `apps/`, `node_modules/` or `temp/`. A `node_modules/` path always means the repo's root `node_modules`; write files under `SCRATCH_DIR/source/node_modules` or `SCRATCH_DIR/oldgen/node_modules` with their full `temp/bake-in-template/…` path.
- **Scripts.** Every script a step runs is bundled in [scripts/](scripts/). Run it with `node` from the repo root, exactly as the step gives it; never copy it into `SCRATCH_DIR` or rewrite it. If you write a one-off script of your own (e.g. a translator's render check), write it with the Write tool into `SCRATCH_DIR/tmp/<agent>[-<rowId or n>]/`, never through a Bash heredoc or a long `node -e`: the shell layer can drop backslashes. Never put it in the `SCRATCH_DIR` root or in `staging/`.
- **Cleanup.** Delete what you created for yourself before you return, with `node .claude/skills/bake-in-template/scripts/clean.js <path>...` (never `rm -rf` or `Remove-Item`). Your `tmp/` folder always goes; the files the handoff table or your instructions name stay, because the orchestrator reads them. SKILL.md "Cleanup" lists what the orchestrator deletes and when.

## Agent return envelope

```json
{
  "success": true,
  "files_written": ["temp/bake-in-template/<SOURCE_NAME>/capture.json"],
  "summary": "Captured 12 files for temp/bake-in-template/<SOURCE_NAME>/source/test/fixtures/asyncapi.yml.",
  "unresolved": [],
  "dependencies": {}
}
```

- `files_written`: every deliverable file written, repo-relative. A directory entry (e.g. `temp/bake-in-template/<SOURCE_NAME>/golden/<fixture>`) stands for every file under it, and intermediate scratch files (e.g. `capture-run-<i>.json`) aren't listed. Translator mode `2a` returns an object keyed by row id, e.g. `{ "S1": ["packages/helpers/src/routes.js", "packages/helpers/src/index.js"] }`.- `summary`: at most five sentences. Translators name the change ids they applied.
- `unresolved`: ids (`A3`, `I7`, `C2`) or tagged strings (`hook-package:<pkg>`, `license:<value>`, `config-key:<key>`, `capture:<fixture>`) the orchestrator must act on.
- `dependencies`: npm package → range. List only the packages that **the template's own code** imports and that `TARGET_PATH/package.json` doesn't list yet. Use an empty object when nothing is needed. Packages the *generated project* needs go into the generated `package.json` content, never here.

## `source-index.json`

The orchestrator writes it with `scan.js` (SKILL.md precondition 5). The examples in this file all describe the hypothetical Nunjucks HTTP server from SKILL.md's run-variable table. Excerpt:

```json
{
  "engine": "nunjucks",
  "config": {
    "supportedProtocols": ["https"],
    "parameters": { "server": { "description": "The server you want to use in the code.", "required": true } },
    "generator": ">=1.0.0 <3.0.0",
    "filters": ["@asyncapi/generator-filters"],
    "hooks": { "@asyncapi/generator-hooks": "createAsyncapiFile" }
  },
  "apiVersion": "none",
  "detectedProtocol": "http",
  "files": [
    {
      "path": "template/src/index.js",
      "origin": "template",
      "kind": "dynamic",
      "filenameTemplated": false,
      "hasConditionals": true,
      "filters": ["routePath", "kebabCase"],
      "includes": [],
      "parserCalls": [{ "line": 12, "receiver": "channel", "method": "hasPublish", "chain": "channel.hasPublish()" }],
      "definesFilters": [],
      "definesHooks": []
    },
    {
      "path": "filters/index.js",
      "origin": "filter",
      "kind": "js",
      "filenameTemplated": false,
      "hasConditionals": false,
      "filters": [],
      "includes": [],
      "parserCalls": [{ "line": 20, "receiver": "channel", "method": "subscribe", "chain": "channel.subscribe().id()" }],
      "definesFilters": ["routePath"],
      "definesHooks": []
    }
  ],
  "builtinFilters": ["safe"],
  "externalFilters": ["kebabCase"],
  "otherConfigKeys": {},
  "testFixtures": ["temp/bake-in-template/<repo>/source/test/fixtures/asyncapi.yml"],
  "testParams": [{ "file": "test/integration.test.js", "text": "{ server: 'production' }" }],
  "missing": []
}
```

| Field | Meaning |
|---|---|
| `engine` | `ENGINE`, as passed to `scan.js`: `nunjucks` or `react` |
| `config` | the source generator config, verbatim (`.ageneratorrc` wins over `package.json` `generator`) |
| `apiVersion` | `config.apiVersion`, or `none` |
| `detectedProtocol` | the protocol folder for `config.supportedProtocols[0]`, or `null` when the config declares none. A known alias maps to the repo's folder (`ws`, `wss` → `websocket`; `kafka-secure` → `kafka`; `mqtts`, `secure-mqtt` → `mqtt`; `amqps` → `amqp`; `https` → `http`); any other protocol keeps its name, lowercased |
| `files[]` | one entry per scanned file (below) |
| `builtinFilters` | used filter names that the capture generator's Nunjucks defines as built-ins (e.g. `safe`) |
| `externalFilters` | used filter names defined neither in `filters/` nor as built-ins; `api-mapper` locates them in the `config.filters` packages |
| `otherConfigKeys` | every config key besides `parameters`, `hooks`, `filters`, `renderer`, `apiVersion`, `generator` and `supportedProtocols`, with its value |
| `testFixtures` | fixtures named in the source tests, as repo-relative local paths: a URL to a file of this repo becomes that path, any other URL is downloaded to `SCRATCH_DIR/fixtures/` |
| `testParams` | `{ file, text }` for each `templateParams` object in the source tests, either written inline or assigned to a variable in the same file |
| `missing` | includes, fixtures and `templateParams` variables the scan couldn't find |

Per `files[]` entry:

| Field | Meaning |
|---|---|
| `path` | relative to `SCRATCH_DIR/source` |
| `origin` | `template`, `filter`, `hook`, `component`, `helper` or `partial`. It comes from the file's top folder, or is `partial` for an included file found anywhere else in the source |
| `kind` | Nunjucks `template`/`partial` files: `dynamic` (contains `{{`, `{%` or `{#`) or `static`. React `template`/`partial` files: `react` for `.js`/`.jsx`, else `static`. Other origins: `js`. Binary files: `binary` |
| `filenameTemplated` | the path contains `$$` (Nunjucks only) |
| `hasConditionals` | contains `{% if` / `{% for`, or (React files and `components/` files) `if`, `switch`, a ternary, `&&` or `.map(` in the code. Text inside generated-code strings doesn't count |
| `filters` | filter names used inside `{{ … }}` and `{% … %}` tags only, so Markdown tables, shell pipes and `\|\|` never count |
| `includes` | the paths named by `{% include %}`, `{% import %}`, `{% from %}` and `{% extends %}` |
| `parserCalls` | candidate method chains `{ line, receiver, method, chain }`: tag lines of `dynamic` files, every line of `react` and `js` files. They are only candidates, e.g. `pathName.startsWith('/')` too; `api-mapper` drops the non-Parser ones |
| `definesFilters` | `origin: filter` only: the exported filter names |
| `definesHooks` | `origin: hook` only: the exported hook types |

## `changes.md`

The orchestrator writes it after `Q-confirm-changes`. The run variable `CHANGES` is `none` when there are no changes.

```markdown
# Changes

## C1
- **User wording:** "remove the Dockerfile"
- **Restated:** The generated project has no `Dockerfile`.
- **Verification:** command `test ! -f {RUN_DIR}/Dockerfile` → exit code `0`
- **Affects:** existing source file `template/Dockerfile`

## C2
- **User wording:** "add a health endpoint"
- **Restated:** `GET /health` on the running server answers HTTP 200.
- **Verification:** command `curl -s -o /dev/null -w "%{http_code}" http://{HOST}:{PORT}/health` → `200`
- **Affects:** new file `src/health.js`; existing source file `template/src/server.js`

## C3
- **User wording:** "nicer log output"
- **Restated:** Startup and per-message log lines start with a timestamp and the channel name.
- **Verification:** manual: start the server, send one message, check the log line format
- **Affects:** existing source file `template/src/handlers/$$channel$$.js`
```

- **Verification:** either `command <cmd> → <expected>`, where `<expected>` is the trimmed stdout or `exit code <n>`, or `manual: <what the user checks at Q-does-it-work>`.
- **Placeholders** that `smoke-runner` fills in: `{PORT}` and `{HOST}` (from its launch adjustments; `{HOST}` defaults to `localhost`), and `{RUN_DIR}` (the absolute path of the run directory `RUNS_DIR/run-<n>`, with forward slashes even on Windows).
- **Affects:** existing source files, new files (by generated path), `.ageneratorrc` parameters, or dependencies.

## `capture.json`

Written by `capturer`. It is reference material only, never a target.

```json
{
  "source": { "url": "https://github.com/<org>/<repo>", "commit": "<full commit SHA>", "engine": "nunjucks", "apiVersion": "none", "generatorVersion": "<CAPTURE_GENERATOR_VERSION>" },
  "runs": [
    {
      "fixture": "temp/bake-in-template/<SOURCE_NAME>/source/test/fixtures/asyncapi.yml",
      "params": { "server": "production" },
      "outputDir": "golden/asyncapi",
      "files": ["golden/asyncapi/src/index.js"]
    }
  ]
}
```

## `api-map.json`

Written by `api-mapper`.

```json
{
  "calls": [
    {
      "id": "A1",
      "old": "channel.hasPublish()",
      "foundIn": ["filters/index.js:34", "template/src/index.js:12"],
      "v3": "channel.operations().filterByReceive().length > 0",
      "helper": null,
      "grepEvidence": ["node_modules/@asyncapi/parser/cjs/models/channel.d.ts: operations(): OperationsInterface;", "node_modules/@asyncapi/parser/cjs/models/operations.d.ts: filterByReceive(): OperationInterface[];"],
      "note": "v2 publish = the application RECEIVES",
      "forChange": null
    },
    {
      "id": "A2",
      "old": "channel.subscribe().id()",
      "foundIn": ["filters/index.js:20"],
      "v3": "channel.operations().filterBySend()[0].operationId()",
      "helper": null,
      "grepEvidence": ["node_modules/@asyncapi/parser/cjs/models/operations.d.ts: filterBySend(): OperationInterface[];", "node_modules/@asyncapi/parser/cjs/models/operation-trait.d.ts:7: operationId(): string | undefined;", "node_modules/@asyncapi/parser/cjs/models/v2/operation-trait.js:11: return this.operationId() || this._meta.id;"],
      "note": "v2 subscribe = the application SENDS. Use operationId(), not id(): the v2 model id() falls back to subscribe or publish, while the old API id() was the operationId only",
      "forChange": null
    }
  ],
  "filters": [
    { "id": "F1", "name": "routePath", "origin": "local", "definedIn": "filters/index.js", "replacement": "new-helper", "callIds": ["A1", "A2"], "grepEvidence": [], "note": null },
    { "id": "F2", "name": "kebabCase", "origin": "package", "definedIn": "temp/bake-in-template/<SOURCE_NAME>/source/node_modules/@asyncapi/generator-filters/src/customFilters.js:<line>", "replacement": "new-helper", "callIds": [], "grepEvidence": ["temp/bake-in-template/<SOURCE_NAME>/source/node_modules/@asyncapi/generator-filters/src/customFilters.js:<line>: filter.kebabCase = …", "grep -rn kebab packages/helpers/src → 0 matches"], "note": "uses lodash; re-implement in plain JS" },
    { "id": "F3", "name": "safe", "origin": "builtin", "definedIn": "temp/bake-in-template/<SOURCE_NAME>/oldgen/node_modules/nunjucks/src/filters.js:<line>", "replacement": "none", "callIds": [], "grepEvidence": ["grep -rn escape apps/react-sdk/src/renderer → 0 matches"], "note": "escaping control only; React renderer output is not escaped" }
  ]
}
```

`calls[]`:

| Field | Meaning |
|---|---|
| `id` | `A<n>` |
| `old` | the chain as written in the source |
| `foundIn` | every `path:line` from `source-index.json`, in any origin, plus package filter files |
| `v3` | the v3 Parser API expression, or `NONE` |
| `helper` | an `@asyncapi/generator-helpers` export that wraps the call, or `null` |
| `grepEvidence` | `path:line: match` lines (or `command → result` for a count) from the greps that confirmed every name in `v3` / `helper`. A row with an empty `grepEvidence` and a `v3` other than `NONE` is invalid |
| `note` | semantics the translator must not get wrong |
| `forChange` | `C<n>` when the row exists only for a change, else `null` |

`filters[]`:

| Field | Meaning |
|---|---|
| `id` | `F<n>` |
| `name` | the filter name |
| `origin` | `local` (source `filters/`), `package` (a `config.filters` package) or `builtin` (Nunjucks) |
| `definedIn` | the defining file (and line) |
| `replacement` | an existing `@asyncapi/generator-helpers` export name, `new-helper` (ported into `packages/helpers` as a new export in Wave 2a), or, for built-ins only, `inline` (plain JS at the call site, expression in `note`) or `none` |
| `callIds` | the `calls[]` rows for the Parser calls inside the filter |
| `grepEvidence` | as for `calls[]`. Empty is allowed only for `origin: local` |
| `note` | why this replacement |

## `inventory.json`

Written by the orchestrator after Wave 1. The ids in this example are illustrative; a real inventory numbers its rows in its own order. Example where C1 is "remove the Dockerfile" and C2 is "add a `/health` route":

```json
{
  "rows": [
    { "id": "S1", "wave": "2a", "source": "filters/index.js#routePath", "kind": "filter", "becomes": "shared-helper", "plannedPath": "packages/helpers/src/routes.js", "exportName": "routePath", "referenceOutput": [], "outputs": [], "apiMapIds": ["F1", "A1", "A2"], "changes": [], "hasConditionals": true, "uncovered": false, "excludedByBuild": false, "usedBy": ["I4"] },
    { "id": "I1", "wave": "copy", "source": "template/.editorconfig", "kind": "static-non-js", "becomes": "copy", "plannedPath": "template/.editorconfig", "referenceOutput": ["golden/asyncapi/.editorconfig"], "outputs": [], "apiMapIds": [], "changes": [], "hasConditionals": false, "uncovered": false, "excludedByBuild": false },
    { "id": "I2", "wave": "copy", "source": "template/src/lib/utils.js", "kind": "static-js", "becomes": "verbatim-component", "plannedPath": "template/src/lib/utils.js.js", "referenceOutput": ["golden/asyncapi/src/lib/utils.js"], "outputs": [], "apiMapIds": [], "changes": [], "hasConditionals": false, "uncovered": false, "excludedByBuild": false },
    { "id": "I3", "wave": "2b", "source": "template/src/server.js", "kind": "static-js", "becomes": "component", "plannedPath": "template/src/server.js.js", "referenceOutput": ["golden/asyncapi/src/server.js"], "outputs": [], "apiMapIds": [], "changes": ["C2"], "hasConditionals": false, "uncovered": false, "excludedByBuild": false },
    { "id": "I4", "wave": "2b", "source": "template/src/index.js", "kind": "dynamic", "becomes": "component", "plannedPath": "template/src/index.js.js", "referenceOutput": ["golden/asyncapi/src/index.js"], "outputs": [], "apiMapIds": ["A1", "A2", "F1", "F2"], "changes": [], "hasConditionals": true, "uncovered": false, "excludedByBuild": false },
    { "id": "I6", "wave": "2b", "source": "template/src/handlers/$$channel$$.js", "kind": "dynamic-per-channel", "becomes": "component-file-array", "plannedPath": "template/src/handlers/channel.js", "referenceOutput": ["golden/asyncapi/src/handlers/userSignedUp.js"], "outputs": [], "apiMapIds": ["A2"], "changes": [], "hasConditionals": true, "uncovered": false, "excludedByBuild": false },
    { "id": "I7", "wave": "-", "source": "template/Dockerfile", "kind": "static-non-js", "becomes": "dropped", "plannedPath": null, "referenceOutput": ["golden/asyncapi/Dockerfile"], "outputs": [], "apiMapIds": [], "changes": ["C1"], "hasConditionals": false, "uncovered": false, "excludedByBuild": false },
    { "id": "I8", "wave": "2b", "source": null, "kind": "new", "becomes": "component", "plannedPath": "template/src/health.js.js", "newPath": "src/health.js", "referenceOutput": [], "outputs": [], "apiMapIds": [], "changes": ["C2"], "hasConditionals": false, "uncovered": false, "excludedByBuild": false },
    { "id": "I9", "wave": "-", "source": "(config hook)", "kind": "hook-output", "becomes": "keep-hook", "plannedPath": null, "hook": "@asyncapi/generator-hooks: createAsyncapiFile", "referenceOutput": ["golden/asyncapi/asyncapi.yaml"], "outputs": [], "apiMapIds": [], "changes": [], "hasConditionals": false, "uncovered": false, "excludedByBuild": false },
    { "id": "I10", "wave": "-", "source": "template/package-lock.json", "kind": "dynamic", "becomes": "dropped", "plannedPath": null, "referenceOutput": ["golden/asyncapi/package-lock.json"], "outputs": [], "apiMapIds": [], "changes": [], "hasConditionals": false, "uncovered": false, "excludedByBuild": false }
  ]
}
```

| Field | Meaning |
|---|---|
| `id` | `S<n>` for `2a` rows, `I<n>` for every other row |
| `wave` | `copy` and `-` (orchestrator / no translation), `2a`, `2b` |
| `source` | path under `SCRATCH_DIR/source`; `<file>#<filter>` for one filter of a file; `(config hook)`; `null` for a new file |
| `kind` | `static-non-js`, `static-js`, `dynamic`, `dynamic-per-channel`, `react`, `filter`, `helper`, `partial`, `component`, `hook`, `new`, `hook-output` |
| `becomes` | `copy` and `verbatim-component` (orchestrator, Wave 2a); `shared-helper` and `shared-component` (translator `2a`); `component`, `component-file-array` and `local-hook` (translator `2b`); `dropped` and `keep-hook` (no translation) |
| `plannedPath` | where the row's code goes, relative to `TARGET_PATH`; for `shared-helper`, the repo-relative `packages/helpers/src/<module>.js`; `null` for `dropped` and `keep-hook` |
| `exportName` | `shared-helper` only: the new `@asyncapi/generator-helpers` export |
| `referenceOutput` | golden files the old template produced for this row (`SCRATCH_DIR`-relative). Reference only |
| `outputs` | repo-relative files written for the row. Starts empty; the orchestrator fills it from each envelope |
| `apiMapIds` | the `api-map.json` rows the translator may use |
| `changes` | change ids that apply to the row |
| `hasConditionals` | from `source-index.json`, or `true` when a change adds a branch |
| `uncovered` | template row with no reference output that no change drops (`Q-uncovered-files`) |
| `excludedByBuild` | a folder in `plannedPath` contains `test`, so the build's copy filter would drop it (`Q-test-folder`) |
| `outputName` | only when `test` in a file name forced a rename: the real name of the generated file |
| `usedBy` | `2a` rows: the rows that import it |
| `newPath` | `kind: new`: the generated path |
| `hook` | `keep-hook`: `<package>: <hook name>` |

## `run-<n>.json`

Written by `smoke-runner`.

```json
{
  "n": 1,
  "runDir": "<repo abs>/temp/bake-in-template/<SOURCE_NAME>/runs/run-1",
  "command": "npm start",
  "install": { "command": "npm install --ignore-scripts --no-audit --no-fund", "exitCode": 0 },
  "adjustments": [{ "file": "<config file>", "change": "port: 80 → port: 49152", "reason": "port 80 needs elevated rights" }],
  "placeholders": { "PORT": "49152", "HOST": "localhost", "RUN_DIR": "<repo abs>/temp/bake-in-template/<SOURCE_NAME>/runs/run-1" },
  "pid": 12345,
  "commandLine": "node .claude/skills/bake-in-template/scripts/launch.js … npm start",
  "url": "http://localhost:49152",
  "startedCleanly": true,
  "running": true,
  "exitCode": null,
  "verifications": [{ "change": "C2", "command": "curl -s -o /dev/null -w \"%{http_code}\" http://localhost:49152/health", "expected": "200", "actual": "200", "passed": true }],
  "log": "first and last 40 lines of run-1.log",
  "logFile": "temp/bake-in-template/<SOURCE_NAME>/runs/run-1.log",
  "errFile": "temp/bake-in-template/<SOURCE_NAME>/runs/run-1.err.log"
}
```

`commandLine` is the string read from the live process right after the start, trimmed of surrounding whitespace, so a later PID check can compare it (also trimmed). The example abbreviates it: on Windows it is the full quoted form, e.g. `"C:\Program Files\nodejs\node.exe" "<repo abs>\.claude\skills\bake-in-template\scripts\launch.js" "…\runs\run-1" … "npm" "start"`. `pid` is the `launch.js` wrapper, which exits when the command does. `log` holds the whole log when it has 80 lines or fewer; it includes the install output. `running` is `false` once `smoke-runner` stopped the process itself (unclean start or failed verification).

## `state.json`

Written by the orchestrator after every wave and every question.

```json
{
  "completedWave": "1",
  "startedAt": "<ISO timestamp>",
  "updatedAt": "<ISO timestamp>",
  "variables": { "SOURCE_URL": "https://github.com/<org>/<repo>", "TARGET_SEGMENTS": "servers/http/javascript" },
  "questions": [{ "id": "Q-role", "question": "Is the generated project a server or a client? The README says: …", "answer": "server", "at": "<ISO timestamp>" }],
  "iterations": 0,
  "gateAttempts": { "build": 0, "templateLint": 0, "suiteLint": 0, "importGate": 0, "templateTest": 0, "helpers": 0, "suiteTest": 0 },
  "runningPids": [{ "pid": 12345, "commandLine": "node .claude/skills/bake-in-template/scripts/launch.js … npm start" }]
}
```

- `completedWave`: `"none"` until Wave 0 finishes, then `"0"`, `"1"`, `"2a"`, `"2b"`, `"3"`, `"4"` or `"final"`. Final cleanup deletes `state.json` right after it is set to `"final"`, so a later run never mistakes a finished run for an interrupted one.
- `gateAttempts`: reset to 0 when Wave 3 completes, so Final starts with 3 attempts per gate.
- `variables`: every run variable from SKILL.md.
- `runningPids[]`: processes the run started and hasn't stopped. Each is stopped only after the PID check in SKILL.md.
