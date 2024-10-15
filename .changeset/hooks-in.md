---
"@asyncapi/generator": minor
---

- Package `@asyncapi/generator-hooks` is now part of `generator` repo and won't be released separately. Source code is stored under `apps/hooks` but the package/library name stays as it was originally for backward compatibility,
- By default `@asyncapi/generator-hooks` package, known as package with a lot of different hooks used in templates, is available in the generator and you no longer have to configure it in your `package.json` in `dependencies`. Package `@asyncapi/generator-hooks` will no longer be published to NPM separately and is deprecated. You can still have your own hooks, and you can still store them in a separate package and configure with your template,
- Remember that the fact that hooks package is now included by default, doesn't mean all hooks from it are enabled by default. You still have to enable given hook in the configuration explicitly because some hooks can execute automatically without passing a specific parameter. Also hook's supported parameters also need to be defined in your template's config.
