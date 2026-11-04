---
"@asyncapi/generator-components": patch
"@asyncapi/generator": patch
---

Prevent generated JavaScript WebSocket clients from leaking sockets on repeated connect calls. Reuse open connections and pending connection promises, reject reconnects while closing, and reject connection attempts that close before opening.
