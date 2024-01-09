---
title: "How to generating models and classes using Modelina"
weight: 200
---

This guide will walk you through the process of generating models and classes using [Modelina](https://www.asyncapi.com/tools/modelina) and the asyncapi generator. If you want to generate models for your application from the data types, you should use Modelina instead of the asyncapi generator with a template else you should use 

[Modelina](https://www.asyncapi.com/tools/modelina) is an AsyncAPI library that is used to generate data models using inputs such as AsyncAPI, OpenAPI or JSON schema inputs. This library helps generate data models based on your AsyncAPI document, the model template (which defines the message payloads) via the asyncapi CLI. You can then use the generated models in your code, and you can store the generated models in a single file. This tutorial will guide you through generating a model class for a Python MQTT client using Modelina and the AsyncAPI CLI.

In this guide, you'll learn to:

1. Generate a model class using a Python MQTT client.
2. Use the Modelina library and the asyncapi CLI to generate Python data models.
3. Create a model schema to test your model code using an MQTT client.

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js and npm](https://nodejs.org/en/download/).
- [AsyncAPI CLI](https://www.asyncapi.com/docs/tools/generator/installation-guide#asyncapi-cli) installed in your machine.

> :memo: **Note:**
> When building the model from scratch, you'll need to have a predefined [AsyncAPI document](https://www.asyncapi.com/docs/tools/generator/asyncapi-document) and you can also use the existing [community-maintained templates](https://www.asyncapi.com/docs/tools/generator/template#generator-templates-list) instead of creating a template from scratch.

## Getting started

First, install Modelina in your project using npm:

 `npm install --save @asyncapi/modelina`
This command will then automatically add the modelina dependency to your `package.json` as shown below:

 ```json
 "dependencies": {
    ...
    "@asyncapi/modelina": "^2.0.5"
    ...
  },
 ```

## Generating models

With Modelina installed, you can now generate models using an AsyncAPI document as an input. In the next section, you'll create a `model.js` file to define the logic of your model(s).

### Create a model.js file

Create a new folder in the **template** directory named **src/models** and create a **models.js** file within it.
Then in the model.js file, add the following code:

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

1. Imports the **File** component from the [generator react SDK](https://github.com/asyncapi/generator-react-sdk). This tells the AsyncAPI CLI to use the [react render engine](https://www.asyncapi.com/docs/tools/generator/react-render-engine) to generate a model file or files as output.
2. Import Modelina into your template. The Modelina library makes the **PythonGenerator** and the **FormatHelpers** used to format the generated Python code available to your model template.
3. Define an asynchronous function **schemaRender** that get's invoked everytime the AsyncAPI CLI runs the **models.js** template. This function is responsible for rendering the generated schema files. It also takes the `asyncapi` object as an input parameter.
4. Instantiates the **PythonGenerator** model generator from Modelina. It will be used to generate Python code from the AsyncAPI document.
5. Generates an array of Python model classes from the `asyncapi` (AsyncAPI document) object received from the generator.
6. Define an empty array **files** to store the generated model files.
7. Iterates over each generated model and formats the generated model names to Pascal case.
8. Add filenames and the model schemas to the **files** array.
9. Return an array of files, each representing the generated model classes, to the generator engine.

## Generate models
Use the AsyncAPI CLI to generate your models using the following command:

```
asyncapi generate fromTemplate test/fixtures/asyncapi.yml ./ -o test/project --force-write --param server=dev
```
If successful, you should see the following output:

```
Generation in progress. Keep calm and wait a bit... done
Check out your shiny new generated files at test/project.
```

Navigate to test/project/src/models to find your generated model files.

## Conclusion

Modelina provides a flexible and powerful way to generate data models from AsyncAPI, OpenAPI, or JSON Schema documents. With the AsyncAPI CLI, you can easily generate models and integrate them into your development workflow. With the ability to customize the generated models, Modelina proves to be a valuable tool in the development of event-driven architectures.

>Note:
>You can integrate this example into your own template by following the [generator template tutorial](https://www.asyncapi.com/docs/tools/generator/generator-template). Ensure that you add `@asyncapi/modelina` to template dependencies using `npm install --save @asyncapi/modelina``.
