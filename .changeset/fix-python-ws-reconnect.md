---
"@asyncapi/generator-components": patch
---

Clear `self._stop_event` in the generated Python WebSocket client `connect()` method so calling `connect()` after `close()` can reconnect cleanly.
