# Dart `example.dart` — Architecture Deep-Dive

> **Parent doc:** [`dynamic-examples-architecture.md`](./dynamic-examples-architecture.md) — covers the broad 3-language strategy.
> **Scope:** **Dart only.** Detailed architecture for making `packages/templates/clients/websocket/dart/example.dart` a generated, generic, spec-aware artifact.
> **Date:** 2026-06-24
> **Status:** Design approved; v1 simplified per user feedback (no `getExampleStrategy` helper — two booleans inline; new `exampleFileName` param replaces hardcoded `<File name="example.dart">`).
> **Component location:** local to the Dart template (`dart/components/`, flat, `Example*` prefix). Promotion to `@asyncapi/generator-components` is explicit follow-up work.

---

## 1. Problem statement

The hand-written `packages/templates/clients/websocket/dart/example.dart` (36 lines) is hardcoded for the Hoppscotch echo demo. It:

- imports from a snapshot-output path (`test/temp/snapshotTestResult/custom_client_hoppscotch/client.dart`) that **only exists for repo contributors**, not for end users running `asyncapi generate fromTemplate`,
- names the literal class `HoppscotchClient` and the literal send method `sendEchoMessage('Hello, Echo!')`, so any spec that doesn't have that exact send op gets a broken example,
- runs an infinite `while(true)` send loop and **never calls `close()`**, leaking the connection,
- has no shape-awareness — the same body is emitted regardless of whether the spec has send ops, receive ops, both, or none.

The fix is to make `example.dart` a **generated artifact** of the template, emitted next to `client.dart` in the user's output directory, built by composing small JSX components — same architectural pattern the template already uses for `client.dart` itself.

This doc is the Dart-specific design. The companion doc (`dynamic-examples-architecture.md`) covers the cross-language strategy at a higher level.

---

## 2. Decisions

| # | Decision | Rationale / source |
|---|---|---|
| D1 | **Scope** is only `packages/templates/clients/websocket/dart/`. JavaScript and Python get their own deep-dive passes. | User instruction. |
| D2 | **Output**: one new file emitted next to `client.dart` in the user's output dir. Filename is parameterized via a new `exampleFileName` param (default `example.dart`), mirroring the existing `clientFileName` pattern. | User update: don't hardcode the filename. |
| D3 | **All four body shapes** rendered correctly: send + receive, send-only, receive-only, none. **No strategy enum.** Two booleans (`hasSend`, `hasReceive`) computed inline in the composer drive the conditional rendering — this covers the four combinations naturally without an enum or a helper. | User update: simplify v1 — drop the `getExampleStrategy` helper. |
| D4 | **Components are local and flat** in `dart/components/`, alongside existing `ClientClass.js`, `Constructor.js`, `ClientFields.js`. No sub-folder. Filenames prefixed with `Example*` to group them visually. | User decision (Q3). |
| D5 | **Fine-grained: 7 sub-components + 1 composer.** Each block of the generated file is its own component, mirroring how `Connect`, `SendOperations`, `CloseConnection` already factor the client-side. | User decision (Q2). |
| D6 | **No new helpers in `@asyncapi/generator-helpers`.** v1 reuses only existing helpers (`getClientName`, `getOperationMessages`, `getMessageExamples`, `lowerFirst`). The two booleans (`hasSend`, `hasReceive`) come from `asyncapi.operations().filterBySend()/filterByReceive()` directly — no abstraction worth adding for two `.length > 0` checks. Extract a classifier helper later only if a 3rd dimension of variation appears or JS/Python want a shared source of truth. | User update: simplify v1. Helpers stay language-agnostic regardless. |
| D7 | **Send loop is bounded**: `for (var i = 0; i < 5; i++) { ... }`, then `close()`. Replaces the current `while(true)`. | User decision (Q4). |
| D8 | **Payload literal** comes from `message.examples()` (via existing `getMessageExamples` helper). When absent, fall back to a TODO-prefixed placeholder. Dart-side formatter inside `ExampleSendInvocations` converts the raw example to a Dart literal (string → quoted, object → map literal, number/bool/null → direct). | User decision (Q5). |
| D9 | **Import path** is `import '<params.clientFileName>';` (relative sibling). The `clientFileName` override flows through unchanged. | User decision (Q6). |
| D10 | **No outgoing-processor block** for Dart. The Dart client does not generate `registerOutgoingProcessor` (no shared `RegisterOutgoingProcessor` component, no per-template `RegisterOutgoingProcessor.js` under `dart/components/`). Verified against `dart/components/ClientClass.js` and `dart/test/temp/snapshotTestResult/custom_client_hoppscotch/client.dart`. | Direct verification — corrects an assumption in the parent doc. |
| D11 | **No alternate-constructor demonstration** for Dart. The Dart client has only one constructor (`ClientName({String? url})`); no `throwSendErrors`/`raiseSendErrors`-style flag exists. | Verified against `dart/components/Constructor.js`. |
| D12 | **The existing hardcoded `example.dart` stays in place for this PR.** Cleanup is a separate follow-up so this diff stays additive and reviewable. | Matches parent doc Decision #6. |
| D13 | **New `.ageneratorrc` param: `exampleFileName`** — optional, default `example.dart`. Used by `template/example.dart.js` as `<File name={params.exampleFileName}>`. Mirrors the existing `clientFileName: client.dart` entry exactly. | User update. |

