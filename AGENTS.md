# AGENT.md — AsyncAPI Generator Code Guidelines

This document is the source of truth for code review standards in the `asyncapi/generator` monorepo. It is consumed by CodeRabbit (`knowledge_base.code_guidelines` in `.coderabbit.yaml`) and is intended to be read by both human reviewers and AI agents.

The monorepo contains tightly coupled packages that together form the AsyncAPI code/documentation generation pipeline. Each package has a specific role and its own conventions; this file captures both the shared rules and the per-package deviations.

---

## Referenced documents

The guidelines below cross-reference the following authoritative docs. If a path or URL changes, update it **here only** — all inline mentions use reference-style links that resolve to this section.

[contributing-commits]: CONTRIBUTING.md#conventional-commits
[development-release]: Development.md#release-process
[packages-readme]: packages/README.md
[hooks-guide]: apps/generator/docs/hooks.md
[keeper-readme]: apps/keeper/README.md
[react-sdk-readme]: apps/react-sdk/README.md
[baked-in-templates]: apps/generator/docs/baked-in-templates.md
[websocket-test-readme]: packages/templates/clients/websocket/test/README.md

---

## 1. Repository topology

```text
apps/
  generator/          # @asyncapi/generator — main CLI + Generator class (CJS, Jest)
  hooks/              # @asyncapi/generator-hooks — built-in lifecycle hooks (CJS, Jest)
  keeper/             # @asyncapi/keeper — AJV message validator (ESM → Babel → CJS)
  nunjucks-filters/   # legacy/stub — treat as frozen; do not add features here
  react-sdk/          # @asyncapi/generator-react-sdk — TS React renderer (TS → tsc; bundles Rollup as a runtime dep for its template transpiler)
packages/
  components/         # @asyncapi/generator-components — shared React template components (JSX)
  helpers/            # @asyncapi/generator-helpers — pure JS helpers over Parser API (CJS, no build)
  templates/          # Baked-in templates shipped inside the generator (grouped by type: clients, sdks, docs, configs). Currently: clients/kafka/java/quarkus, clients/websocket/{javascript,python,dart,java/quarkus}
```

Orchestration is Turborepo (`turbo.json`). Every package-level script (`test`, `lint`, `build`, `docs`) must be runnable through the root `turbo run <script> --filter=<pkg>` — do not introduce scripts that only work from inside a package directory when they need the full workspace graph.

---

## 2. Monorepo-wide rules

### 2.1 Runtime and tooling
- **Node**: `>=24.11`. **npm**: `>=11.5.1`. Do not regress `engines` in any `package.json`.
- **Module style** differs per package (see 4). Do not silently switch a package from CJS to ESM or vice versa; that is a structural change that must be called out in the PR description.
- **No Prettier.** Formatting is enforced entirely through ESLint. Do not add a `.prettierrc` or `prettier` devDependency.

### 2.2 Linting
Every package inherits the root `.eslintrc` — that file is the source of truth for lint rules. Package `lint` scripts must invoke the root config and ignore file via relative `--config` / `--ignore-path` flags — the exact number of `../` segments depends on the package's depth in the tree (e.g. `apps/*` uses `../../.eslintrc`; `packages/templates/clients/<protocol>/test/integration-test/` uses `../../../../../../.eslintrc`). Do not add a package-local `.eslintrc` to avoid the relative path.

### 2.3 Commits and PR titles
See the [Conventional Commits section in `CONTRIBUTING.md`][contributing-commits].

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
Changesets, release-triggering prefixes, and the full release flow are documented in the [Release process section in `Development.md`][development-release]. Use that as the source of truth on review; flag PRs whose diffs suggest a release but ship no `.changeset/*.md`.

---

## 3. Cross-cutting architectural principles

Template development inside the generator is an experimental effort. All its architectural principles and assumptions — spanning `packages/helpers`, `packages/components`, and `packages/templates/*` — live in [`packages/README.md`][packages-readme] under **"Assumptions and Principles"**.

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
- Conditional file generation: prefer the new `conditionalGeneration` (JMESPath) API over the deprecated `conditionalFiles`. Do not extend `conditionalFiles`.

**Tests:**
- `test/*.test.js` are unit tests; `test/integration.test.js` is the full E2E with `@jest-environment node`. Fixtures in `test/docs/`, test templates in `test/test-templates/`.
- `jest.setTimeout(100000)` is acceptable in integration tests (template transpilation is slow). Not in unit tests.
- Update integration snapshots with `npm run generator:update:snapshot`, never hand-edit `__snapshots__`.
- `pretest` hook builds `react-sdk` and baked-in templates — don't break this chain.

