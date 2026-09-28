---
name: port-client-component
description: Port a component or feature that already exists in one protocol client template to sibling clients under packages/templates/clients/<protocol>/ that are missing it. Use when the user asks to "port", "add this to the other client(s) too", or "do the same for python/dart/java", or describes a parity gap between clients of the same protocol. Requires the feature, the reference client, and the target client(s) to be named explicitly.
---

# Port a Client Component to Sibling Clients

You are porting a component or feature that already works in one protocol client template to one or more sibling clients that are missing it, within `packages/templates/clients/<protocol>/*` (currently: websocket — javascript, python, dart, java/quarkus; kafka — java/quarkus). This is a recurring shape in this repo — a capability lands in one client and sibling clients for the same protocol never get the equivalent treatment.

Read [AGENT.md](../../../AGENT.md) sections 2.5 (release hygiene / changesets) and 4.7 (baked-in templates) before executing — this skill's closing steps depend on both.

## Invocation

The user must name three things explicitly:

1. **The feature/component**, in words.
2. **The reference client** that already has it (language, and framework where applicable, e.g. `java/quarkus`).
3. **One or more target clients** missing it.

If any of the three is missing, ask via `AskUserQuestion`. Do not guess reference/target/feature from a bare GitHub issue number or URL: extracting them from free-form issue text requires interpretation and risks misidentifying which client is the reference on a vaguely-worded issue. The user names it; you don't guess it.

## Preconditions (fast gate)

Check in order; stop and report on the first failure:

### 1. Protocol match

The reference and every target must live under the same `packages/templates/clients/<protocol>/` directory. Cross-protocol porting (e.g. websocket → kafka) is out of scope — stop and tell the user.

### 2. Target-lacks-it

For each target, `Grep` for an equivalent construct using the feature's key terms from the user's description. If a target already has it, drop it from the target list and tell the user why — never overwrite working code to "match" a reference.

## Research phase

Work through these in order — each produces an artifact the execution steps consume directly. Print each artifact back to the user as you produce it.

### 1. Locate the reference implementation

