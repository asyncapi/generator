# test-wirer

You give the new template its tests. Every baked-in template gets integration tests in its protocol's single suite at `SUITE_PATH` (AGENTS.md §4.7), so neither the location nor whether to have tests is a question. You extend that suite, or create it if it doesn't exist. You also write component tests for template-local components with conditional rendering, and generate every snapshot through the scripts, never by hand.

## Inputs

From the spawn prompt:
- the run-variable table: `TARGET_PATH`, `TARGET_SEGMENTS`, `SUITE_PATH`, `SUITE_EXISTS`, `INTEGRATION_KEY`, `ROLE`, `PROTOCOL`, `FIXTURES`, `SCRATCH_DIR`;
- the path of `SCRATCH_DIR/inventory.json`;
- the `ROLE`-matching fixture (the rule is in SKILL.md, Wave 4), or `none`. With `none`, write `asyncapi-<ROLE>.yml` as Branch C step 5 describes, whichever branch you are in, and use it wherever this file says "the `ROLE`-matching fixture".

Read the [WebSocket test README](../../../../packages/templates/clients/websocket/test/README.md) and the websocket suite (`packages/templates/clients/websocket/test/integration-test/`): its `package.json`, `jest.config.js`, `snapshotResolver.js`, `integration.test.js` and `common-test.js`. It is the model for every branch.

**Bugs.** When a snapshot shows that a template file is wrong (e.g. it throws, or prints a broken value), don't fix the template: generate the snapshot anyway, and put the owning row id in `unresolved` with what you saw in `summary`. The orchestrator routes it to a translator.

## Pick the branch

- `SUITE_EXISTS = false` → **Branch C**.
- The suite's `package.json` has `test:<key>` scripts that set `TEST_CLIENT`, and its `integration.test.js` defines `runTestSuiteForClient` → **Branch A** (per-client scoped, like websocket).
- Otherwise → **Branch B** (a single client with no scoping, like kafka today).

## Branch A — add to a scoped suite

Follow "Adding a new client to integration tests" in the WebSocket test README:
1. Add `languageConfig['<INTEGRATION_KEY>']` to `integration.test.js`, with `testResultPath: path.resolve(__dirname, '<R>/test/temp/snapshotTestResult')` and `template: path.resolve(__dirname, '<R>')`, where `<R>` is `../../` plus the segments after the protocol (`../../javascript`, `../../java/quarkus`). Add a `clientFileName` only if the template declares that parameter.
2. Wrap a new describe block in `runTestSuiteForClient('<INTEGRATION_KEY>', () => { … })`.
3. In the suite's `package.json`, add `"test:<KEY>": "cross-env TEST_CLIENT=<KEY> jest"` and `"test:<KEY>:update": "cross-env TEST_CLIENT=<KEY> jest -u"`. Append `&& npm run test:<KEY>` to `test` and `&& npm run test:<KEY>:update` to `test:update`.

## Branch B — add scoping to a single-client suite, then add the client

The existing client's snapshots must stay byte-identical.

1. Note the existing client's key: its path segments after the protocol, joined with `-` (kafka: `java-quarkus`).
2. Copy `snapshotResolver.js` from the websocket suite verbatim, and add `snapshotResolver: './snapshotResolver.js'` to the suite's `jest.config.js`.
3. In `integration.test.js`:
   - flatten `languageConfig` (`languageConfig.java.quarkus` → `languageConfig['java-quarkus']`), both where it is defined and where the describe block reads it;
   - copy `getConfig` and `runTestSuiteForClient` from the websocket suite;
   - make `beforeAll` clean `getConfig(process.env.TEST_CLIENT)` the way the websocket suite does, so a scoped run cleans only its own client's output. (The old `beforeAll` passed the nested `{ quarkus: {…} }` object, which worked: `cleanTestResultPaths` in `packages/helpers/src/testing.js` walks nested configs. The change is for scoping, not a bug fix.);
   - wrap the existing describe block in `runTestSuiteForClient('<existingKey>', …)`.
4. In the suite's `package.json`:
   - add `test:<existingKey>` / `test:<existingKey>:update` with `cross-env TEST_CLIENT=<existingKey>`;
   - set `test` to `npm run test:<existingKey>` and `test:update` to `npm run test:<existingKey>:update`;
   - add `cross-env` at the websocket suite's range to `devDependencies`.
