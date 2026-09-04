---
"@asyncapi/generator": patch
---

Fix conditional generation lookups for nested template paths. `conditionalGeneration` and `conditionalFiles` config keys are written with POSIX separators (e.g. `conditionalFolder2/input.txt`), but on Windows `path.relative` produces backslash-separated paths, so nested entries never matched and files were generated even when their condition failed. Additionally, when a deprecated `conditionalFiles` entry matched a nested file path, the condition was looked up under the file's top-level directory instead of the file key itself, so the condition was never evaluated and the file was silently skipped. Paths are now normalized to POSIX separators before the config lookups, and `conditionalFiles` conditions are resolved by their file key.
