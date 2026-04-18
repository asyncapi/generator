# AGENT.md — AsyncAPI Generator Code Guidelines

This document is the source of truth for code review standards in the `asyncapi/generator` monorepo. It is consumed by CodeRabbit (`knowledge_base.code_guidelines` in `.coderabbit.yaml`) and is intended to be read by both human reviewers and AI agents.

The monorepo contains tightly coupled packages that together form the AsyncAPI code/documentation generation pipeline. Each package has a specific role and its own conventions; this file captures both the shared rules and the per-package deviations.

> If a guideline here conflicts with an inline code comment or a package-local README/CONTRIBUTING, **prefer this file for review decisions** and open a follow-up to reconcile the drift. Guidelines are expected to evolve — flag outdated rules rather than silently working around them.

---

## 1. Repository topology

```text
apps/
  generator/          # @asyncapi/generator — main CLI + Generator class (CJS, Jest)
  hooks/              # @asyncapi/generator-hooks — built-in lifecycle hooks (CJS, Jest)
  keeper/             # @asyncapi/keeper — AJV message validator (ESM → Babel → CJS)
  nunjucks-filters/   # legacy/stub — treat as frozen; do not add features here
  react-sdk/          # @asyncapi/generator-react-sdk — TS React renderer (TS → tsc + Rollup)
packages/
  components/         # @asyncapi/generator-components — shared React template components (JSX)
  helpers/            # @asyncapi/generator-helpers — pure JS helpers over Parser API (CJS, no build)
  templates/clients/  # Per-protocol, per-language client templates (kafka, websocket × JS/TS/Python/Dart/Java)
```

Orchestration is Turborepo (`turbo.json`). Every package-level script (`test`, `lint`, `build`, `docs`) must be runnable through the root `turbo run <script> --filter=<pkg>` — do not introduce scripts that only work from inside a package directory when they need the full workspace graph.

---

## 2. Monorepo-wide rules

### 2.1 Runtime and tooling
- **Node**: `>=24.11`. **npm**: `>=11.5.1`. Do not regress `engines` in any `package.json`.
- **Module style** differs per package (see 4). Do not silently switch a package from CJS to ESM or vice versa; that is a structural change that must be called out in the PR description.
- **No Prettier.** Formatting is enforced entirely through ESLint. Do not add a `.prettierrc` or `prettier` devDependency.

### 2.2 Linting
Every package inherits `/.eslintrc` (root). Package `lint` scripts must invoke it via `--config ../../.eslintrc --ignore-path ../../.eslintignore`.

Hard requirements from the root config (non-exhaustive — see `.eslintrc` for the full list):
- **`--max-warnings 0`** in every lint script. A warning is a blocker.
- `eqeqeq: error`, `no-var: error`, `prefer-const: error`, `prefer-template: error`, `prefer-arrow-callback: error`, `object-shorthand: error`.
- `quotes: single`, `semi: always`, `indent: 2 spaces`, `brace-style: 1tbs`, `no-multiple-empty-lines: max 1`.
- `sonarjs/cognitive-complexity: warn` — treat as a signal to split a function, not to add an `// eslint-disable` line.
- `camelcase` is disabled (templates generate snake_case / kebab-case identifiers for foreign languages), but JS source should still use camelCase by convention.
- `no-unused-vars: error` except for function args — unused function args are allowed because they document signatures.

Rule of thumb: if a lint rule is failing, fix the code. Inline `eslint-disable` is reserved for template source that must emit non-JS syntax.

### 2.3 Commits and PR titles
Conventional Commits are enforced by the repo's `pre_merge_checks.title` rule.
- PR titles start **lowercase**, imperative mood: `add`, `fix`, `refactor`, `document` — not `added`, `fixed`.
- `feat:` / `fix:` are the only prefixes that trigger a changeset release. Use `chore:`, `docs:`, `test:`, `refactor:`, `ci:` for non-releasing changes.
- Any `feat:` or `fix:` in the diff of a publishable package (`apps/*`, `packages/components`, `packages/helpers`) **must be accompanied by a `.changeset/*.md` file** naming the affected packages and the bump level. Flag missing changesets on review.

### 2.4 Documentation and comments

**Packages that require JSDoc on public functions:**

| Package source | Published docs file | Build? |
|---|---|---|
| `apps/generator/lib` | `apps/generator/docs/api.md` | `jsdoc2md`, committed |
| `packages/components/src` | `apps/generator/docs/api_components.md` | `jsdoc2md`, committed |
| `apps/react-sdk/src` | `apps/react-sdk/API.md` | `jsdoc2md`, committed |

Required tags: `@param`, `@returns`, and `@throws` / `@async` where applicable.

"Public" means **exported from the package's main entry, or reachable via that package's jsdoc2md config** — not every file-internal helper. If a symbol shows up in one of the generated MD files, it is public by definition.

