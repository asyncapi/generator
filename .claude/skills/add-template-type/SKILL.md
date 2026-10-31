---
name: add-template-type
description: Add a new opinionated template type (a new top-level folder such as servers or scripts) to the baked-in templates under packages/templates. Use when the user asks to add, introduce, register or support a new template type, category or top-level templates folder. Do not use for adding a template to an existing type (clients, sdks, docs, configs), or for renaming or removing a type.
---

# Add a Baked-in Template Type

You are adding a new opinionated type to the baked-in templates in `packages/templates/`. A type is a top-level folder (plural, e.g. `servers`). Its templates get `type: <singular>` metadata and `core-template-<singular>-…` names. Types exist only at build time: the `TEMPLATE_TYPES` registry in `apps/generator/scripts/build-templates.js` defines them, three documents describe them (the Baked-in Templates guide, `packages/README.md` and `AGENTS.md`), and `.sonarcloud.properties` excludes their folders from Sonar. This skill does the plumbing only. It doesn't create a template of the new type.

Read [AGENTS.md](../../../AGENTS.md) section 4.7 and the [Baked-in Templates guide](../../../apps/generator/docs/baked-in-templates.md) before executing.

## Invocation

The user must give two things:

1. **Folder name:** plural, the directory under `packages/templates/` (e.g. `servers`).
2. **Purpose:** one or two sentences on what templates of this type generate and why no existing type covers it.

If either is missing, ask via `AskUserQuestion`. Don't derive them from a GitHub issue number or URL.

Below, `<dir>` is the folder name, `<type>` the singular value chosen in Q1, and `<purpose>` the user's text. `<guide-text>` and `<principle-text>` are the doc wordings approved in Q4.

## Preconditions (fast gate)

Run every check before any edit. Stop and report on the first failure.

### 1. Registry exists

`Grep` for `const TEMPLATE_TYPES` in `apps/generator/scripts/build-templates.js`. If it's missing, stop: "this repo predates the `TEMPLATE_TYPES` registry; refactor the build script first".

### 2. Name is new and well-formed

- `<dir>` matches `^[a-z]+$`.
- `<dir>` isn't already a `dir:` value in `TEMPLATE_TYPES`. If it is, stop and quote the existing row.
- `packages/templates/<dir>` doesn't exist. The build throws on any unregistered top-level folder, so one existing now means someone is mid-change. Stop and ask the user about it.

### 3. Name survives the build

Two build behaviors would hide every template of the type without an error:

- **`<dir>` is in `IGNORED_DIRS`** (same file). `collectTemplates` never descends into those folders.
- **`<dir>` contains the substring `test`.** `transpileTemplate` copies with the filter `!src.includes('test')` on the absolute path, so every file of the type would be dropped from the generator's bundled templates.

Stop and name the behavior that would hide the type.

### 4. Edit targets are clean

```bash
git diff --quiet HEAD -- apps/generator/scripts/build-templates.js apps/generator/docs/baked-in-templates.md packages/README.md AGENTS.md .sonarcloud.properties apps/generator/lib/templates/BakedInTemplatesList.json || git diff --stat HEAD -- apps/generator/scripts/build-templates.js apps/generator/docs/baked-in-templates.md packages/README.md AGENTS.md .sonarcloud.properties apps/generator/lib/templates/BakedInTemplatesList.json
```

If the second command prints anything, stop and list the dirty files. The check compares content with HEAD, so line-ending-only changes left by an earlier build on a `core.autocrlf=true` checkout don't count, while real staged or unstaged edits do. `CLAUDE.md` is a symlink to `AGENTS.md`, so edit only `AGENTS.md`.

## Research

Ask every question via `AskUserQuestion`. Make the first option the recommendation, marked "(Recommended)", and put the evidence in the question text. Print each answer back to the user.

### Q1. Singular type value

Recommend `<dir>` minus a trailing `s` (`servers` → `server`). If `<dir>` doesn't end in `s`, recommend it unchanged. Mention that `docs` is the existing exception (folder and type are both `docs`). The answer must not already be a `type:` value in `TEMPLATE_TYPES`. If it is, ask again and quote the clash.

### Q2. Path shape

Options:

- **Protocol-scoped:** `<dir>/<protocol>/<target>[/<stack>]`, like `clients` and `sdks`.
- **Flat:** `<dir>/<target>`, like `docs` and `configs`.

Recommend protocol-scoped when `<purpose>` names a protocol, broker or transport (websocket, kafka, mqtt, http, …). Otherwise recommend flat. Quote `<purpose>` in the question.

### Q3. Principle conflict (only when found)

