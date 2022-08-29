---
title: "AsyncAPI Specification File"
weight: 20
---

### What is the Asyncapi Specification?
The **AsyncAPI specification** defines a standard, protocol-agnostic interface that describes message-based or event-driven APIs. The AsyncAPI specification allows people or machines communicating with one another, to understand the capabilities of an event-driven API without requiring access to the source code, documentation, or inspecting the network traffic.

The specification allows you to define the structure and format of your API, including the channels the end user can subscribe to and the format of the messages they will be receiving. 

The files describing the message-driven API under the AsyncAPI Specification are represented as JSON objects and conform to the JSON standards. YAML, a superset of JSON, can also be used to represent an A2S (AsyncAPI Specification) file. The specification file, when fed as an input to the generator library via the AsyncAPI CLI command, shown in the code snippet below, will generate API documentation or generate message-based API boilerplate code.

```bash
ag asyncapi.yaml ~/my-template
```
1. **ag** is the AsyncAPI generator
2. **asyncapi.yaml** is the specification file
3. **~/my-template** is the template you are using

> :bulb: **Note:** 
If you haven't set up the AsyncAPI CLI tool, please refer to our [AsyncAPI CLI installation guide](installation.md)

### Use cases of the API definition file
- Interactive and clear API documentation.
- Generation of message-based APIs boilerplate code.
- Validation of messages the client receives using the JSON schema that defines validation rules for your objects in the spec file. 
- Application of API management policies to messages before they arrive to the broker.

> :bulb: **Remember:** 
If you want to learn how to create an AsyncAPI specification file or refresh your knowledge about the syntax and structure of the AsyncAPI Specification file, check out our official [documentation](https://www.asyncapi.com/docs/reference/specification/v2.4.0).

In the following sections, you'll learn about the inner working of the generator, what happens once the specification file is fed to the generator, and how you can use the content of the specification file with either an AsyncAPI document or AsyncAPI string in your template.

### The generation process
The generator library receives the template and AsyncAPI specification file as inputs. To validate the json/yaml specification file, the generator passes the stringified version of the original specification document to the [parser](parser.md). The parser validates the AsyncAPI specification using either the OpenAPI, RAML, or Avro schema defined in the spec files. If valid, the parser then manipulates the original JSON or YML specification file into functions and properties, bundling them together into an **asyncapiDocument**. At this point, the generator library passes the original apiString, the asyncapiDocument, and the extra parameters provided by the user to the render engine. The render engine renders a template where the original apiString, the asyncapiDocument, and the extra parameters are accessible to the template developer. Thus, they can access functions that extract data from the AsyncAPI file.

The diagram below depicts the entire process of passing the template and specification file as arguments to the AsyncAPI CLI tool, and how the generator library then uses these inputs to generate the output you need.

``` mermaid
graph LR
    E[ AsyncAPI Document ] --> B{Generator}
    F[ Template ] --> B{Generator}
  subgraph Generator Library
    B -->| asyncapiString| C[Parser]
    C[Parser] --> |AsyncAPI| D(Render Engine)
    B{Generator}--> | originalAsyncAPI | D(Render Engine)
    B{Generator}--> | params | D(Render Engine)
  end
  D(Render Engine) --> O(HTML)
  D(Render Engine) --> M(Markdown)
  D(Render Engine) --> N(Node.js)
  D(Render Engine) --> J(Java Spring Boot)

> :bulb: **Remember**
> 
> When you are writing your template, you get access to the specification file in two different forms; the originalAsyncAPI which is a stringified version of the specification `.yml` file, and the asyncapiDocument.

> :memo: **Note:** 
> Check out the [asyncapiDocument structure](https://github.com/asyncapi/parser-js/blob/master/API.md#module_@asyncapi/parser+AsyncAPIDocument)

In the following sections, you will learn how to use either the **asyncapiString** or the **asyncapiDocument** in your template.

#### Method 1: asyncapiString + template 
The first way to generate a message-based API template using the generator tool is by using the asyncapiString. The asynapiString is a stringified version of the specification YAML or JSON file you pass as a parameter to the CLI `ag` command. During the generation process, the generator library calls `generator.originalAsyncAPI`, which returns a stringified version of the original spec file. This stringified version is what the generator library passes to the render engine, and the render engine makes it accessible in your output alias the template.

**An example of an asyncapiString:**
```
const asyncapiString = `
asyncapi: 2.4.0
info:
  title: Example to show stringified specification file
  version: 1.0.0
...
`;

```
The generator library generates templates using the `generator.generateFromString` instance method, as shown in the sample code snippet below:

```
generator
  .generateFromString(asyncapiString)
  .then(() => {
    console.log('Done!');
  })
  .catch(console.error);
  ```

#### Method 2: asyncapiDocument + template
A major advantage of using the asyncApiDocument is that it simplifies the structure of the more complex spec file, enabling the developer to easily access the specification files' content by simply invoking a function. 

Once the specification YAML or JSON file is passed as an input to the generator library, it is passed on to the [Parser](parser.md) library, which then manipulates the file to a more structured document called the asyncapiDocument. Once the parser returns the document to the generator, the generator passes it to the render engine. The render engine makes the asyncapiDocument accessible from your output alias, the template.

From the template, you can access the document's content. For example, if you wished to extract the spec file version used in your ReadME, you can do that by running `asyncapiDocument.version()`. Or, to get the message payload, you can use the `asyncapiDocument.allMessages()` method.

In the sample code snippet below, notice how you can access document contents of the asyncapiDocument in your template:

```
  const apiName = asyncapi.info().title();
  const channels = asyncapi.channels();
...
```
> :memo: **Note:**  
> To learn about the various instances you can use to access the documents' content, read these [AsyncAPIDocument and parser files](https://github.com/asyncapi/parser-js/blob/master/API.md#module_@asyncapi/parser+AsyncAPIDocument) 

  