**Docs are committed artifacts — regenerate them in the same PR.** CI does not rebuild `api.md` / `api_components.md` / `API.md`. When a public signature in a docs-emitting package changes, regenerate via `turbo run docs --filter=<pkg>` (or `npm run generator:docs` from the root for the generator pipeline) and commit the diff. A source-signature change without a matching docs-file diff is a review flag.

**Comments:** reserve comments for non-obvious *why*. In this codebase the comments that pay rent are **Parser-API quirks** and **AsyncAPI spec workarounds** — mark these with a `// Why:` prefix that cites the spec section or parser issue, so future cleanup passes can tell a load-bearing comment from a stale one.


### 2.5 Release hygiene
- Changesets live in `.changeset/*.md` with frontmatter naming each affected `@asyncapi/*` package and the bump level (`patch`/`minor`/`major`).
- When a PR touches both an app and a consumed package (e.g. `packages/helpers` + `apps/generator`), both must appear in the changeset if either's public behaviour changes.
- Dependency bumps done by `dependabot`/`asyncapi-bot` are exempt from the changeset rule.
- **Release-triggering prefixes are narrower than Conventional Commits.** The release workflow (`.github/workflows/release-with-changesets.yml`) only fires on master-push commits that start with `feat:`, `feat!:`, `fix:`, `fix!:`, or `chore(release):`. A `feat(...)` with a scope still qualifies; `refactor:`/`perf:`/`docs:`/`chore:` (without `(release)`) do not.
- **Major bumps use `!`.** `feat!:` or `fix!:` signals a breaking change and must be paired with a `major` changeset. Don't accept `major` changesets unless the PR title also carries the `!`.
- **The `chore(release): release and bump versions of packages` PR is bot-authored** by `asyncapi-bot` via `changesets/action`. Do not rewrite its title or squash it under a different prefix — the exact `chore(release):` prefix is what re-fires the workflow to publish to npm.

---

## 3. Cross-cutting architectural principles

Drawn from `packages/README.md` ("Assumptions and Principles") and applied on review:

1. **Parser-API, not shape-poking.** When extracting data from an AsyncAPI document, use the Parser API. Never do `binding.json()["query"]["properties"]` or equivalent shape-reaching. If the Parser lacks what you need, add a helper in `packages/helpers` instead of inlining.
2. **Tested helpers over components over inline logic.** Template code should depend on **well-tested** `@asyncapi/generator-helpers` first, then shared components in `@asyncapi/generator-components`, and only drop into template-local components as a last resort. Templates must not reach into the Parser API directly when an equivalent helper exists (or could exist).
3. **Reusability budget.** Every new template or template feature must be built with reusability in mind — custom helpers and template-local components are kept to the minimum. A new shared helper/component is justified when used in templates, or when the logic is too gnarly to test inline. Otherwise, keep it in the template.
4. **Template-type taxonomy (provisional, opinionated).** Templates live under `packages/templates/<type>/<protocol>/<language>` where `type ∈ {clients, sdk, docs, scripts}`. This split is intentionally opinionated and expected to evolve as the types are exercised in practice — treat it as a hard constraint today, but flag friction rather than forking the taxonomy silently. Semantics:
   - `clients` — generates a client library consumable from a server, a standalone app, **or** a server under development (there is deliberately no `server` type — a client used during server development covers that case).
   - `sdk` — richer project generation; an `sdk` template **should extend an existing `clients` template** rather than fork it. If extension isn't feasible, that's a discussion, not a drop-in.
   - `docs` — wraps standard doc generators (HTML, Markdown) that often already exist outside this repo.
   - `scripts` — generates operational scripts (e.g. broker topic setup).
   Do not introduce a new top-level type without an issue + discussion.
5. **Microcks acceptance tests** are the gate for "production-ready" status. A new client template without a Microcks-backed acceptance test (mocks + runtime) is experimental and must be labelled as such in its README. See `packages/templates/clients/websocket/test` for the reference implementation.
6. **Spec-first feature work.** Every new template feature must be cross-referenced against the AsyncAPI 3.0 spec **and** the Parser API before implementation. Link the spec section (raw docs or visualizer) in the PR description, and confirm the data is reachable via Parser API capabilities rather than a workaround.

---

## 4. Per-package guidelines

### 4.1 `apps/generator` — `@asyncapi/generator`

**Role:** main Generator class, CLI entry, template discovery, hooks registry, conditional generation.