`Grep` principle 2 in `packages/README.md` (the sub-bullets under "The idea is that templates inside generator are grouped under a predefined opinionated types") for `<dir>` and `<type>`. For every sentence that argues against the new type (e.g. "thus no dedicated `server` type" when adding `servers`), quote it and ask:

- **Reword (Recommended):** put your proposed rewording in the option description. Keep the sentence's original point and drop only the part the new type contradicts.
- **Remove the sentence.**
- Other: the user's wording.

Never change the sentence without an answer. If no sentence argues against the type, skip Q3 and say so.

### Q3b. Existing mention (only when found)

Principle 2 may already describe the type, as with the `scripts` sub-bullet and the `scripts` entry in the lead-in list. Check whether a principle 2 sub-bullet starts with `` `<dir>` `` or `` `<type>` ``, and whether the lead-in's backticked list already contains `<dir>` or `<type>`. Ask after Q4, because the options need `<principle-text>`. Quote the existing sub-bullet and ask:

- **Replace it with `<principle-text>` (Recommended).**
- **Keep it and skip the append.**
- Other: the user's wording.

If nothing mentions the type, skip Q3b and say so.

### Q4. Doc wording

`<purpose>` is written as a request ("…which the client type doesn't cover"), so it can't go into the docs verbatim. Draft two doc-ready texts from it, each matching the style of its sibling bullets and with no reference to the request or to other principles:

- `<guide-text>` for the guide's "Supported template types" bullet. Siblings read "Templates that generate …", e.g. "Templates that generate a server application implementing the API, e.g. a WebSocket server".
- `<principle-text>` for the principle 2 sub-bullet. Siblings read "`<type>` purpose is that …" or "`<type>` is for …", e.g. "`server` purpose is that the template generates a server application that implements the API, e.g. a WebSocket server."

Ask with both drafts quoted in full in the question text:

- **Use these drafts (Recommended).**
- Other: the user's edits.

### Drift report (no question)

Collect the type lists from five places and print them side by side:

| Source | Where |
|---|---|
| registry | `dir` and `type` values of `TEMPLATE_TYPES` |
| guide | "Supported template types" bullets in `apps/generator/docs/baked-in-templates.md` |
| principles | principle 2 sub-bullets in `packages/README.md` |
| principles lead-in | the backticked list in principle 2's first sentence in `packages/README.md` |
| topology | "grouped by type: …" in the `templates/` line of `AGENTS.md` §1 |

Compare by singular type, using the registry to map folders to types, and print every mismatch (e.g. principles list `scripts` where the registry has `configs`). **Don't fix drift.** Renaming or removing types is out of scope.

## Execution

### 1. Registry row

Append to `TEMPLATE_TYPES` in `apps/generator/scripts/build-templates.js`:

```js
  { dir: '<dir>', type: '<type>', protocolScoped: <true|false> },
```

### 2. Baked-in Templates guide

In `apps/generator/docs/baked-in-templates.md`:

- **"Supported template types":** append `` - `<type>` (not yet implemented): <guide-text> ``.
- **"General structure", `type:` bullet:** add `` `<dir>` `` as the last item before the final "or", e.g. "One of `docs`, `clients`, `sdks`, `configs`, or `<dir>`."
- **Protocol-scoped:**
  - in the "(Only for …)" list of the `protocol:` bullet and the "(Optional, for …)" list of the `stack:` bullet, add `` `<dir>` `` as the last item of the list, keeping the "`a`, `b`, and `c`" form. For example, a two-item list becomes a three-item one: "(Only for `clients` and `sdks`)" becomes "(Only for `clients`, `sdks`, and `<dir>`)";
  - append `/<dir>` to the protocol-scoped label in "Type-specific rules" (today `**clients/sdks**`, which becomes `**clients/sdks/<dir>**`).
- **Flat:** append `/<dir>` to the flat label in "Type-specific rules" (today `**docs/configs**`).
- **If `<type>` equals `<dir>`:** in the plural/singular note, change "except for `docs`" to "except for `docs` and `<dir>`".

### 3. Principle 2

In `packages/README.md`, append after the last principle 2 sub-bullet (4-space indent, like its siblings). Append only when Q3b found no existing sub-bullet. Otherwise apply Q3b's answer (replace the bullet, or leave it as it is):

```markdown
    - <principle-text>
```

Also append `, <type>` inside the backticked list of the principle 2 lead-in sentence ("…opinionated types, like `client, sdk, docs, scripts`." becomes "…like `client, sdk, docs, scripts, <type>`."). Skip this when the lead-in list already contains `<dir>` or `<type>`.

