---
"@asyncapi/generator-components": patch
"@asyncapi/generator": patch
---

Fix the Python WebSocket client ignoring processors registered with `register_outgoing_processor()`. The generated `send_*` instance methods now run them in registration order before sending, keep the current message when a processor returns `None`, and treat a processor error like any other send failure.
