---
"@asyncapi/generator": minor
---
- Moved the logic of **conditionalFile generation** to a new **conditionalGeneration module**, which now supports both file and folder generation in a unified way.

- Introduced a new **conditionalGeneration** configuration that supports **subject** and **parameter** fields, enabling flexible and granular conditional generation.

- The conditionalFile configuration is planned for deprecation in favor of the new conditionalGeneration setup. You can track the deprecation in the issue [#1553](https://github.com/asyncapi/generator/issues/1553).
