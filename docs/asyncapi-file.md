---
title: "AsyncAPI Specification File"
weight: 20
---

### What is the Asyncapi Specification?
The **AsyncAPI specification** defines a standard, protocol-agnostic interface description of message-based or event-driven APIs which allows the people or machines communicating with one another to understand the capabilities of an event-driven API without requiring access to the source code, documentation or inspecting the network traffic.

This specification file when fed as an input to the generator library using the **asyncAPI CLI command**, shown in the code snippet below, generates API documentation or API code with it.

```bash
ag asyncapi.yaml ~/my-template
```
1. **ag** is the asyncAPI generator
2. **asyncapi.yaml** is the specification file
3. **~/my-template** is the template you are using

### Use cases of of the API definition file
- Interactive documentation
- Code generation
- Validation of messages the client receives
- Application of API management policies to messages before they arive to the broker


<Remember>
If you are looking to learn how to create your own asyncapi specification file or you need to refresh your knowledge,check out our official [documentation](https://www.asyncapi.com/docs/reference/specification/v2.4.0)
</Remember>

In this documentation you'll learn about the inner working of the generator and what happens once the spec file is fed to the generator and how you can use the content of spec file using the asyncAPI document in your code.

<aside class="info"> If you are looking to learn how to build your own custom template please check out our [documentation](authoring-templates.md)
</aside>

The generator receives the template and AsyncAPI specification file as an input. The illustration below clearly depicts the whole proccess from when you add the template and your specification file to the cli tool, to how the generator uses the input to generate the output you need.

``` mermaid
graph LR
    E[ Specification File ] -->| asyncapi specification | B(Generator)
    F[ Generator Template ] -->| Template | B{Generator}
    B -->| asyncapi String| C[Parser]
    C -->|One| D[asyncapi Document]
```
The generator library upon receiving as an input the specificication file and then generates code with it. As a user you will need access to the data that was defined in the specification file. 
When you are writing your template, you get access to the specification file in two different forms; the originalAsyncApi which is a stringified version of the specification `.yml` file and the second is the asyncapiDocument


#### Method 1: asyncapiString + template ##
The **asynapiString** is a stringified version of your specification yaml that your template gets access to using the templates hook `createAsyncapiFile(generator)`. The template then gets the original specification file by calling `generator.originalAsyncAPI` which returns a stringified version of the original spec file. You can therefore use it in your generatoed application code.
Example:
```
const asyncapiString = `
asyncapi: 2.0.0
info:
  title: Example to show stringified specification file
  version: 0.1.0
channels:
  example:
    publish:
      message:
        schemaFormat: 'application/vnd.oai.openapi;version=3.0.0'
        payload: # The following is an OpenAPI schema
          type: object
          properties:
            title:
              type: string
              nullable: true
            author:
              type: string
              example: Jack Johnson
`
```



#### Method 2: asyncapiDocument+ template ##
Once the specification yml or json is passed as an input to the generator library, it is passed on to the Parser library which then manipulates the file to a more structured document called the [asyncapiDocument](https://github.com/asyncapi/parser-js/blob/master/API.md#module_@asyncapi/parser+AsyncAPIDocument). It should be used to access the documents content for example, to extract the version of the spec file used for your Readme.md, you can do that using the asyncapiDocument by running `asyncapiDocument.version` or to get the message payload using `asyncapiDocument.allMessages`



Note: How it simplifies the structure of the spec file which is complex and nested

Note 2: Mention how you can check to see how these 2 docs are used in the written templates e.g node.js template
Note 3: https://github.com/asyncapi/template-for-generator-templates#template-context
Note 4: Both files are passed to the renderer engines ie React ans nunjucks
Note 5: You get access to these 2 files in the templates you will use
Note 6: Adv of one over the other
Note 7: Link to the parser docs or talk about the parser
Note 8: Show the structure of the asyncapiDocument as a code snippet
Note 9: Listen to the last section of the recording again