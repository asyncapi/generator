# @asyncapi/generator

## 2.5.0

### Minor Changes

- 2d16234: - Package `@asyncapi/generator-hooks` is now part of `generator` repo and won't be released separately. Theource code is stored under `apps/hooks` but the `package/library` name stays as it was originally for backward compatibility,
  - By default, the `@asyncapi/generator-hooks` package, known as **package** contains many different hooks used in templates and is available in the generator. You no longer have to configure it in your `package.json` in `dependencies`. The package, `@asyncapi/generator-hooks` will no longer be published to NPM separately and is deprecated. You can still have your own hooks, store them in a separate package, and configure them with your template.
  - Remember that the fact that the hooks package is now included by default, doesn't mean all hooks from it are enabled by default. You still have to enable a given hook in the configuration file explicitly because some hooks can execute automatically without passing a specific parameter. Also, a hook's supported parameters need to be defined in your template's config.

## 2.4.1

### Patch Changes

- 3a372c4: Removed the source-map-support package from the AsyncAPI Generator, as it is no longer required for version 2, which now supports Node.js version 18.12.0 and above.

## 2.4.0

### Minor Changes

- 46114d8: Add `compile` option to enable rerun of transpilation of templates build with react engine. It is set to `true` by default. In future major releases it will be set to `false` and we will explain how to publish template to include transpilation files by default. Transpiled files are already included in [`html-template`](https://github.com/asyncapi/html-template/pull/575). It means that you can run generator for `html-template` (it's latest version) with `compile=false` and this will improve the speed of HTML generation for you.

## 2.3.0

### Minor Changes

- 44fcc33: ts-node is registered only when it's actually needed

## 2.2.0

### Minor Changes

- 81dfd0c: Enable `noOverwriteGlobs` option for templates based on react rendering engine.

## 2.1.3

### Patch Changes

- 93fb8e8: Updated the method for importing the Nunjucks filter dependency

## 2.1.2

### Patch Changes

- a3e93ef: update the git context for the docker versioning.

## 2.1.1

### Patch Changes

- 36ee8a8: Fix docker image publishing. Removed package name from version tag for Docker tagging.

## 2.1.0

### Minor Changes

- 99a14a8: - New release pipeline supporting monorepo,
  - Package `@asyncapi/generator-filters` is now part of `generator` repo and won't be released separately. New name of the library is `nunjuckis-filters`,
  - By default `@asyncapi/generator-filters` package, known as package with a lot of different nunjucks filters, is registered and added to generator and you no longer have to configure it in your `package.json`. Package `@asyncapi/generator-filters` will no longer be published to NPM separately and is deprecated.
