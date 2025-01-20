---
"@asyncapi/generator": minor
---

- Deprecation of `ag` CLI. It is deprecated in favour of the `AsyncAPI CLI` that a single entry point for all the AsyncAPI tools. No new features will be adde to `ag` and it will be completely removed. Official documentation of AsyncAPI Generator do not mention `ag` for over a year, and only `AsyncAPI CLI` and `asyncapi generate fromTemplate` are promoted. Read [migration guide](https://www.asyncapi.com/docs/tools/generator/migration-cli) that will help you understand how to migrate your `ag` commands to the new AsyncAPI CLI.

- [Nunjucks render engine](https://www.asyncapi.com/docs/tools/generator/nunjucks-render-engine) is deprecated and will be removed in October 2025. Use [React render engine](https://www.asyncapi.com/docs/tools/generator/react-render-engine) instead. If you already use Nunjucks in production, read [migration guide](https://www.asyncapi.com/docs/tools/generator/migration-nunjucks-react) that will help you understand how to migrate to the new engine. Removal of Nunjucks render engine results also in removal of [Nunjucks-filters](apps/nunjucks-filters) library.

Removal of both deprecated parts of the generator are planned for October 2025, which gives you 9 months to migrate.