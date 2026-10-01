---
name: maintain-template-tutorials
description: Verify and maintain the "Creating a template" tutorials (Python in apps/generator/docs/generator-template.md, Java in apps/generator/docs/generator-template-java.md). Use when asked to check, test, update, or fix these tutorials, when a change to the generator, react-sdk, AsyncAPI CLI, Parser API, or AsyncAPI spec version may affect them, or when an issue reports that a tutorial step fails. Do not use for other docs pages or for baked-in templates under packages/templates.
---

# Maintain the template tutorials

Two tutorials teach readers to build an MQTT client template from scratch:

| Tutorial | File | Project the reader builds |
|---|---|---|
| Creating a template - Python | `apps/generator/docs/generator-template.md` | `python-mqtt-client-template` |
| Creating a template - Java | `apps/generator/docs/generator-template-java.md` | `java-mqtt-client-template` |

The Java tutorial reuses the AsyncAPI document from the Python tutorial's "Background context" section, so a change to that document affects both tutorials.

Readers copy code blocks one by one. A tutorial is correct only when every block, taken in order, produces a template that generates working code. Reading the markdown is not enough. You verify a tutorial by running it, with the bundled script.

## Bundled resource

`scripts/verify-tutorial.mjs`, next to this file, walks a tutorial the way a reader does. It rebuilds the reader's project from the code blocks in tutorial order and runs the commands the tutorial gives at each step:

- `asyncapi` runs through `npx --yes @asyncapi/cli@<version>`, so the check uses the published CLI and the generator version the CLI depends on, not the code in this repository.
- `npm install` pulls the published `@asyncapi/generator-react-sdk` version from the tutorial's `package.json`.
- `npm test`, `gradle build`, and `gradle run` run exactly as the tutorial defines them. Docker runs Gradle when the machine has no local `gradle` and JDK.
- `python` is a virtual environment with `paho-mqtt==1.6.1`, the version the Python tutorial requires.
- Next to every program that publishes, `npx mqtt@5 sub -V 4` subscribes to the same topics. A step passes only when the broker delivers the IDs the program printed. The tutorial clients print "sent" even when the broker dropped the connection, so the printed line alone proves nothing.
- It checks the outputs the tutorial promises: the title-only first generation, the missing `server` parameter error, and that the generated code compiles. The compile check catches template text that leaks into the output, such as a `// 2` comment inside JSX children.

The script prints one `PASS` or `FAIL` line per step, then `N/M checks passed`, and exits non-zero when a step fails.

## Run the verification

Run the script yourself whenever this skill applies. Do not ask the user to run it, and do not report a tutorial as working without a run that passed.

1. Check the prerequisites: `node`, `npm`, `python3`, and a running Docker daemon (`docker info`). If Docker is not running, stop and tell the user.
2. Start the script from the repository root in the background, with the output going to a log file in your scratchpad directory. A full run of both tutorials takes about 20 to 30 minutes, mostly Gradle in Docker and the broker checks.

   ```bash
   node .claude/skills/maintain-template-tutorials/scripts/verify-tutorial.mjs all --keep --workdir {SCRATCHPAD}/tutorial-verify > {SCRATCHPAD}/tutorial-verify.log 2>&1
   ```

   Use `python` or `java` instead of `all` when the change touches only one tutorial. A change to the Python tutorial's "Background context" document affects both.
3. Watch the log for the lines that matter, not the full output, which is long:

   ```bash
   tail -n +1 -f {SCRATCHPAD}/tutorial-verify.log | grep --line-buffered -E "^(PASS|FAIL)|checks passed|=== "
   ```

4. When a step fails, read that step's block in the log. It holds the tail of the program output and of the subscriber output. Then follow [Read a failure](#read-a-failure).
5. When the run ends, check that no containers are left: `docker ps --filter label=asyncapi-tutorial-verify`. Remove what is left with `docker rm -f`. Do not stop or remove anything else, for example a broker the user runs on `localhost:1883`.
6. Report the `PASS` and `FAIL` lines and the broker mode to the user.

Other options: `--cli-version X` pins the AsyncAPI CLI, and `--timeout SECONDS` changes how long each broker check waits (default `300`). Without `--keep`, the script deletes the work directory after a run with no failures.

### Choose the broker

`--broker local` is the default. It follows the tutorials' note for a local broker: every `test.mosquitto.org` in the copied code becomes `localhost`. The script uses the broker that already listens on `localhost:1883`. If there is none, it runs the tutorials' own command, `docker run -d --name mosquitto -p 1883:1883 eclipse-mosquitto`, under a different container name. The Gradle container reaches the host broker through a small `alpine/socat` container, because Docker Desktop has host networking off by default.

`--broker public` runs the code as written, against `test.mosquitto.org`. Run it as well when a change touches the broker address or the connection code. The public broker drops a large share of connections at times, from paho and mqtt.js alike, so a failure in this mode only counts when the same step passes with `--broker local`.

### Read a failure

1. Decide whether the tutorial is wrong or the script is wrong.
2. A `selector "..." matched N code blocks` error means the tutorial changed shape, for example a new code block that looks like an existing one. Update the selector in `scripts/verify-tutorial.mjs` so it matches exactly one block. Do not loosen a selector until it matches anything.
3. A broker step that fails with `--broker public` but passes with `--broker local` means the public broker is unstable. Do not change the tutorials for it.
4. Anything else is a tutorial bug until proven otherwise. Reproduce it in the kept work directory, fix the tutorial, and run the script again.

## Update a tutorial

1. Make the change in the markdown. Keep the two tutorials consistent: the same AsyncAPI document shape, the same `generator` range and `apiVersion`, the same `react-sdk` version, and the same `TopicFunction` logic in each component's own language.
2. When a code block changes, check every later block that repeats it. Both tutorials show `package.json` and `index.js` more than once, and readers copy whichever one is in front of them.
3. Check API calls against the Parser API version that `apiVersion` names. Read the type definitions in `apps/generator/node_modules/@asyncapi/parser/cjs/models/v3/` instead of trusting memory. For example, a v3 `Operation` has `channels()`, not `channel()`, and the v3 document has `servers()`, not `server()`.
4. Use an AsyncAPI version that the published parser accepts. The list is in `@asyncapi/specs/schemas/`. A version that looks right, such as `3.0.1`, can be rejected.
5. Inside JSX children, write comments as `{/* ... */}`. A `// ...` line there is text, and it ends up in the generated file.
6. Run the verification for every tutorial you changed.
7. Follow the repository's writing rules for any prose you change.

## Keep the script in step with the tutorials

The script encodes the tutorial structure: which code block belongs to which step, and which commands run at each step. When you add, remove, or reorder steps in a tutorial, update `scripts/verify-tutorial.mjs` in the same change. A script that skips a step reports a pass for a step that nobody checked.

## Release hygiene

The tutorials are documentation only. A change to them needs no changeset. Use the `docs:` prefix in the pull request title.
