## @asyncapi/keeper

AsyncAPI message payload validation library that validates messages against JSON Schema (Draft-07).

### Installation

```bash
npm install @asyncapi/keeper
```

### API

#### `await compileSchemas(schemas)`

#### Parameters

| Parameter | Type               | Description                                                                 | Required |
|-----------|--------------------|-----------------------------------------------------------------------------|----------|
| `schemas` | `Array<Object>`    | Array of JSON Schema Draft-07 objects representing valid message structures  | Yes      |

#### Returns
`Promise<Array<function>>` — Array of compiled schema validator functions.

#### `await compileSchemasByOperationId(asyncapiFilepath, operationId)`

#### Parameters

| Parameter           | Type         | Description                                                                                 | Required |
|---------------------|--------------|---------------------------------------------------------------------------------------------|----------|
| `asyncapiFilepath`  | `string`     | Path to the AsyncAPI document file.                                                         | Yes      |
| `operationId`       | `string`     | The ID of the operation to extract message schemas from.                                    | Yes      |

#### Returns
`Promise<Array<function>>` — Array of compiled schema validator functions for the operation's messages.

#### `validateMessage(compiledSchemas, message)`

#### Parameters

| Parameter        | Type               | Description                                                                 | Required |
|------------------|--------------------|-----------------------------------------------------------------------------|----------|
| `compiledSchemas`| `Array<function>`  | Array of compiled schema validator functions                                | Yes      |
| `message`        | `any`              | The message payload to validate (any non-null value)                       | Yes      |

#### Returns
`{ isValid: boolean, validationErrors?: Array<object> }` — Object containing validation result and errors if invalid.

#### `removeCompiledSchemas()`

#### Returns
`void` — Unregisters all currently registered schemas from the validator.

### Usage

#### Basic Schema Compilation and Validation

```js 
import { compileSchemas, validateMessage, removeCompiledSchemas } from '@asyncapi/keeper';

// Example schemas (JSON Schema Draft-07 objects)
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

// Compile schemas
const compiledSchemas = await compileSchemas(schemas);

// Validate messages
const message1 = { content: 'Hello', timestamp: '2024-05-01T12:00:00Z' };
const result1 = validateMessage(compiledSchemas, message1);
console.log('Valid:', result1.isValid); // true
console.log('Errors:', result1.validationErrors); // undefined

const message2 = { content: 42 }; // Invalid: content should be string
const result2 = validateMessage(compiledSchemas, message2);
console.log('Valid:', result2.isValid); // false
console.log('Errors:', result2.validationErrors); // Array of validation errors

// Clean up
removeCompiledSchemas();
```

#### Operation-Specific Validation

```js
import { compileSchemasByOperationId, validateMessage, removeCompiledSchemas } from '@asyncapi/keeper';

const asyncapiFilepath = path.resolve(__dirname, './asyncapi.yaml'); // Path to your AsyncAPI document
const operationId = 'sendHelloMessage'; // The operationId to validate against

// Compile schemas for specific operation
const compiledSchemas = await compileSchemasByOperationId(asyncapiFilepath, operationId);

// Validate message against operation schemas
const message = { content: 'Hello from operation' };
const result = validateMessage(compiledSchemas, message);
console.log('Valid for operation:', result.isValid); // true or false

// Clean up
removeCompiledSchemas();
```