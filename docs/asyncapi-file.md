---
title: "AsyncAPI Specification File"
weight: 20
---

### What is the Asyncapi Specification?
The **AsyncAPI specification** defines a standard, protocol-agnostic interface that describes message-based or event-driven APIs. The AsyncAPI specification allows people or machines communicating with one another, to understand the capabilities of an event-driven APIs without requiring access to the source code, documentation or inspecting the network traffic.

The specification allows you to define the structure and format of your API including the channels the end user can subscribe to and the format of the messages they will be receiving.

This specification file when fed as an input to the generator library using the *asyncAPI CLI command, shown in the code snippet below, will generates API documentation(how to use the API) or generate API boilerplate code with it.(TBD)

```bash
ag asyncapi.yaml ~/my-template
```
1. **ag** is the asyncAPI generator
2. **asyncapi.yaml** is the specification file
3. **~/my-template** is the template you are using

### Use cases of of the API definition file
- Interactive and clear API documentation
- Code generation
- Validation of messages the client receives
- Application of API management policies to messages before they arive to the broker


<Remember>
If you are looking to learn how to create your own asyncapi specification file or you need to refresh your knowledge about the syntax and structure of the AsyncAPI Specification file, check out our official [documentation](https://www.asyncapi.com/docs/reference/specification/v2.4.0)
</Remember>

In this documentation you'll learn about the inner working of the generator and what happens once the specification file is fed to the generator and how you can use the content of spefication file using the asyncAPI document in your template.

<aside class="info"> If you are looking to learn how to build your own custom template please check out our [documentation](authoring-templates.md)
</aside>

The generator library receives the template and AsyncAPI specification file as inputs. In order to validate that the specification file is valid, the generator passes the stringified version of the original specification document to the [parser](parser.md). if valid, the parser then manipulates the original json/yml specification file into funtions and properties and bundles them together into an **asyncapiDocument**. The generator library then passes the originalapiString, the asyncapiDocument and the extra parameters provided by the user to the render engine. The render engine renders a template (where the originalapiString, the asyncapiDocument and the extra parameters) can be accessed from by the end user(developer?) from and  writes the generated output into a file.

The illustration below clearly depicts the whole proccess from when you pass the template and your specification file as arguments to the asyncapi CLI tool, to how the generator library uses the input to generate the output you need.

``` mermaid
graph LR
    E[ AsyncApi Document ] --> B{Generator}
    F[ Template ] --> B{Generator}
  subgraph Generator Library
    B -->| asyncapiString| C[Parser]
    C[Parser] --> |asyncapiDocument| D(Render Engine)
    B{Generator}--> | originalAsyncAPI | D(Render Engine)
    B{Generator}--> | template params | D(Render Engine)
  end
  D(Render Engine) --> O(HTML)
  D(Render Engine) --> M(Markdown)
  D(Render Engine) --> N(Node.js)
  D(Render Engine) --> J(Java Spring Boot)
```

**NB:** When you are writing your template, you get access to the specification file in two different forms; the originalAsyncApi which is a stringified version of the specification `.yml` file and the second is the asyncapiDocument.

<aside class="info"> You can check the structure of the asyncapiDocument [here](https://github.com/asyncapi/parser-js/blob/master/API.md#module_@asyncapi/parser+AsyncAPIDocument)

#### Method 1: asyncapiString + template ##
The **asynapiString** is a stringified version of your specification yaml that your template gets access to using the templates hook `createAsyncapiFile(generator)`. The template then gets the original specification file by calling `generator.originalAsyncAPI` which returns a stringified version of the original spec file. You can therefore use it in your generatoed application code.
Example: **Give uber eats example**
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

> Please check [this file](https://github.com/asyncapi/template-for-generator-templates/blob/master/template/index.js) 
to see how the content of the asyncapiDocument gets accessed.
Using the asyncapiString above, we'll see int= the code snippet below how data from the asyncapiDocument gets accessed in your template.

```
/*
 * Notice also how to retrieve passed properties to custom component, by the destruction of the first argument.
 * Accessing document data is made easier thanks to the AsyncAPI JavaScript Parser - https://github.com/asyncapi/parser-js.
 */
function BodyContent({ asyncapi }) {
  const apiName = asyncapi.info().title();
  const channels = asyncapi.channels();

  // rest of implementation...
}
```
