---
title: "Introduction"
weight: 10
---

The AsyncAPI Generator is a tool that generates anything you want using the **[AsyncAPI document](asyncapi-file.md)** and **[template](template.md)** that are supplied as inputs to the AsyncAPI Generator. The Generator was built with extensibility in mind; you can use the generator to generate anything you want, provided that it can be defined in a template, such as code, diagrams, markdown files, microservices, and applications. A number of [community-maintained templates](https://github.com/search?q=topic%3Aasyncapi+topic%3Agenerator+topic%3Atemplate) are now available for immediate usage.

### Generator use cases 
- Generation of interactive and understandable API documentation
- Generation of APIs' client libraries
- Generation of APIs' boilerplate code

### Generator advantages
- Quick set up and easy to use on a regular basis
- Effortless generation of complex documents
- Number of AsyncAPI templates

### Generation process
1. The **Generator** receives the **[template](template.md)** and **[AsyncAPI document](asyncapi-file.md)** as inputs. 
2. The **Generator** sends to the **[Parser](parser.md)** the stringified version of the original specification file in order to validate the JSON/YAML **AsyncAPI file**.
3. The **parser** uses additional plugins such as the OpenAPI, RAML, or Avro schemas to validate custom schemas of message payloads defined in the **AsyncAPI file**.
4. If the **parser** determines that the original **AsyncAPI file** is valid, it then manipulates the original JSON/YAML **AsyncAPI file** and returns functions and properties that enable easier access to file contents, bundling them together into an **asyncapi**(asyncapiDocument). 
5. At this point, the **generator** passes the **asyncapi**, the **originalAsyncAPI**, and the **params** which collectively make up the **[template context](asyncapi-context.md)** to the **render engine**. 
6. AsyncAPI has two **render engines**([react](react-render-engine.md) and [nunjucks](nunjucks-render-engine.md)). Depending on which one you've specified in your `package.json`, the generator knows the right render engine to pass both the **template files** and the **template context**.
7. Once the **render engine** receives the **template files** and the **template context**, it injects all the dynamic values in your react or nunjucks based **template files** using the **template context**. As a result, the render engine generates **markdown**, **pdf**, **boilerplate code**, and **anything else** you specified to be generated as output.

> You can generate anything you want using the Generator as long as it can be defined in a **template**.

The diagram below depicts the entire process of passing the **template** and **AsyncAPI document** to the AsyncAPI Generator tool, how the Generator uses these inputs to generate the desired output, and example outputs you can get from the render engine.

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