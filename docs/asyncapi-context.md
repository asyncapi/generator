---
title: "Template Context"
weight: 80
---

While using the Generator you may want dynamic values to be populated to your templates and thus be rendered in the output. Generator is able to achieve that using the template context.
The **template context** allows you to inject dynamic values to the template files passed to the asyncAPI CLI during the generation process. The render engine will then display these dynamically assigned values in the output.

## Template context generation process

``` mermaid
graph LR
    A[Template Context]
    B{Generator}
    C[Parser]
    D[Render Engine]
    E[Template] --> B
    F[Params] --> B
  subgraph Generator
    B -->| params | A
    B--> | asyncapiString| C
    C --> | asyncapi -> AsyncAPIDocument type | A
    B--> | Template Files | A
    A --> D
  end
```