### 4.2 `apps/hooks` — `@asyncapi/generator-hooks`

**Role:** built-in generator lifecycle hooks (currently a `generate:after` hook that writes the source AsyncAPI doc alongside output). The generator also dispatches `generate:before` (after filter registration, before rendering) and `setFileTemplateName` (rename a file template's output just before write) — see the [Hooks guide][hooks-guide].

### 4.3 `apps/keeper` — `@asyncapi/keeper`

**Role:** runtime message validator (AJV v8 + AsyncAPI Parser). Used by generated clients to validate inbound/outbound messages. Public API surface and behavior live in the [keeper README][keeper-readme] — keep it in sync with `src/index.js` on any signature change.

**Conventions:**
- **ES module source, Babel-transpiled to `lib/` (CJS) on publish.** Edit `src/*.js` only; `lib/*` is build output and must not be committed manually.
- Tests are integration-style: Babel-jest loads real AsyncAPI YAML fixtures from `apps/keeper/test/__fixtures__/` and exercises the public exports against them — no mocks of AJV or `@asyncapi/parser`.

### 4.4 `apps/react-sdk` — `@asyncapi/generator-react-sdk`

**Role:** two-stage render engine used by `apps/generator`. A Rollup-based transpiler bundles each template directory to CJS, then a custom React reconciler walks the element tree and emits a plain string (with child output exposed to each component as `childrenContent`). Ships the `Text`, `Indent`, `File` primitives and the `render` entry point. For the architecture overview, restrictions, and rendering example see the [React SDK README][react-sdk-readme].

### 4.5 `packages/components` — `@asyncapi/generator-components`

**Role:** A library of reusable components that can be shared across different templates, helping to avoid duplication and accelerate template development.

**Conventions:**
- ES module JSX, Babel-transpiled to `lib/` on publish. Edit `src/`, never `lib/`.
- A component belongs here when it is used by **two or more** language/protocol templates. Single-use components stay in the template's local `components/` directory.
- **Every shared component must have its own tests.** Reuse means a regression here propagates across every template that depends on the component, so test coverage isn't optional. Tests are integration-style with a real AsyncAPI fixture and `toMatchSnapshot()`.

### 4.6 `packages/helpers` — `@asyncapi/generator-helpers`

**Role:** A utility library that provides helper functions and utilities to simplify template development. It reduces boilerplate and speeds up template creation.

**Conventions:**
- CommonJS; no build step. `src/` is published directly via `main: src/index.js`.
- **Every exported helper needs a test.** Default to parsing a fixture from `test/__fixtures__/` and passing the real Parser object to the helper. Only hand-construct a Parser-shaped stand-in when no fixture can express the case (e.g. an empty channels map, a malformed document the parser would reject), and leave an inline comment in the test explaining *why* a fixture wasn't viable — stand-ins drift silently when `@asyncapi/parser` is upgraded.

### 4.7 `packages/templates/*` — baked-in templates

**Role:** official AsyncAPI templates that are **developed, versioned, and shipped directly inside the `generator` repository and exposed with `@asyncapi/generator` library**.

**Conventions:**
- The directory layout (`{type}/[protocol]/[target]/[stack]`), required files (`.ageneratorrc`, `package.json`), metadata normalization, the `core-template-*` package-name rule, and the "how to add a new template" flow — live in the [Baked-in Templates guide][baked-in-templates].
- **Template-local component tests are conditional-only, and share one protocol fixture.** A component under `<client>/components/` gets a dedicated snapshot test **only when it has conditional rendering or variant logic** (per-server branches, query-param shape, operation-type switches); purely presentational components are covered by integration + acceptance tests. Each protocol keeps a single AsyncAPI fixture under `test/__fixtures__/` that exercises the full component surface — reuse it across clients of the same protocol and extend it (updating dependent snapshots) only when a new variant genuinely isn't expressible against the existing spec.
- **Integration and acceptance tests are protocol-shared** Each protocol owns one integration suite (snapshot-driven, common helpers, per-client isolation) and one Microcks-based acceptance suite (language-native tests against a mocked server). For the full mechanics — per-client `TEST_CLIENT` scoping, snapshot layout, Microcks setup, and the checklist for onboarding a new client — see the [WebSocket test README][websocket-test-readme].

---
