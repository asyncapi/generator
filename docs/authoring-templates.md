---
title: "Authoring Templates"
weight: 60
---

The AsyncAPI generator has been built with extensibility in mind. The package uses a set of default templates to let you generate documentation and code. However, you can create and use your own templates. In this section, you learn how to create your own one.

To work on a template, you need an AsyncAPI specification file that you can use for testing. For this purpose, you can use [this](../test/docs/dummy.yml) dummy file as it's purpose is to cover as many features of AsyncAPI as possible. Do not copy this file to your template but use it directly from this repo like this: `ag https://raw.githubusercontent.com/asyncapi/generator/master/test/docs/dummy.yml ./your-template`

> In case you find some features missing or other possible improvements in the dummy file, suggest changes. The goal is to build a file that all templates can use and check their specification features coverage.

## Common assumptions

1. A template is a directory in your file system.
1. The template can have own dependencies. Just create `package.json` for the template. The generator makes sure to trigger the installation of dependencies.
1. Templates can be configured. Configuration must be stored in the `package.json` file under custom `generator` property. [Read more about the configuration file](#configuration-file).
1. The template engine can be either [React](#react) (recommended) or [Nunjucks](#nunjucks) (default). This can be controlled with the `renderer` property in the [template configuration](#template-configuration).
1. Templates may contain `hooks` that are functions invoked during specific moment of the generation. In the template, they must be stored in the `hooks` directory under the template directory. They can also be stored in other modules and external libraries and configured inside the template [Read more about hooks](#hooks).
1. There are parameters with special meaning. [Read more about special parameters](#special-parameters).

## Special file names

We use NPM behind the scenes to download and install the templates. Since NPM will not fetch files like `.gitignore`, you should name them differently. Luckily, the Generator will take care of renaming them back for you. The following is a table of the special file names:

|Special file name|Output file name|
|---|---|
|`{.gitignore}`|`.gitignore`|
|`{.npmignore}`|`.npmignore`|