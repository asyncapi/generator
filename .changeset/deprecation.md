---
"@asyncapi/generator": minor
---

- **Deprecation of `ag` CLI**: The `ag` CLI is deprecated in favour of the `AsyncAPI CLI` that is a single entry point for all the AsyncAPI tools. No new features will be added to `ag` and it will be completely removed. The official documentation of AsyncAPI Generator has not mentioned `ag` for over a year, instead only using `AsyncAPI CLI` and `asyncapi generate fromTemplate` commands. Refer to the [migration guide](https://www.asyncapi.com/docs/tools/generator/migration-cli) that will help you understand how to migrate your `ag` commands to the new `AsyncAPI CLI` command.

- **Deprecation of Nunjucks render engine:** The [Nunjucks render engine](https://www.asyncapi.com/docs/tools/generator/nunjucks-render-engine) is deprecated and will be removed in October 2025. It is recommended to switch to the [React render engine](https://www.asyncapi.com/docs/tools/generator/react-render-engine) instead. If you are using Nunjucks in production, read the [migration guide](https://www.asyncapi.com/docs/tools/generator/migration-nunjucks-react) that will help you understand how to migrate to the new engine. The removal of the Nunjucks render engine results also in removal of [Nunjucks-filters](apps/nunjucks-filters) library.

Removal of both deprecated parts of the generator is planned for October 2025, which gives you 9 months to migrate.