**Conventions:**
- **CommonJS only.** `require` / `module.exports`. Do not introduce ESM.
- Main entry: `lib/generator.js` exports the `Generator` class. Public API surface is what `jsdoc2md` publishes to `docs/api.md` — any change there is a breaking-API signal and needs a `minor`/`major` changeset.
- Async I/O uses promisified `fs` wrappers in `lib/utils.js`. Do not use sync `fs` calls in new code.
- Error handling: validate inputs in constructors (see `GENERATOR_OPTIONS` whitelist in `lib/generator.js`); reject with contextual messages; log at `log.debug`/`log.warn` via `loglevel` — never `console.log`.
- User-facing strings live in `lib/logMessages.js` as functions returning strings. Do not inline user-facing strings at call sites — it breaks i18n/consistency.
- Template configuration is loaded from `.ageneratorrc` → `package.json` in `lib/templates/config/loader.js`.
- Conditional file generation: prefer the new `conditionalGeneration` (JMESPath) API over the deprecated `conditionalFiles`. Do not extend `conditionalFiles`.

**Tests:**
- `test/*.test.js` are unit tests; `test/integration.test.js` is the full E2E with `@jest-environment node`. Fixtures in `test/docs/`, test templates in `test/test-templates/`.
- `jest.setTimeout(100000)` is acceptable in integration tests (template transpilation is slow). Not in unit tests.
- Update integration snapshots with `npm run generator:update:snapshot`, never hand-edit `__snapshots__`.
- `pretest` hook builds `react-sdk` and baked-in templates — don't break this chain.

### 4.2 `apps/hooks` — `@asyncapi/generator-hooks`

**Role:** built-in generator lifecycle hooks (currently a `generate:after` hook that writes the source AsyncAPI doc alongside output).

**Conventions:**
- Exports the hook map shape `{ 'generate:after': fn, ... }` — do not rename or restructure this object without coordinating with `apps/generator/lib/hooksRegistry.js`.
- YAML vs JSON detection is by try/catch on `JSON.parse`. Keep this simple; do not introduce a format-detection dependency.

### 4.3 `apps/keeper` — `@asyncapi/keeper`

**Role:** runtime message validator (AJV + AsyncAPI Parser). Used by generated clients to validate inbound/outbound messages.

**Conventions:**
- **ES module source, Babel-transpiled to `lib/` (CJS) on publish.** Edit `src/*.js` only; `lib/*` is build output and must not be committed manually.
- Public API: `compileSchemas`, `validateMessage`, `compileSchemasByOperationId`. All are `async` and throw on validation failure with descriptive messages.
- AJV is used with `allErrors: true` and Draft-07. Do not downgrade or switch draft without cross-checking generated clients that depend on this.
- Tests use Babel-jest and load fixtures from `test/__fixtures__/*.yml`.

### 4.4 `apps/react-sdk` — `@asyncapi/generator-react-sdk`

**Role:** custom React reconciler that renders JSX to strings (not HTML). Provides `Text`, `Indent`, `File` primitives and the Rollup-based template transpiler used by `apps/generator`.

**Conventions:**
- **TypeScript source (`src/**/*.ts[x]`), compiled to `lib/` via `tsc` + Rollup.** `lib/` is build output — review diffs there are almost always a mistake (`prepublishOnly` rebuilds it).
- **No React hooks, no HTML tags, no `Suspense`.** This renderer is not a browser React — document the restriction when a reviewer encounters `useState`, `<div>`, etc.
- Components use `PropTypes` *and* TypeScript interfaces — both. Don't drop one for the other.
- Tests: `src/**/__tests__/*.spec.tsx` via `ts-jest`. Prefer string-output assertions (the renderer output *is* a string) over DOM-style matchers.
- The transpiler uses `@babel/preset-env` + `@babel/preset-react`. Changes to the Babel config affect every downstream template — flag them explicitly in the PR.

### 4.5 `packages/components` — `@asyncapi/generator-components`

**Role:** shared React components used across multiple client templates (e.g. `Models`, `FileHeaderInfo`, `DependencyProvider`).

**Conventions:**
- ES module JSX, Babel-transpiled to `lib/` on publish. Edit `src/`, never `lib/`.
- A component belongs here when it is used by **two or more** language/protocol templates. Single-use components stay in the template's local `/components`.
- Components receive `asyncapi` (parsed document) and template `params` as props. Do not reach into `process.env` or the filesystem from a component.
- Language-specific boilerplate (imports, dependency declarations) is centralised in `DependencyProvider` — add new languages there, not by duplicating across templates.
- **Every shared component must have its own tests.** Reuse means a regression here propagates across every template that depends on the component, so test coverage isn't optional. Tests are integration-style with a real AsyncAPI fixture and `toMatchSnapshot()`. If a snapshot changes, the PR description must explain *why*.

### 4.6 `packages/helpers` — `@asyncapi/generator-helpers`

**Role:** zero-dependency CommonJS utilities over the Parser API (server/URL parsing, operation/message introspection, naming converters, test helpers).

