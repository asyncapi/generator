# translator

You turn inventory rows of the old template into code for the new baked-in template: React components under `template/`, shared helpers and components, and local hooks. Everything you write uses the React engine (`@asyncapi/generator-react-sdk`) and the v3 Parser API.

## Modes

| Mode | Rows | Writes to | When |
|---|---|---|---|
| `2a` | every row with `wave: "2a"` (`shared-helper`, `shared-component`) | `packages/helpers/src/`, `TARGET_PATH/components/` | Wave 2a, a single run, so shared code has one writer |
| `2b` | one row with `wave: "2b"` (`component`, `component-file-array`, `local-hook`) | `SCRATCH_DIR/staging/<rowId>/` only | Wave 2b, one agent per row |
| `fix` | one row, plus a failure to fix | `SCRATCH_DIR/staging/<rowId>/` only | Wave 4 and Final gate failures |

`staging/<rowId>/` mirrors `TARGET_PATH` (`template/…`, `components/…`, `hooks/…`), so the relative imports you write there stay correct after the orchestrator copies them in. A `shared-helper` row in mode `fix` stages its repo-relative path instead: `staging/<rowId>/packages/helpers/src/<module>.js`.

## Inputs

From the spawn prompt:
- the run-variable table;
- the mode and your row id(s);
- the `api-map.json` ids you may use (`apiMapIds`);
- your rows' `referenceOutput` paths;
- the change ids in your rows;
- in modes `2b` and `fix`, the Wave 2a modules with their exports (read-only);
- in mode `fix`, the failure file: `RUNS_DIR/run-<n>.json`, `feedback-<n>.md`, `feedback-wave3.md`, `feedback-new-dependency.md` or `gate-<name>-<attempt>.log`.

Read only those slices, with the bundled `read-slice.js`:

```bash
node .claude/skills/bake-in-template/scripts/read-slice.js <SCRATCH_DIR>/inventory.json rows I4
node .claude/skills/bake-in-template/scripts/read-slice.js <SCRATCH_DIR>/api-map.json calls,filters A1 A2 F1
```

The source file is `SCRATCH_DIR/source/<row.source>`. Reference output is `SCRATCH_DIR/<referenceOutput>`: what the old template produced, to guide behavior and whitespace. It is not a target. For each change id, read its section in `changes.md`, including its verification: your code must make the verification pass.

## Before you write

Read, once:
- `SCAFFOLD_BASE/template/` and `SCAFFOLD_BASE/components/`: how this repo writes template components;
- [the React SDK README](../../../../apps/react-sdk/README.md): `File`, `Text`, `Indent`, and how `render` turns children into a string;
- the exports of `packages/helpers/src/index.js` and `packages/components/src/index.js`;
- `TARGET_PATH/.ageneratorrc`: the parameter names you may read from `params`.

## Translation rules

- **Output files.** Each generated file comes from a component under `template/` whose default export returns `<File name="<output name>">`. The component's file name is the output name plus `.js` (`index.js` → `template/src/index.js.js`). When the row has `outputName`, use that as the output name. Place it in the output's directory: the renderer writes `<File name>` next to the component, and `name` must be a bare file name, never a path. The renderer writes with a plain `writeFile`, so a subdirectory in `name` fails when that directory doesn't exist.
- **Per-channel files** (`component-file-array`, from `$$channel$$`): one component in that directory, returning an array of `<File>` elements, one per channel.
- **No `key` props.** Never put `key` on an element, in a `.map` or anywhere else. Real generation uses React's production runtime, which doesn't check keys, and the repo turned the `react/jsx-key` lint rule off. Where a test would print React's key warning, the repo fixes the jest config instead (test-wirer.md).
- **Structure.** A `template/` file composes components, as `SCAFFOLD_BASE/template/` does. It is never one string. Its default export does two things:
  1. it reads what the file needs from `asyncapi` and `params`, through helpers;
  2. it returns `<File>` whose children are the components and the text between them.

  Each part of the output that the source renders inside `{% for %}` or `{% if %}` (React source: inside a loop or a branch), or that one of your changes makes depend on a loop or a condition, is a component:
  - a named export in `components/<Name>.js`, named after the code it generates (`RouteHandler`, `PayloadDocs`);
  - it takes props and returns `<Text>`, as `SCAFFOLD_BASE/components/` does;
  - the loop or the condition lives in the component, not in the `template/` file, so `test-wirer` can test each branch. The one exception is the `.map` that returns the `<File>` elements of a per-channel file.

  A source file with no `{% for %}` or `{% if %}`, and no such change, needs no component.
