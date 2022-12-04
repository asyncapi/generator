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

Parser allows the template developer to also easily access schemas provided in all of the above supported formats. This is because the JavaScript parser converts all of them into JSON schema.

If the document is valid, Parser returns `AsyncAPIDocument` instance with a set of helper functions that enable easier access to contents of AsyncAPI document. The parser provides dereferenced output. During the dereference process the AsyncAPI parser substitutes a reference with a full definition. The dereferenced output is always in the .json format. If a document is invalid, the parser provides a message listing all errors. 

For example, the following asyncapi document has two channels–`channelOne` and `channelTwo`. Each channel has one operation and a single message:

```js

asyncapi: '2.5.0'
info:
  title: Demo API
  version: '1.0.0'
channels:
  name/channelOne:
    publish:
      summary: This is the first sample channel
      operationId: onMessage
      message:
        name: FirstMessage
            id:
              type: integer
              minimum: 0
              description: Id of the channel
            sentAt:
              type: string
              format: date-time
              description: Date and time when the message was sent.
  name/channelTwo:
    publish:
      summary: This is the second sample channel
      operationId: messageRead
      message:
        name: SecondMessage
            id:
              type: integer
              minimum: 0
              description: Id of the channel
            sentAt:
              type: string
              format: date-time
              description: Date and time when the message was sent.

```
We can use helper functions provided by parser to operate on the above JSON file. For example, we can use the helper method `asyncAPIDocument.channelNames()` which returns an array of all channel names currently present in the asyncAPI document. Another example where you can use a helper function is to list out messages present in your JSON file. Instead of fetching a single message one at a time, you can use the function `asyncAPIDocument.allMessages()` that returns the map of all messages present in your asyncAPI document.

```js
  const channelNames = asyncAPIDocument.channelNames();
  const messages = asyncAPIDocument.allMessages();
```

> Parser gives you access to a number of these [helper functions](https://github.com/asyncapi/parser-js/blob/master/API.md) that you can implement to access contents of your asyncAPI document. 

## AsyncAPI Document validation process

1. Generator receives [asyncAPI document](https://github.com/asyncapi/generator/blob/master/docs/asyncapi-document.md) as an input.
2. Generator sends asyncAPI document to the parser as **asyncapistring**. It is the stringified version of the original asyncAPI document.
3. Parser uses additional plugins such as the OpenAPI, RAML, or Avro schemas to validate custom schemas of message payloads defined in the AsyncAPI Document.
4. If the asyncAPI document is invalid, it throws an error based on the type of failure that was encountered. For example, if the AsyncAPI document is not a string nor a JS object, parser throws the `invalid-document-type` error. 

   Similarly, other types of error can be:
      - `invalid-json`
      - `invalid-yaml`
      - `impossible-to-convert-to-json`

5. If the document is valid, it modifies the asyncAPI document and returns a set of helper functions and bundles them together into the asyncapi variable.
6. The original asyncAPI document is part of the [Template Context](https://github.com/asyncapi/generator/blob/master/docs/template-context.md) as generator passes the original asyncAPI document to the template context as well.	