---

## 3. File layout

### 3.1 New files

```text
packages/templates/clients/websocket/dart/
├── .ageneratorrc                      ← unchanged
├── package.json                       ← unchanged (helpers/react-sdk deps already there)
├── example.dart                       ← UNCHANGED legacy file (deleted in follow-up)
├── template/
│   ├── client.dart.js                 ← unchanged
│   ├── pubspec.yaml.js                ← unchanged
│   └── example.dart.js                ← NEW (~10 lines)
└── components/
    ├── ClientClass.js                 ← unchanged
    ├── Constructor.js                 ← unchanged
    ├── ClientFields.js                ← unchanged
    ├── Example.js                     ← NEW (composer, ~50 lines)
    ├── ExampleImports.js              ← NEW (~15 lines)
    ├── ExampleHandlers.js             ← NEW (~25 lines)
    ├── ExampleConnect.js              ← NEW (~15 lines)
    ├── ExampleSendInvocations.js      ← NEW (~50 lines — includes Dart literal formatter)
    ├── ExampleReceiveWait.js          ← NEW (~10 lines)
    ├── ExampleClose.js                ← NEW (~10 lines)
    └── ExampleMain.js                 ← NEW (~50 lines — strategy-aware composition)
```

**Total Dart-side surface:** 1 new file template + 8 new components (composer included). Roughly ~235 lines of additive template code before tests.

### 3.2 Files modified outside `dart/components/`

- `packages/templates/clients/websocket/dart/.ageneratorrc` — add the `exampleFileName` param (default `example.dart`).
- `packages/templates/clients/websocket/test/integration-test/__snapshots__/integration.test.js.dart.snap` — gains a new `example.dart` entry per snapshot scenario. Regenerate via `npm run test:dart:update`.

That's it. **No `packages/helpers/` changes** in v1 (per D6).

### 3.3 What is *not* modified

- `packages/helpers/` — no new exports, no fixture additions, no helper tests for v1.
- `packages/components/` — nothing shared yet; promotion is explicit follow-up work.
- `apps/generator/docs/api_components.md` — local components don't surface there.
- `dart/package.json` — `@asyncapi/generator-helpers` (1.1.0) and `@asyncapi/generator-react-sdk` deps already cover everything; no version bumps required.

### 3.4 `.ageneratorrc` change

Add the `exampleFileName` entry (the rest of the file is unchanged):

```yaml
exampleFileName:
  description: The name of the generated example file
  required: false
  default: example.dart
```

This is byte-for-byte parallel to the existing `clientFileName` entry.

### 3.5 File-template shape — `template/example.dart.js`

Mirrors `template/client.dart.js` and `template/README.md.js`, with the filename driven by the new param:

```javascript
import { File } from '@asyncapi/generator-react-sdk';
import { Example } from '../components/Example';

export default function ({ asyncapi, params }) {
  return (
    <File name={params.exampleFileName}>
      <Example asyncapi={asyncapi} params={params} />
    </File>
  );
}
```

That is the entire file template. All genericness lives one level down in `components/Example.js`.

