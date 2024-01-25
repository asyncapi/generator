---
title: "Adding models generation in template"
weight: 200
---

This guide will walk you through the process of enabling models/types generation in a template by using [Modelina](https://www.asyncapi.com/tools/modelina).

Modelina is an AsyncAPI library designed for generating data models using inputs such as [AsyncAPI](generator/asyncapi-document), OpenAPI, or JSON schema inputs. Its functionality revolves around creating data models from the provided AsyncAPI document and the model template, which defines message payloads. It is better to use Modelina in your template to handle model generation rather than providing custom templates.

You can integrate the work shown in this guide into a template by following the [tutorial about creating a template](https://www.asyncapi.com/docs/tools/generator/generator-template).

In this guide, you'll learn how to use Modelina in a template code to enable support for Python data model generation.

## Add Modelina dependency

Install Modelina in your project using npm: `npm install --save @asyncapi/modelina`.

Ensure your template's `package.json` file now contains Modelina pointing to its latest version:

 ```json
 "dependencies": {
    // ...
    "@asyncapi/modelina": "^2.0.5"
    // ...
  }
```

## Create a models.js file

Create a new directory in the **template** directory named **src/models** and create a **models.js** file within it. In the **models.js** file, add the following code:

```python
// 1
import { File } from '@asyncapi/generator-react-sdk';
// 2
import { PythonGenerator, FormatHelpers } from '@asyncapi/modelina';

/**
 * @typedef RenderArgument
 * @type {object}
 * @property {AsyncAPIDocument} asyncapi document object received from the generator.
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
  // 7
  for (const model of models) {
    // 8
    const modelFileName = `${FormatHelpers.toPascalCase(model.modelName)}.py`;
    // 9
    files.push(<File name={modelFileName}>{model.result}</File>);
  }
  return files;
}
```

Let's break it down. The code snippet above does the following:

1. The `File` component from the [generator react SDK](https://github.com/asyncapi/generator-react-sdk) is needed to handle the further rendering of generated models into files.
2. The `PythonGenerator` generator is the core needed for model generation. Additionally, you can import [FormatHelpers](https://github.com/asyncapi/modelina/blob/master/src/helpers/FormatHelpers.ts) that provides a set of helpers making it easier to modify model names to match your required case.
3. You can change the name `schemaRender` to anything else like `modelRenderer`. More importantly, this must be an `async` function and a default export. This function is invoked during generation process and should contain the logic behind models generation.
4. First, create an instance of the `PythonGenerator` model generator. If you decide to use present functionality from Modelina, you need to pass your presets here during instance creation.
5. The actual model generation is one line of code, and as a result you get an array of models that later you need to turn into files.
6. You need to define an array that must be returned from `schemaRender` function. The array must contain React components, and in this case, the `<File>` component.
7. Iterate over generated models and use their content to create proper definitions of `<File>` components.
8. Notice how using Modelina helpers, in this case the  `toPascalCase` function, let's you make sure that the filename of your model follows specific case pattern.
9. Each component must be added into the `files` array that you later return from the default function. Notice the definition of the `<File>` component that enables you to provide the name of resulting file and the content of the model. Notice also `model.result` that shows that initially generated array with models did not contain raw models content but a set of output objects that contain not only `result` but also other info, like for example `modelName`.

With such a model template that uses Modelina, as a result of generation process you would receive a set of model files in `$OUTPUT_DIR/src/models` directory.

## Conclusion

Modelina provides a flexible and powerful way to generate data models from AsyncAPI, OpenAPI, or JSON Schema documents. By integrating Modelina you can much faster enable models generation in your template.
