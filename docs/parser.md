---
title: "Parser"
weight: 90
---

## Parser

AsyncAPI Parser is a package used to parse and validate the AsyncAPI documents in your Node.js or browser application. These documents can be either in–YAML or JSON format.

Parser validates these documents using dedicated schema-supported plugins. These supported schemas are:

- AsyncAPI schema
- OpenAPI schema
- JSON schema
- Avro schema
- RAML data-type schema(schema parser for RAML data types)

> Note: If you use the parser as a package, you can also register external schemas. For example, you can also write your own schema.

If the document is valid, Parser returns `AsyncAPIDocument` instance with a set of helper functions that enable easier access to contents of AsyncAPI document. The parser provides dereferenced output. During the dereference process the AsyncAPI parser substitutes a reference with a full definition. The dereferenced output is always in the .json format. If a document is invalid, the parser provides a message listing all errors. 

## Installation

You can install parser with:

```
npm install @asyncapi/parser
```
The parser by default supports AsyncAPI Schema Format and JSON Schema Format. For additional formats, you need to install additional plugins. For example:

- OpenAPI Schema Object
  ```
  npm install @asyncapi/openapi-schema-parser
  ```
- Avro schema
  ```
  npm install @asyncapi/avro-schema-parser
  ```
- RAML data type
  ```
  npm install @asyncapi/raml-dt-schema-parser
  ```

> document under construction