---

## 4. Spec-aware composition (no helper in v1)

### 4.1 The two booleans

The composer computes two booleans inline. That's the entire strategy mechanism in v1:

```javascript
const sendOps    = asyncapi.operations().filterBySend();
const hasSend    = sendOps.length > 0;
const hasReceive = asyncapi.operations().filterByReceive().length > 0;
```

These two flags drive **all** conditional rendering. No string enum, no classifier helper, no separate helper test.

### 4.2 The four body shapes that arise from `hasSend × hasReceive`

| `hasSend` | `hasReceive` | Body of `main()` |
|---|---|---|
| true | true | register message handler → register error handler → `try { connect; bounded send loop } catch { ... } finally { close }` |
| true | false | register **error handler only** (no receive ops to fire the message handler) → `try { connect; bounded send loop } catch { ... } finally { close }`. `ExampleHandlers` still emits the message-handler function definition at file scope for file-shape symmetry — it just isn't registered. |
| false | true | register message handler → register error handler → `try { connect; await Future.delayed(10s) } catch { ... } finally { close }` |
| false | false | identical body to the `(false, true)` row. The example degenerates into a minimal "I can connect" demo with a 10s wait that gives the user an obvious place to extend. |

**Why the `(false, false)` and `(false, true)` rows produce the same emitted Dart code:** Dart's generated client doesn't expose `recvXxx()` methods (receive is dispatched via the stream listener inside `Connect`). So for any spec without send ops, the example body is the same — register handlers, connect, wait, close. The two cells stay distinct in this table only as documentation; the renderer treats them identically.

### 4.3 Two rendering decisions per body

The `ExampleMain` component makes exactly two `cond`-decisions, both directly off the two booleans:

1. **Emit the `registerMessageHandler(...)` line?** → only when `hasReceive`.
2. **Send branch or wait branch?** → `hasSend ? <ExampleSendInvocations /> : <ExampleReceiveWait />`.

That's the entire spec-aware logic. There is no third dimension in v1.

### 4.4 Why no helper for v1

Two `.length > 0` checks read more clearly inline than an indirection through a `getExampleStrategy()` enum:

- **Locality.** The composer that uses the booleans is the composer that computes them — one file, no jumping.
- **Less surface.** No new export, no new fixture, no new helper test, no new dependency arrow from `templates/dart` into `packages/helpers`.
- **Smaller PR.** v1 lands as Dart-only with zero changes outside the Dart template (other than the snapshot regen).
- **Forward-compatible.** If a 3rd dimension of variation appears later (e.g., distinguishing request/reply vs. fire-and-forget sends), or if JS/Python join and want a single classifier, extracting `getExampleStrategy(asyncapi)` to `packages/helpers/src/operations.js` is mechanical — same code, just lifted. The doc keeps a note for this in §12.

### 4.5 Existing helpers reused (no changes needed)

- `getClientName(asyncapi, appendClientSuffix, customClientName)` — resolves the client class name (e.g. `HoppscotchClient`). Already used by `ClientClass.js`.
- `getOperationMessages(operation)` — pull messages for one operation. Already in `operations.js`.
- `getMessageExamples(message)` — pull example payloads for one message. Already in `operations.js`.
- `lowerFirst(name)` — used in `Example.js` to derive the instance variable name from the class name (`HoppscotchClient` → `hoppscotchClient`). Already in `utils.js`.

---

## 5. Component contracts

