---
title: "Introduction"
weight: 10
---

The AsyncAPI Generator is a tool that generates anything you want using the **[AsyncAPI Document](asyncapi-file.md)** and **[Template](template.md)** that are supplied as inputs to the AsyncAPI CLI. The Generator was built with extensibility in mind; you can use the generator to generate anything you want, provided that it can be defined in a template, such as code, diagrams, markdown files, microservices, and applications. A number of [community-maintained templates](https://github.com/search?q=topic%3Aasyncapi+topic%3Agenerator+topic%3Atemplate) are now available for immediate usage.

### Generator use cases 
- Generation of interactive and understandable API documentation
- Generation of APIs' client libraries
- Generation of APIs' boilerplate code

### Generator advantages
- Quick to setup and easy to use on a regular basis
- Effortless generation of complex documents
- Number of community maintained AsyncAPI templates

### Generation process
1. The **Generator** receives the **[Template](template.md)** and **[AsyncAPI Document](asyncapi-file.md)** as inputs. 
2. The **Generator** sends to the **[Parser](parser.md)** the **asyncapiString** which is a stringified version of the original **AsyncAPI Document**.
3. The **Parser** uses additional plugins such as the OpenAPI, RAML, or Avro schemas to validate custom schemas of message payloads defined in the **AsyncAPI Document**.
4. If the **Parser** determines that the original **AsyncAPI Document** is valid, it manipulates the document and returns a set of helper functions and properties and bundles them together into an **asyncapi** variable that is an instance of [**AsyncAPIDocument**](https://github.com/asyncapi/parser-js/blob/master/API.md#module_@asyncapi/parser+AsyncAPIDocument). The **asyncapi** helper functions make it easier to access the contents of the AsyncAPI Document.
5. At this point, the **Generator** passes the **[asyncapi](asyncapi-file.md#method-2-asyncapi-and-template)**, the **[originalAsyncAPI](asyncapi-file.md#method-1-originalasyncapi-and-template)**, and the **params** which collectively make up the **[Template Context](asyncapi-context.md)** to the **Render Engine**. 
6. AsyncAPI has two **Render Engines**([react](react-render-engine.md) and [nunjucks](nunjucks-render-engine.md). Depending on which one you've specified in your `package.json`, the generator knows the right **Render Engine** to pass both the **Template Files** and the **Template Context**.
7. Once the **Render Engine** receives the **Template Files** and the **Template Context**, it injects all the dynamic values in your react or nunjucks based **Template Files** using the **Template Context**. As a result, the **Render Engine** generates **markdown**, **pdf**, **boilerplate code**, and **anything else** you specified to be generated as output.

> You can generate anything you want using the Generator as long as it can be defined in a **Template**.

The diagram below depicts the entire process of passing the **Template** and **AsyncAPI Document** to the AsyncAPI Generator tool, how the Generator uses these inputs to generate the desired output, and example outputs you can get from the render engine.

``` mermaid
graph LR
    A[Template Context]
    B{Generator}
    C[Parser]
    D[Render Engine]
    E[AsyncAPI Document] --> B
    F[Template] --> B
  subgraph Generator Library
    B -->| asyncapiString | C
    C --> | asyncapi | A
    B--> | originalAsyncAPI | A
    B--> | params | A
    A --> D
    B --> | Template Files | D
  end
  D --> O[HTML]
  D --> M[Markdown]
  D --> N[Node.js]
  D --> J[Java Spring Boot]
  D --> K[Anything else]
  ```
**`params`** are template-specific options that you can pass during generation to customize generation result.