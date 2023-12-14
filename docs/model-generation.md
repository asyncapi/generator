---
title: "Generating models and classes using Modelina"
weight: 200
---

Suppose you want to generate models for your application from the data types you have using the asyncapi generator. Then you should use modelina instead of the asyncapi generator with a template.

Modelina is an AsyncAPI library that is used to generate data models using inputs such as AsyncAPI, OpenAPI or JSON schema inputs.

This tutorial teaches you how to generate a model class using a Python MQTT client. You'll use the Modelina library and the asyncapi CLI to generate Python data models. You'll create a model schema to create and test your model code using an MQTT client.

## Prerequisites
In this tutorial, we will use an existing [MQTT Python project](https://github.com/derberg/python-mqtt-client-template). To get an in-depth understanding of what it does, please go through the [generator template tutorial](https://www.asyncapi.com/docs/tools/generator/generator_template).
Additionally, you'll need to add the following configurations to your project:
1. Add the modelina dependency to the `package.json` file in your project

 ```json
 "dependencies": {
    ...
    "@asyncapi/modelina": "^2.0.5"
    ...
  },
 ```
2. Install modelina using the following command:

 `npm -i s @asyncapi/modelina`


## Background context

### asyncapi.yml file
Explain about the relevance of channels and properties to the generated models

## Create a model.js file
The **model.js** file is used to define the logic for your model. Inside the template folder, create a new folder src/models and add a **model.js** file to the models folder and add the code snippet below:

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
  // Instantiate the model generator
  const pythonGenerator = new PythonGenerator();
// 4
  const models = await pythonGenerator.generate(asyncapi);

  const files = [];

  for (const model of models) {
    // 5
    const modelFileName = `${FormatHelpers.toPascalCase(model.modelName)}.py`;
    // 6
    files.push(<File name={modelFileName}>{model.result}</File>);
  }
// 7
  return files;
}
```

The code snippet above does the following:

1. Generate a file using the generator react sdk.
2. Import modelina (should have installed it first).
3. Define a function schemaRender** that is responsible for rendering the generated schema documents.
4. Instantiate the model generator.
5. Generates an array of Python model classes.
6. Format the generated model, comes from modelina, to Pascal case.
7. Add filenames and the model schemas(contents the contents of the model class) to the files array.
8. Return an array of files to the generator engine.

## Model generation
Using the asyncapi cli, generate your model by running the following command:

`asyncapi generate fromTemplate test/fixtures/asyncapi.yml ./ -o test/project --force-write --param server=dev`

You should see the following output on your command line:
![](https://imgur.com/W2FGK1c.png)

Navigate to test/project folder and you should see that your model template generated two modelsin the src/models folder