| # | Component | Always rendered? | Props | Role | Helpers used |
|---|---|---|---|---|---|
| 0 | `Example.js` (composer) | yes (root) | `{ asyncapi, params }` | Reads `asyncapi` + `params`, resolves `clientName`, `instanceName`, `sendOps`, `hasReceive`; orchestrates sub-components. | `getClientName`, `lowerFirst` |
| 1 | `ExampleImports` | yes | `{ clientFileName }` | Emits `import 'dart:async';` + `import '<clientFileName>';`. | — |
| 2 | `ExampleHandlers` | yes (always emits *both* function defs) | none (purely presentational) | Emits the `void myMessageHandler(String message)` and `void myErrorHandler(Object error)` function definitions at file scope. | — |
| 3 | `ExampleConnect` | yes (inside `ExampleMain` body) | `{ instanceName }` | Emits the single `await <instanceName>.connect();` line. The surrounding `try`/`catch`/`finally` lives in `ExampleMain`. | — |
| 4 | `ExampleSendInvocations` | conditional: `sendOps.length > 0` | `{ instanceName, sendOps, iterations=5, maxOpsToList=5 }` | Emits the bounded `for (var i = 0; i < iterations; i++) { ... }` loop with one call per send op (capped at `maxOpsToList`, remainder commented). Inline `toDartLiteral` formatter converts raw example values to Dart literals. | `getOperationMessages`, `getMessageExamples` |
| 5 | `ExampleReceiveWait` | conditional: `sendOps.length === 0` | `{ seconds=10 }` | Emits `await Future.delayed(Duration(seconds: N));` with a comment explaining why we wait. | — |
| 6 | `ExampleClose` | yes (inside the `finally` block in `ExampleMain`) | `{ instanceName }` | Emits the single `<instanceName>.close();` line (synchronous in Dart). | — |
| 7 | `ExampleMain` | yes | `{ clientName, instanceName, sendOps, hasReceive }` | Wraps everything in `Future<void> main() async { ... }`. Decides which `register*` calls to emit (using `hasReceive`), chooses between `ExampleSendInvocations` and `ExampleReceiveWait` (using `sendOps.length > 0`), wraps in `try { ... } catch (error) { ... } finally { ExampleClose }`. | — (props already resolved) |

**Why the indenting work happens here and not in helpers:** all formatting — `final ` keyword, `await ` placement, indentation, Dart string-escape rules — is Dart-idiomatic. The helpers stay clean.

---

## 6. Per-component sketches

The sketches below show the JSX intent. Final whitespace details (exact `indent={}`, `newLines={}` calibration) are micro-decisions for the implementation phase.

### 6.1 `ExampleImports.js`

```javascript
import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleImports({ clientFileName }) {
  return (
    <Text newLines={2}>
      {`import 'dart:async';
import '${clientFileName}';`}
    </Text>
  );
}
```

### 6.2 `ExampleHandlers.js`

Always emits both function definitions, even in `send-only` (where the message handler is never registered). Symmetry > minimalism; an unused function definition is harmless and keeps file diffs across strategies small.

```javascript
import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleHandlers() {
  return (
    <Text newLines={2}>
      {`void myMessageHandler(String message) {
  print('====================');
  print('Just proving I got the message in myMessageHandler: \$message');
  print('====================');
}

void myErrorHandler(Object error) {
  print('Errors from WebSocket: \$error');
}`}
    </Text>
  );
}
```

### 6.3 `ExampleConnect.js`

```javascript
import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleConnect({ instanceName }) {
  return (
    <Text indent={4}>
      {`await ${instanceName}.connect();`}
    </Text>
  );
}
```

### 6.4 `ExampleClose.js`

```javascript
import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleClose({ instanceName }) {
  return (
    <Text indent={4}>
      {`${instanceName}.close();`}
    </Text>
  );
}
```

### 6.5 `ExampleReceiveWait.js`

```javascript
import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleReceiveWait({ seconds = 10 }) {
  return (
    <Text indent={4} newLines={2}>
      {`// Wait for incoming messages to be processed by myMessageHandler.
await Future.delayed(Duration(seconds: ${seconds}));`}
    </Text>
  );
}
```

### 6.6 `ExampleSendInvocations.js`

Contains the Dart literal formatter — the one place where Dart-specific output formatting lives. The formatter is **deliberately not lifted to helpers** (per D6).

