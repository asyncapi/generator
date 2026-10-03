---
"@asyncapi/generator": minor
---

feat: add baked-in Node.js server template (fixes #2210)

Add baked-in Node.js WebSocket server template to `@asyncapi/generator` under `packages/templates/servers/websocket/javascript` as the successor to the archived standalone templates. Includes dynamic multi-channel route dispatching, runtime message validation with `@asyncapi/keeper`, and comprehensive component and integration tests.
