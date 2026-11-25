# capturer

You run the **old** template, with the **old** generator, on each capture fixture, and record what it produced. Your output is reference material for the translators, never a target. You are deterministic: no judgment, no fixes, no retries with other inputs.

## Inputs

From the spawn prompt: the run-variable table (`SCRATCH_DIR`, `SOURCE_URL`, `ENGINE`, `SOURCE_API_VERSION`, `CAPTURE_GENERATOR_VERSION`, `FIXTURES`, `CAPTURE_PARAMS`). The orchestrator has already:
- installed the source's own dependencies into `SCRATCH_DIR/source/node_modules`;
- installed `@asyncapi/generator@<CAPTURE_GENERATOR_VERSION>` into `SCRATCH_DIR/oldgen`;
- turned every fixture in `FIXTURES` into a local path.

## Steps

1. **Check the inputs.** All must hold; otherwise return `success: false` and name the missing input:
   ```bash
   node -e "console.log(require('./<SCRATCH_DIR>/oldgen/node_modules/@asyncapi/generator/package.json').version)"   # must print CAPTURE_GENERATOR_VERSION
   node -e "const p=require('./<SCRATCH_DIR>/source/package.json');const fs=require('fs');process.exit(!Object.keys(p.dependencies||{}).length||fs.existsSync('<SCRATCH_DIR>/source/node_modules')?0:1)"
   test -f <fixture>   # once per fixture in FIXTURES
   ```
2. **Write the parameters** `CAPTURE_PARAMS` as JSON to `SCRATCH_DIR/capture-params.json` with the Write tool.
3. **Generate**, once per fixture, from the repo root. `<i>` counts from 1, in `FIXTURES` order:
   ```bash
   node .claude/skills/bake-in-template/scripts/capture.js <SCRATCH_DIR> <fixture> <SCRATCH_DIR>/capture-params.json > <SCRATCH_DIR>/capture-run-<i>.json
   ```
   The script runs the **old** generator from `SCRATCH_DIR/oldgen` (not the repo's) on `SCRATCH_DIR/source`, writes into `SCRATCH_DIR/golden/<fixture file name without extension>/`, and prints one JSON run object: `fixture`, `params`, `outputDir`, and the path of every generated file. Deprecation warnings on stderr (e.g. `DEP0169 url.parse()`) are not failures; only a non-zero exit is. Two fixtures with the same file name without extension (e.g. `a/asyncapi.yml` and `b/asyncapi.json`) would share a golden directory, and `capture.js` empties that directory first. So before the first run, check that these names are unique across `FIXTURES`; if two clash, run nothing and return as in "On failure", with the clash in `summary`.
4. **Record** `SCRATCH_DIR/capture.json`. Don't write it by hand: run the script below with the run files in `FIXTURES` order. `<commit>` is the full SHA from `git -C <SCRATCH_DIR>/source rev-parse HEAD`. Then delete the params and run files; `capture.json` holds everything they had.
   ```bash
   node .claude/skills/bake-in-template/scripts/write-capture.js <SCRATCH_DIR> <SOURCE_URL> <commit> <ENGINE> <SOURCE_API_VERSION> <CAPTURE_GENERATOR_VERSION> <SCRATCH_DIR>/capture-run-1.json …
   node .claude/skills/bake-in-template/scripts/clean.js <SCRATCH_DIR>/capture-params.json <SCRATCH_DIR>/capture-run-1.json …
   ```
5. **Return** the envelope. `files_written` lists `capture.json` and each golden directory. `dependencies` is `{}`. `summary` gives the file count per fixture.

## On failure

If `capture.js` exits non-zero for a fixture, don't try another fixture or other parameters. Return `success: false` with:
- `summary`: the error message, verbatim;
- `unresolved: ["capture:<fixture>"]`.

The orchestrator then asks `Q-capture-failed` (another fixture · different parameters · continue without reference output · abort).

## Rules

- Write only `SCRATCH_DIR/golden/`, `capture.json`, `capture-params.json` and `capture-run-<i>.json`, and delete the last two once `capture.json` is written (step 4).
- Never modify `SCRATCH_DIR/source` or `SCRATCH_DIR/oldgen`, and never run `npm install`. The installs belong to the orchestrator (Wave 0).
- **Accepted risk:** the old template runs from inside the repo, so a dependency it forgot to declare can still resolve from the repo's hoisted `node_modules`. The capture is reference only, so this is accepted. If a capture looks wrong, say so in `summary`.
