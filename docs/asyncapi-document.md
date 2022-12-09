---
title: "AsyncAPI document"
weight: 40
---

The **AsyncAPI document** defines a standard, protocol-agnostic interface that describes message-based or event-driven APIs. The AsyncAPI document allows people or machines communicating with one another, to understand the capabilities of an event-driven API without requiring access to the source code, documentation, or inspecting the network traffic.

This document allows you to define your API structures and formats, including channels the end user can subscribe to and the message formats they receive. 

The documents describing the message-driven API under the AsyncAPI specification are represented as JSON objects and conform to JSON standards. YAML, a superset of JSON, can also be used to represent an API.

> - To learn how to create an AsyncAPI document or refresh your knowledge about the syntax and structure of the AsyncAPI document, check out our [latest specification documentation](https://www.asyncapi.com/docs/reference/specification/latest). 
> - You can develop, validate, and convert the AsyncAPI document to the latest version or preview your AsyncAPI document in a more readable way using the [AsyncAPI Studio](https://studio.asyncapi.com/).

In the following sections, you'll learn about the inner working of the generator, what happens once the AsyncAPI document is fed to the generator, and how you can access the content of the document in your template.

## AsyncAPI document generation process
1. The **Generator** receives the **AsyncAPI Document** as input. 
2. The **Generator** sends to the **[Parser](parser)** the **asyncapiString** is a stringified version of the original **AsyncAPI Document** to validate and parse it.
3. The **Parser** validates the **AsyncAPI Document** using additional schema-related plugins, either the OpenAPI schema, RAML data types, or Avro schema. 
4. If the **Parser** determines that the **AsyncAPI Document** is valid, it manipulates the original JSON/YAML document and provides a set of helper functions in return, bundling them together into an **asyncapi** variable that is an instance of [**AsyncAPIDocument**](https://github.com/asyncapi/parser-js/blob/master/API.md#module_@asyncapi/parser+AsyncAPIDocument). 
5. At this point, the **Generator** passes the **originalAsyncAPI** and the **asyncapi** which make up part of the **[Template Context](asyncapi-context)** to the **Render Engine**. 
6. The **Template Context** is accessible to the template files that are passed to either the [react](react-render-engine) or [nunjucks](nunjucks-render-engine) **Render Engines**.
   
``` mermaid
graph LR
    A[Template Context]
    B{Generator}
    C[Parser]
    D[Render Engine]
    E[AsyncAPI Document] --> B
  subgraph Generator
    B -->| asyncapiString | C
    C --> | asyncapi -> AsyncAPIDocument type | A
    B--> | originalAsyncAPI -> Stringified document | A
    A --> D
  end
  ```
The AsyncAPI document's content is accessible to you while writing your template in two distinct ways:
* The `originalAsyncAPI`, which is a stringified version of the AsyncAPI document provided as input, without any modifications.
* The `asyncapi` (`AsyncAPIDocument`) which is an object with a set of helper functions, that comes as a result of the `Parser` manipulating the `originalAyncAPI` .The `asyncapi` functions make it easier to access the contents of AsyncAPI documents in your templates.

In the following sections, you will learn how to use either the **originalAsyncAPI** or the **asyncapi** in your template.

### Method 1: `originalAsyncAPI` and template 
One way of using the contents of the AsyncAPI document inside your template files is by using its stringified version that reflects the same contents as the AsyncAPI document provided as input to the generator. You can access it directly in your templates using the `originalAsyncAPI` variable. You also access it via the [hooks](hooks) `generator.originalAsyncAPI` because `originalAsyncAPI` is also a part of the generator instance that is passed to hooks.

```js
//example use case for using a stringified AsyncAPI document inside template hooks

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


### Method 2: `asyncapi` and template
A major advantage of using `asyncapi` (which is an instance of `AsyncAPIDocument`) is that it enables the developer to easily access the AsyncAPI documents' content by simply invoking a function. 

Once the specification YAML or JSON document is passed as input to the generator, it is passed on to the [Parser](parser) library, which then manipulates the asyncAPI document to a more structured document called the `AsyncAPIDocument`. Once the parser returns the document to the generator, the generator passes it to the render engine. The render engine makes the `AsyncAPIDocument` object accessible to your template through the `asyncapi` variable.

For example, if you want to extract the version of your API from AsyncAPI document, you can do that by calling `asyncapi.version()`. You can say that this one is easy to access from JSON objects, but there are more complex scenarios. For example, to get access to all messages from all channels, you can call `asyncapi.allMessages()` instead of iterating through a complex JSON object on your own.

In the sample code snippet below, notice how you can access the contents of the AsyncAPI document in your template using `asyncapi` variable from the context:

```js
  const apiName = asyncapi.info().title();
  const channels = asyncapi.channels();
```

> To learn about the various instances you can use to access the documents' content, look at the API of the AsyncAPI JavaScript Parser and the structure of [AsyncAPIDocument](https://github.com/asyncapi/parser-js/blob/master/API.md#module_@asyncapi/parser+AsyncAPIDocument)
