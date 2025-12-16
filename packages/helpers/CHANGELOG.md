# @asyncapi/generator-helpers

## 1.0.1

### Patch Changes

- c5be81a: Enforce new helpers and components release to use latest versions in generator. Required because of the recent misconfiguration of releases and Trusted Publishing.

## 1.0.0

### Major Changes

- df08ae7: ### Breaking Changes

  - You must use Node.js 24.11 or higher, and NPM 11.5.1 or higher
  - Nunjucks renderer removed — React is now the sole rendering engine. No need to specify render engine in config anymore
  - Nunjucks filters package and its public filters removed; filter-based template APIs no longer available.
  - `ag` CLI is no longer available. It was announced some time ago that it would be deprecated, and users are encouraged to switch to the [AsyncAPI CLI](https://github.com/asyncapi/cli/)

  ### Migration Guides

  - [Migrating from Nunjucks to React render engine](https://github.com/asyncapi/generator/blob/%40asyncapi/generator%402.8.4/apps/generator/docs/migration-nunjucks-react.md)
  - [Migrating from `ag` CLI to AsyncAPI CLI](https://github.com/asyncapi/generator/blob/%40asyncapi/generator%402.8.4/apps/generator/docs/migration-cli.md)

## 0.2.0

### Minor Changes

- 32c321b: Initial release of `@asyncapi/generator-components` and `@asyncapi/generator-helpers` to make them available for `@asyncapi/generator`
