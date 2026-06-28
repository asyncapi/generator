# Dart `example.dart` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `example.dart` a generated, spec-aware, runnable artifact emitted next to the generated `client.dart`. Replace the hand-written hardcoded example with a JSX component pipeline that branches on whether the parsed AsyncAPI doc has send and/or receive operations.

**Architecture:** A new file template `template/example.dart.js` renders an `<Example>` composer (in `dart/components/`) that orchestrates 7 sub-components: `ExampleImports`, `ExampleHandlers`, `ExampleMain`, plus the four pieces nested inside `ExampleMain` (`ExampleConnect`, `ExampleSendInvocations`, `ExampleReceiveWait`, `ExampleClose`). The composer extracts `clientName`, `instanceName`, `sendOps`, and `hasReceive` from the parsed doc using existing helpers and threads them down. `ExampleMain` conditionally renders `ExampleSendInvocations` (when `sendOps.length > 0`) or `ExampleReceiveWait` (otherwise), and skips the `registerMessageHandler` line when `hasReceive` is false. A new `.ageneratorrc` param `exampleFileName` (default `example.dart`) drives the output filename.

**Tech Stack:** JSX (Babel/React preset), `@asyncapi/generator-react-sdk`, `@asyncapi/generator-helpers` (existing helpers only — no new exports), Jest snapshot tests with `babel-jest`, AsyncAPI Parser v3.

**Source spec:** `.claude/research/dart-example-architecture.md`

**Constraint:** All work happens under `packages/templates/clients/websocket/dart/`. The only files modified outside this directory are the integration-test snapshot file (auto-regenerated). No `packages/helpers/` changes in v1.

---

### Task 1: Verify starting state

**Files:** none (read-only orientation)

- [ ] **Step 1: Confirm branch and clean state**

Run:

```bash
cd C:/GS/generator
git status
git log --oneline -5
```

Expected: on branch `fix/1627-dynamic-examples`, branch ahead of or in sync with `origin/master`. Note any pre-existing modifications to `packages/templates/clients/websocket/test/integration-test/__snapshots__/integration.test.js.dart.snap` — these are pre-existing and must NOT be reverted; they're an in-progress baseline the example work will be layered on top of.

- [ ] **Step 2: Re-read the spec sections that lock in code**

Read `.claude/research/dart-example-architecture.md` sections §3 (file layout), §4 (two-boolean composition), §5 (component contracts), §6.1–6.8 (per-component sketches), §6.9 (rendered output for `both`). These are the source of truth for every component's behavior.

- [ ] **Step 3: Confirm the `.ageneratorrc` and `package.json` baseline**

Run:

```bash
cat packages/templates/clients/websocket/dart/.ageneratorrc
cat packages/templates/clients/websocket/dart/package.json
```

Expected: `.ageneratorrc` lists `server`, `clientFileName`, `appendClientSuffix`, `customClientName`. `package.json` has `@asyncapi/generator-react-sdk: "*"`, `@asyncapi/generator-helpers: "1.1.0"`, `@asyncapi/generator-components: "0.7.0"`. No `prebuild`/`build` scripts (template transpilation happens at generator runtime).

---

### Task 2: Add `exampleFileName` param to `.ageneratorrc`

**Files:**
- Modify: `packages/templates/clients/websocket/dart/.ageneratorrc`

- [ ] **Step 1: Add the `exampleFileName` entry**

Open `packages/templates/clients/websocket/dart/.ageneratorrc` and insert the new entry immediately after the existing `clientFileName` block (before `appendClientSuffix`). The full resulting `parameters:` section must read:

```yaml
apiVersion: v3
parameters:
  server:
    description: The name of the server described in AsyncAPI document
    required: true
  clientFileName:
    description: The name of the generated client file
    required: false
    default: client.dart
  exampleFileName:
    description: The name of the generated example file
    required: false
    default: example.dart
  appendClientSuffix:
    description: Add 'Client' suffix at the end of the class name. This option has no effect if 'customClientName' is specified.
    required: false
    default: false
  customClientName:
    description: The custom name for the generated client class
    required: false
metadata:
  type: client
  protocol: websocket
  target: dart
```

