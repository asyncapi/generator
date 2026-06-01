---
"@asyncapi/generator": patch
---

The `mapBaseUrlToFolder` resolver now rejects `$ref`s that resolve outside the configured base folder. Previously a reference such as `https://schema.example.com/crm/../../../etc/passwd` was passed through unnormalized, letting a malicious AsyncAPI document read files outside the mapped folder (path traversal). References that escape the base folder are now blocked with an explicit error.

This only affects references that start with the mapped base URL and then use `../` to climb out of the mapped folder (e.g. `https://schema.example.com/crm/../shared/common.json` reaching a sibling folder). If you relied on this to reference files outside the mapped folder, map a higher-level base instead — e.g. map `https://schema.example.com/` to `./schemas/` and reference `https://schema.example.com/shared/common.json` directly — so the resolved paths stay within the mapped folder.
