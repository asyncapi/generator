---
title: "AsyncAPI document"
weight: 40
---

## What is the AsyncAPI file?
The **AsyncAPI file** defines a standard, protocol-agnostic interface that describes message-based or event-driven APIs. The AsyncAPI file allows people or machines communicating with one another, to understand the capabilities of an event-driven API without requiring access to the source code, documentation, or inspecting the network traffic.

This file allows you to define your API structures and formats, including channels the end user can subscribe to and the message formats they receive. 

The files describing the message-driven API under the AsyncAPI Specification are represented as JSON objects and conform to JSON standards. YAML, a superset of JSON, can also be used to represent an A2S (AsyncAPI Specification) file.

> - To learn how to create an AsyncAPI file or refresh your knowledge about the syntax and structure of the AsyncAPI file, check out our [latest specification documentation](https://www.asyncapi.com/docs/reference/specification/latest). 
> - You can develop, validate, convert the AsyncAPI file to the latest version or preview your AsyncAPI file in a more readable way using the [AsyncAPI Studio](https://studio.asyncapi.com/).

In the following sections, you'll learn about the inner working of the generator, what happens once the specification file is fed to the generator, and how you can use the content of the specification file with either an AsyncAPI document or AsyncAPI string in your template.

## The generation process
1. The **Generator** receives the **AsyncAPI file** as an input. 
2. The Generator sends to the **[Parser](parser.md)** a stringified version of the original specification file to validate the JSON/YAML **AsyncAPI file**.
3. The **parser** validates the **AsyncAPI file** using either the OpenAPI, RAML, or Avro schemas defined in the specification files. 
4. If the **parser** determines that the **AsyncAPI file** is valid, it manipulates the original JSON/YAML specification file into functions and properties, bundling them together into an **asyncapi**(asyncapiDocument). 
5. At this point, the **Generator** passes the **originalAsyncAPI** and the **asyncapi** which make up part of the **[template context](asyncapi-context.md)** to the **render engine**. 
6. The **template context** is accessible to the template files that are passed to either the [react](react-render-engine.md) or [nunjucks](nunjucks-render-engine.md) **render engines** by the **Generator**.
   
``` mermaid
graph LR
    A[Template Context]
    B{Generator}
    C[Parser]
    D[Render Engine]
    E[AsyncAPI File] --> B
  subgraph Generator
    B -->| asyncapiString | C
    C --> | asyncapi -> AsyncAPIDocument type | A
    B--> | originalAsyncAPI -> Stringified document | A
    A --> D
  end
  ```
The AsyncAPI file's content is accessible to you while writing your template in two distinct ways:
1. The `originalAsyncAPI`, which is a stringified version of the AsyncAPI file provided as input, without any modifications.
2. The `asyncapi` (`AsyncAPIDocument`) which is an object with a set of functions and properties, that comes as a result of the AsyncAPI Parser manipulating the `originalAyncAPI` .The `asyncapi` methods and parameters make it easier to access contents of AsyncAPI file in your templates.

> Check out the structure of the [AsyncAPIDocument](https://github.com/asyncapi/parser-js/blob/master/API.md#module_@asyncapi/parser+AsyncAPIDocument)

In the following sections, you will learn how to use either the **originalAsyncAPI** or the **asyncapi** in your template.

### Method 1: `originalAsyncAPI` and template 
One way of using the contents of AsyncAPI file inside your template files is by using its stringified version that reflects exactly the same contents as the AsyncAPI file provided as an input to the AsyncAPI Generator CLI. You can access this stringified AsyncAPI file directly in your templates using the `originalAsyncAPI` variable. You also access it via the [hooks](hooks.md) `generator.originalAsyncAPI` functionality because `originalAsyncAPI` is also a part of the Generator instance that is passed to hooks.

```
//example use case for using a stringified AsyncAPI file inside template hooks

const fs = require('fs');
const path = require('path');

function createAsyncapiFile(generator) {
  const asyncapi = generator.originalAsyncAPI;
  let extension;
  
  try {
    JSON.parse(asyncapi);
    extension = 'json';
  } catch (e) {
    extension = 'yaml';
  }

  const outputFileName = `asyncapi.${extension}`;

  const asyncapiOutputLocation = path.resolve('./'', outputFileName);

  fs.writeFileSync(asyncapiOutputLocation, asyncapi);
```

The Generator generates templates using the `generator.generateFromString` instance method, as shown in the sample code snippet below:

```
generator.generateFromString(asyncapiString).then(() => {
    console.log('Done!');
  })
  .catch(console.error);
  ```

### Method 2: `asyncapi` and template
A major advantage of using `asyncapi` (which is an instance of `AsyncAPIDocument`) is that it enables the developer to easily access the specification files' content by simply invoking a function. 

Once the specification YAML or JSON file is passed as an input to the Generator, it is passed on to the [Parser](parser.md) library, which then manipulates the asyncAPI file to a more structured document called the `AsyncAPIDocument`. Once the parser returns the document to the generator, the generator passes it to the render engine. The render engine makes the `AsyncAPIDocument` object accessible to your template through the `asyncapi` variable.

For example, if you want to extract the version of your API from AsyncAPI document, you can do that by calling `asyncapi.version()`. You can say that this one is easy to access from JSON objects, but there are more complex scenarios. For example, to get access to all messages from all channels, you can call `asyncapi.allMessages()` instead of iterating through a complex JSON object on your own.

In the sample code snippet below, notice how you can access the contents of the AsyncAPI file in your template:

```
  const apiName = asyncapi.info().title();
  const channels = asyncapi.channels();
```

> To learn about the various instances you can use to access the documents' content, look at the API of the AsyncAPI JavaScript Parser and the structure of [AsyncAPIDocument](https://github.com/asyncapi/parser-js/blob/master/API.md#module_@asyncapi/parser+AsyncAPIDocument)