- [ ] **Step 2: Lint the change**

Run from `packages/templates/clients/websocket/dart/`:

```bash
npm run lint
```

Expected: PASS with 0 warnings (`.ageneratorrc` is YAML, not linted by ESLint, but running lint confirms nothing else broke).

- [ ] **Step 3: Commit**

```bash
git add packages/templates/clients/websocket/dart/.ageneratorrc
git commit -m "feat(dart): add exampleFileName param to .ageneratorrc"
```

---

### Task 3: Create `ExampleImports` component

**Files:**
- Create: `packages/templates/clients/websocket/dart/components/ExampleImports.js`

Presentational component with no variant logic — no dedicated test per the repo rule (covered by `Example.test.js` and integration). Reference: spec §6.1.

- [ ] **Step 1: Create the component file**

Write `packages/templates/clients/websocket/dart/components/ExampleImports.js`:

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

- [ ] **Step 2: Lint**

Run from `packages/templates/clients/websocket/dart/`:

```bash
npm run lint
```

Expected: PASS, 0 warnings.

- [ ] **Step 3: Commit**

```bash
git add packages/templates/clients/websocket/dart/components/ExampleImports.js
git commit -m "feat(dart): add ExampleImports component"
```

---

### Task 4: Create `ExampleHandlers` component

**Files:**
- Create: `packages/templates/clients/websocket/dart/components/ExampleHandlers.js`

Presentational. Always emits both function definitions (message + error handler) for file-shape symmetry across all four `(hasSend, hasReceive)` permutations. Reference: spec §6.2.

- [ ] **Step 1: Create the component file**

Write `packages/templates/clients/websocket/dart/components/ExampleHandlers.js`:

```javascript
import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleHandlers() {
  return (
    <Text newLines={2}>
      {`void myMessageHandler(String message) {
  print('====================');
  print('Just proving I got the message in myMessageHandler: $message');
  print('====================');
}

void myErrorHandler(Object error) {
  print('Errors from WebSocket: $error');
}`}
    </Text>
  );
}
```

(The `$message` and `$error` are Dart string interpolations in the output; JS template literals only interpret `${...}` with curly braces, so plain `$message` passes through literally.)

- [ ] **Step 2: Lint**

```bash
cd packages/templates/clients/websocket/dart
npm run lint
```

Expected: PASS, 0 warnings.

- [ ] **Step 3: Commit**

```bash
git add packages/templates/clients/websocket/dart/components/ExampleHandlers.js
git commit -m "feat(dart): add ExampleHandlers component"
```

---

### Task 5: Create `ExampleConnect` component

**Files:**
- Create: `packages/templates/clients/websocket/dart/components/ExampleConnect.js`

Presentational. Rendered inside `ExampleMain`'s `try` block, indented 4 spaces (the try block itself is indented 2 by `ExampleMain`, so 4 = 2 + 2 deeper). Reference: spec §6.3.

- [ ] **Step 1: Create the component file**

Write `packages/templates/clients/websocket/dart/components/ExampleConnect.js`:

