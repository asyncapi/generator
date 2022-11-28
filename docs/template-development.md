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
## 2. `package.json` file

Before the generation process begins, the generator installs the template into its dependencies. A `package.json` is necessary to identify the template name.

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

The above example of a`template/index.js` file shows the generation process result. The user also receives an `asyncapi.md` file with hardcoded and dynamic (title of the application taken from AsyncAPI document) information.

Every template must depend on the [`@asyncapi/generator-react-sdk` package](https://github.com/asyncapi/generator-react-sdk), which contains a template file's basic components.

## Additional configuration options

You must configure the generator's `package.json` file to contain JSON objects with the required parameters for template configuration, such as:

|Name|Type|Description|
|---|---|---|
|`renderer`| String | Its value can be either `react` or `nunjucks` (default).
|`supportedProtocols`| [String] | A list with all the protocols this template supports.
|`parameters`| Object[String, Object] | An object with all the parameters that can be passed when generating the template. When using the command line, it's done by indicating `--param name=value` or `-p name=value`.
|`parameters[param].description`| String | A user-friendly description about the parameter.
|`parameters[param].default`| Any | Default value of the parameter if not specified. Shouldn't be used for mandatory `required=true` parameters.
|`parameters[param].required`| Boolean | Whether the parameter is required or not.

Above table lists some of the configurations options which help generator achieve specific set of tasks throughout the generation process. The `generator` property from 'package.json' contains all the configuration information. To learn more about template configuration and various supported parameters. Read more about the [configuration file](configuration-file.md).

> Whenever you make a change to the package.json, make sure you perform an update by running `npm install`;  this command synchronizes with the package-lock.json and validates the file.

### Adding configuration options in `package.json` 

The following examples show some advanced configurations that we can use in our `package.json` file:

```json
{
  "name": "myTemplate",
  "generator": {
    "renderer": "react",
    "supportedProtocols": "mqtt"
  },
  "dependencies": {
    "@asyncapi/generator-react-sdk": "^0.2.25"
  }
}
```
The above `package.json` file has a newly added configuration called `supportedProtocols` which is set to `mqtt`. This configuration displays all the protocols that this template supports. You can have multiple supported protocols in our template. 

For example, if you want to generate an output using the above template, you need to have an AsyncAPI document that has servers that use `mqtt` in order to generate your desired output. If your AsyncAPI document has server connections with `kafka`, the generation process will be terminated since the only supported protocol mentioned is `mqtt`. 

### Accessing parameters inside the template

Additionally, we can also have a configuration called `parameters` which is an object with all the parameters that can be passed when generating the template:

```json
{
  "name": "myTemplate",
  "generator": {
    "renderer": "react",
    "supportedProtocols": "mqtt",
    "parameters": {
        "version": {
          "description": "Override the version of your application provided under `info.version` location in the AsyncAPI document.",
          "required": false
        }
    }
  },
  "dependencies": {
    "@asyncapi/generator-react-sdk": "^0.2.25"
  }
}
```

The default version of your application is always fetched from your AsyncAPI document. The above configuration will help the template user to override the existing version with a new version on the command line.

The changes done in the template will be as follows:

Original:

```js
<Text>App name is: **{ asyncapi.info().title() }**</Text>
```

Newer:

```js
<Text>App name is: **{ asyncapi.info().title() }**</Text>
<Text>Version is: **{params.version || asyncapi.info.version()}**</Text>
```

Now that you have added all the configuration options, you can start the generation process by using generator CLI. You can pass these parameters via the CLI. When using CLI, it's done by indicating --param name=value or -p name=value.
As you can see, the above configuration will help the template user to override the existing version with a new version on the command line. For example, `-p version=2.0.0`.

## Hooks

[Hooks](hooks.md) enable templates to perform multiple tasks. You can add Hooks to your template as fractions of code. In the template, you must store it in the `hooks` directory under the template directory. You can also store it in other modules and external libraries, or even configure it inside the template. The generation process can perform multiple actions.

**Templates** can perform multiple actions _before_ or _after_ the generation process with the help of **hooks**.

For example, hooks can help you change the specification version with the new `version` that you can pass before the generation process even begins:

```js
module.exports = {
  'generate:before': ({ asyncapi, templateParams = {} }) => {
    const version = templateParams.version || asyncapi.info().version();
    asyncapi._json.info.version = version;
  }
};
```
This can be an even better alternative way of overriding the `version` parameter that we discussed in the previous section. Not only a markdown document will be generated but also the AsyncAPI file that was passed to the generator will be returned with the overwritten version.

The updated template looks like the following:

```js
<Text>App name is: **{ asyncapi.info().title() }**</Text>
<Text>Version is: **{asyncapi.info.version()}**</Text>
```

For example, In nodejs-template, the following hooks are overridden in the template context so that they can still be reused for other purposes:

```json
{
"@asyncapi/generator-hooks": "^0.1.0",
"hooks": {
      "@asyncapi/generator-hooks": "createAsyncapiFile"
    }
  }
```