```javascript
import { Text } from '@asyncapi/generator-react-sdk';
import { getOperationMessages, getMessageExamples } from '@asyncapi/generator-helpers';

// Dart literal formatter: converts a JS value (from message.examples()[0].value())
// into a Dart source literal. Lives in this component, not in helpers, because the
// output shape is Dart-specific.
function toDartLiteral(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\$/g, '\\$');
    return `'${escaped}'`;
  }
  if (Array.isArray(value)) return `[${value.map(toDartLiteral).join(', ')}]`;
  if (typeof value === 'object') {
    const entries = Object.entries(value).map(
      ([k, v]) => `'${k}': ${toDartLiteral(v)}`
    );
    return `{${entries.join(', ')}}`;
  }
  return `'TODO: unsupported example type ${typeof value}'`;
}

function resolvePayloadLiteral(operation) {
  const messages = getOperationMessages(operation);
  if (!messages || messages.length === 0) {
    return `'TODO: replace with payload for ${operation.id()}'`;
  }
  const examples = getMessageExamples(messages[0]);
  if (!examples) {
    const name = (messages[0].name && messages[0].name()) || operation.id();
    return `'TODO: replace with payload matching ${name}'`;
  }
  const first = examples.all()[0];
  const raw = typeof first.value === 'function' ? first.value() : first;
  return toDartLiteral(raw);
}

export function ExampleSendInvocations({
  instanceName,
  sendOps,
  iterations = 5,
  maxOpsToList = 5,
}) {
  const opsToList = sendOps.slice(0, maxOpsToList);
  const remainder = sendOps.length - opsToList.length;

  const calls = opsToList
    .map((op) => `      ${instanceName}.${op.id()}(${resolvePayloadLiteral(op)});`)
    .join('\n');

  const tail =
    remainder > 0
      ? `\n      // ... ${remainder} more send operation${remainder > 1 ? 's' : ''} elided from the example.`
      : '';

  return (
    <Text indent={4} newLines={2}>
      {`for (var i = 0; i < ${iterations}; i++) {
  try {
${calls}${tail}
  } catch (error) {
    print('Error while sending message: \$error');
  }
  await Future.delayed(Duration(seconds: 2));
}`}
    </Text>
  );
}
```

### 6.7 `ExampleMain.js`

```javascript
import { Text } from '@asyncapi/generator-react-sdk';
import { ExampleConnect } from './ExampleConnect';
import { ExampleSendInvocations } from './ExampleSendInvocations';
import { ExampleReceiveWait } from './ExampleReceiveWait';
import { ExampleClose } from './ExampleClose';

export function ExampleMain({ clientName, instanceName, sendOps, hasReceive }) {
  const hasSend = sendOps.length > 0;

  return (
    <Text>
      <Text newLines={1}>{'Future<void> main() async {'}</Text>
      <Text indent={2}>{`final ${instanceName} = ${clientName}();`}</Text>
      {hasReceive && (
        <Text indent={2}>{`${instanceName}.registerMessageHandler(myMessageHandler);`}</Text>
      )}
      <Text indent={2} newLines={2}>{`${instanceName}.registerErrorHandler(myErrorHandler);`}</Text>

      <Text indent={2}>{'try {'}</Text>
      <ExampleConnect instanceName={instanceName} />
      <Text>{''}</Text>
      {hasSend
        ? <ExampleSendInvocations instanceName={instanceName} sendOps={sendOps} />
        : <ExampleReceiveWait />}
      <Text indent={2}>{'} catch (error) {'}</Text>
      <Text indent={4}>{`print('Failed to connect to WebSocket: \$error');`}</Text>
      <Text indent={2}>{'} finally {'}</Text>
      <ExampleClose instanceName={instanceName} />
      <Text indent={2}>{'}'}</Text>
      <Text>{'}'}</Text>
    </Text>
  );
}
```

### 6.8 `Example.js` (composer)

```javascript
import { Text } from '@asyncapi/generator-react-sdk';
import { getClientName, lowerFirst } from '@asyncapi/generator-helpers';
import { ExampleImports } from './ExampleImports';
import { ExampleHandlers } from './ExampleHandlers';
import { ExampleMain } from './ExampleMain';

export function Example({ asyncapi, params }) {
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const instanceName = lowerFirst(clientName);
  const sendOps = asyncapi.operations().filterBySend();
  const hasReceive = asyncapi.operations().filterByReceive().length > 0;

  return (
    <Text>
      <ExampleImports clientFileName={params.clientFileName} />
      <ExampleHandlers />
      <ExampleMain
        clientName={clientName}
        instanceName={instanceName}
        sendOps={sendOps}
        hasReceive={hasReceive}
      />
    </Text>
  );
}
```

### 6.9 Rendered output — strategy `both` (Hoppscotch echo)

For an AsyncAPI doc with one send op `sendEchoMessage` (payload example `'Hello, Echo!'`) and one receive op:

```dart
import 'dart:async';
import 'client.dart';

