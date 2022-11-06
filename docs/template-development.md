---
title: "Template development"
weight: 50
---

## Minimum template requirements

Let's discuss the minimum components your template requires: `template` directory and `package.json` file.

## 1. `template` directory

The `template` directory stores generated outputs in files. In other words, the generator processes all the files stored in this directory.

```js
import { File, Text } from "@asyncapi/generator-react-sdk";

export default function({ asyncapi, params, originalAsyncAPI }) {
return (
    <File name="asyncapi.md">
    <Text>This is a markdown file for my application.</Text>
    <Text>App name is: **{ asyncapi.info().title() }**</Text>
    </File>
);
}
```

The above example of a`template/index.js` file shows the generation process result. The user also receives an `asyncapi.md` file with hardcoded and dynamic information extracted into the AsyncAPI file.

Every template must depend on the [`@asyncapi/generator-react-sdk` package](https://github.com/asyncapi/generator-react-sdk), which contains a template file's basic components.

## 2. `package.json` file

Before the generation process runs, the generator installs the template into its dependencies. A `package.json` is necessary to identify the template name.

The following block shows an example `package.json` file that points to the [React Render Engine](react-render-engine.md) and necessary dependencies:

```json
{
  "name": "myTemplate",
  "generator": {
    "renderer": "react"
  },
  "dependencies": {
    "@asyncapi/generator-react-sdk": "^0.2.25"
  }
}
```

## Template configuration

You must configure the generator's `package.json` file to contain JSON objects with the required parameters for template configuration, such as:

|Name|Type|Description|
|---|---|---|
|`renderer`| String | Its value can be either `react` or `nunjucks` (default).
|`supportedProtocols`| [String] | A list with all the protocols this template supports.
|`parameters`| Object[String, Object] | An object with all the parameters that can be passed when generating the template. When using the command line, it's done by indicating `--param name=value` or `-p name=value`.
|`parameters[param].description`| String | A user-friendly description about the parameter.
|`parameters[param].default`| Any | Default value of the parameter if not specified. Shouldn't be used for mandatory `required=true` parameters.
|`parameters[param].required`| Boolean | Whether the parameter is required or not.

These are predefined configurations which help generator achieve specific set of tasks throughout the generation process. The `generator` property from 'package.json' contains all the configuration information. To learn more about template configuration and various supported parameters. Read more about the [configuration file](configuration-file.md)

> Whenever you make a change to the package.json, make sure you perform an update by running `npm install`;  this command synchronizes with the package-lock.json and validates the file.

## Render engines

Render engines generate code, documentation, markdown, diagrams, or anything else you may have specified to be generated as output. AsyncAPI templates support multiple render engines, including [Nunjucks](nunjucks-render-engine.md) and [React](react-render-engine.md). 

Each rendering engine has its process and unique features, affecting how you write templates. While you are free to use the render engine of your choice, we recommend using the React render engine for your projects.

> The [AsyncAPI React SDK](https://github.com/asyncapi/generator-react-sdk) is a set of components and functions that use React as a render engine in the generator.
## Hooks

[Hooks](hooks.md) enable templates to perform multiple tasks. You can add Hooks to your template as fractions of code. In the template, you must store it in the `hooks` directory under the template directory. You can also store it in other modules and external libraries, or even configure it inside the template. The generation process can perform multiple actions. _(Example: A hook that generates a pdf after the generation process is complete.)_

**Templates** can perform multiple actions _before_ or _after_ the generation process with the help of **hooks**.








