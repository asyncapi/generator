---
"@asyncapi/generator-hooks": patch
"@asyncapi/nunjucks-filters": patch
"@asyncapi/generator-components": patch
"@asyncapi/generator-helpers": patch
---

- Changed the version of `@asyncapi/generator-hooks`, `@asyncapi/generator-components`, `@asyncapi/generator-helpers` and `@asyncapi/nunjucks-filters` from '*' to their original version.

- Replaced asterisk (*) version specifier with explicit version numbers in package dependencies. While the wildcard was intended to resolve packages from local workspaces, it resulted in unnecessary npm registry lookups for unpublished packages. This change ensures proper local workspace resolution and prevents failed registry lookups, improving both reliability and performance.

