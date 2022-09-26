---
title: "Template"
weight: 40
---

## What's a Template?

Template is a project designed to give you some form of output with the help of Generator and [AsyncAPI file](asyncapi-file.md) as an input. It is just a set of files where you describe what you would like the Generator to generate as an output. Some examples of these outputs can be things such as—code, documentation, diagrams, python and java applications, and much more. 

Template is an independent NodeJS project that’s not related to the Generator repository. AsyncAPI templates are managed, released and published separately. Generator uses the Arborist library. Arborist connects both Template and Generator, It is also the dependency tree manager for npm. 

Arborist helps the generator fetch source code or hooks of the template and use that for the generation process. It also means templates are a set of customly designed files which can be stored anywhere like–in npm, on local during the development process, or just as a github repository. You can do anything that is already possible with `npm install`.

The following section talks about the minimum components your template should have in any given situation.

# Minimum for your template

The most basic template must have the following:

- `template directory`: This is where you keep the files that determine the output that will be generated. In other words, the Generator processes all the files stored in this directory.

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

> Code sample developed is stored under template/index.js folder

- `package.json`: This file is necessary even if your template doesn't need any external dependencies. Before the generation process runs, the Generator must install the template into its dependencies, and `package.json` is necessary to identify the template name.

Following example shows components of `package.json` file and select dependencies:

```json
"generator": {
    "renderer": "react",
    "parameters": {
      "server": {
        "description": "The server you want to use in the code.",
        "required": true
      },

"dependencies": {
    "@asyncapi/generator-filters": "^2.1.0",
    "@asyncapi/generator-hooks": "^0.1.0",
    "@asyncapi/generator-react-sdk": "^0.2.16"
  },
```




