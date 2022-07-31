---
title: "AsyncAPI Specification File"
weight: 20
---

### What is the Asyncapi Specification?
The **AsyncAPI specification** defines a standard, protocol-agnostic interface that describes message-based or event-driven APIs. The AsyncAPI specification allows people or machines communicating with one another, to understand the capabilities of an event-driven APIs without requiring access to the source code, documentation or inspecting the network traffic.

The specification allows you to define the structure and format of your API including the channels the end user can subscribe to and the format of the messages they will be receiving.

This specification file when fed as an input to the generator library using the *asyncAPI CLI command, shown in the code snippet below, will generates API documentation(how to use the API) or generate API boilerplate code, also refered to as the template, with it.(TBD)

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

The generator library receives the template and AsyncAPI specification file as inputs. In order to validate that the specification file is valid, the generator passes the stringified version of the original specification document to the [parser](parser.md). if valid, the parser then manipulates the original json/yml specification file into funtions and properties and bundles them together into an **asyncapiDocument**. The generator library then passes the originalapiString, the asyncapiDocument and the extra parameters provided by the user to the renderer engine. The renderer engine renders a template (where the originalapiString, the asyncapiDocument and the extra parameters) can be accessed from by the end user(developer?) from and  writes the generated output into a file.

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
<aside class="info"> To learn more about hooks, check our official documentation [here](hooks.md)

##### How to use the asyncapiString in your template?


#### Method 2: asyncapiDocument+ template ##
Once the specification yml or json is passed as an input to the generator library, it is passed on to the Parser library which then manipulates the file to a more structured document called the [asyncapiDocument](https://github.com/asyncapi/parser-js/blob/master/API.md#module_@asyncapi/parser+AsyncAPIDocument). Once the parser returns the document to the generator, the generator passes it to the renderer engine. The renderer engine will make the asyncapiDocument accessible from your template.

From the template, you can access the documents content for example, to extract the version of the spec file used for your Readme.md, you can do that by running `asyncapiDocument.version()` or to get the message payload you use `asyncapiDocument.allMessages()` method.


In the code snippet below, you'll see how you can access document contents of the asyncapiDocument in your template.

```
  const apiName = asyncapi.info().title();
  const channels = asyncapi.channels();
...
```

> To learn about the various instances you can use to access the documents' content, please check [this file](https://github.com/asyncapi/template-for-generator-templates/blob/master/template/index.js) 


## Advantages of using the asyncApiDocument instaed of the asyncapiString in your template
1. It simplifies the structure of the spec file which is complex and nested.
2. 

Note 2: Mention how you can check to see how these 2 docs are used in the written templates e.g node.js template
Note 3: https://github.com/asyncapi/template-for-generator-templates#template-context
Note 4: Both files are passed to the renderer engines ie React ans nunjucks DONE
Note 5: You get access to these 2 files in the templates you will use DONE
Note 6: Adv of one over the other
Note 7: Link to the parser docs or talk about the parser
Note 8: Show the structure of the asyncapiDocument as a code snippet
Note 9: Listen to the last section of the recording again