---
title: "TypeScript support"
weight: 150
---

The AsyncAPI generator has TypeScript support for [hooks](#hooks) and Nunjucks's [filters](#filters). Assumptions:

- Installing the `typescript` package and creating the` tsconfig.json` file isn't necessary.
- Source code of the hook/filter must have `.ts` extension.
- Each package related to the typings for TypeScript like `@types/node` must be installed in the template under `dependencies` array. This is because the Generator transpiles the TypeScript code on-the-fly while rendering the template, and cannot use packages under `devDependencies`.
- Each template should have `@types/node` package installed to enable support for typings for Node.


