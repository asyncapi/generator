---
title: "Parser"
weight: 60
---

## Parser

The **AsyncAPI Parser** is a powerful library for parsing and validating [AsyncAPI documents](asyncapi-document) in both Node.js and browser environments. It supports YAML and JSON inputs and ensures correctness through schema validation.

### ✅ Supported schema formats:

- AsyncAPI (v2 and v3)
- OpenAPI
- JSON Schema
- Avro
- RAML

These schemas are automatically transformed into JSON Schema format internally, simplifying access and manipulation.

---

## Key Features

- **Parsing** of AsyncAPI YAML/JSON files.
- **Validation** against AsyncAPI and referenced schemas.
- **Dereferencing** of `$ref` values into inlined content.
- **Helper functions** to access channels, messages, schemas, and more.

---

## Example: AsyncAPI v3 Document

Below is a minimal v3.0.0-compliant AsyncAPI document using `channels`, `operations`, and component references:

```yaml
asyncapi: 3.0.0
info:
  title: Comments Service
  version: 1.0.0
  description: Handles all comment-related events.
servers:
  dev:
    host: test.mosquitto.org
    protocol: mqtt
channels:
  sendCommentLiked:
    address: comment/liked
    messages:
      commentLiked:
        $ref: '#/components/messages/commentLiked'
  sendCommentUnliked:
    address: comment/unliked
    messages:
      commentUnliked:
        $ref: '#/components/messages/commentUnliked'
operations:
  sendCommentLiked:
    action: send
    channel:
      $ref: '#/channels/sendCommentLiked'
  sendCommentUnliked:
    action: send
    channel:
      $ref: '#/channels/sendCommentUnliked'
components:
  messages:
    commentLiked:
      payload:
        $ref: '#/components/schemas/commentReaction'
    commentUnliked:
      payload:
        $ref: '#/components/schemas/commentReaction'
  schemas:
    commentReaction:
      type: object
      properties:
        commentId:
          type: string
