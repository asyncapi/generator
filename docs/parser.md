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

If the document is valid, the parser provides dereferenced output. During the dereference process the AsyncAPI parser substitutes a reference with a full definition. The dereferenced output is always in the .json format. The parser provides a set of helper functions and bundles them in together into an asyncapi variable. If a document is invalid, the parser provides a message listing all errors. 


