---
title: "AsyncAPI Specification File"
weight: 20
---

### What is the Asyncapi Specification?
The **AsyncAPI specification** defines a standard, protocol-agnostic interface that describes message-based or event-driven APIs. The AsyncAPI specification allows people or machines communicating with one another, to understand the capabilities of an event-driven APIs without requiring access to the source code, documentation or inspecting the network traffic.

The specification allows you to define the structure and format of your API including the channels the end user can subscribe to and the format of the messages they will be receiving.

The files describing the message-driven API in accordance with the AsyncAPI Specification are represented as JSON objects and conform to the JSON standards. YAML, being a superset of JSON, can be used as well to represent a A2S (AsyncAPI Specification) file.

This specification file when fed as an input to the generator library using the asyncAPI CLI command, shown in the code snippet below, will generates API documentation(how to use the API) or generate API boilerplate code, also refered to as the template, with it.(TBD)

```bash
ag asyncapi.yaml ~/my-template
```
1. **ag** is the asyncAPI generator
2. **asyncapi.yaml** is the specification file
3. **~/my-template** is the template you are using

> :bulb: **Note:** 
If you haven't setup the asyncapi CLI tool, please reference to our [installation guide](installation.md)

### Use cases of of the API definition file
- Interactive and clear API documentation
- Code generation
- Validation of messages the client receives using the json schema that defines validation rules for your objects in the spec file 
- Application of API management policies to messages before they arive to the broker


> :bulb: **Remember:** 
If you are looking to learn how to create your own asyncapi specification file or you need to refresh your knowledge about the syntax and structure of the AsyncAPI Specification file, check out our official [documentation](https://www.asyncapi.com/docs/reference/specification/v2.4.0)

In this documentation you'll learn about the inner working of the generator and what happens once the specification file is fed to the generator and how you can use the content of spefication file using the asyncAPI document in your template.

### The generation process
The generator library receives the template and AsyncAPI specification file as inputs. In order to validate that the json/yaml specification file is valid, the generator passes the stringified version of the original specification document to the [parser](parser.md). The parser validates the asyncapi specification using either the openapi schema, raml scema or the avro schema defined in the spec files. if valid, the parser then manipulates the original json/yml specification file into funtions and properties and bundles them together into an **asyncapiDocument**. The generator library then passes the originalapiString, the asyncapiDocument and the extra parameters provided by the user to the renderer engine. The renderer engine renders a template where the originalapiString, the asyncapiDocument and the extra parameters are made accesible to the template developer so they access functions that extract some data from the asyncapi file.

The illustration below clearly depicts the whole proccess from when you pass the template and your specification file as arguments to the asyncapi CLI tool, to how the generator library uses the input to generate the output you need.

``` mermaid
graph LR
    E[ AsyncApi Document ] --> B{Generator}
    F[ Template ] --> B{Generator}
  subgraph Generator Library
    B -->| asyncapiString| C[Parser]
    C[Parser] --> |asyncapi| D(Render Engine)
    B{Generator}--> | originalAsyncAPI | D(Render Engine)
    B{Generator}--> | params | D(Render Engine)
  end
  D(Render Engine) --> O(HTML)
  D(Render Engine) --> M(Markdown)
  D(Render Engine) --> N(Node.js)
  D(Render Engine) --> J(Java Spring Boot)
```

**NB:** When you are writing your template, you get access to the specification file in two different forms; the originalAsyncApi which is a stringified version of the specification `.yml` file and the second is the asyncapiDocument.

> :memo: **Note:** 
> In case you need a refresher, you can check the structure of the asyncapiDocument [here](https://github.com/asyncapi/parser-js/blob/master/API.md#module_@asyncapi/parser+AsyncAPIDocument)

In the section below, you will learn how to use either the **asyncapiString** or the **asyncapiDocument** in your template.
#### Method 1: asyncapiString + template ##
This first way to generate an asynchronous API template using the generator tool is by using the asyncapiString. The asynapiString is a stringified version of the specification yaml/json file you pass as parameter to the CLI ag command. During the generation process, the generator library calls `generator.originalAsyncAPI` which returns a stringified version of the original spec file. This stringified version is what the generator library passes to the renderer engine and the renderer engine makes it accesible in your output/template.

**An example of an asyncapiString:**
```
const asyncapiString = `
asyncapi: 2.0.0
info:
  title: Example to show stringified specification file
  version: 1.0.0
...
`;

```
The generator library generates templates using the `generator.generateFromString` instance method as shown in the code snippet below

```
generator
  .generateFromString(asyncapiString)
  .then(() => {
    console.log('Done!');
  })
  .catch(console.error);
  ```
> :memo: **Note:**  
> To learn more about hooks, check our official documentation [here](hooks.md)

##### How to use the asyncapiString in your template?
TBD

#### Method 2: asyncapiDocument+ template ##
Once the specification yml or json is passed as an input to the generator library, it is passed on to the Parser library which then manipulates the file to a more structured document called the [asyncapiDocument](https://github.com/asyncapi/parser-js/blob/master/API.md#module_@asyncapi/parser+AsyncAPIDocument). Once the parser returns the document to the generator, the generator passes it to the renderer engine. The renderer engine will make the asyncapiDocument accessible from your template.

From the template, you can access the documents content for example, to extract the version of the spec file used for your Readme.md, you can do that by running `asyncapiDocument.version()` or to get the message payload you use `asyncapiDocument.allMessages()` method.


In the code snippet below, you'll see how you can access document contents of the asyncapiDocument in your template.

```
  const apiName = asyncapi.info().title();
  const channels = asyncapi.channels();
...
```

> :memo: **Note:**  
> To learn about the various instances you can use to access the documents' content, please check [this file](https://github.com/asyncapi/template-for-generator-templates/blob/master/template/index.js) 


## Advantage of using the asyncApiDocument instaed of the asyncapiString in your template
The asyncApiDocument simplifies the structure of the spec file which is complex and nested enabling the developer to easily access the specification files content by simply invoking a function
  