5. Rename the snapshot to the name the resolver now looks for:
   ```bash
   git mv <SUITE_PATH>/__snapshots__/integration.test.js.snap <SUITE_PATH>/__snapshots__/integration.test.js.<existingKey>.snap
   ```
6. **Prove the existing client didn't change** before adding the new one. `--ci` makes a missing or renamed snapshot fail instead of being written:
   ```bash
   (cd <SUITE_PATH> && npx cross-env TEST_CLIENT=<existingKey> jest --ci)
   git diff HEAD -M --name-status -- <SUITE_PATH>/__snapshots__/
   ```
   The jest run must pass. The diff must print exactly one line, `R100	…integration.test.js.snap	…integration.test.js.<existingKey>.snap`. If either fails, stop: return `success: false` with the output in `summary`. Never update the existing client's snapshots.
7. Now add the new client exactly as in Branch A.

## Branch C — create the suite

Create `SUITE_PATH`, modeled on the websocket suite:

1. **`package.json`.** The `name` must be unique among workspaces, or the root `npm install` fails. Copying the websocket suite's `@asyncapi/template-integration-test` would collide, so use `@asyncapi/template-<type>-<protocol>-integration-test` (e.g. `@asyncapi/template-servers-http-integration-test`). That name also matches the root `templates:test` filter (`@asyncapi/template*`). Check that no workspace uses it yet: `Grep` for `"name": "<that name>"` in `**/package.json`; expect no match.
   ```json
   {
     "name": "@asyncapi/template-<type>-<protocol>-integration-test",
     "private": true,
     "description": "Integration tests for all the <protocol> <type>",
     "scripts": {
       "test": "npm run test:<KEY>",
       "test:update": "npm run test:<KEY>:update",
       "test:<KEY>": "cross-env TEST_CLIENT=<KEY> jest",
       "test:<KEY>:update": "cross-env TEST_CLIENT=<KEY> jest -u",
       "lint": "eslint --max-warnings 0 --config ../../../../../../.eslintrc --ignore-path ../../../../../../.eslintignore .",
       "lint:fix": "eslint --fix --max-warnings 0 --config ../../../../../../.eslintrc --ignore-path ../../../../../../.eslintignore ."
     },
     "license": "Apache-2.0",
     "dependencies": { "@asyncapi/generator-helpers": "<the version apps/generator/package.json pins>" },
     "devDependencies": "<copy the websocket suite's devDependencies verbatim>"
   }
   ```
2. **`jest.config.js` and `snapshotResolver.js`:** copy the websocket suite's verbatim. The suite sits at the same depth, so the `../../../../../../jest.config.base` path stays valid.
3. **`common-test.js`:**
   ```js
   const Generator = require('@asyncapi/generator');
   const { verifyDirectoryStructure, getDirElementsRecursive } = require('@asyncapi/generator-helpers');

   jest.setTimeout(100000);

   /**
    * Generates a project from a template and snapshots every generated file.
    *
    * @param {string} template Template directory.
    * @param {string} outputPath Directory to generate into.
    * @param {string} asyncapiPath AsyncAPI document to generate from.
    * @param {object} params Template parameters.
    * @returns {Promise<void>}
    */
   async function generateAndVerify(template, outputPath, asyncapiPath, params) {
     const generator = new Generator(template, outputPath, { forceWrite: true, templateParams: params });
     await generator.generateFromFile(asyncapiPath);
     const directoryElements = await getDirElementsRecursive(outputPath);
     await verifyDirectoryStructure(directoryElements, outputPath);
   }

   module.exports = { generateAndVerify };
   ```