`Grep` the reference client's `template/` and `components/` directories **and** its committed runnable example at the template root (`example.py` / `example.js` / `example.dart` — hand-maintained mirror of the generated example, not build output) for the feature's key terms (from the user's description). List the matches as **"the reference files."** A hit in the root example file makes the target's root example file an injection point too — that file is what the client README's manual test actually runs, so omitting it ships a port the documented test never exercises. This step also proves the reference actually has the feature: if the matches are ambiguous, ask the user to point at the specific file(s) rather than guessing; if nothing plausible turns up and the user can't point at a file either, stop and report "feature not found in reference client."

### 2. Check sibling implementations for divergence

`Grep` the *other* sibling clients that already have this feature — not just the named reference. If a sibling's implementation behaviorally diverges from the reference (observable test: the reference only registers/stores something while a sibling also applies it in the runtime path, or their generated methods differ in what they do rather than how they say it), surface the divergence via `AskUserQuestion` and let the user pick which behavior to port — before any translation. Do not silently mirror the reference when a more complete sibling exists, and do not silently "improve" on the reference either; the choice is the user's, and it must be made before the golden snippet is written because the snippet encodes it.

### 3. Classify the mechanism

Check whether any reference file imports from `@asyncapi/generator-components` for this feature. This determines which execution branch applies:

| What the reference files show | Branch |
|---|---|
| A reference file imports a component from `@asyncapi/generator-components` that renders this feature | **A — Shared-config extension** |
| No such import — the feature's logic lives only in the reference client's own template-local files | **B — Local-only logic** |

- **Branch A** means the shared component already exists in `packages/components/src/components/`, built on a per-language config map (the `QueryParamsVariables` shape: a top-level object keyed by language, values either a function or a framework-keyed sub-object, e.g. `java: { quarkus: (param) => … }`). Deterministic — the shared component already knows how to render every language, it's just missing entries/wiring for the targets.
- **Branch B** requires cross-language translation, which is a judgment call rather than a mechanical copy.

Don't assume Branch A because a shared components package exists — confirm the specific reference files actually import from it. A reference client can have template-local logic even when unrelated shared components exist for other features.

A feature can span **both** branches — e.g. a local register method and constructor field (B) plus a shared example component missing the target's config entry (A). Classify each reference file separately: the branch applies per file, and a mixed feature runs both execution sections, each for its own files.

### 4. Map injection points

For each target client, find the file(s) structurally equivalent to the reference files — same relative path under that client's directory (the `<framework>` segment adds one directory level for stack-specific clients like `java/quarkus`). Record one row per (reference file × target) pair in a markdown table and print it back to the user:

| Reference file | Target client | Target file | Exists? |
|---|---|---|---|
| `…/websocket/python/components/Constructor.js` | dart | `…/websocket/dart/components/Constructor.js` | yes |
| `…/websocket/python/components/Constructor.js` | java/quarkus | `…/websocket/java/quarkus/components/Constructor.js` | yes |
| `…/websocket/python/example.py` | dart | `…/websocket/dart/example.dart` | yes |

Structural equivalence is by **role**, not always by filename — e.g. python declares instance fields in `Constructor.js` while dart declares them in `ClientFields.js`; the root example file's equivalent is the target's own root example file.

This table is **the injection map** — the execution steps edit exactly these target files and no others, with one exemption: Branch A additionally edits the shared component itself under `packages/components/` (its config map and `Language` typedef in `src/components/<Component>.js`, and its test in `test/components/<Component>.test.js`). Those files are per-feature rather than per-target, so they are not rows in this table; the Branch A execution steps name them explicitly. If a target has no structurally equivalent file at all (`Exists? = no` — the feature would need an entirely new file, not an edit to an existing one), flag that row — that's a bigger change than this skill's mechanical scope assumes, and the user should confirm before you proceed.

## Translation protocol (run for every target language, in both branches)

Any step that writes target-language code is a cross-language translation — the code strings inside a Branch A config-map entry just as much as Branch B's template-local logic. Translation is the one judgment call in this skill, so never translate freely from general language knowledge; anchor every choice to something checkable in this repo by running these two steps before writing any code. Their output is what the closing steps verify deterministically: the snapshot diff there must match the golden snippet produced here.

### 1. Build an idiom map from repo precedent

Break the reference logic into its constructs (env-var read, null/absence check, map assignment, string interpolation, error raise, …). For each construct, find how the target language already expresses it *in this repo* and record one row per construct — print the table back to the user:

| Construct (reference: python) | Target idiom (dart) | Precedent file |
|---|---|---|
| `os.getenv("X")` | `Platform.environment['X']` | `…/dart/components/Connect.js` |
| `params["x"] = y` | `params['x'] = y;` | `…/dart/components/Connect.js` |
| `if x is not None:` | `if (x != null) {` | `…/dart/components/HandleMessage.js` |

Precedent sources, in priority order:

1. The target client's own `template/` and `components/` files (`Grep` them for the construct).
2. In Branch A, the sibling entries already in the shared component's config map — they show the exact shape and style the new entry must match.

Repo precedent wins over textbook syntax: it matches the style the generated client already uses, keeps snapshot churn minimal, and turns free-form translation into filling in a table. Only fall back to general language knowledge for a construct with no precedent anywhere in the repo — and mark that row `(no precedent)` so the user knows which lines rest on judgment alone.

### 2. Write the golden snippet before any template code

Using the idiom map, author the exact target-language code the *generated client file* should contain after the port, and print it to the user. The snippet must mirror the reference 1:1 — same structure, same order of operations, same variable roles; no "improvements," no restructuring. The goal is behavioral parity, not a better implementation. This is the expected answer the closing steps' snapshot diff is checked against — writing it first means that diff is compared to a committed intent, not eyeballed for plausibility.

## Execution — Branch A (shared-config extension)

Execute in order:

1. **Run the translation protocol** for each target language, then **add a config-map entry** for each target language missing one, modeled directly off an existing sibling entry in the shared component (same keys/shape, target language's syntax from the idiom map only). Match the existing entry's shape exactly: if siblings return `{ variableDefinition, ifCondition, assignment, closing }`, the new entry returns the same four keys, not a reinterpretation.

   **Worked example** — adding a `dart` entry to `queryParamLogicConfig` in `QueryParamsVariables.js`, modeled off the existing `javascript` entry (same four keys, Dart syntax only):

   ```js
   // Existing sibling (javascript):
   //   variableDefinition → `const ${paramName} = ${paramName} || process.env.${paramName.toUpperCase()};`
   //   ifCondition        → `if (${paramName}) {`
   //   assignment         → `params["${paramName}"] = ${paramName};`
   //   closing            → `}`
   dart: (param) => {
     const paramName = param[0];
     return {
       variableDefinition: {
         text: `final ${paramName}Value = ${paramName} ?? Platform.environment['${paramName.toUpperCase()}'];`,
         indent: 8,
       },
       ifCondition: { text: `if (${paramName}Value != null) {`, indent: 8 },
       assignment: { text: `params['${paramName}'] = ${paramName}Value;`, indent: 10 },
       closing: { text: '}', indent: 8, newLines: 1 },
     };
   },
   ```

   Also extend the component's `@typedef Language` union (e.g. `'python' | 'java' | 'javascript'` → add `'dart'`), and delete any JSDoc note that explains why the target language was previously excluded — the port makes it stale. The typedef is manual (the runtime `supportedLanguages` check derives from `Object.keys(<config>)` and updates itself) but is not published to the API docs; see closing step 5 for how to read the docs diff.

2. **Wire the shared component into targets that don't call it yet.** Add the import, plumb the required prop through the call chain the same way the reference sources it (e.g. via a helper like `getQueryParams`), and render the shared component with `language='<target>'` (and `framework='<target-framework>'` where applicable).

3. **Extend the shared component's test.** Add one snapshot case per new language branch to `packages/components/test/components/<Component>.test.js`, following the existing per-language case pattern exactly. If that test file does not exist yet, create it first, modeled on a sibling component's test — per AGENT.md §4.5 every shared component must have its own tests, so a missing file is a gap to close, not a reason to skip this step. Then regenerate the component's snapshot:

   ```bash
   (cd packages/components && npm run test:update -- <Component>)
   ```

   This rebuilds `lib/` and then runs jest with `-u`, scoped to that component's suite.

   Open the regenerated `.snap` and sanity-check the new language's output before moving on — the real correctness gate is the integration-snapshot diff in the closing steps.

## Execution — Branch B (local-only logic)

Execute in order:

1. **Run the translation protocol** for each target file in the injection map: build the idiom map, then write the golden snippet.

2. **Write the template code.** Write the template/component code so it renders exactly the golden snippet — the rendered output is the contract, and closing step 3's snapshot diff verifies it. All translation decisions were already made in the golden snippet; nothing new gets invented here.

3. **Do not create a new shared component during this port**, even though the logic now exists in reference + N targets after this change. Porting and deduping are separate concerns — deduping is deliberately deferred to the handoff step below.

## Common closing steps (both branches)

Run these regardless of which branch you executed:

1. **Rebuild the shared package if the port touched `packages/components/src`** (Branch A always does). Integration tests transpile templates against `packages/components/lib/` (Babel output), not `src/`. The `test:update` run in Branch A step 3 already rebuilds `lib/`, so this step is only needed if you edited `src/` again after it — but skipping it in that case regenerates snapshots against stale component code:

   ```bash
   npm run components:build
   ```

2. **Regenerate integration snapshots** for the protocol:

   ```bash
   (cd packages/templates/clients/<protocol>/test/integration-test && npm run test:update)
   ```

   or per client: `npm run test:<lang>:update`.

3. **Diff the snapshots as the correctness gate:**

   ```bash
   git diff packages/templates/clients/<protocol>/test/integration-test/__snapshots__/
   ```

   This is where the translation protocol's output gets verified: the added snapshot lines must match the golden snippet from protocol step 2 — not merely "look right." Modest whitespace churn elsewhere is expected; any deviation from the golden snippet, or large semantic diffs (different method names, missing lines, changed body content), means a step above is wrong — usually the idiom map or the code that consumed it. Fix the offending step and re-run steps 2–3 rather than accepting the diff.

4. **Run the full check** from the repo root:

   ```bash
   npm run templates:test
   npm run lint
   ```

5. **Branch A only — regenerate the components API docs:**

   ```bash
   turbo run docs --filter=@asyncapi/generator-components
   ```

   then `git diff apps/generator/docs/api_components.md`. Interpret the diff by what actually changed: the repo's jsdoc2md handlebars template publishes only **function-level** JSDoc (description, `@param`, `@returns`, `@example`) — `@typedef` unions are never emitted into the doc. If the port only extended the `Language` typedef and added config entries, an empty diff is *correct*; confirm by grepping the published file for the component's section rather than looping on rewrites of good JSDoc. Only if a function-level JSDoc block changed (or a new public component was added) does an empty diff mean the JSDoc is missing or malformed (per AGENT.md §2.4, this doc is a committed artifact that must be regenerated in the same PR as any public-signature change).

6. **Changeset reminder.** Per AGENT.md §2.5, `packages/templates/*` is private/unpublished, so target this change at `@asyncapi/generator`. Add `@asyncapi/generator-components` as well whenever Branch A modified anything under `packages/components` — a new config-map entry changes the published package's rendered output even though the component's prop signature is unchanged, so the signature alone is not the trigger.

## Dedup detection & handoff

After porting, check whether the ported logic is now duplicated with no shared home:

- If the reference files are **whole, single-purpose component files** (nothing else mixed in) and the same file now exists near-identically in 2+ clients, that's a candidate for promotion into the shared components package. `Glob` for `packages/templates/clients/**/components/<SameFileName>.js`; if it returns 2+, report this to the user and offer via `AskUserQuestion` to invoke `migrate-component` next.
- If the ported logic is a **fragment inside a larger multi-purpose file** (e.g. buried in `Constructor.js` alongside unrelated logic), automatic duplication detection is unreliable — tell the user duplication may now exist and let them decide, rather than guessing.

## Reference materials

- Canonical shared-config-map example: `packages/components/src/components/QueryParamsVariables.js`.
- Per-language test-case idioms for Branch A step 3: `packages/components/test/components/QueryParamsVariables.test.js`.

## Non-goals

- Not a general bug-fix-porting tool for issues unrelated to cross-client feature parity (e.g. a hardcoded-filename bug that's JS-only, with no equivalent gap in siblings, is out of scope).
- Not responsible for deciding *whether* to extract a shared component — only for detecting when duplication now exists after a port and handing that decision to the user.
- Does not accept a GitHub issue number or URL as direct input (see Invocation) — the user names feature/reference/targets explicitly.
