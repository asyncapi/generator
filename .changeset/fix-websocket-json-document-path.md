---
"@asyncapi/generator": patch
---

Fix the JavaScript WebSocket client to reference `asyncapi.json` for JSON input, matching the document written by the generator hook. YAML input continues to reference `asyncapi.yaml`.
