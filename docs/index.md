---
title: "Introduction"
weight: 10
---
AsyncAPI Generator is a fast, feature-packed and ready to use Javascript based Npm library. The generator generates whatever you want based on the **[AsyncAPI file](asyncapi-file.md)** and **[template](template.md)** as fed as inputs to the AsyncAPI Generator CLI. Generator has been built with extensibility in mind; you can generate anything you want using the genrator as long as it can be defined in a template e.g code, diagrams, markdown files, microservices and applications etc.  There is also a number of [community-maintained templates](https://github.com/search?q=topic%3Aasyncapi+topic%3Agenerator+topic%3Atemplate) that you can use out of the box.

### Use cases of the Generator
- Generation of interactive and clear API documentation.
- Generation of message-based APIs boilerplate code.

### Benefits of using Generator:

1. Quick set up and easy to use on a regular basis
2. Effortless generation of complex documents
3. List of readily available AsyncAPI templates
4. Support for render engines such as React and Nunjucks

### The generation process
1. The **Generator** receives the **[template](template.md)** and **[AsyncAPI file](asyncapi-file.md)** as inputs. 
2. To validate the JSON/YAML **AsyncAPI file**, the generator passes the stringified version of the original specification file to the **[AsyncAPI Parser](parser.md)**. 
3. The parser validates the AsyncAPI specification. To parse and validate custom schemas of messages' payloads, the parser uses additional plugins for either the OpenAPI, RAML, or Avro schemas. 
4. If valid, the parser then manipulates the original JSON/YAML AsyncAPI file and returns functions and properties that enable easier access to file contents, bundling them together into an **asyncapi**(asyncapiDocument). 
5. At this point, the generator library passes the **asyncapi*, the ****originalAsyncAPI****, and the **params** which collectively make up the **[template context](asyncapi-context.md)**. 
6. The Generator passes the **Template Context** to the **render engine** therefore making it accessible in the templates.
7. Either the [react](react-render-engine.md) or [nunjucks](nunjucks-render-engine.md) **Render Engine** renders a template using all the data injected with **Template Context**. The render engines also get access to the **template files**. 
8. AsyncAPI has two **render engines**(react and nunjucks) and depending on whichever one of them you've specified in your `package.json` the generator will be able to know the right render engine to pass the **template files** and the **template context**.
9.  The **render engine** will then be responsible for populating all the dynamic values in your react or nunjucks **template files** using the **template context** it receives from the generator tool. 
10. As a result, the render engine will generates **markdown**, **pdf**, **boilerplate code** and **anything else you want generated** as output.

> **Note:** 
> You can generate anything you want using the Generator as long as it can be defined in a **template**.

The diagram below depicts the entire process of passing the template and **AsyncAPI file** as arguments to the AsyncAPI Generator CLI tool, and how the generator library then uses these inputs to generate the output you need and the kind of output you can get from the render engine.

``` mermaid
graph LR
    A[Template Context]
    B{Generator}
    C[Parser]
    D[Render Engine]
    E[AsyncAPI File] --> B
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