Apply the Q3 answer to the conflicting sentence, if there is one.

### 4. AGENTS.md topology

In the `templates/` line of `AGENTS.md` §1, append `, <dir>` inside "(grouped by type: …)".

### 5. Sonar exclusion

In `.sonarcloud.properties`, insert `,packages/templates/<dir>/**/*` into `sonar.exclusions=` right after `packages/templates/clients/**/*`. Template folders are excluded until the template structure is finalized (see the TODO under that line).

## Verification

### 1. Lint

```bash
cd apps/generator && npm run lint
```

### 2. Probe template

`build-templates.js` imports `@asyncapi/generator-react-sdk`. If `apps/react-sdk/lib` is missing, run `npm run build:reactsdk` in `apps/generator` first.

Run from the repo root in Bash. The probe is:

| Shape | `PROBE` | Expected metadata | Expected name |
|---|---|---|---|
| protocol-scoped | `packages/templates/<dir>/probe/js` | `type: <type>`, `protocol: probe`, `target: js` | `core-template-<type>-probe-js` |
| flat | `packages/templates/<dir>/probe` | `type: <type>`, `target: probe` | `core-template-<type>-probe` |

```bash
LIST=apps/generator/lib/templates/BakedInTemplatesList.json
PROBE=packages/templates/<dir>/probe/js     # flat: packages/templates/<dir>/probe
mkdir -p "$PROBE"
printf '{"name": "x", "private": true}\n' > "$PROBE/package.json"
printf '{}\n' > "$PROBE/.ageneratorrc"
N=$(grep -c '"name"' "$LIST")
echo "templates before probe: $N"
(cd apps/generator && npm run build)
grep -A5 '"core-template-<type>-probe' "$LIST"
cat "$PROBE/.ageneratorrc"
grep '"name"' "$PROBE/package.json"
```

Check all three outputs against the table. The build must also report one more template than before: `Updated <N+1> templates`, where N is the count printed before the build.

**Cleanup.** Always run it, including when an assertion fails or you stop early:

```bash
rm -rf packages/templates/<dir> apps/generator/lib/templates/bakedInTemplates/core-template-<type>-probe*
(cd apps/generator && npm run build)
git diff --quiet HEAD -- apps/generator/lib/templates/BakedInTemplatesList.json && echo "list restored" || echo "LIST CHANGED"
git diff --quiet -- packages/templates apps/generator/lib/templates/BakedInTemplatesList.json && git checkout -- packages/templates apps/generator/lib/templates/BakedInTemplatesList.json
```

- The `rm` of `packages/templates/<dir>` is safe because precondition 2 proved the folder didn't exist.
- The transpiled probe under `lib/templates/bakedInTemplates/` is gitignored, and the build never removes stale entries, so delete it by hand.
- The list check compares the working tree with HEAD. Precondition 4 proved the list matched HEAD before the probe, and a rebuild of the committed templates reproduces it exactly. The block uses no variables from the probe step, so it works in a fresh shell.
- The last line restores line endings. On `core.autocrlf=true` checkouts, the build rewrites every `.ageneratorrc` and the list with LF, so `git status` shows them as modified even though the content is unchanged. It runs only when there's no content diff.

"LIST CHANGED" is a failure.

### 3. Failure loop

If step 1 or 2 fails, fix the registry row and re-run both steps. After 3 failed rounds, stop and show `git diff` plus the failing output.

## Final report

Print:

- `git diff --stat`;
- the drift report;
- the Q3 decision (or "no conflict found");
- reminders:
  - the first template of the new type must remove "(not yet implemented)" from its guide bullet, and its PR carries a `feat:` title plus an `@asyncapi/generator` changeset;
  - for a flat type, the test-suite layout (the integration suite path has no protocol segment) is decided with its first template;
  - this type-adding change needs no changeset: `apps/generator/scripts/` isn't published, and `BakedInTemplatesList.json` doesn't change. Suggested title: `chore: add <type> baked-in template type`.

Don't commit unless the user asks.

## Reference materials

- Registry, path parsing and validation: `apps/generator/scripts/build-templates.js` (`TEMPLATE_TYPES`, `getTemplateMeta`, the skip checks in `main`, `IGNORED_DIRS`).
- Runtime lookup: `apps/generator/lib/templates/bakedInTemplates.js` filters on any `type` string, so it needs no change.

## Non-goals

- Creating a template of the new type, scaffolding one, or creating its integration or acceptance suites.
- Renaming or retiring types, or fixing drift between the type lists. Drift is only reported.
- Removing "(not yet implemented)" markers.
- Runtime changes in `apps/generator/lib/`.
- Changesets.
