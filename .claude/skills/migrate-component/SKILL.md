---
name: migrate-component
description: Promote a duplicated React/JSX template-local component into the shared @asyncapi/generator-components package. Use this skill whenever the user asks to "migrate", "move", "promote", "extract", "share", or "consolidate" a component into generator-components (or shared components / the components package). Also trigger for phrases like "it's used in multiple templates now, let's share it" or "avoid duplication across clients". Do not fire for unrelated React refactors or for moving code between apps/.
---

# Migrate Component to @asyncapi/generator-components

You are migrating a duplicated React/JSX template-local component out of `packages/templates/clients/<protocol>/<lang>[/<framework>]/components/` (the `<framework>` segment is present for stack-specific templates like `java/quarkus`, omitted for single-stack languages like `python`) into the shared `packages/components/src/components/` package.

> **Important:** Always edit `src/` files. The `lib/` directory is generated at publish time by Babel — never edit files there.

## Invocation

The user has named the component to migrate, e.g. "migrate HandleError". If they did NOT name one, ask which component.

## Preconditions (fast gate)

### 1. Two-template threshold check

Use the **Glob tool** with pattern `packages/templates/clients/**/components/<Component>.js` to find all template-local copies of this component.

Decide based on the result count:

| Result count | Action |
|---|---|
| **0** | Stop and report "no template files found" — nothing to promote. |
| **1** | Report "only one template uses this component; CLAUDE.md section 4.5 recommends 2+ before promotion" and **prompt the user via `AskUserQuestion`**: continue anyway? |
| **2+** | Continue automatically — threshold satisfied. |

The 1-template case is the only judgment call — do not stop unilaterally; let the user make the call.

### 2. No naming collision

Use the **Glob tool** with pattern `packages/components/src/components/<Component>.js` — if it returns a result, stop and report that the component already exists in the shared package.

## Research & design (produce the migration plan)

Before touching any files, work through these three steps in order. Each produces an artifact the execution steps consume directly:

1. **The template files** — the canonical list of files to migrate from templates into the shared package.
2. **The props table** — file × props × render-shape × indent/newLines.
3. **The union signature** — the shared component's prop list, with required/optional/defaults.

### 1. Catalog the template files

The Glob results from precondition 1 are the canonical list — call it **"the template files"** in subsequent steps. Every later step (read sources, delete files, update imports) refers back to these exact paths. Echo the list back to the user as a fenced block so it stays visible; do not re-run Glob.

### 2. Read every copy and tabulate

`Read` every path in **the template files** — one read per file, no skipping. For each, record one row in a markdown table:

| File | Props (with defaults) | Render shape | Indent | newLines |
|---|---|---|---|---|
| `…/javascript/.../<Component>.js` | `{ methodName, methodParams = ['msg'] }` | `<Text>…</Text>` | 2 | 1 |
| `…/python/.../<Component>.js`     | `{ methodName, methodParams = ['self','msg'], preExecutionCode }` | `<Text>…</Text>` | 4 | 2 |
| `…/dart/.../<Component>.js`       | `{ methodName }` | `<MethodGenerator … />` | 2 | 1 |

This table is the source of truth for the next two research steps. Print it back to the user.

### 3. Derive the prop signature (union rule)

The shared component's props are **the union of props across the template files**:

- Prop in **every** template file → required (no default).
- Prop in **some** template files → optional, with a default matching the omitting file's current behavior.
- Prop with different defaults per language → keep required; push the per-language value into the consuming template's JSX usage.

**Worked example** (using the table above):

```js
// Per-copy props:
//   javascript → { methodName, methodParams = ['msg'] }
//   python     → { methodName, methodParams = ['self','msg'], preExecutionCode }
//   dart       → { methodName }
//
// Union → { methodName, methodParams, preExecutionCode }
//   methodName       → required          (in every copy)
//   methodParams     → optional, ['msg'] (JS/Dart omit; Python overrides at the call site)
//   preExecutionCode → optional, ''      (only Python uses it; default is a no-op for JS/Dart)

export function <Component>({
  methodName,
  methodParams = ['msg'],
  preExecutionCode = '',
}) { /* … */ }
```

Python's consuming template then renders `<<Component> methodName='onMessage' methodParams={['self','msg']} preExecutionCode='…' />`; JS/Dart pass only what they need.

**Choose the abstraction shape** based on the table and signature:

- **Method-shaped** — delegates to `MethodGenerator` with a `websocket<X>Config` map. Use when per-language differences are mostly method-body strings (the config object holds the language-specific logic; the component itself is thin). See `packages/components/src/components/RegisterErrorHandler.js`.
- **Structural** — config object keyed by language returning `Text` code blocks. Use when the rendering structure itself varies across languages (different indentation, different block shapes, framework sub-keys). See `packages/components/src/components/QueryParamsVariables.js`.

## Execution steps

Execute strictly in this order; each step must succeed before the next.

### 1. Author the shared component

Create `packages/components/src/components/<Component>.js` using **the signature and abstraction shape from research step 3**.

Two things to enforce (everything else — named export, body code, imports, EOF newline — copy from the canonical example for your chosen shape):

