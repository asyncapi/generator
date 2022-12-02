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



