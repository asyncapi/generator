## @asyncapi/keeper

AsyncAPI message payload validation library. Compiles message payload schemas with [AJV](https://ajv.js.org/) (v8) and validates runtime messages against them.

### Installation

```bash
npm install @asyncapi/keeper
```

### API

#### `compileSchema(schema)`

Synchronously compiles a single JSON Schema into a validator function.

| Parameter | Type     | Description                     | Required |
|-----------|----------|---------------------------------|----------|
| `schema`  | `object` | JSON Schema object to compile.  | Yes      |

**Returns** `function` — a compiled validator function.
**Throws** if AJV cannot compile the schema.

#### `compileSchemas(schemas)`

Synchronously compiles an array of schemas.

| Parameter | Type             | Description                                   | Required |
|-----------|------------------|-----------------------------------------------|----------|
| `schemas` | `Array<object>`  | Array of JSON Schema objects to compile.      | Yes      |

**Returns** `Array<function>` — array of compiled validator functions.
**Throws** if `schemas` is not an array, or if AJV cannot compile any schema.

#### `await compileSchemasByOperationId(asyncapiFilepath, operationId)`

Parses an AsyncAPI document from disk and compiles the payload schemas of every message belonging to the given operation.

| Parameter          | Type     | Description                                                          | Required |
|--------------------|----------|----------------------------------------------------------------------|----------|
| `asyncapiFilepath` | `string` | Path to the AsyncAPI document file (YAML or JSON).                   | Yes      |
| `operationId`      | `string` | Non-empty ID of the operation whose message payloads to compile.     | Yes      |

**Returns** `Promise<Array<function>>` — compiled validators for the operation's messages. Messages without a payload are skipped; if the operation has no messages, an empty array is returned (with a console warning).
**Throws** if `operationId` is not a non-empty string, if parsing the document fails, or if the operation is not found.

#### `validateMessage(compiledSchema, message)`

Validates a single message against one compiled validator.

| Parameter        | Type       | Description                                     | Required |
|------------------|------------|-------------------------------------------------|----------|
| `compiledSchema` | `function` | A validator returned by `compileSchema(s)`.     | Yes      |
| `message`        | `any`      | The message payload to validate (not `undefined`). | Yes   |

**Returns** `{ isValid: boolean, validationErrors?: Array<object> }`. On failure, `validationErrors` contains AJV's error objects.
**Throws** if `message` is `undefined` or `compiledSchema` is not a function.

To validate against an array of compiled schemas (e.g. the output of `compileSchemas` / `compileSchemasByOperationId`), call `validateMessage` per entry and combine the results as your use case requires.

### Usage

#### Basic schema compilation and validation

```js
import { compileSchema, validateMessage } from '@asyncapi/keeper';

const schema = {
  type: 'object',
  properties: {
    content: { type: 'string' },
    timestamp: { type: 'string', format: 'date-time' }
  },
  required: ['content', 'timestamp'],
  additionalProperties: false
};

const validator = compileSchema(schema);

const result = validateMessage(validator, {
  content: 'Hello',
  timestamp: '2024-05-01T12:00:00Z'
});
console.log(result.isValid);         // true
console.log(result.validationErrors); // undefined

const bad = validateMessage(validator, { content: 42 });
console.log(bad.isValid);            // false
console.log(bad.validationErrors);   // [ { ...AJV error... }, ... ]
```

#### Operation-specific validation

```js
import { compileSchemasByOperationId, validateMessage } from '@asyncapi/keeper';
import path from 'path';

const asyncapiFilepath = path.resolve(__dirname, './asyncapi.yaml');
const validators = await compileSchemasByOperationId(asyncapiFilepath, 'sendHelloMessage');

const message = { content: 'Hello from operation' };
const anyMatch = validators.some(v => validateMessage(v, message).isValid);
console.log('Valid for operation:', anyMatch);
```
