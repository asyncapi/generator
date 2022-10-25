---
title: "Template"
weight: 50
---

# Minimum template requirements

Let's discuss the minimum components your template requires: `template` directory and `package.json` file.

## 1. `template` directory

The `template` directory stores files with the generated outputs. In other words, the Generator processes all the files stored in this directory.

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

TThe above example of a`template/index.js` file shows the generation process result. The user also receives an `asyncapi.md` file with hardcoded and dynamic information extracted into the AsyncAPI file.

Every template must depend on the [`@asyncapi/generator-react-sdk` package](https://github.com/asyncapi/generator-react-sdk), which contains a template file's basic components.

## 2. `package.json` file

Before the generation process runs, the Generator installs the template into its dependencies. A `package.json` is necessary to identify the template name.

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

## Template Configuration

The `package.json` file from the Generator must be configured so that it contains JSON objects that may have the following information. Some of the parameters used for template configuration are:

|Name|Type|Description|
|---|---|---|
|`renderer`| String | Its value can be either `react` or `nunjucks` (default).
|`supportedProtocols`| [String] | A list with all the protocols this template supports.
|`parameters`| Object[String, Object] | An object with all the parameters that can be passed when generating the template. When using the command line, it's done by indicating `--param name=value` or `-p name=value`.
|`parameters[param].description`| String | A user-friendly description about the parameter.
|`parameters[param].default`| Any | Default value of the parameter if not specified. Shouldn't be used for mandatory `required=true` parameters.
|`parameters[param].required`| Boolean | Whether the parameter is required or not.

These are predefined configurations which help generator achieve specific set of tasks throughout the generation process. The `generator` property from 'package.json' contains all the configuration information. To learn more about template configuration and various supported parameters, you can check [configuration file](configuration-file.md)

> Whenever you make a change to the package.json, make sure you perform an update by running `npm install`;  this command synchronizes with the package-lock.json and validates the file.

## Render Engines

Render engines are actually responsible for generating–code, documentation, markdown, diagrams, or anything else you may have specified to be generated as output. AsyncAPI templates support multiple render engines including both [Nunjucks](nunjucks-render-engine.md) and [React](react-render-engine.md). 

Each rendering engine has its own process and unique set of features, uniquely affecting how you write templates. While you're free to use the render engine of your choice, we recommend using the React render engine for your projects.

> The [AsyncAPI React SDK](https://github.com/asyncapi/generator-react-sdk) is a set of components/functions that use React as a render engine in the Generator.

## Hooks

[Hooks](hooks.md) enable templates to perform multiple tasks. Hooks are fractions of code that can be added to your template. They can be plugged into the generation process to perform multiple actions. _(Example: a hook that generates a pdf after the generation process is completed)_

**Templates** can perform multiple actions _before_ or _after_ the generation process with the help of **hooks**.