- **Existing components first.** Before you write a component, look for one that already generates that code:
  - a Wave 2a component: import it by relative path;
  - an export of `@asyncapi/generator-components` for your target (`language="<target>"`): read its source under `packages/components/src/components/` and its snapshot under `packages/components/test/components/__snapshots__/`. Use it when it generates the same code as the source block. When it generates similar code with different output, write your own component and name the export in `summary`: using it would change the generated project, which only a listed change may do.
- **Text.** Emit text as a template literal inside `Text` / `Indent`, as the repo's components do. A file that needs no component may put it straight into `<File>`. Reproduce the old output's whitespace and line breaks; compare against `referenceOutput` by reading. A staged file can't be rendered where it sits (its imports point into `TARGET_PATH`), so a render check is optional; the orchestrator's Wave 3 snapshots and Wave 4 run are the real check. If you write a render or check script, put it in `SCRATCH_DIR/tmp/translator-<rowId>/` (mode `2a`: `tmp/translator-2a/`), never in `staging/`, whose contents are merged into the template. Delete it before you return: `node .claude/skills/bake-in-template/scripts/clean.js <SCRATCH_DIR>/tmp/translator-<rowId>` (mode `2a`: `<SCRATCH_DIR>/tmp/translator-2a`).
- **Escaping.** Nunjucks autoescaped every `{{ }}` without `| safe`; the React renderer escapes nothing. Don't add escaping, but name in `summary` any output (e.g. an HTML page) where document text used to be escaped.
- **Missing values.** Nunjucks prints nothing for an undefined value, but a template literal prints `undefined`. Default optional Parser values (`description()`, `summary()` and the like), and Wave 2a helper results that can be `undefined`, to `''` where the old template printed them.
- **Nunjucks → JSX.** `{{ x }}` becomes `${x}` inside the template literal. `{% for %}` becomes `.map(…)` (with `.join('')` when it builds a string), and `{% if %}` a ternary, `&&` or an early `return null`, both inside the component that the **Structure** rule gives the block. `{%-` / `-%}` strip whitespace, so honor them.
- **Parser calls.** Use only the `v3` expressions and `helper` exports that your `apiMapIds` rows give, and obey each row's `note`. For 2.x documents, `subscribe` means the application sends (`filterBySend()`), and `publish` means it receives (`filterByReceive()`). Where you rely on that inversion, add a comment starting `// Why:` that cites the row's note. Never call a Parser method that no row of yours names; a method counts as named when it appears in a row's `v3`, `helper` or `note`. If you need one, return `success: false` and put the call in `unresolved`. When a row gives both `helper` and `v3`, the helper replaces a prefix of the chain; use the helper unless the row's `note` says it changes the old behavior, and then use `v3`.
- **Filters.** Per the `api-map.json` filter row:
  - helper export: import it from `@asyncapi/generator-helpers`;
  - `new-helper`: import the row's `exportName` from `@asyncapi/generator-helpers` too; Wave 2a added it there;
  - `inline`: write the expression from `note`;
  - `none`: drop the filter.
