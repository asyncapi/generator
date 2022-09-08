---
title: "Introduction"
weight: 10
---
The [specification file](asyncapi-file.md), when fed as an input to the generator library via the AsyncAPI CLI command, shown in the code snippet below, will generate API documentation or generate message-based API boilerplate code.

```bash
ag asyncapi.yaml ~/my-template
```
1. **ag** is the AsyncAPI generator
2. **asyncapi.yaml** is the specification file
3. **~/my-template** is the template you are using

> :bulb: **Note:** 
If you haven't set up the AsyncAPI CLI tool, please refer to our [AsyncAPI CLI installation guide](installation.md)

### The generation process
1. The **Generator** receives the [template](template.md) and [AsyncAPI specification file](asyncapi-file.md) as inputs. 
2. To validate the JSON/YAML AsyncAPI specification file, the generator passes the stringified version of the original specification document to the [AsyncAPI Parser](parser.md). 
3. The parser validates the AsyncAPI specification. To parse and validate custom schemas of messages' payloads, the parser uses additional plugins for either the OpenAPI, RAML, or Avro schemas. 
4. If valid, the parser then manipulates the original JSON/YAML AsyncAPI file and returns functions and properties that enable easier access to file contents, bundling them together into an **asyncapiDocument**. 
5. At this point, the generator library passes the **original apiString**, the **asyncapiDocument**, and the **extra parameters** which collectively make up the [template context](asyncapi-context.md). 
6. The generator passes the **Template Context** to the render engine, therefore, making it accessible in the templates.
7. Either the [react](react-render-engine.md) or [nunjucks](nunjucks-render-engine.md) **Render Engine** renders a template using all the data injected with **Template Context**.
8. One the generator receives the template as an input, the generator provides all the **template files** that are generated using the available generator features to the render engine. These generated files are then used by the user in the template.

### The rendering process
1. AsyncAPI has two **render engines**(react and nunjucks) and depending on whichever one of them you've specified in your `package.json` the generator will be able to know the right render engine to pass the **template files** and the **template context**.
2. The **render engine** will then be responsible for populating all the dynamic values in your react or nunjucks **template files** using the **template context** it receives from the generator tool. 
3. As a result, the render engine will genarte **markdown**, **pdf**, **boilerplate code** and **anything else you want generated** as output.

The diagram below depicts the entire process of passing the template and specification file as arguments to the AsyncAPI CLI tool, and how the generator library then uses these inputs to generate the output you need and the kind of output you can get from the render engine.

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
### Use cases of the Generator
- Generation of interactive and clear API documentation.
- Generation of message-based APIs boilerplate code.
- Validation of messages the client receives using the JSON schema that defines validation rules for your objects in the spec file. 
- Application of API management policies to messages before they arrive to the broker.