void myMessageHandler(String message) {
  print('====================');
  print('Just proving I got the message in myMessageHandler: $message');
  print('====================');
}

void myErrorHandler(Object error) {
  print('Errors from WebSocket: $error');
}

Future<void> main() async {
  final hoppscotchClient = HoppscotchClient();
  hoppscotchClient.registerMessageHandler(myMessageHandler);
  hoppscotchClient.registerErrorHandler(myErrorHandler);

  try {
    await hoppscotchClient.connect();

    for (var i = 0; i < 5; i++) {
      try {
        hoppscotchClient.sendEchoMessage('Hello, Echo!');
      } catch (error) {
        print('Error while sending message: $error');
      }
      await Future.delayed(Duration(seconds: 2));
    }
  } catch (error) {
    print('Failed to connect to WebSocket: $error');
  } finally {
    hoppscotchClient.close();
  }
}
```

### 6.10 Rendered output — strategy `send-only`

Identical to `both`, except the `hoppscotchClient.registerMessageHandler(myMessageHandler);` line is omitted. The function definition `void myMessageHandler(...)` is still emitted at file scope.

### 6.11 Rendered output — strategy `receive-only`

```dart
import 'dart:async';
import 'client.dart';

void myMessageHandler(String message) { /* ... */ }
void myErrorHandler(Object error) { /* ... */ }

Future<void> main() async {
  final myService = MyService();
  myService.registerMessageHandler(myMessageHandler);
  myService.registerErrorHandler(myErrorHandler);

  try {
    await myService.connect();

    // Wait for incoming messages to be processed by myMessageHandler.
    await Future.delayed(Duration(seconds: 10));
  } catch (error) {
    print('Failed to connect to WebSocket: $error');
  } finally {
    myService.close();
  }
}
```

### 6.12 Rendered output — strategy `none`

Identical to `receive-only`. The wait gives the user a place to extend.

---

## 7. Drift fixes — what improves vs. the current `example.dart`

| # | Drift in current file | How the new design fixes it |
|---|---|---|
| 1 | Hardcoded `import 'test/temp/snapshotTestResult/custom_client_hoppscotch/client.dart';` (only valid for repo contributors) | `ExampleImports` emits `import '${params.clientFileName}';` (relative sibling — works for any user) |
| 2 | Hardcoded class name `HoppscotchClient` | `Example.js` resolves the class via `getClientName(asyncapi, ...)` and propagates it |
| 3 | Hardcoded `sendEchoMessage('Hello, Echo!')` — not spec-aware | `ExampleSendInvocations` iterates `asyncapi.operations().filterBySend()` and uses `op.id()` for each call; payload comes from `message.examples()` or a TODO placeholder |
| 4 | Infinite `while(true)` loop — never terminates, never closes | Bounded `for (var i = 0; i < 5; i++)` loop, then `close()` in `finally` |
| 5 | No `wsClient.close()` call — connection leaks | `ExampleClose` emits `close()` in the `finally` block of `main()` |
| 6 | No shape-awareness — same body for any spec | `Example.js` computes `sendOps` and `hasReceive`; `ExampleMain` `cond`-renders the appropriate body off those two booleans |
| 7 | Instance variable hardcoded as `wsClient` regardless of class | `lowerFirst(clientName)` gives a class-derived instance name (e.g., `hoppscotchClient`, `myService`) |

---

## 8. Edge cases the design must handle

| Case | Behavior |
|---|---|
| Spec has 50 send ops | `ExampleSendInvocations` caps the listing at `maxOpsToList=5` distinct send methods and emits a comment `// ... 45 more send operations elided ...`. The loop iteration count is independent (always 5). Together this keeps the example under ~80 lines for very chatty specs. |
| Spec sets `customClientName='MyClient'` | `getClientName()` returns `'MyClient'`; `lowerFirst()` gives `'myClient'`. Imports unchanged. |
| Spec sets `appendClientSuffix=true` (default false) | `getClientName()` appends `'Client'`; instance derives from the result. |
| Send op message has no `examples()` and no obvious schema name | Placeholder: `final message = 'TODO: replace with payload for <opId>';` — typed as a string for compile safety; user replaces. |
| Send op message example is a string | `'Hello, Echo!'` with proper Dart string escaping for `\`, `'`, `$`. |
| Send op message example is an object | Dart map literal: `{'text': 'hi', 'ts': 1234}`. Dart's send method accepts `dynamic` and JSON-encodes non-strings. |
| Send op message example is an array / number / bool / null | Direct Dart literal — Dart's send accepts `dynamic`. |
| Spec with `clientFileName='my_client.dart'` override | Imports `import 'my_client.dart';` — works because the override flows through `params.clientFileName`. |
| Spec with no servers | The generated client's `Connect` already handles this (it reads `params.server`); the example doesn't reference servers directly. |
| Spec with multiple servers | User chose one via `params.server`; example uses that one (no multi-server demo — explicit out-of-scope). |
| Operation `id()` collides with a Dart keyword | Already handled upstream by `SendOperations`'s Dart config — the same `op.id()` is used in both places, so whatever the generated client method is named, the example will match. |