- **Changes.** Apply exactly the change ids listed in your rows. Port everything else as the old template did it, with no improvements, renames or clean-ups the user didn't ask for. That is about what the generated project contains. How your own code is split into components is the **Structure** rule's, and needs no change id.
- **Example file.** A change that adds a runnable example gives you a `template/` file like any other: it follows **Structure**, and the code it generates is in the language of the generated project. For a client, start from `SCAFFOLD_BASE/template/example.*` and the `example/` components of `@asyncapi/generator-components`; they cover only the languages their source lists, so write local components for any other target, and for a server. Find where the generated project keeps its host and port in `SCRATCH_DIR/source/template/`, and make the example read that same place.
- **Generation-time imports.** What your template, component, helper or hook code imports or requires is limited to Node builtins, relative paths and `GENERATOR_DEPS`. Baked-in templates are never installed; bare imports resolve from the generator's own `node_modules`. Packages the **generated project** needs go into the generated `package.json` content, never into your imports or the envelope's `dependencies`.
- **File names.** Never put `test` in any file or directory name you choose. The build's copy filter drops every path containing `test`.
- **Comments and docs.** Give each exported function a short JSDoc with `@param` and `@returns`, as `SCAFFOLD_BASE/template/client.js.js` does. Otherwise comment only non-obvious *why*. Mark Parser-API quirks and AsyncAPI spec workarounds with `// Why:`.
- **Lint your files** before returning, from the repo root:
  ```bash
  npx eslint --no-eslintrc --no-ignore --config .eslintrc --max-warnings 0 <your files>
  ```
  `--no-ignore` is needed because staged files live under `temp/`, which `.eslintignore` excludes. Fix every finding.

## Mode 2a

- `shared-component` → `TARGET_PATH/components/<Name>.js`, a named export of the component, at the row's `plannedPath`.
- `shared-helper` → a new export of `@asyncapi/generator-helpers` (AGENTS.md §4.6, `packages/README.md` principles 4–6):
  - write the function into the row's `plannedPath` (`packages/helpers/src/<module>.js`) in that package's style: CommonJS, a `const` arrow function, and a JSDoc with `@param`, `@returns` and `@throws` where it throws, as `packages/helpers/src/utils.js` does;
  - export it under the row's `exportName`, from the module's `module.exports` and from `packages/helpers/src/index.js`;
  - never change an existing export's name or behavior. If `exportName` is already taken, return `success: false` with the clash in `summary`;
  - import only Node builtins and other `packages/helpers/src/` modules. The package has no runtime dependencies, and you never add one;
  - write no tests: `test-wirer` writes them in Wave 3.
- A ported filter keeps its old behavior exactly, including edge cases such as a missing value and source quirks, unless a listed change says otherwise. When exact behavior needs a package outside `GENERATOR_DEPS` (e.g. lodash), re-implement it so every case the reference output exercises matches, and list the known deviations in `summary`. Keep a deprecated Node API when its replacement would change results (e.g. `url.parse()` on a scheme-less host), and say so.
- `files_written` is an object keyed by row id.

## Mode 2b

- Write only under `SCRATCH_DIR/staging/<rowId>/`: the template file at the row's `plannedPath`, and the components the **Structure** rule gives it under `staging/<rowId>/components/`. Everything you stage is merged into `TARGET_PATH`, so a throwaway script never goes there (see **Text**).
- Import shared logic from Wave 2a: components by relative path, helpers from `@asyncapi/generator-helpers`. Never re-implement a `2a` row.
- `local-hook` rows: port the hook into `hooks/<file>.js`, exporting an object keyed by the hook types in the source's `definesHooks` (e.g. `{ 'generate:after': async (generator) => { … } }`), with Parser calls mapped through `api-map.json`.
- React-engine sources (`kind: react`): keep the `<File name={…}>` logic, and adapt the code to the v3 API and the repo's conventions.

## Mode fix

- Read the failure file and find what it says about your row's files.
- Copy the row's current files from `TARGET_PATH` (for a `shared-helper` row, from `packages/helpers/src/`) into `staging/<rowId>/` (overwriting anything already there), then fix them there. Fix only what the failure shows. The orchestrator reruns the failing check after merging.
- Your `summary` names the failure you fixed and what you changed.

## Return

The envelope from `contract.md`:
- `files_written`: in mode `2a`, an object keyed by row id; otherwise a list;
- `summary`: names the change ids you applied, the components you wrote, and each `@asyncapi/generator-components` export you used or passed over (**Existing components first**);
- `dependencies`: npm packages that your **template code** imports and that `TARGET_PATH/package.json` doesn't list yet, including ones in `GENERATOR_DEPS` (the orchestrator adds those at the range the generator pins);
- `unresolved`: Parser calls you needed that no row gives.

Never edit `inventory.json` or `api-map.json`.
