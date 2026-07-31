---
"@asyncapi/generator-components": minor
"@asyncapi/generator": minor
---

The WebSocket Dart, JavaScript, and Python templates now emit a spec-aware runnable example next to the generated client, rendered from shared components instead of being shipped as a hardcoded file.

**New components in `@asyncapi/generator-components`** (all under `src/components/example/`, each throwing `unsupportedLanguage` for languages outside `dart | javascript | python`):

- **Imports** — the example's import block, derived from the `clientFileName` parameter
- **Handlers** — placeholder message/error handlers; Python renders one `handle_<snake_op_id>` per receive operation plus a `custom_error_handler`, JavaScript and Dart render a fixed `myMessageHandler` / `myErrorHandler` pair
- **OpenConnection** — the `connect()` invocation
- **Close** — the `close()` invocation, for use in the example's `finally` block
- **SendInvocations** — a bounded iteration loop invoking each send operation in turn, with payloads resolved from `message.examples()`
- **OutgoingProcessor** — the outgoing message processor definition, rendered only when the spec has send operations

**Template changes shipped through `@asyncapi/generator`:**

- Each client now generates a runnable example file based on your AsyncAPI document, instead of shipping a fixed one.
- A new `exampleFileName` parameter (default `example.dart` / `example.js` / `example.py`) overrides the generated example's filename.