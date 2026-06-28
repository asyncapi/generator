# Dynamic Examples — Architecture Research

> **Issue:** [asyncapi/generator#1627 — Start generating examples](https://github.com/asyncapi/generator/issues/1627)
> **Date:** 2026-06-23
> **Status:** Design approved — ready for implementation plan
> **Scope:** WebSocket clients — JavaScript, Python, Dart (the 3 templates referenced in the issue)

---

## 1. Problem statement

Three WebSocket client templates ship a hand-written example file alongside the generator:

| Template | Example file | Lines |
|---|---|---|
| `packages/templates/clients/websocket/javascript/` | `example.js` | 52 |
| `packages/templates/clients/websocket/python/` | `example.py` | 41 |
| `packages/templates/clients/websocket/dart/` | `example.dart` | 36 |

The issue identifies two concrete failure modes for these hand-written examples:

1. **Discoverability** — examples live only in the source repository, so a user who runs `asyncapi generate fromTemplate <spec> @asyncapi/template-...` gets a client but no runnable demonstration of how to use it.
2. **Drift** — when the template changes, contributors regularly forget to update the example. The current state already shows drift (see §3.4).

The fix is to make examples a **generated artifact** of the template, emitted next to the generated client (`client.*` + `README.md` + `example.*`), so every user generating from any AsyncAPI document gets a runnable example tailored to *their* spec, and the example tracks the template by construction.

---

## 2. Decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | Scope is the 3 clients with hardcoded examples today (JS / Python / Dart). Java/Quarkus and Kafka are explicitly future work. | Strictly answers the issue as written; keeps the microgrant deliverable focused. |
| 2 | Delivery: a standalone runnable file `example.<ext>` written into the generated output directory, next to `client.*` and `README.md`. | Matches the issue's framing: *"if someone generates something with the template, they do not have the example available first-hand."* |
| 3 | The example must be **shape-aware** — branch on the parsed AsyncAPI document. Send/receive/both/none → different example bodies. Iterate real send operations, not a hardcoded `sendEchoMessage`. | A spec without send operations cannot show `wsClient.sendEchoMessage(...)`. A fixed example would be broken for that input. |
| 4 | Implementation lives **locally inside each template** (`<template>/components/example/...`). No promotion to `@asyncapi/generator-components` in this PR. | Per-language idioms (`Future<void> main()` vs `def main()` vs top-level `main()`) make the abstraction tax higher than the duplication tax at this stage. Plan to promote in a follow-up once the per-language shapes have stabilized. |
| 5 | File naming: `example.js` / `example.py` / `example.dart`. Not parameterized. | Matches today's convention; keeps the diff small. |
| 6 | The existing hardcoded `example.{js,py,dart}` files at the template root **stay for now**. | Defer the cleanup to a follow-up PR — separating "add generation" from "remove duplication" keeps reviews focused. |
| 7 | Testing / acceptance-suite integration is **out of scope** for this design. The focus is generating consistent, generalized examples. | Verification is recommended future work (§9). |

---

## 3. Analysis of the current 3 examples

### 3.1 Common structure (decomposition pass #1 — what's already there)

Reading the 3 files side-by-side, every example today is built from the same conceptual blocks, in the same order:

```text
┌─────────────────────────────────────────────────────────────────────┐
│ 1. Module/Import — load the generated client                        │
├─────────────────────────────────────────────────────────────────────┤
│ 2. Custom message handler   (function definition)                   │
├─────────────────────────────────────────────────────────────────────┤
│ 3. Custom error handler     (function definition)                   │
├─────────────────────────────────────────────────────────────────────┤
│ 4. Outgoing processor       (JS + Python only — Dart missing)       │
├─────────────────────────────────────────────────────────────────────┤
│ 5. Main entry point opens:                                          │
│    5a. Instantiate client                                           │
│    5b. Register handlers (message, error, [outgoing])               │
│    5c. await connect() in try/catch                                 │
│    5d. Send loop — periodic call to ONE hardcoded send method       │
│    5e. (close() — MISSING in all 3)                                 │
│ 6. Invoke main()                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Block-by-block detail

**Block 1 — Imports**

```javascript
// example.js
const WSClient = require('./test/temp/snapshotTestResult/custom_client_hoppscotch/client.js');
```

```python
# example.py
sys.path.append(os.path.join(os.path.dirname(__file__), 'test'))
from temp.snapshotTestResult.custom_client_hoppscotch.client import HoppscotchClient
```

```dart
// example.dart
import 'test/temp/snapshotTestResult/custom_client_hoppscotch/client.dart';
```

- All three reach into the snapshot-test output directory (`test/temp/snapshotTestResult/custom_client_hoppscotch/`). This works for repo contributors who first run `npm run test:update` to produce the snapshot client, but **fails for a user** running the generator on their own spec — the snapshot path doesn't exist in their output directory.
- The class name in JS (`WSClient`) doesn't match Python/Dart (`HoppscotchClient`). JS treats it as opaque; Python/Dart use the actual exported class. A generated example must use the real exported class name (`getClientName(...)`).

**Block 2 — Message handler**

| Language | Shape |
|---|---|
| JS | `function myHandler(message) { console.log(...) }` |
| Python | `def custom_message_handler(message): print(...)` |
| Dart | `void myHandler(String message) { print(...) }` |

Same intent in all three, language-idiomatic signature in each. ANSI color codes in the Python version (`\033[94m`) are a one-off that JS/Dart don't have — flag as drift candidate to either remove or replicate.

**Block 3 — Error handler**

Same shape as Block 2, parameter is the error object. No drift here.

**Block 4 — Outgoing processor**

JS and Python both define an `outgoingProcessor(message)` / `outgoing_message_processor(message)` function that transforms the payload before send. **Dart has no equivalent.** This is the clearest drift: the `RegisterOutgoingProcessor` component exists in all 3 templates (it's a *generated* method on the client class), but the Dart example never demonstrates it. A dynamic example fixes this for free by always emitting the processor when the spec has send ops.

**Block 5a–5b — Instantiate + register**

```javascript
const wsClient = new WSClient();
wsClient.registerMessageHandler(myHandler);
wsClient.registerErrorHandler(myErrorHandler);
wsClient.registerOutgoingProcessor(outgoingProcessor);
```

Note in `example.js`: `const wsClient = new WSClient();` is at module scope (line 3), before `main()`. In Python and Dart it's *inside* `main()`. Trivial drift but a real one.

**Block 5c — Connect**

```javascript
try {
  await wsClient.connect();
  // ...
} catch (error) {
  console.error('Failed to connect to WebSocket:', error.message);
}
```

```python
client.connect()  # no try/except wrapper
time.sleep(2)
```

```dart
try {
  await wsClient.connect();
  // ...
} catch (error) {
  print('Failed to connect to WebSocket: $error');
}
```

Python's `connect()` is synchronous and has no try/except — a noticeable asymmetry with JS/Dart's awaited + caught form. The underlying connect *does* throw on failure, so this is a real example-quality bug.

**Block 5d — Send loop**

| Language | Pattern |
|---|---|
| JS | `while (true) { await client.sendEchoMessage(msg); await sleep(5000); }` — infinite |
| Python | `for i in range(5): client.send_echo_message(msg); time.sleep(2)` — bounded, 5 iterations |
| Dart | `while (true) { client.sendEchoMessage(msg); await Future.delayed(5s); }` — infinite |

Three different strategies for "send a message periodically." The dynamic example should pick one canonical pattern per language and stick to it. Recommendation: bounded loop (`5` iterations) for all three — keeps the example terminating for demo purposes, and the user can change the bound trivially.

**Block 5e — Close**

**Missing in all three.** All three examples leak the connection. The generator emits a `close()` method on every client (via the shared `CloseConnection` component), but no example calls it. A dynamic example fixes this.

**Block 6 — Main invocation**

| Language | Pattern |
|---|---|
| JS | `main();` (top-level, fire-and-forget) |
| Python | `main()` (synchronous call after `def main()`) |
| Dart | `Future<void> main() async { ... }` (Dart's actual entry point) |

Language-idiomatic. No drift.

### 3.3 Decomposition pass #2 — the *target* component breakdown

Re-decomposing with the dynamism requirements layered in, the example splits into 8 components per template:

| Component | Always present? | Notes |
|---|---|---|
| `ExampleImports` | yes | Uses `clientFileName`, `clientName`, target generator-output directory — no hardcoded paths. |
| `ExampleHandlers` | yes | Message handler + error handler. Always rendered. |
| `ExampleOutgoingProcessor` | **conditional on send ops** | Skip entirely when the spec has no send operations. |
| `ExampleConnect` | yes | `connect()` with language-idiomatic try/catch (fix Python's missing wrap). |
| `ExampleSendInvocations` | **conditional on send ops** | Iterate the actual `filterBySend()` operations; emit one canonical call per op inside a bounded loop. |
| `ExampleReceiveWait` | **conditional: receive-only specs** | When there are no send ops, the example still needs to do *something* while waiting for incoming messages. Emit a sleep/wait. |
| `ExampleClose` | yes | The fix for the missing-close defect. Always close at the end. |
| `ExampleMain` | yes | Language-specific entry-point shape (`async main`, `def main`, `Future<void> main async`). |

### 3.4 Drift inventory — what the dynamic example fixes for free

| # | Drift / defect today | Fixed by |
|---|---|---|
| 1 | Dart missing outgoing processor block | `ExampleOutgoingProcessor` rendered uniformly across all 3 languages |
| 2 | Python missing try/except around `connect()` | `ExampleConnect` emits the language-idiomatic guard uniformly |
| 3 | None of the 3 examples call `close()` — connection leak | `ExampleClose` always renders at the end of `main` |
| 4 | Three different send-loop strategies (while-true / for-range / while-true-Dart) | `ExampleSendInvocations` picks one canonical bounded-loop pattern per language |
| 5 | Hardcoded `'Hello, Echo!'` payload | Pull from `message.payload().examples()` via a new helper, fall back to a placeholder string |
| 6 | Hardcoded `sendEchoMessage` method name | `ExampleSendInvocations` iterates `asyncapi.operations().filterBySend()` and resolves each method name via the same logic used by `SendOperations` component |
| 7 | Path reaches into `test/temp/snapshotTestResult/custom_client_hoppscotch/client.*` (only valid for repo contributors) | `ExampleImports` uses `params.clientFileName` and emits a relative import valid for the *user's* output directory |
| 8 | Class name mismatch between JS opaque `WSClient` and Py/Dart actual `HoppscotchClient` | All three use `getClientName(...)` so the rendered example always names the actual exported class |
| 9 | Module-scope vs in-`main` client instantiation drift (JS at module scope, others inside main) | `ExampleMain` defines the canonical placement — instantiate inside `main` for all 3 |
| 10 | `throwSendErrors=false` / `raise_send_errors=False` constructor flag documented in README but not demonstrated in any example | `ExampleHandlers` or `ExampleMain` includes a commented alternate-constructor line referencing the flag |

---

## 4. Architecture

### 4.1 File layout per template

```text
packages/templates/clients/websocket/<lang>/
├── template/
│   ├── client.<ext>.js           ← existing
│   ├── README.md.js              ← existing
│   └── example.<ext>.js          ← NEW: ~6-line file template that renders <Example/>
├── components/
│   ├── ClientClass.js            ← existing
│   ├── Constructor.js            ← existing
│   ├── ... (other existing)
│   └── example/                  ← NEW directory
│       ├── ExampleImports.js
│       ├── ExampleHandlers.js
│       ├── ExampleOutgoingProcessor.js
│       ├── ExampleConnect.js
│       ├── ExampleSendInvocations.js
│       ├── ExampleReceiveWait.js
│       ├── ExampleClose.js
│       ├── ExampleMain.js
│       └── Example.js            ← top-level composer
├── example.<ext>                 ← existing hardcoded file (kept for now per Decision #6)
├── package.json
└── .ageneratorrc
```

This is replicated identically across the JS / Python / Dart templates. The *structure* is identical; the *contents* of each component file are language-idiomatic and therefore not shared (see Decision #4).

### 4.2 File template shape

Each `template/example.<ext>.js` is a thin file template that does the same job as the existing `template/README.md.js`:

```javascript
// packages/templates/clients/websocket/javascript/template/example.js.js
import { File } from '@asyncapi/generator-react-sdk';
import { Example } from '../components/example/Example';

export default function ({ asyncapi, params }) {
  return (
    <File name="example.js">
      <Example asyncapi={asyncapi} params={params} />
    </File>
  );
}
```

Python and Dart equivalents differ only in `File name="..."` and the import path.

### 4.3 Composer (`Example.js`) shape

The local `Example.js` per template orchestrates the 8 sub-components based on the shape-strategy:

```javascript
import { Text } from '@asyncapi/generator-react-sdk';
import { getClientName, getExampleStrategy } from '@asyncapi/generator-helpers';
import { ExampleImports } from './ExampleImports';
import { ExampleHandlers } from './ExampleHandlers';
import { ExampleOutgoingProcessor } from './ExampleOutgoingProcessor';
import { ExampleMain } from './ExampleMain';

export function Example({ asyncapi, params }) {
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const sendOps = asyncapi.operations().filterBySend();
  const receiveOps = asyncapi.operations().filterByReceive();
  const strategy = getExampleStrategy(asyncapi); // 'both' | 'send-only' | 'receive-only' | 'none'

  return (
    <Text>
      <ExampleImports clientName={clientName} clientFileName={params.clientFileName} />
      <ExampleHandlers strategy={strategy} />
      {sendOps.length > 0 && <ExampleOutgoingProcessor />}
      <ExampleMain
        strategy={strategy}
        clientName={clientName}
        sendOps={sendOps}
        receiveOps={receiveOps}
      />
    </Text>
  );
}
```

`ExampleMain` itself imports and composes `ExampleConnect`, `ExampleSendInvocations`, `ExampleReceiveWait`, and `ExampleClose` — these only render *inside* the entry-point wrapper, so they're nested under `ExampleMain` rather than being top-level children of the composer.

`ExampleHandlers` always renders **both** the message handler and the error handler **function definitions** — defining a function that's never called is harmless and keeps the file structure uniform across strategies. The `strategy` prop is used only to decide whether to emit the message-handler stub at all in the truly degenerate `send-only` case (some teams will prefer to omit it, but the default is to keep it for symmetry). `ExampleMain` then decides which `register*` calls to actually emit based on strategy.

`ExampleMain` is the only component that knows about the call-sequence strategy and renders the inner orchestration (`ExampleConnect` → send/receive blocks → `ExampleClose`) inside the entry-point wrapper. That's intentional: in every supported language, the call sequence has to live *inside* `main()`, and `main()`'s syntactic shape varies enough per language that nesting reads more clearly than gluing the blocks from outside.

### 4.4 Shape-strategy decision table

| Strategy | Trigger | Blocks rendered (inside `main`) |
|---|---|---|
| `both` | spec has ≥1 send op AND ≥1 receive op | register handlers → connect → bounded send loop → close |
| `send-only` | spec has ≥1 send op, no receive ops | register error handler (network errors still possible) → connect → bounded send loop → close. Message-handler `register*` call is skipped because there are no receive ops to fire it; the handler *function definition* itself is still emitted by `ExampleHandlers` for file-shape uniformity. |
| `receive-only` | spec has no send ops, ≥1 receive op | register handlers → connect → `ExampleReceiveWait` (sleep N seconds) → close |
| `none` | spec has no operations at all | register handlers → connect → `ExampleReceiveWait` (10s) → close. Acts as a minimal "hello world" — the generated client can still connect, the example proves it. |

Determining the strategy is a pure function over the parsed document — encapsulate in `getExampleStrategy(asyncapi)` in `packages/helpers`.

### 4.5 Per-language rendering differences

Each component file is written 3 times (once per template), language-idiomatic. The differences are mechanical:

| Concept | JavaScript | Python | Dart |
|---|---|---|---|
| Client import | `const X = require('./X');` | `from X import X` | `import 'package:X.dart';` (or relative path) |
| Function decl. | `function f(x) { ... }` | `def f(x):` | `void f(T x) { ... }` |
| Async entry | top-level `main();` | `def main(): ...; main()` | `Future<void> main() async { ... }` |
| Connect await | `await client.connect();` | `client.connect()` (sync) | `await wsClient.connect();` |
| Try / catch | `try { ... } catch (e) { ... }` | `try: ... except Exception as e: ...` | `try { ... } catch (e) { ... }` |
| Sleep | `await new Promise(r => setTimeout(r, ms))` | `time.sleep(seconds)` | `await Future.delayed(Duration(...))` |
| Send call | `await client.sendXMessage(payload)` | `client.send_x_message(payload)` | `wsClient.sendXMessage(payload)` |
| Close call | `await client.close()` | `client.close()` | `await wsClient.close()` |
| Print | `console.log(...)` | `print(...)` | `print(...)` |

Send method naming follows the existing `SendOperations` component conventions for each language (camelCase in JS/Dart, snake_case in Python).

### 4.6 Helpers required in `packages/helpers`

Three new helpers needed; each gets a fixture-based test per the repo rule ("Every exported helper needs a test"):

1. **`getExampleStrategy(asyncapi)`** — returns `'both' | 'send-only' | 'receive-only' | 'none'`. Pure function over `asyncapi.operations().filterBySend()` and `filterByReceive()`.

2. **`getExamplePayloadForOperation(operation, language)`** — returns a string representation of an example payload for the operation's message. Strategy:
   - If `message.payload().examples()` is non-empty, use the first example, JSON-stringified in JS/Dart, dict-literal-formatted in Python.
   - If the schema is a simple string type, fall back to `"example string"`.
   - Otherwise emit a placeholder `'TODO: replace with payload matching <schema-name>'`.
   - The `language` parameter governs the *literal* form (JSON vs dict literal vs Dart map literal).

3. **`getSendMethodName(operation, language)`** — returns the generated method name for a send op (matches the naming used by the existing `SendOperations` component). Already half-implemented as logic inside `SendOperations`; promote to a helper so both components agree.

### 4.7 Tests for the new components

Per the repo rule for `<client>/components/`:

> A component under `<client>/components/` gets a dedicated snapshot test **only when it has conditional rendering or variant logic** (per-server branches, query-param shape, operation-type switches); purely presentational components are covered by integration + acceptance tests.

Applied to our new components:

| Component | Has variant logic? | Dedicated snapshot test? |
|---|---|---|
| `ExampleImports` | no (just uses props) | no — integration covers it |
| `ExampleHandlers` | no | no |
| `ExampleOutgoingProcessor` | no (the conditional is in the composer, not this component) | no |
| `ExampleConnect` | no | no |
| `ExampleSendInvocations` | **yes** — iterates N ops, payload format varies by message schema | **yes** |
| `ExampleReceiveWait` | no | no |
| `ExampleClose` | no | no |
| `ExampleMain` | **yes** — branches on `strategy` (4 paths) | **yes** |
| `Example.js` (composer) | **yes** — strategy selection + conditional sub-renders | **yes** |

So three new local-component snapshot tests per template. Reuse the existing protocol-shared WebSocket fixture (`packages/templates/clients/websocket/test/__fixtures__/`); if a `send-only` or `receive-only` permutation isn't expressible against the current fixtures, add a minimal new fixture rather than altering the shared one (per the repo's "extend only when a new variant genuinely isn't expressible against the existing spec" rule).

Helper tests follow the standard `packages/helpers/test/__fixtures__/` pattern.

---

## 5. Per-client variation analysis

The user's question — "do we need different examples for different generated clients, and what about those cases" — has three independent axes of variation. The answer is: **yes**, dynamically, across all three.

### 5.1 Axis A — per-language variation (JS vs Python vs Dart)

For the *same* AsyncAPI document, the three templates emit three structurally analogous but textually distinct examples. The shape (handlers → connect → send loop → close) is identical; the syntax is language-idiomatic. This axis is handled by writing each component three times (Decision #4) and by the language-specific rendering table in §4.5.

**This is unavoidable variation.** No abstraction collapses `await wsClient.connect()` and `client.connect()` and `await wsClient.connect()` into a single source without a language-specific dispatch — which is exactly what `Usage.js` and `CoreMethods.js` already do for the README, with a config object indexed by language. We could mirror that pattern (Approach B in the brainstorm) — and likely will, post-stabilization — but for now per-template locality wins.

### 5.2 Axis B — per-spec variation (different AsyncAPI documents)

For the *same* template (e.g., `websocket/javascript`), two different AsyncAPI documents produce two different examples:

- A spec with only `send` operations gets the `send-only` strategy.
- A spec with only `receive` operations gets the `receive-only` strategy.
- A spec with both directions gets `both`.
- A spec with no operations gets `none`.

Within each strategy, further variation comes from:
- **Number of send operations** — the bounded send loop iterates the actual list of send method names.
- **Message payload shape** — the helper pulls real example payloads from message schemas where available.
- **Query parameters** — already handled by the generated `client.*` constructor; the example doesn't need to reference these directly.

**This is the most important axis to get right.** A spec-blind example would either be broken (calling `sendEchoMessage` on a spec without that op) or trivial (just `new Client()`).

### 5.3 Axis C — combination (different client, same spec)

The interaction of A × B: an `n`-spec × `3`-language matrix. Each cell of the matrix is a different example file. None of the cells require special handling beyond what A and B already cover — A's per-language rendering is applied to B's per-spec strategy. Total complexity is `O(spec) + O(language)`, not `O(spec × language)`.

### 5.4 Edge cases the design must handle

| Case | Behavior |
|---|---|
| Spec with 50 send ops | Two separate bounds apply. **Op-enumeration cap** (proposed: 5) — `ExampleSendInvocations` lists at most 5 distinct send methods, comments the remainder by name. **Loop-iteration count** (proposed: 5) — the bounded for-loop runs 5 iterations regardless of op count. Together this keeps the example file under ~80 lines even for very chatty specs. |
| Spec where send op name collides with a JS keyword | Already handled upstream by `SendOperations` — same helper. |
| Spec with no servers defined | Connect can't render a URL; client constructor already handles this (uses `params.server`). Example just calls `connect()` without changes. |
| Spec where `customClientName` param is set | All components read `clientName` via `getClientName(asyncapi, params.appendClientSuffix, params.customClientName)` — same as existing `ClientClass`. |
| Spec with multiple servers | The user picked a server via `params.server`; example uses that one. Multi-server demonstration is out of scope for this PR. |
| Spec with binary payload | Example payload helper returns a placeholder comment — binary in an example is more confusing than illustrative. |

---

## 6. Rejected alternatives

### 6.1 Approach A (rejected for this PR, kept for follow-up)

A single shared `<Example/>` component in `@asyncapi/generator-components`, mirroring how `<Readme/>` is built. Sub-components select per-language snippets via a `language` prop, identical to `Usage.js`.

**Why rejected for now:** the *structure* of an example is more language-idiomatic than the structure of a README. README composition (Overview / Installation / Usage / CoreMethods / AvailableOperations) reads the same in all languages — only inline snippets differ. An example's *entry point shape* itself differs (Dart's `Future<void> main() async`, Python's `if __name__ == '__main__'`-style or simple `main()` invocation, JS's top-level call). Abstracting that costs more clarity than it buys at 3-template scale.

**Why keep for follow-up:** once the 3 implementations exist, the genuine common shape becomes visible, and a confident promotion can happen without inventing the abstraction speculatively.

### 6.2 Approach B (rejected)

A single shared `Example.js` with a per-language `exampleConfig = { javascript: ..., python: ..., dart: ... }` object containing 3 large template strings.

**Why rejected:** every language branch grows together. The shape-aware logic (4 strategies) would have to be replicated inside each language's template string, or the language strings would have to be sliced into smaller chunks — at which point you've reinvented Approach A but worse.

### 6.3 Reading examples from disk and templating only the bits that vary

Keep the current hardcoded `example.{js,py,dart}` files as templates with placeholders (`{{CLIENT_NAME}}`, `{{SEND_METHOD}}`, etc.) and have the generator do string substitution.

**Why rejected:** the generator deliberately uses the React/JSX rendering pipeline for *all* generated artifacts (see `apps/react-sdk` design). Introducing a parallel string-substitution path for one artifact type would violate the architectural assumption that "every generated file is a React component output." It also makes shape-aware logic ugly (you can't easily render a different *structure* with template substitution).

### 6.4 Embed the example only inside the generated README (no separate file)

Extend the existing `Usage` component in `packages/components/src/components/readme/` to emit the full handler/connect/loop/close pattern instead of the current minimal snippet.

**Why rejected:** the issue explicitly wants discoverable, **runnable** examples for end users. A code block inside README.md is informative but not directly runnable. Users would still copy-paste into a file before they can run anything. Decision #2 chose the standalone-file path; this option doesn't deliver on that.

That said: once the standalone example exists, **the README's Usage section could reuse the same source** by rendering an excerpt of `<Example/>` inline. That's a recommended future enhancement (§9) — single-source-of-truth between README and standalone file.

---

## 7. Out-of-scope decisions, documented

Each of the following was considered and intentionally deferred:

| # | Item | Defer reason |
|---|---|---|
| 1 | Java/Quarkus WebSocket example | Out of scope per Decision #1. Java/Quarkus example shape is meaningfully different (Quarkus DI, `@Inject`, etc.) and merits its own design pass. |
| 2 | Kafka client example | Out of scope per Decision #1. Producer/consumer + broker setup is a fundamentally different example shape from WebSocket. |
| 3 | Acceptance-test integration (run the generated example against Microcks) | The user explicitly said *"focus on generating consistent and generalized example rather than testing"* in the brainstorm. See §9 for what this would look like. |
| 4 | Promotion to `@asyncapi/generator-components` | Decision #4 — promote in a follow-up. |
| 5 | Deleting the existing hardcoded `example.{js,py,dart}` files | Decision #6 — keep for now, separate PR for cleanup. |
| 6 | `exampleFileName` param to override output filename | Not required by the issue; can add in a follow-up if requested. |
| 7 | Multi-server demonstration | One server (the one picked via `params.server`) is enough for a runnable example. Multi-server is a documentation concern, not an example concern. |

---

## 8. Implementation footprint estimate

Files to create:

```
packages/helpers/src/
├── getExampleStrategy.js                   (~25 lines)
├── getExamplePayloadForOperation.js        (~60 lines, 3 language branches)
└── getSendMethodName.js                    (~20 lines, refactored out of SendOperations)

packages/helpers/test/
├── getExampleStrategy.test.js
├── getExamplePayloadForOperation.test.js
└── getSendMethodName.test.js

packages/templates/clients/websocket/javascript/
├── template/example.js.js                  (~6 lines)
└── components/example/
    ├── Example.js                          (~40 lines, with snapshot test)
    ├── ExampleImports.js                   (~15 lines)
    ├── ExampleHandlers.js                  (~25 lines)
    ├── ExampleOutgoingProcessor.js         (~20 lines)
    ├── ExampleConnect.js                   (~15 lines)
    ├── ExampleSendInvocations.js           (~30 lines, with snapshot test)
    ├── ExampleReceiveWait.js               (~10 lines)
    ├── ExampleClose.js                     (~10 lines)
    └── ExampleMain.js                      (~50 lines, with snapshot test — branches on strategy)

packages/templates/clients/websocket/python/
└── (mirror of the JavaScript tree, Python-idiomatic content)

packages/templates/clients/websocket/dart/
└── (mirror, Dart-idiomatic content)
```

Files to modify:

- `packages/templates/clients/websocket/<lang>/package.json` — likely no change needed; the existing `@asyncapi/generator-helpers` dependency picks up the new helpers automatically.
- `packages/templates/clients/websocket/<lang>/.ageneratorrc` — no change; new file template lives next to existing ones.
- `packages/helpers/src/index.js` — export the 3 new helpers.
- `apps/generator/docs/api_components.md` — does NOT need regenerating, since the new components are local to templates (not in `packages/components`).
- Integration snapshot files for each template — will gain a new `example.<ext>` entry; regenerate via `npm run test:<client>:update` per the existing process.

**Estimated diff size:** ~25–30 new files, ~600–800 added lines (template code + tests), all additive — no removals required for the example feature itself.

**Changeset:** one `.changeset/*.md` naming **`@asyncapi/generator`** (per the rule that `packages/templates/*` are private and ship through `@asyncapi/generator`) and **`@asyncapi/generator-helpers`** (because three new exported helpers land there). `minor` level — adds public surface, no breaking changes.

---

## 9. Future work (recommended, out of scope for this PR)

Listed roughly in the order they should be picked up after this lands:

### 9.1 Use the generated example as the SUT in acceptance tests

The acceptance tests at `packages/templates/clients/websocket/test/javascript/acceptance.test.js` and `.../python/test_acceptance.py` currently re-implement the same connect/register-handler/send pattern that the example demonstrates. Once examples are generated:

- The acceptance test could `require`/`import` the *generated* `example.<ext>` from a known snapshot output directory.
- A `MOCK_URL` parameter on the example (or a CLI arg the example accepts) lets the test redirect connections to Microcks.
- One source of truth for "how to use the client" — the example demonstrates it, the acceptance test verifies it works.

This was the question derberg raised in the issue: *"Maybe we should somehow use them in the acceptance tests?"* — the answer is yes, but it's a second-stage deliverable that depends on this PR landing first.

### 9.2 Promote to `@asyncapi/generator-components`

After the 3 per-language implementations exist and the genuine common shape is visible, promote `Example` and its sub-components to `packages/components`, following the same path `Readme` took. The 2+ template rule then applies cleanly. Cost: a shared-package PR that follows the standard `packages/components` test conventions.

### 9.3 Single source of truth for README's Usage section

Once the shared `<Example/>` component exists (§9.2), the `Usage` section of the README could render an excerpt of it (or the full thing for a small spec). Eliminates the drift risk between the README's Usage and the standalone example.

### 9.4 Java/Quarkus example

WebSocket Java/Quarkus has its own template (`packages/templates/clients/websocket/java/quarkus/`) with no example. Add `ExampleX` components mirroring the 3 here but Java-idiomatic. Roughly a clone of one of the existing 3 (probably Dart, since both are typed/curly-brace), adjusted for Quarkus's injection model.

### 9.5 Kafka example

Kafka's example shape differs fundamentally — producer/consumer split, broker setup, no `connect()`/`close()` lifecycle. Likely a fresh design pass rather than extending the WebSocket components.

### 9.6 Delete the legacy hardcoded `example.{js,py,dart}` files

After this PR lands and contributors have at least one cycle to verify the generated examples are equivalent (or strictly better), delete the legacy hardcoded files in a follow-up PR. Keeps the diff and review here focused on adding generation, separately from removing the legacy artifacts.

### 9.7 `exampleFileName` param

If users want to customize the output filename (e.g., `demo.js` instead of `example.js`), add an `exampleFileName` param to each template's `.ageneratorrc`. Trivial follow-up.

---

## 10. Open questions to resolve before implementation

These are items I'd want to confirm during the implementation-plan phase, not now:

1. **Two send-loop bounds (cap-of-5 each)** — proposed *op-enumeration* cap of 5 (max 5 distinct send methods listed in the file) and proposed *loop-iteration* cap of 5 (the for-loop runs 5 times). Confirm both during implementation.
2. **Placeholder payload format** — when a message schema has no example and no simple primitive type, what literal should the example emit? Proposed: `'TODO: replace with payload matching <SchemaName>'`. Confirm.
3. **Should the example demonstrate the alternate constructor (`throwSendErrors=false`)?** Proposed: yes, as a commented alternative line near the instantiation site, to surface the API without complicating the active code path.
4. **`ExampleReceiveWait` duration** — proposed: 10 seconds. Reasonable default for "wait long enough to receive a few messages from a typical mock server." Confirm.

---

## 11. References

- Issue: [asyncapi/generator#1627](https://github.com/asyncapi/generator/issues/1627)
- Current hardcoded examples:
  - `packages/templates/clients/websocket/javascript/example.js`
  - `packages/templates/clients/websocket/python/example.py`
  - `packages/templates/clients/websocket/dart/example.dart`
- Existing analogous pattern (the `Readme` shared component):
  - `packages/components/src/components/readme/Readme.js`
  - `packages/components/src/components/readme/Usage.js`
  - `packages/components/src/components/readme/CoreMethods.js`
- Templates whose file-template structure should be mirrored:
  - `packages/templates/clients/websocket/javascript/template/README.md.js`
  - `packages/templates/clients/websocket/javascript/template/client.js.js`
- Repo conventions enforced by this design:
  - `AGENTS.md` §4.5 — when components belong in `packages/components`
  - `AGENTS.md` §4.6 — helper tests use fixtures from `test/__fixtures__/`
  - `AGENTS.md` §4.7 — template-local component tests are conditional-only and share a protocol fixture
  - `AGENTS.md` §2.5 — changeset rules; `packages/templates/*` is `private` and ships through `@asyncapi/generator`
