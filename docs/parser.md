---
title: "Parser"
weight: 90
---

## Parser

AsyncAPI Parser is a package used to parse and validate the AsyncAPI documents in your Node.js or browser application. These documents can be either in YAML or JSON format.

Parser validates these documents using dedicated schema-supported plugins. These supported schemas are:

- AsyncAPI schema (no plugin needed)
- OpenAPI schema
- JSON schema
- Avro schema
- RAML data-type schema

If the document is valid, Parser returns `AsyncAPIDocument` instance with a set of helper functions that enable easier access to contents of AsyncAPI document. The parser provides dereferenced output. During the dereference process the AsyncAPI parser substitutes a reference with a full definition. The dereferenced output is always in the .json format. If a document is invalid, the parser provides a message listing all errors. 

For example, the following asyncapi document has two channels–`channelOne` and `channelTwo`. Each channel has one operation and a single message:

```js

asyncapi: '2.5.0'
info:
  title: Demo API
  version: '1.0.0'
channels:
  first/channelOne:
    publish:
      summary: This is the first sample channel
      operationId: onMessage
      message:
        name: FirstMessage
        payload:
          type: object
          properties:
            id:
              type: integer
              minimum: 0
              description: Id of the channel
            sentAt:
              type: string
              format: date-time
              description: Date and time when the message was sent.

  second/channelTwo:
    publish:
      summary: This is the second sample channel
      operationId: messageRead
      message:
        name: SecondMessage
        payload:
          type: object
          properties:
            id:
              type: integer
              minimum: 0
              description: Id of the channel
            sentAt:
              type: string
              format: date-time
              description: Date and time when the message was sent.

```
We can use helper functions provided by parser to operate on the above JSON file. For example, we can use the helper method `asyncAPIDocument.channelNames()` which returns an array of all channel names currently present in the asyncAPI document.




