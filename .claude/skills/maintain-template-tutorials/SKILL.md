---
name: maintain-template-tutorials
description: Verify and maintain the "Creating a template" tutorials (Python in apps/generator/docs/generator-template.md, Java in apps/generator/docs/generator-template-java.md). Use when asked to check, test, update, or fix these tutorials, when a change to the generator, react-sdk, AsyncAPI CLI, Parser API, or AsyncAPI spec version may affect them, or when an issue reports that a tutorial step fails. Do not use for other docs pages or for baked-in templates under packages/templates.
---

# Maintain the template tutorials

Readers copy the tutorials' code blocks one by one, so a tutorial is correct only when every block, in order, produces working code. The Java tutorial reuses the AsyncAPI document from the Python tutorial's "Background context" section, so a change there affects both.

## Verify

Run `scripts/verify-tutorial.mjs` yourself. Never report a tutorial as working without a passing run.

```bash
node .claude/skills/maintain-template-tutorials/scripts/verify-tutorial.mjs {python|java|all} --keep --workdir {SCRATCHPAD}/tutorial-verify
```

- The script rebuilds the reader's project from the code blocks and runs each step's commands, with the AsyncAPI CLI and an MQTT subscriber through `npx`. A broker step passes only when the subscriber receives the IDs the client printed.
- It needs `node`, `python3`, and a running Docker daemon. A full run takes 20 to 30 minutes, so run it in the background and watch the `PASS` and `FAIL` lines.
- `--broker local` (the default) applies the tutorials' localhost note. It uses the broker on `localhost:1883`, or starts the tutorials' Mosquitto container. Add a `--broker public` run when a change touches the broker address or connection code. `test.mosquitto.org` is often unstable, so a public failure counts only when the same step passes locally.

When a step fails:

- `selector "..." matched N code blocks` means the tutorial changed shape. Fix the selector so it matches exactly one block.
- Anything else is a tutorial bug until proven otherwise. Reproduce it in the work directory, fix the tutorial, and run again.

## Update a tutorial

- Keep both tutorials consistent: the AsyncAPI document, `apiVersion`, the `generator` range, the `react-sdk` version, and the `TopicFunction` logic.
- Both tutorials repeat `package.json` and `index.js`. Update every copy.
- Check Parser API calls against `apps/generator/node_modules/@asyncapi/parser/cjs/models/v3/`. For example, a v3 `Operation` has `channels()`, not `channel()`.
- Use an AsyncAPI version listed in `@asyncapi/specs/schemas/`. The parser rejects `3.0.1`.
- Inside JSX children, write comments as `{/* ... */}`. A `// ...` line there ends up in the generated file.
- When you add, remove, or reorder tutorial steps, update the script's steps in the same change.
