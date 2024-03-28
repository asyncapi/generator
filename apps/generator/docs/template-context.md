---
title: "Template context"
weight: 100
---

While using the generator tool, you may want dynamic values populated to your templates and rendered in the output. The generator can achieve that using the **template context**.
The **template context** allows you to access the contents of the [AsyncAPI document](asyncapi-document.md) and inject dynamic values to the template files passed to the asyncAPI CLI during the generation process. The render engine then displays these dynamically assigned values in the output.

## Generation process
1. The **Generator** receives **Template** and **params** as input.
2. The **Generator** sends to the **Parser** the **asyncapiString** which is a stringified version of the original **AsyncAPI document**. 
3. The **Parser** validates the format of the **asyncapiString** using OpenAPI, RAML, or Avro schemas.
4. If the **asyncapiString** is valid, the **parser** manipulates it, returns a set of helper functions and properties, and bundles them into an **asyncapi** variable. The **asyncapi** variable is an instance of the **AsyncAPI document**. The helper functions and properties make it easier to access the contents of the **AsyncAPI document** in the template.
5. The **Generator** then passes the **params**, which are template-specific options used to customize the output, the **Template files**, and the **asyncapi** which collectively make up the **Template Context**.
6. The **Template Context** is then passed to the **Render Engine**. The **Render Engine** then injects all the dynamic values from the **Template Context** into the **Template files**.
   
``` mermaid
graph LR
    A[Template Context]
    B{Generator}
    C[Parser]
    D[Render Engine]
    E[Template] --> B
    F[Params] --> B
    G[AsyncAPI Document] --> B
  subgraph Generator
    B -->| params | A
    B--> | asyncapiString| C
    B -->| originalAsyncAPI | A
    C --> | asyncapi -> AsyncAPIDocument type | A
    B--> | Template Files | D
    A --> D
  end
```

## Template context
The extra context passed to the render engine during the generation process and made accessible in the templates includes:

- **`originalAsyncAPI`** is a stringified version of the original AsyncAPI document that the user passed to the Generator.
- **`asyncapi`** is a parsed AsyncAPI document with helper functions and properties. You should use it to access document contents e.g `asyncapi.title`.
- **`params`** is an object with all the parameters passed to the Generator by the user.