---

## 9. Tests

Per the repo rule for `<client>/components/`:

> A component under `<client>/components/` gets a dedicated snapshot test **only when it has conditional rendering or variant logic**; purely presentational components are covered by integration + acceptance tests.

Applied:

| Component | Variant logic? | Dedicated snapshot test? |
|---|---|---|
| `Example.js` (composer) | yes — boolean combinations + clientName resolution | **yes** — one snapshot per `(hasSend, hasReceive)` combination (4 snapshots) |
| `ExampleImports` | no | no |
| `ExampleHandlers` | no | no |
| `ExampleConnect` | no | no |
| `ExampleSendInvocations` | yes — iterates N ops, payload format varies by example shape | **yes** — covers: 1 op string payload, 1 op object payload, 1 op no example (placeholder), N>maxOpsToList |
| `ExampleReceiveWait` | no (the `seconds` prop is configurable but always renders the same shape) | no |
| `ExampleClose` | no | no |
| `ExampleMain` | yes — two `cond`-branches off `hasSend` and `hasReceive` | **yes** — one snapshot per `(hasSend, hasReceive)` combination |

**Three new component-snapshot tests** for the Dart template: `Example.test.js`, `ExampleSendInvocations.test.js`, `ExampleMain.test.js`.

**No helper test** — v1 has no new helper.

**Fixtures:** reuse the existing protocol-shared WebSocket fixture at `packages/templates/clients/websocket/test/__fixtures__/`. If a `(true, false)` (send-only) or `(false, false)` (no-ops) permutation isn't expressible against the current fixtures, add a minimal new one rather than altering the shared one — per the repo rule "extend only when a new variant genuinely isn't expressible".

**Integration test:** `packages/templates/clients/websocket/test/integration-test/__snapshots__/integration.test.js.dart.snap` will gain `example.dart` entries for each existing snapshot scenario (Hoppscotch + Postman + custom). Regenerate via `npm run test:dart:update`. **No new integration test file is created** — the example just rides on the existing snapshot harness.

---

## 10. Per-client variation axes — applied to Dart

| Axis | What varies | How Dart handles it |
|---|---|---|
| **A — Language** | per-language idioms | Out of scope here — JS and Python live in their own deep-dives. This doc is Dart only. |
| **B — Per-spec** | different AsyncAPI docs → different examples | `filterBySend()` + `filterByReceive()` (two `.length > 0` checks in the composer) + `message.examples()` together drive variation. A spec with only sends → send-loop body, no message-handler registration. Echo spec (sends + receives) → send-loop body, both handlers registered. Receive-only chat spec → wait body, both handlers registered. Stub spec → wait body, both handlers registered. |
| **C — Per-param** | `customClientName`, `appendClientSuffix`, `clientFileName`, `server` | All flow through `params` into the composer; sub-components use the resolved values. |
| **D — Per-op-count** | 0, 1, N send ops | Composer skips the send block at 0; lists up to `maxOpsToList=5` send ops, comments the remainder. |

---

## 11. Open items for the implementation plan

These are micro-decisions to lock down during planning, not now:

