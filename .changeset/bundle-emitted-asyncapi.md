---
"@asyncapi/generator-hooks": patch
---

Fix `createAsyncapiFile` (`generate:after`) copying the source AsyncAPI document verbatim, which left external `$ref`s (e.g. `$ref: './commons/servers.yml#/...'`) unresolved in the generated output and broke runtime consumers such as `@asyncapi/keeper`. The hook now bundles the document via `@asyncapi/bundler` when it was loaded from a file on disk, inlining external `$ref`s into a single self-contained file. If no source file is available, or bundling fails, it falls back to writing the original source unchanged.

Note: refs are resolved relative to the source file's own directory only, so refs pointing outside a path reachable from there (e.g. a `commons/` folder reached only through a symlink) will not bundle and fall back to the verbatim source.