```javascript
import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleConnect({ instanceName }) {
  return (
    <Text indent={4} newLines={2}>
      {`await ${instanceName}.connect();`}
    </Text>
  );
}
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: PASS, 0 warnings.

- [ ] **Step 3: Commit**

```bash
git add packages/templates/clients/websocket/dart/components/ExampleConnect.js
git commit -m "feat(dart): add ExampleConnect component"
```

---

### Task 6: Create `ExampleClose` component

**Files:**
- Create: `packages/templates/clients/websocket/dart/components/ExampleClose.js`

Presentational. Rendered inside the `finally` block, indented 4. Dart's `close()` is synchronous (returns `void`) so no `await`. Reference: spec §6.4.

- [ ] **Step 1: Create the component file**

Write `packages/templates/clients/websocket/dart/components/ExampleClose.js`:

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

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: PASS, 0 warnings.

- [ ] **Step 3: Commit**

```bash
git add packages/templates/clients/websocket/dart/components/ExampleClose.js
git commit -m "feat(dart): add ExampleClose component"
```

---

### Task 7: Create `ExampleReceiveWait` component

**Files:**
- Create: `packages/templates/clients/websocket/dart/components/ExampleReceiveWait.js`

Presentational. Used by `ExampleMain` when `sendOps.length === 0`. Emits a 10-second wait to give incoming messages time to fire the handler before the example terminates. Reference: spec §6.5.

- [ ] **Step 1: Create the component file**

Write `packages/templates/clients/websocket/dart/components/ExampleReceiveWait.js`:

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

(The second line of the multi-line template literal has no leading spaces — the `indent={4}` is applied to every line of the rendered output, so both lines come out at column 4.)

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: PASS, 0 warnings.

- [ ] **Step 3: Commit**

```bash
git add packages/templates/clients/websocket/dart/components/ExampleReceiveWait.js
git commit -m "feat(dart): add ExampleReceiveWait component"
```

---

### Task 8: Create `ExampleSendInvocations` component with TDD snapshot test

**Files:**
- Create: `packages/templates/clients/websocket/dart/components/ExampleSendInvocations.js`
- Test: `packages/templates/clients/websocket/dart/test/components/ExampleSendInvocations.test.js`

Variant component (iterates N ops, payload format varies per example shape) → gets a dedicated snapshot test per the repo rule. Reference: spec §6.6.

- [ ] **Step 1: Write the failing test**

Create `packages/templates/clients/websocket/dart/test/components/ExampleSendInvocations.test.js`:

```javascript
import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { ExampleSendInvocations } from '../../components/ExampleSendInvocations';

const parser = new Parser();
const asyncapiFilePath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-hoppscotch-client.yml'
);

