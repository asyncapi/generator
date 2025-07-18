## @asyncapi/keeper

AsyncAPI message payload validation library that validates messages against JSON Schema (Draft-07).

### Installation

```bash
npm install @asyncapi/keeper
```

### API

### `await validateMessage(message, schemas)`

#### Parameters

| Parameter | Type               | Description                                                                 | Required |
|-----------|--------------------|-----------------------------------------------------------------------------|----------|
| `message` | `any`           | The message payload to validate (any non-null value)                                      | Yes      |
| `schemas` | `Array<Object>`    | Array of JSON Schema Draft-07 objects representing valid message structures  | Yes      |

#### Returns
`Promise<boolean>` — Resolves to true if the message is valid against any schema, otherwise false.

### Usage

#### Multiple Schema Validation

```js 
import { validateMessage } from '@asyncapi/keeper';

// Example message and schemas (schemas as JSON Schema objects)
const message = { content: 'Hello', timestamp: '2024-05-01T12:00:00Z' };
const schemas = [
  {
    type: 'object',
    properties: {
      content: { type: 'string' },
      timestamp: { type: 'string', format: 'date-time' }
    },
    required: ['content', 'timestamp'],
    additionalProperties: false
  },
  {
    type: 'object',
    properties: {
      content: { type: 'string' }
    },
    required: ['content'],
    additionalProperties: false
  }
];

const isValid = await validateMessage(message, schemas);
console.log('Valid against any schema:', isValid); // true or false
```

### `await validateByOperationId(asyncapiFilepath, operationId, message)`

#### Parameters

| Parameter           | Type         | Description                                                                                 | Required |
|---------------------|--------------|---------------------------------------------------------------------------------------------|----------|
| `asyncapiFilepath`  | `string`     | Path to the AsyncAPI document file.                                                         | Yes      |
| `operationId`       | `string`     | The ID of the operation to validate against.                                                       | Yes      |
| `message`           | `any`        | The message payload to validate (any non-null value)                                        | Yes      |

#### Returns
`Promise<boolean>` — Resolves to true if the message is valid against any of the operation's message schemas, otherwise false.

### Usage

#### Validate by Operation ID

```js
import { validateByOperationId } from '@asyncapi/keeper';

const asyncapiFilepath = path.resolve(__dirname, './asyncapi.yaml'); // Path to your AsyncAPI document
const operationId = 'sendMessage'; // The operationId you want to validate against
const message = { content: 'Hello', timestamp: '2024-05-01T12:00:00Z' };

const isValid = await validateByOperationId(asyncapiFilepath, operationId, message);
console.log('Valid for operation:', isValid); // true or false
```