- **JSDoc** — `@typedef` for the `Language` union, `@param` for **every prop in the research step 3 union** (matching required/optional/defaults exactly), `@returns {JSX.Element}`, and a `@example` block. This is what `jsdoc2md` publishes to `apps/generator/docs/api_components.md` in step 9; missing or malformed tags produce an empty diff there.
- **Validate constrained props** — for `language`/`framework` (or any prop with a supported set), throw using helpers from `packages/components/src/utils/ErrorHandling.js`. Use `unsupportedLanguage(language, supportedList)` for the `language` prop; use `unsupportedFramework(language, framework, supportedList)` when the component also accepts a `framework` prop (e.g. `java/quarkus`). See `QueryParamsVariables.js` for the full pattern.

### 2. Export it

Edit `packages/components/src/index.js`: append one line `export { <Component> } from './components/<Component>';`.

### 3. Write the test

Create `packages/components/test/components/<Component>.test.js`. Test cases come **directly** from the artifacts of research steps 2 and 3:

- **One snapshot test per row in research step 2's table** (i.e. per `(language, framework?)` pair). Pass the per-language props from that row.
- **One variant test per optional prop in research step 3's union** — proves the prop is wired through, not hardcoded.
- **One negative test**: omit all optional props and confirm no `undefined` leaks in the snapshot.

### 4. Generate the snapshot

```bash
npm run components:test -- -u
```

Output: `packages/components/test/components/__snapshots__/<Component>.test.js.snap`. Open it and sanity-check that the rendered output looks like what each language template emits today. The real correctness check happens in **step 8** — `git diff` on the regenerated per-client integration snapshots.

### 5. Delete the template files

For each path in **"the template files"** (research step 1):

- `git rm <path>`
- If a sibling test exists at `packages/templates/clients/<protocol>/<lang>[/<framework>]/test/components/<Component>.test.js` (same `<lang>[/<framework>]` segments as the source file — e.g. `java/quarkus/test/components/…`): `git rm` it and its `.snap`.

Do **not** re-run Glob — the list from research step 1 is canonical.

### 6. Update each consuming template

For each path in **"the template files"** (research step 1), find the file that imported it. Use the **Grep tool** with pattern `from './<Component>'` scoped to that file's template root — the directory immediately above `components/`, which is `<lang>/` for single-stack languages or `<lang>/<framework>/` for stack-specific ones (e.g. `packages/templates/clients/websocket/python/` or `packages/templates/clients/websocket/java/quarkus/`).

In each match:

- Remove the local import line.
- Add `<Component>` to the existing `@asyncapi/generator-components` import (match the file's existing order convention; alphabetical not required).
- At each `<<Component> />` JSX usage, pass **the props from that language's row in research step 2's table** plus `language='<lang>'`. The rendered output must be identical to what the deleted local file emitted — that's what keeps the integration snapshot churn minimal in step 7.

**Example** (using the worked example from research step 3):

```jsx
// JS template — methodParams default matches the table, so only pass required props.
<<Component> language='javascript' methodName='onMessage' />

// Python template — override per-language values from the table.
<<Component>
  language='python'
  methodName='on_message'
  methodParams={['self', 'msg']}
  preExecutionCode={'...'}
/>

// Dart template — only methodName per the table.
<<Component> language='dart' methodName='onMessage' />
```

### 7. Regenerate integration snapshots

Run from the integration-test package — much faster than repo root since it skips the rest of the pipeline:

```bash
cd packages/templates/clients/<protocol>/test/integration-test && npm run test:update
```

Or to update a single client: `cd packages/templates/clients/<protocol>/test/integration-test && npm run test:<lang>:update`

Rebuilds `__snapshots__/integration.test.js.<lang>.snap` (one per client).

### 8. Diff the regenerated snapshots

`git diff` is the migration's correctness check — the new snapshots vs. the committed ones tell you whether the migration changed any rendered output:

```bash
git diff packages/templates/clients/<protocol>/test/integration-test/__snapshots__/
```

Expect modest whitespace/indent churn. Large semantic diffs (different method names, missing lines, body content changes) mean step 1 (component implementation) or step 6 (consumer props) is wrong → fix the offending step, then re-run step 4 (component snapshot) and steps 7–8 (integration snapshots + diff). Skip steps 2/3/5/6 unless they're what you're fixing.

### 9. Regenerate the API docs

`apps/generator/docs/api_components.md` is a committed `jsdoc2md` artifact and CLAUDE.md section 2.4 requires it be regenerated in the same PR as any public-signature change:

```bash
turbo run docs --filter=@asyncapi/generator-components
```

Then `git diff apps/generator/docs/api_components.md` and commit alongside the source changes. Empty diff = JSDoc tags in step 1 are missing or malformed → fix and rerun.

### 10. Run all tests and lint

From repo root:

- `npm run components:test` — passes.
- `npm run templates:test` — passes (the integration snapshot is now in sync).
- `npm run lint` — passes.

## Reference materials

- Canonical method-shaped example: `packages/components/src/components/RegisterErrorHandler.js`.
- Canonical structural example: `packages/components/src/components/QueryParamsVariables.js`.
- Test idioms: `packages/components/test/components/RegisterErrorHandler.test.js`.
- Error handling utilities: `packages/components/src/utils/ErrorHandling.js`.