4. **`integration.test.js`:** `languageConfig` with `'<KEY>'` (as in Branch A step 1), `getConfig` and `runTestSuiteForClient` copied from the websocket suite, a `beforeAll` that cleans `getConfig(process.env.TEST_CLIENT)`, and one describe block per client wrapped in `runTestSuiteForClient`. Its test is the template-specific test described under "In every branch" below. Reference repo files from the suite by relative path, e.g. `path.resolve(__dirname, '../../../../../../<repo-relative path>')`.
5. **Fixture.** Reuse the `ROLE`-matching fixture when one exists in another type's `__fixtures__` of the same protocol, referenced by relative path. From `packages/templates/servers/<protocol>/test/integration-test/`, a fixture of the protocol's clients is `path.resolve(__dirname, '../../../../clients/<protocol>/test/__fixtures__/<fixture>.yml')`. Otherwise write `packages/templates/<type>/<protocol>/test/__fixtures__/asyncapi-<ROLE>.yml`: an AsyncAPI 3 version of the capture fixture, written from `ROLE`'s perspective. In v3, operations describe what the application itself does, so a v2 `publish` becomes a v3 `receive` for the application, and a v2 `subscribe` becomes a `send`. Verify it with `node .claude/skills/bake-in-template/scripts/fixture-info.js <file>`: it must print a `version` of `3.0.0` (or later) and send/receive counts matching your intent.

The suite must run through `turbo run test --filter=@asyncapi/template-<type>-<protocol>-integration-test`.

## In every branch

- **Common tests or a template-specific test.** Call the suite's shared `runCommonTests` only if the template supports every option it exercises. For websocket, that means `.ageneratorrc` declares `clientFileName`, `customClientName` and `appendClientSuffix`; check with `Grep`. Otherwise write one **template-specific test** in the new describe block, on the `ROLE`-matching v3 fixture, with parameters valid for it (`server` set to one of its `servers` ids). It calls the generate-and-snapshot helper from the suite's `common-test.js`: `generateAndVerifyClient` in an existing suite (add it to `module.exports`, because the existing suites don't export it), `generateAndVerify` in a new one. Never point a test at a `FIXTURES` path: those usually sit under the gitignored `temp/`, so the test would pass locally and fail in CI.
- **Component tests.** Write one for every inventory row with `hasConditionals: true` whose `plannedPath` starts with `components/`. Components with no logic, and every file under `template/`, are covered by the integration tests (AGENTS.md §4.7). Name the file `TARGET_PATH/test/components/<base>.test.js`, where `<base>` is the `plannedPath` basename up to its first `.` (`components/Banner.js` → `Banner`), because the orchestrator's coverage check looks for that name. Follow `packages/templates/clients/websocket/javascript/test/components/CompileOperationSchemas.test.js`: parse the protocol's one shared fixture (the one the sibling templates' component tests parse; for a new type, the `ROLE`-matching fixture) with `fromFile(new Parser(), path).parse()`. Never add a second fixture to a `__fixtures__/` folder (AGENTS.md §4.7). When a branch isn't expressible in the shared fixture, extend it, then run `npm run test:update` and `npm test` in every sibling template whose tests read that fixture, and list their changed snapshots in `files_written`. Then call `render(<Component … />)` from `@asyncapi/generator-react-sdk`, and `expect(result).toMatchSnapshot()`. Cover each branch of the conditional: one test per branch, with props or fixtures that select it; when one fixture renders every branch at once, one snapshot plus a `toContain` check per branch is enough.
- **Helper tests.** For every `shared-helper` row, test its `exportName` in `packages/helpers/test/<module>.test.js`, named after the `plannedPath` module (extend the file if it exists). Follow `packages/helpers/test/utils.test.js`, and import from `@asyncapi/generator-helpers`. A helper that reads the document gets a parsed real fixture from `packages/helpers/test/__fixtures__/` (`fromFile(new Parser(), path).parse()`): reuse one there, or add one when none expresses the case. A helper of plain values (strings, URLs) takes inline values and needs no fixture. Cover each case the source filter handled, including a missing value. Then run `(cd packages/helpers && npm test)`; it must pass (AGENTS.md §4.6).
- **Snapshots:** generate them through the scripts, never by hand:
  ```bash
  (cd <SUITE_PATH> && npm run test:<INTEGRATION_KEY>:update)
  (cd <TARGET_PATH> && npm run test:update)
  ```
  Then run both again without `:update`; they must pass. Commit-ready snapshots are part of the template (WebSocket test README, step 4).
- **Lint** what you wrote: `(cd <SUITE_PATH> && npm run lint)` and `(cd <TARGET_PATH> && npm run lint)`. Both must pass with no warnings.

## Return

The envelope, with `files_written` listing every file you created or changed, snapshots included. `summary` names the branch you took and the test count per file.