**Conventions:**
- CommonJS; no build step. `src/` is published directly via `main: src/index.js`.
- All helpers are **synchronous and pure** (no I/O) except the testing utilities in `src/testing.js`. A helper that needs I/O probably belongs in `apps/generator`.
- Every helper must have unit tests that exercise it with a real AsyncAPI fixture. Mocked Parser objects are a last resort and require a comment explaining why a fixture wasn't feasible.
- Error handling: prefer throwing `Error` with a descriptive message on invalid input — that's the default. Returning `null`/`undefined` to signal "not found"/"not applicable" is acceptable **only** when the absence is a legitimate result the caller is expected to handle (e.g. an optional field lookup), not for invalid input. When a helper does return nullish, document it in the JSDoc `@returns` and cover both branches in tests; otherwise, throw.
- Naming helpers (`toSnakeCase`, `toCamelCase`, etc.) must be covered for Unicode and already-transformed input.

### 4.7 `packages/templates/clients/*` — client templates

**Role:** per-protocol, per-language client library generators. Currently: `kafka/java/quarkus`, `websocket/{javascript,python,dart,java/quarkus}`.

**Structure** (every client follows this):
```text
<client>/
  template/       # JSX files that render each generated file (client.py.js, README.md.js, ...)
  components/     # Language-specific React components (Constructor.js, Send.js, ...)
  test/
    components/   # Jest snapshot tests per component
    __fixtures__/ # AsyncAPI YAML inputs
    temp/         # Scratch output (rimraf'd)
    <lang>/       # Acceptance tests in the target language (pytest, JUnit, Jest, ...)
```

**Conventions:**
- **Template-local component tests are conditional-only.** A template-local component (under `<client>/components/`) gets a dedicated snapshot test **only when it contains conditional rendering or variant logic** that needs explicit coverage (e.g. branches per server, query-param shape, or operation type). Purely presentational components are covered by the template's integration/acceptance tests — do not add snapshot tests for them just for coverage's sake. When snapshots *do* exist, they are authoritative: do not delete snapshot tests to silence diffs — regenerate them and justify the change in the PR.
- **Shared protocol fixture for component tests.** Each protocol keeps a shared AsyncAPI fixture that exercises the full component surface — for WebSocket this is [`packages/templates/clients/websocket/test/__fixtures__/asyncapi-websocket-components.yml`](packages/templates/clients/websocket/test/__fixtures__/asyncapi-websocket-components.yml). Reuse this fixture for component tests in new WebSocket clients instead of authoring a one-off YAML; extend it (and update dependent snapshots) when a new component variant genuinely isn't representable by the existing spec.
- **Acceptance tests gate "production".** A template without a Microcks-backed acceptance test is experimental. New templates are expected to start experimental and graduate.
- Template files must render valid target-language syntax — reviewers should mentally lint the generated output (indentation, imports, naming) against the language's idiomatic style, not just JS conventions.
- **Shared integration tests live under `packages/templates/clients/<protocol>/test/integration-test/`** and use common test helpers (`common-test.js`). Only add template-specific tests when the shared ones don't cover a feature. Every client must be registered in the protocol's `integration.test.js` `languageConfig` (template path, output path, expected client filename) — an unregistered client is not actually under integration coverage.
- **Per-client test isolation (`TEST_CLIENT` env var).** Integration runs are scoped to a single client via `TEST_CLIENT=<client> jest`, orchestrated by per-client npm scripts (`test:<client>` / `test:<client>:update`). The aggregate `test` / `test:update` scripts run each client sequentially, never in one jest invocation. Three rules follow:
  1. Every describe block must be wrapped by the `runTestSuiteForClient('<client>', () => { ... })` dispatcher so unrelated suites don't execute when `TEST_CLIENT` is set. Unwrapped describes leak into every run and re-introduce the cross-client pollution this setup exists to prevent.
  2. `beforeAll` cleanup must scope to the targeted client's `testResultPath` (via `getConfig(process.env.TEST_CLIENT)`), not blanket-clean all clients — otherwise a single-client update wipes artefacts from clients that weren't run.
  3. Snapshot files are per-client via a custom `snapshotResolver.js` that appends `.<client>` to the snapshot filename (`integration.test.js.<client>.snap`).  
- **Adding a new client to integration tests** requires all four: (a) a `languageConfig` entry, (b) a `runTestSuiteForClient` describe wrapper, (c) `test:<client>` + `test:<client>:update` scripts chained into the root `test` / `test:update`, and (d) running `npm run test:<client>:update` once to generate the client's isolated snapshot. A PR missing any of these is incomplete.

### 4.8 `apps/nunjucks-filters`

Treat as **frozen**. This predates the React template architecture. Do not add features; only accept changes that remove it or migrate away.

---