---
'@asyncapi/generator': minor
'@asyncapi/generator-helpers': minor
---

Add the baked-in template `core-template-server-websocket-javascript`, ported from https://github.com/asyncapi-archived-repos/nodejs-ws-template to the React engine and the v3 Parser API. It generates a Node.js WebSocket server built on the `ws` package from an AsyncAPI 3 document. New `@asyncapi/generator-helpers` exports: `getServerPort`, `getOperationIds`, `kebabCase`, `oneLine`, `docline`.
