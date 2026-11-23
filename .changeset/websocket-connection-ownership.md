---
"@asyncapi/generator-components": patch
"@asyncapi/generator": patch
---

Prevent generated JavaScript WebSocket clients from leaking sockets on repeated connect calls. Reuse open connections and pending connection promises, start a new connection without waiting for a closing socket, and reject connection attempts that close before opening.