1. **`exampleFileName` default value.** Proposed: `example.dart` (matches the `clientFileName: client.dart` convention). Confirm.
2. **Max-ops cap default.** Proposed: 5. Confirm.
3. **Receive-wait duration default.** Proposed: 10 seconds. Confirm.
4. **Inner per-send delay inside the bounded loop.** Proposed: 2 seconds (`await Future.delayed(Duration(seconds: 2))`). Confirm.
5. **`maxOpsToList` exposed as a prop on `ExampleSendInvocations`?** Yes (defaulted), so a later integration test can pin it. No `.ageneratorrc` exposure now.
6. **Whitespace calibration.** Final `indent={}` / `newLines={}` values for each `<Text>` call need to be tuned during implementation so the rendered output is clean.
7. **Snapshot fixtures for `Example.test.js`.** Use the existing WebSocket protocol fixture for the `(true, true)` case; if asserting *each* `(hasSend, hasReceive)` combination requires `(true, false)` and `(false, false)` permutations, either build small parser-shaped stand-ins or add per-combination AsyncAPI YAML fixtures.

---

## 12. Future work (Dart-specific)

1. **Promote to `@asyncapi/generator-components`.** Once JS and Python deep-dives complete and the three implementations exist, lift the 8 components (with a `language` prop on each, mirroring how `SendOperations`/`Connect`/`CloseConnection` already do it) into `packages/components/src/components/example/`. Follow the same path `Readme` took.
2. **Extract `getExampleStrategy(asyncapi)` to `@asyncapi/generator-helpers` if/when needed.** Triggers: a 3rd dimension of variation appears (e.g., distinguishing request/reply vs. fire-and-forget sends), or JS/Python join and want a single classifier shared across templates. Until then, the two booleans inline in the composer carry their own weight more clearly. The lift is mechanical — extract the two `.length > 0` checks and the 4-row decision table verbatim.
3. **Delete legacy `example.dart`.** After this PR lands and contributors confirm the generated output is equivalent or strictly better, drop the hardcoded file in a follow-up.
4. **Reuse the generated `example.dart` in the Dart acceptance test.** Today the acceptance test re-implements the same handler-register-connect-send pattern. Once generated, point the acceptance harness at the generated `example.dart` with a `MOCK_URL` override and have one source of truth for "how to use the Dart client."
5. **Dart-specific extensions.** When Dart gains an outgoing-processor mechanism (if ever), add `ExampleOutgoingProcessor` mirroring the JS/Python equivalents.

---

## 13. References

- Parent doc — broad 3-language strategy: [`./dynamic-examples-architecture.md`](./dynamic-examples-architecture.md)
- Issue: [asyncapi/generator#1627](https://github.com/asyncapi/generator/issues/1627)
- Current hardcoded Dart example: `packages/templates/clients/websocket/dart/example.dart`
- Existing Dart components: `packages/templates/clients/websocket/dart/components/{ClientClass.js, Constructor.js, ClientFields.js}`
- Existing Dart file template: `packages/templates/clients/websocket/dart/template/client.dart.js`
- Shared `SendOperations` Dart config (source of `op.id()` naming convention): `packages/components/src/components/SendOperations.js` lines 159-174
- Helpers reused (no changes in v1): `packages/helpers/src/operations.js` (`getOperationMessages`, `getMessageExamples`), `packages/helpers/src/utils.js` (`getClientName`, `lowerFirst`)
- Generated Dart client snapshot (target shape of `client.dart` the example imports): `packages/templates/clients/websocket/dart/test/temp/snapshotTestResult/custom_client_hoppscotch/client.dart`
- Existing `.ageneratorrc` param pattern referenced by D13: `packages/templates/clients/websocket/dart/.ageneratorrc` (`clientFileName` entry)
- Repo rules enforced by this design:
  - `AGENTS.md` §4.5 — when components belong in `packages/components` (not yet, by D4)
  - `AGENTS.md` §4.6 — helpers stay language-agnostic, fixture-tested (v1 adds no helpers)
  - `AGENTS.md` §4.7 — template-local component tests are conditional-only
  - `AGENTS.md` §2.5 — changeset names only `@asyncapi/generator` (because `packages/templates/*` is private and there are no `packages/helpers/` changes in v1); `minor` level