describe('ExampleSendInvocations component', () => {
  let sendOps;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    sendOps = parseResult.document.operations().filterBySend();
  });

  test('renders bounded for-loop with one send op (hoppscotch echo)', () => {
    const result = render(
      <ExampleSendInvocations instanceName="hoppscotchClient" sendOps={sendOps} />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders nothing when sendOps is empty', () => {
    const result = render(
      <ExampleSendInvocations instanceName="hoppscotchClient" sendOps={[]} />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('elides extra ops when sendOps length exceeds maxOpsToList', () => {
    const fakeOps = Array.from({ length: 7 }, (_, i) => ({
      id: () => `sendOp${i}`,
      messages: () => ({ isEmpty: () => true })
    }));
    const result = render(
      <ExampleSendInvocations
        instanceName="myClient"
        sendOps={fakeOps}
        maxOpsToList={3}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('emits TODO placeholder when message has no examples', () => {
    const fakeOp = {
      id: () => 'sendStuff',
      messages: () => ({
        isEmpty: () => false,
        all: () => [
          {
            name: () => 'StuffPayload',
            examples: () => ({ isEmpty: () => true })
          }
        ]
      })
    };
    const result = render(
      <ExampleSendInvocations instanceName="myClient" sendOps={[fakeOp]} />
    );
    expect(result.trim()).toMatchSnapshot();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run from `packages/templates/clients/websocket/dart/`:

```bash
npx jest test/components/ExampleSendInvocations.test.js
```

Expected: FAIL — `Cannot find module '../../components/ExampleSendInvocations' from 'test/components/ExampleSendInvocations.test.js'`.

- [ ] **Step 3: Implement the component**

Create `packages/templates/clients/websocket/dart/components/ExampleSendInvocations.js`:

```javascript
import { Text } from '@asyncapi/generator-react-sdk';
import { getOperationMessages, getMessageExamples } from '@asyncapi/generator-helpers';

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
  if (Array.isArray(value)) {
    return `[${value.map(toDartLiteral).join(', ')}]`;
  }
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
  const message = messages[0];
  const examples = getMessageExamples(message);
  if (!examples) {
    const name = (typeof message.name === 'function' && message.name()) || operation.id();
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
  if (!sendOps || sendOps.length === 0) {
    return null;
  }

  const opsToList = sendOps.slice(0, maxOpsToList);
  const remainder = sendOps.length - opsToList.length;

  const calls = opsToList
    .map((op) => `    ${instanceName}.${op.id()}(${resolvePayloadLiteral(op)});`)
    .join('\n');

  const tail =
    remainder > 0
      ? `\n    // ... ${remainder} more send operation${remainder > 1 ? 's' : ''} elided from the example.`
      : '';

  return (
    <Text indent={4}>
      {`for (var i = 0; i < ${iterations}; i++) {
  try {
${calls}${tail}
  } catch (error) {
    print('Error while sending message: $error');
  }
  await Future.delayed(Duration(seconds: 2));
}`}
    </Text>
  );
}
```

- [ ] **Step 4: Run the test, write the snapshot**

```bash
npx jest test/components/ExampleSendInvocations.test.js
```

Expected: PASS — four snapshots written (no existing snapshot to compare against on first run, so Jest treats them as new).

- [ ] **Step 5: Inspect the snapshot for correctness**

Open `packages/templates/clients/websocket/dart/test/components/__snapshots__/ExampleSendInvocations.test.js.snap` and verify each snapshot:

1. **`renders bounded for-loop with one send op (hoppscotch echo)`** — should contain:
   ```
   for (var i = 0; i < 5; i++) {
     try {
         hoppscotchClient.sendEchoMessage('test');
     } catch (error) {
       print('Error while sending message: $error');
     }
     await Future.delayed(Duration(seconds: 2));
   }
   ```
   Indentation: outer `for` at col 4, inner `try`/`} catch`/`await` at col 6, inner call and `print` at col 8.

2. **`renders nothing when sendOps is empty`** — empty string (`""`).

3. **`elides extra ops`** — for-loop body lists 3 calls (`myClient.sendOp0(...)` through `myClient.sendOp2(...)`) followed by the comment `// ... 4 more send operations elided from the example.`.

4. **`emits TODO placeholder when message has no examples`** — for-loop body contains `myClient.sendStuff('TODO: replace with payload matching StuffPayload');`.

If any snapshot looks wrong, **stop and fix the component before committing**. Snapshot mistakes propagate.

- [ ] **Step 6: Lint**

```bash
npm run lint
```

Expected: PASS, 0 warnings.

- [ ] **Step 7: Commit**

```bash
git add packages/templates/clients/websocket/dart/components/ExampleSendInvocations.js \
        packages/templates/clients/websocket/dart/test/components/ExampleSendInvocations.test.js \
        packages/templates/clients/websocket/dart/test/components/__snapshots__/ExampleSendInvocations.test.js.snap
git commit -m "feat(dart): add ExampleSendInvocations component with snapshot tests"
```

---

### Task 9: Create `ExampleMain` component with TDD snapshot test

**Files:**
- Create: `packages/templates/clients/websocket/dart/components/ExampleMain.js`
- Test: `packages/templates/clients/websocket/dart/test/components/ExampleMain.test.js`

Variant component (branches on `hasReceive` and on `sendOps.length > 0` — four effective combinations). Snapshot tests cover all four. Reference: spec §6.7.

- [ ] **Step 1: Write the failing test**

Create `packages/templates/clients/websocket/dart/test/components/ExampleMain.test.js`:

```javascript
import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { ExampleMain } from '../../components/ExampleMain';

const parser = new Parser();
const asyncapiFilePath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-hoppscotch-client.yml'
);

describe('ExampleMain component', () => {
  let sendOps;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    sendOps = parseResult.document.operations().filterBySend();
  });

  test('renders both branch: hasSend=true, hasReceive=true', () => {
    const result = render(
      <ExampleMain
        clientName="HoppscotchClient"
        instanceName="hoppscotchClient"
        sendOps={sendOps}
        hasReceive={true}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders send-only branch: hasSend=true, hasReceive=false', () => {
    const result = render(
      <ExampleMain
        clientName="HoppscotchClient"
        instanceName="hoppscotchClient"
        sendOps={sendOps}
        hasReceive={false}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders receive-only branch: hasSend=false, hasReceive=true', () => {
    const result = render(
      <ExampleMain
        clientName="HoppscotchClient"
        instanceName="hoppscotchClient"
        sendOps={[]}
        hasReceive={true}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders none branch: hasSend=false, hasReceive=false', () => {
    const result = render(
      <ExampleMain
        clientName="HoppscotchClient"
        instanceName="hoppscotchClient"
        sendOps={[]}
        hasReceive={false}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx jest test/components/ExampleMain.test.js
```

Expected: FAIL — `Cannot find module '../../components/ExampleMain'`.

- [ ] **Step 3: Implement the component**

Create `packages/templates/clients/websocket/dart/components/ExampleMain.js`:

```javascript
import { Text } from '@asyncapi/generator-react-sdk';
import { ExampleConnect } from './ExampleConnect';
import { ExampleSendInvocations } from './ExampleSendInvocations';
import { ExampleReceiveWait } from './ExampleReceiveWait';
import { ExampleClose } from './ExampleClose';

export function ExampleMain({ clientName, instanceName, sendOps, hasReceive }) {
  const hasSend = Array.isArray(sendOps) && sendOps.length > 0;

  return (
    <Text>
      <Text>{'Future<void> main() async {'}</Text>
      <Text indent={2}>{`final ${instanceName} = ${clientName}();`}</Text>
      {hasReceive && (
        <Text indent={2}>{`${instanceName}.registerMessageHandler(myMessageHandler);`}</Text>
      )}
      <Text indent={2} newLines={2}>
        {`${instanceName}.registerErrorHandler(myErrorHandler);`}
      </Text>
      <Text indent={2}>{'try {'}</Text>
      <ExampleConnect instanceName={instanceName} />
      {hasSend ? (
        <ExampleSendInvocations instanceName={instanceName} sendOps={sendOps} />
      ) : (
        <ExampleReceiveWait />
      )}
      <Text indent={2}>{'} catch (error) {'}</Text>
      <Text indent={4}>{`print('Failed to connect to WebSocket: $error');`}</Text>
      <Text indent={2}>{'} finally {'}</Text>
      <ExampleClose instanceName={instanceName} />
      <Text indent={2}>{'}'}</Text>
      <Text>{'}'}</Text>
    </Text>
  );
}
```

- [ ] **Step 4: Run the test, write the snapshots**

```bash
npx jest test/components/ExampleMain.test.js
```

Expected: PASS, four new snapshots written.

- [ ] **Step 5: Inspect each snapshot**

Open `packages/templates/clients/websocket/dart/test/components/__snapshots__/ExampleMain.test.js.snap`. Verify each of the four snapshots:

1. **`renders both branch`** — full `Future<void> main() async { ... }` body with `registerMessageHandler` line present and a send loop calling `hoppscotchClient.sendEchoMessage('test');`. The `finally` block calls `hoppscotchClient.close();`.

2. **`renders send-only branch`** — same as above EXCEPT the `registerMessageHandler` line is absent.

3. **`renders receive-only branch`** — `registerMessageHandler` line present; instead of the send loop, the `try` body contains `await Future.delayed(Duration(seconds: 10));` with the explanatory comment.

4. **`renders none branch`** — same as `receive-only` EXCEPT the `registerMessageHandler` line is absent.

Verify indentation: `Future<void> main()` at col 0, `final wsClient = …` at col 2, `try {`/`} catch`/`} finally`/`}` at col 2, `await connect()`/send loop header/`Future.delayed`/`print('Failed...')`/`close()` at col 4.

- [ ] **Step 6: Lint**

```bash
npm run lint
```

Expected: PASS, 0 warnings.

- [ ] **Step 7: Commit**

```bash
git add packages/templates/clients/websocket/dart/components/ExampleMain.js \
        packages/templates/clients/websocket/dart/test/components/ExampleMain.test.js \
        packages/templates/clients/websocket/dart/test/components/__snapshots__/ExampleMain.test.js.snap
git commit -m "feat(dart): add ExampleMain component with 4 strategy snapshot tests"
```

---

### Task 10: Create `Example` composer with TDD snapshot test

**Files:**
- Create: `packages/templates/clients/websocket/dart/components/Example.js`
- Test: `packages/templates/clients/websocket/dart/test/components/Example.test.js`

Composer — orchestrates `ExampleImports`, `ExampleHandlers`, and `ExampleMain`. Resolves `clientName`/`instanceName`/`sendOps`/`hasReceive` from the parsed doc using existing helpers. Reference: spec §6.8.

- [ ] **Step 1: Write the failing test**

Create `packages/templates/clients/websocket/dart/test/components/Example.test.js`:

```javascript
import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { Example } from '../../components/Example';

const parser = new Parser();
const asyncapiFilePath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-hoppscotch-client.yml'
);

describe('Example composer', () => {
  let asyncapi;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    asyncapi = parseResult.document;
  });

  test('renders full example for hoppscotch (both send and receive)', () => {
    const params = {
      clientFileName: 'client.dart',
      appendClientSuffix: false,
    };
    const result = render(<Example asyncapi={asyncapi} params={params} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('uses customClientName when provided', () => {
    const params = {
      clientFileName: 'client.dart',
      customClientName: 'MyHoppscotchClient',
    };
    const result = render(<Example asyncapi={asyncapi} params={params} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('appends Client suffix when appendClientSuffix is true', () => {
    const params = {
      clientFileName: 'client.dart',
      appendClientSuffix: true,
    };
    const result = render(<Example asyncapi={asyncapi} params={params} />);
    expect(result.trim()).toMatchSnapshot();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx jest test/components/Example.test.js
```

Expected: FAIL — `Cannot find module '../../components/Example'`.

- [ ] **Step 3: Implement the composer**

Create `packages/templates/clients/websocket/dart/components/Example.js`:

```javascript
import { Text } from '@asyncapi/generator-react-sdk';
import { getClientName, lowerFirst } from '@asyncapi/generator-helpers';
import { ExampleImports } from './ExampleImports';
import { ExampleHandlers } from './ExampleHandlers';
import { ExampleMain } from './ExampleMain';

export function Example({ asyncapi, params }) {
  const clientName = getClientName(
    asyncapi,
    params.appendClientSuffix,
    params.customClientName
  );
  const instanceName = lowerFirst(clientName);
  const operations = asyncapi.operations();
  const sendOps = operations.filterBySend();
  const hasReceive = operations.filterByReceive().length > 0;

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

- [ ] **Step 4: Run the test, write the snapshots**

```bash
npx jest test/components/Example.test.js
```

Expected: PASS, three new snapshots written.

- [ ] **Step 5: Inspect the snapshots**

Open `packages/templates/clients/websocket/dart/test/components/__snapshots__/Example.test.js.snap`. Verify each:

1. **`renders full example for hoppscotch (both send and receive)`** — should be a fully-formed Dart source file starting with `import 'dart:async';` / `import 'client.dart';`, the two handler function defs, then `Future<void> main() async {` with `final hoppscotchEchoWebsocketClient = HoppscotchEchoWebsocketClient();` (or similar, depending on `getClientName`'s normalization of the title "Hoppscotch Echo WebSocket Client"). Both handlers registered. Send loop calling `sendEchoMessage('test');`. `finally { ...close(); }`.

   Note: the exact class name is whatever `getClientName(asyncapi, false, undefined)` returns from the hoppscotch fixture's title. Confirm the snapshot matches what `getClientName` actually produces — don't fix the snapshot, fix the test/expectation if needed.

2. **`uses customClientName when provided`** — `final myHoppscotchClient = MyHoppscotchClient();`.

3. **`appends Client suffix when appendClientSuffix is true`** — class name ends with `Client` (e.g., `HoppscotchEchoWebsocketClientClient`). Yes, double-`Client` if the title already contained "Client" — that's the existing `getClientName` behavior and not something we change.

If snapshots look wrong, fix `Example.js`. If snapshots look unexpected but are actually correct (e.g., the class name from the title is something you didn't expect), accept the snapshot and proceed.

- [ ] **Step 6: Lint**

```bash
npm run lint
```

Expected: PASS, 0 warnings.

- [ ] **Step 7: Commit**

```bash
git add packages/templates/clients/websocket/dart/components/Example.js \
        packages/templates/clients/websocket/dart/test/components/Example.test.js \
        packages/templates/clients/websocket/dart/test/components/__snapshots__/Example.test.js.snap
git commit -m "feat(dart): add Example composer with snapshot tests"
```

---

### Task 11: Create `template/example.dart.js` file template

**Files:**
- Create: `packages/templates/clients/websocket/dart/template/example.dart.js`

The file template is a thin wrapper that names the output file via the new `exampleFileName` param and delegates to `<Example>`. Mirrors `template/client.dart.js`. Reference: spec §3.5.

- [ ] **Step 1: Create the file template**

Write `packages/templates/clients/websocket/dart/template/example.dart.js`:

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

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: PASS, 0 warnings.

- [ ] **Step 3: Commit**

```bash
git add packages/templates/clients/websocket/dart/template/example.dart.js
git commit -m "feat(dart): add example.dart file template using exampleFileName param"
```

---

### Task 12: Regenerate the integration snapshot and review the new `example.dart` entries

**Files:**
- Modify: `packages/templates/clients/websocket/test/integration-test/__snapshots__/integration.test.js.dart.snap` (auto-regen)

The integration test runs `verifyDirectoryStructure`, which snapshots every file in the generator's output directory. Since the new `template/example.dart.js` is now part of the dart template, three new `example.dart` snapshot entries will be added (one per scenario: postman echo, hoppscotch echo, hoppscotch echo with custom client name).

- [ ] **Step 1: Regenerate the dart integration snapshot**

Run from the integration-test directory:

```bash
cd packages/templates/clients/websocket/test/integration-test
npm install
npm run test:dart:update
```

Expected: 3 tests pass under "Dart Client / Common Integration tests for Dart client generation". The `.snap` file will gain 3 new entries keyed `example.dart 1`.

- [ ] **Step 2: Inspect the new snapshot entries**

Open `packages/templates/clients/websocket/test/integration-test/__snapshots__/integration.test.js.dart.snap` and search for `example.dart`. Verify three new entries:

1. **`postman echo`** scenario (uses `appendClientSuffix: true`) — class name should be the postman title + `Client` suffix. Send loop calls the postman send op with whatever payload the postman fixture provides.

2. **`hoppscotch echo`** scenario (no `appendClientSuffix`, no `customClientName`) — class name derived from title only. `sendEchoMessage('test');` in the send loop.

3. **`hoppscotch echo with custom client name`** scenario (uses `customClientName: 'HoppscotchClient'`) — class name `HoppscotchClient`, instance `hoppscotchClient`. Send loop identical to the previous scenario in shape, just with `hoppscotchClient.sendEchoMessage('test');`.

For each, verify the rendered file structure: `import 'dart:async';` → `import 'client.dart';` → handler function defs → `Future<void> main()` with the four-stage `try/catch/finally` block. No double newlines anywhere awkward. The `finally` block closes the connection.

**If any of the three look wrong:**
- Fix the relevant component (Imports/Handlers/Main/etc.).
- Re-run `npm run test:dart:update`.
- Re-inspect.
- Only commit when all three look right.

- [ ] **Step 3: Run the dart unit tests to confirm no regression from the new template file**

Run from `packages/templates/clients/websocket/dart/`:

```bash
cd ../../dart
npm test
```

Expected: all unit snapshot tests still pass (`Example.test.js`, `ExampleMain.test.js`, `ExampleSendInvocations.test.js`).

- [ ] **Step 4: Run the integration test (read-only, no `-u`) to confirm snapshot stability**

```bash
cd ../test/integration-test
npm run test:dart
```

Expected: PASS. If FAIL, it means the snapshot regen in Step 1 didn't capture a determinism issue — investigate before committing.

- [ ] **Step 5: Commit**

```bash
cd C:/GS/generator
git add packages/templates/clients/websocket/test/integration-test/__snapshots__/integration.test.js.dart.snap
git commit -m "test(dart): regenerate integration snapshot with example.dart entries"
```

---

### Task 13: Final verification — lint + full dart test suite

**Files:** none (verification only)

- [ ] **Step 1: Lint the dart template**

```bash
cd packages/templates/clients/websocket/dart
npm run lint
```

Expected: PASS, 0 warnings.

- [ ] **Step 2: Lint the integration-test directory**

```bash
cd ../test/integration-test
npm run lint
```

Expected: PASS, 0 warnings.

- [ ] **Step 3: Run all dart unit tests**

```bash
cd ../../dart
npm test
```

Expected: PASS — coverage report appears, all three component snapshot tests green.

- [ ] **Step 4: Run the dart integration test**

```bash
cd ../test/integration-test
npm run test:dart
```

Expected: PASS — all 3 generation scenarios pass, snapshots stable.

- [ ] **Step 5: Manually inspect one generated example**

```bash
cd C:/GS/generator
cat packages/templates/clients/websocket/dart/test/temp/snapshotTestResult/client_hoppscotch/example.dart
```

(`cat` substitute on Windows PowerShell: `Get-Content`.)

Read the file end-to-end. Expectations:
- starts with `import 'dart:async';` and `import 'client.dart';`
- function defs for `myMessageHandler` and `myErrorHandler`
- `Future<void> main() async {` opens
- `final hoppscotchEchoWebsocketClient = HoppscotchEchoWebsocketClient();` (or whatever the title-derived class name is — accept what `getClientName` produces)
- both `register*` calls present
- `try { await ...connect(); for (...) { ... sendEchoMessage('test'); ... } } catch ... finally { ...close(); }`
- final `}` closes `main`

If any of this looks broken, **stop and fix** before declaring done — even though lint/tests pass, the rendered file is the actual deliverable.

- [ ] **Step 6: Confirm git state is clean**

```bash
git status
```

Expected: working tree clean (all 12 commits from Tasks 2–12 in place, no uncommitted files).

- [ ] **Step 7: Show the commit list**

```bash
git log --oneline origin/master..HEAD
```

Expected: 12 commits, one per implementation task (Tasks 2 through 12 each produced one commit; Task 1 and Task 13 are verification-only and produce no commits).

---

## Notes for the implementer

- **Frequent commits are the goal.** Each task produces exactly one commit (12 commits total). Do not batch.
- **JSX inside `.js` files** is handled by the existing `babel-jest` + `@babel/preset-react` configuration in the dart template's `package.json`. No webpack/build step needed for tests or the generator.
- **Indentation is calibrated.** The `<Text indent={N}>` wrapper adds `N` spaces to every line of its rendered children. Multi-line template literals inside `<Text>` should be written with internal indentation relative to that base — see the `ExampleSendInvocations` sketch where the for-body uses 2 spaces of internal indent (rendered at col 6 when `indent={4}`) and the inner-try body uses 4 spaces (rendered at col 8).
- **No new helpers.** Every helper used is an existing export of `@asyncapi/generator-helpers`: `getClientName`, `lowerFirst`, `getOperationMessages`, `getMessageExamples`. Do not add anything to `packages/helpers/`.
- **Dart-specific formatting stays in `ExampleSendInvocations.js`** — the `toDartLiteral` function is the one place where the JS-side payload value gets translated to a Dart source-code literal. Do not extract this to helpers; it's language-coupled (per the spec rule that helpers stay language-agnostic).
- **No outgoing-processor block.** The Dart client doesn't expose `registerOutgoingProcessor` (verified in `dart/components/ClientClass.js` and the existing `client.dart` snapshot). Don't add one to the example.
- **The legacy hand-written `dart/example.dart` stays for now.** Per spec D12, removing it is a separate follow-up PR after contributors confirm the generated output is equivalent or strictly better.
