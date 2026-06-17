---
"@asyncapi/generator": minor
"@asyncapi/generator-components": minor
---

Generated Python and JavaScript WebSocket clients no longer swallow send errors. Failures are now forwarded to the registered error handlers and raised by default, so callers learn when a message fails to send. Pass `raise_send_errors=False` (Python) or `throwSendErrors=false` (JavaScript) to the constructor to keep a high-throughput producer loop running and rely on the error handlers instead.
