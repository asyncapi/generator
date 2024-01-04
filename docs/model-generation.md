---
title: "Generating models and classes using Modelina"
weight: 200
---

Use [AsyncAPI Modelina](/tools/modelina) to generate models for an application. Since models generation is something that you usually perform as an automated step through CI/CD, best way to use Modelina is through [AsyncAPI CLI](/tools/cli).

In case you work on a template for generating an application and part of template responsibilities is to provide models, you should integrate Modelina library instead of templating model structures using features from AsyncAPI Generator.

[Modelina](https://www.asyncapi.com/tools/modelina) is an AsyncAPI library that is used to generate data models using inputs such as AsyncAPI, OpenAPI or JSON schema inputs. This library helps generate data models based on your AsyncAPI document, the model template (which defines the message payloads) via the asyncapi CLI. You can then use the generated models in your code, and you can store the generated models in a single file. This tutorial will guide you through generating a model class for a Python MQTT client using Modelina and the AsyncAPI CLI.

In this tutorial:

1. You'll learn how to generate a model class using a Python MQTT client.
2. You'll use the Modelina library and the asyncapi CLI to generate Python data models.
3. You'll create a model schema to test your model code using an MQTT client.

## Prerequisites

This tutorial builds upon an existing project, the [MQTT Python project](https://github.com/derberg/python-mqtt-client-template). The project creates a custom generator template using a Python MQTT client. We'll use the same project to create a simple Modelina template and generate data models using the Python MQTT client. To get an in-depth understanding of what this project does, please go through the [generator template tutorial](https://www.asyncapi.com/docs/tools/generator/generator_template).

You should also have [Node.js and npm](https://nodejs.org/en/download/) and the [AsyncAPI CLI](https://www.asyncapi.com/docs/tools/generator/installation-guide#asyncapi-cli) installed in your machine.

> :memo: **Note:**
> When building the model from scratch, you'll need to have a predefined [AsyncAPI document](https://www.asyncapi.com/docs/tools/generator/asyncapi-document) and you can also use the existing [community-maintained templates](https://www.asyncapi.com/docs/tools/generator/template#generator-templates-list) instead of creating a template from scratch.

## Getting started

First, clone the MQTT Python project from Github using the following command:
`git clone https://github.com/derberg/python-mqtt-client-template`

Open the Python MQTT project in your code editor

Then, add the Modelina dependency to the `package.json` file in your project:

 ```json
 "dependencies": {
    ...
    "@asyncapi/modelina": "^2.0.5"
    ...
  },
 ```

Finally, install Modelina in your project using npm:

 `npm install @asyncapi/modelina`

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

1. Imports the **File** component from the [generator react SDK](https://github.com/asyncapi/generator-react-sdk). This tells the generator CLI to use the [react render engine](https://www.asyncapi.com/docs/tools/generator/react-render-engine) to generate a model file or files as output.
2. Import Modelina into your template. The Modelina library makes the **PythonGenerator** and the **FormatHelpers** used to format the generated Python code available to your model template.
3. Define an asynchronous function **schemaRender** that get's invoked everytime the generator CLI runs the **models.js** template. This function is responsible for rendering the generated schema files. It also takes the `asyncapi` object as an input parameter.
4. Instantiates the **PythonGenerator** model generator from Modelina. It will be used to generate Python code from the AsyncAPI document.
5. Generates an array of Python model classes from the `asyncapi` (AsyncAPI document) object received from the generator.
6. Define an empty array **files** to store the generated model files.
7. Iterates over each generated model and formats the generated model names to Pascal case.
8. Add filenames and the model schemas to the **files** array.
9. Return an array of files, each representing the generated model classes, to the generator engine.

## Model generation using the AsyncAPI CLI

Using the AsyncAPI CLI, generate your model by running the following command:

`asyncapi generate fromTemplate test/fixtures/asyncapi.yml ./ -o test/project --force-write --param server=dev`

If successful, you should see the following output on your terminal:
```
Generation in progress. Keep calm and wait a bit... done
Check out your shiny new generated files at test/project.
```

Since you defined your model in **src/models** the generated model schema will be in the **test/project -> src/models** directory.
Navigate to **test/project** folder and you should see that your model template generated two models in the **src/models** folder.
Let's break down the previous command:

- `asyncapi generate fromTemplate` is how you use AsyncAPI generator via the AsyncAPI CLI.
- `test/fixtures/asyncapi.yml` points to your AsyncAPI document.
- `./` specifies the location of your model template.
- `-o` specifies where to output the generated data models.

## Conclusion

Modelina provides a flexible and powerful way to generate data models from AsyncAPI, OpenAPI, or JSON Schema documents. With the AsyncAPI CLI, you can easily generate models and integrate them into your development workflow. With the ability to customize the generated models, Modelina proves to be a valuable tool in the development of event-driven architectures.
