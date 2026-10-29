---
"@asyncapi/generator": patch
---

Fix folder-level `conditionalGeneration` entries that use `subject`. They crashed generation with `TypeError: Cannot read properties of undefined (reading 'json')` because the condition was evaluated against an undefined document instead of the parsed AsyncAPI document.
