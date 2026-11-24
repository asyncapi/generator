# @asyncapi/generator-react-sdk

## 1.2.0

### Minor Changes

- 379fda7: Upgrade the bundled `react` dependency from `^17.0.1` to `^18.3.1` (and `@types/react` to `^18`).

  - Fix `ERR_PACKAGE_PATH_NOT_EXPORTED` when React 18 is resolved by the transpiler. React 18 restricts subpath imports through its `exports` map, so the private `react/cjs/react-jsx-runtime.production.min` path could no longer be resolved by name. The transpiler now locates React's folder via the always-exported `react/package.json` and builds the path to the production JSX runtime from it.

## 1.1.3

### Patch Changes

- a51f90e: Release of `generator-react-sdk` as part of the `generator` monorepo.

  With this release the code from https://github.com/asyncapi/generator-react-sdk is considered to be an archive, and all future development will take place in this repository under `/apps/react-sdk`.
