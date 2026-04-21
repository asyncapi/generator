---
"@asyncapi/generator": patch
---

Fix browserslist error when using pnpm

Set BROWSERSLIST_ROOT_PATH environment variable during template compilation
to prevent browserslist from searching outside the template directory. This
fixes an issue where pnpm's shim files were incorrectly parsed as browserslist
configuration, causing "Unknown browser query" errors.

Fixes: https://github.com/asyncapi/cli/issues/1781