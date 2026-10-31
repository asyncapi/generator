---
"@asyncapi/generator-components": patch
---

Close any existing WebSocket instance in the generated JavaScript WebSocket client `connect()` method before opening a new connection, and reset `this.websocket = null` in `close()`.
