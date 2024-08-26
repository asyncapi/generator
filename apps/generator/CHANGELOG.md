# @asyncapi/generator

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
