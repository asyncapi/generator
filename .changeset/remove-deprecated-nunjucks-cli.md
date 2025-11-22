---
"@asyncapi/generator": major
---

### Breaking Changes
* Nunjucks renderer removed — React is now the sole rendering engine. No need to specify render engine in config anymore
* Nunjucks filters package and its public filters removed; filter-based template APIs no longer available.
* `ag` CLI is no longer available. Long time ago it was already announced that it will be removed and people should move to [AsyncAPI CLI](https://github.com/asyncapi/cli/)

### Migration Guides
- [Migrating from Nunjucks to React render engine](https://github.com/asyncapi/generator/blob/%40asyncapi/generator%402.8.4/apps/generator/docs/migration-nunjucks-react.md)
- [Migrating from `ag` CLI to AsyncAPI CLI](https://github.com/asyncapi/generator/blob/%40asyncapi/generator%402.8.4/apps/generator/docs/migration-cli.md)