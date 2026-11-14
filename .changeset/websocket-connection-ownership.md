---
"@asyncapi/generator-components": patch
"@asyncapi/generator": patch
---

Prevent generated JavaScript WebSocket clients from leaking sockets on repeated connect calls. Reuse open connections and pending connection promises, wait for a closing socket before reconnecting, and reject connection attempts that close before opening.
