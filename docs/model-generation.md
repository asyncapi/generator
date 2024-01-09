---
title: "How to generating models and classes using Modelina"
weight: 200
---

This guide will walk you through the process of generating models and classes using [Modelina](https://www.asyncapi.com/tools/modelina) and the [AsyncAPI CLI](https://www.asyncapi.com/docs/tools/cli).

Modelina is an AsyncAPI library designed for generating data models by utilizing inputs like [AsyncAPI](generator/asyncapi-document), OpenAPI, or JSON schema inputs. Its functionality revolves around creating data models from the provided AsyncAPI document and the model template, which defines message payloads, through the AsyncAPI CLI. The generated models can then be used in your code, and you can also store the generated models in a single file.

In this guide, you'll learn to:

1. Generate a model class using a Python MQTT client.
2. Use the Modelina library and the AsyncAPI CLI to generate Python data models.
3. Create a model schema to test your model code using an MQTT client.

## Prerequisites

Before you get started, ensure you have the following installed:
- [Node.js and npm](https://nodejs.org/en/download/).
- [AsyncAPI CLI](https://www.asyncapi.com/docs/tools/generator/installation-guide#asyncapi-cli) installed in your machine.

> :memo: **Note:**
> When building the model from scratch, you'll need to have a predefined [AsyncAPI document](https://www.asyncapi.com/docs/tools/generator/asyncapi-document) and you can also use the existing [community-maintained templates](https://www.asyncapi.com/docs/tools/generator/template#generator-templates-list) instead of creating a template from scratch.

## Getting started

First, install Modelina in your project using npm:

 `npm install --save @asyncapi/modelina`
Once the command above runs successfully, the Modelina dependency gets automatically added t to your `package.json` file as shown below:

 ```json
 "dependencies": {
    ...
    "@asyncapi/modelina": "^2.0.5"
    ...
  },
 ```

## Generating models

Now that Modelina is successfully installed, you can proceed to generate models using an AsyncAPI document as an input. In the next section, you'll create a `model.js` file where you'll define the logic of your model(s).

### Create a model.js file

Create a new folder in the **template** directory named **src/models** and create a **models.js** file within it.
Then in the **model.js** file, add the following code:

```js
// 1
import { File } from '@asyncapi/generator-react-sdk';
// 2
import { PythonGenerator, FormatHelpers } from '@asyncapi/modelina';

/**
 * @typedef RenderArgument
 * @type {object}
 * @property {AsyncAPIDocument} asyncapi received from the generator.
 */

/**
 * Render all schema models
 * @param {RenderArgument} param0 
 * @returns 
 */

// 3
export default async function schemaRender({ asyncapi }) {
  // 4 
  const pythonGenerator = new PythonGenerator();
// 5
  const models = await pythonGenerator.generate(asyncapi);
// 6
  const files = [];

  for (const model of models) {
    // 7
    const modelFileName = `${FormatHelpers.toPascalCase(model.modelName)}.py`;
    // 8
    files.push(<File name={modelFileName}>{model.result}</File>);
  }
// 9
  return files;
}
```

Let's break it down. The code snippet above does the following:

1. The **File** component from the [generator react SDK](https://github.com/asyncapi/generator-react-sdk) is imported. This tells the AsyncAPI CLI to use the [react render engine](https://www.asyncapi.com/docs/tools/generator/react-render-engine) for generating model files.
2. Modelina is imported into your template. The Modelina library makes the **PythonGenerator** and the **FormatHelpers** for formatting the generated Python code.
3. An asynchronous function **schemaRender**, is defined and is invoked everytime the AsyncAPI CLI runs the **models.js** template. This function is tasked with rendering the generated schema files and takes the `asyncapi` object as an input parameter.
4. A new instance of the **PythonGenerator** model generator from Modelina is created and is used to generate Python code from the provided AsyncAPI document.
5. An array of Python model classes is generated from the `asyncapi`,AsyncAPI document, object received from the generator.
6. An empty array **files** is defined to store the generated model files.
7. The for loop iterates over each generated model and formats the generated model names to Pascal case.
8. The filenames and the model schemas are added to the **files** array.
9. The function returns an array of files, each representing the generated model class, to the generator engine.

>Note:
>You can integrate this example into your own template by following the [generator template tutorial](https://www.asyncapi.com/docs/tools/generator/generator-template). Ensure that you add `@asyncapi/modelina` to template dependencies using `npm install --save @asyncapi/modelina`.

## Generate models

To learn how to generate models using the AsyncAPI CLI, refer to the section on Generator CLI usage. Execute the command provided there, and upon successful generation, the output will guide you to the location of your newly created model files in the specified directory **test/project/src/models**.

## Conclusion

Modelina provides a flexible and powerful way to generate data models from AsyncAPI, OpenAPI, or JSON Schema documents. With the AsyncAPI CLI, you can easily generate models and integrate them into your development workflow. With the ability to customize the generated models, Modelina proves to be a valuable tool in the development of event-driven architectures.
