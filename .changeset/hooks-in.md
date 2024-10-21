---
"@asyncapi/generator": minor
---

- Package `@asyncapi/generator-hooks` is now part of `generator` repo and won't be released separately. Theource code is stored under `apps/hooks` but the `package/library` name stays as it was originally for backward compatibility,
- By default, the `@asyncapi/generator-hooks` package, known as **package** contains many different hooks used in templates and is available in the generator. You no longer have to configure it in your `package.json` in `dependencies`. The package, `@asyncapi/generator-hooks` will no longer be published to NPM separately and is deprecated. You can still have your own hooks, store them in a separate package, and configure them with your template.
- Remember that the fact that the hooks package is now included by default, doesn't mean all hooks from it are enabled by default. You still have to enable a given hook in the configuration file explicitly because some hooks can execute automatically without passing a specific parameter. Also, a hook's supported parameters need to be defined in your template's config.
