---
title: "React render engine"
weight: 110
---

[React](https://reactjs.org) is the render engine and sole rendering engine used by the AsyncAPI generator.

* It enables the possibility of [debugging](#debugging-react-template) your template.
* It provides better error stack traces.
* Provides better support for separating code into more manageable chunks/components.
* The readability of the template is much better.
* Better tool support for development.
* Introduces testability of components.

When writing React templates you decide whether to use CommonJS, ES5, or ES6 modules since everything is bundled together before the rendering process takes over. We use our own React renderer which can be found in the [Generator React SDK](https://github.com/asyncapi/generator-react-sdk). 
There you can find information about how the renderer works or how we transpile your template files.

Your React template always requires `@asyncapi/generator-react-sdk` as a dependency. `@asyncapi/generator-react-sdk` is required to access the `File` component which is required as a root component for a file to be rendered. Furthermore, it provides some common components to make your development easier, like `Text` or `Indent`.

Let's consider a basic React template as the one below called `MyTemplate.js`:

```js
import { File, Text } from "@asyncapi/generator-react-sdk";

export default function({ asyncapi, params, originalAsyncAPI }) {
  return (
    <File name="asyncapi.md">
      <Text>Some text that should render as is</Text>
    </File>
  );
}
```

The exported default function returns a `File` component as a root component which the generator uses to determine what file should be generated. In our case, we overwrite the default functionality of saving the file as `MyTemplate.js` but instead use the filename `asyncapi.md`. It is then specified that we should render `Some text that should render as is\n` within that file. Notice the `\n` character at the end, which is automatically added after the `Text` component. 

For further information about components, props, etc, see the [Generator React SDK](https://github.com/asyncapi/generator-react-sdk)

### Common assumptions

1. Generator renders all files located in the `template` directory if they meet the following conditions:
    - `File` is the root component
    - The file is not in the list of `nonRenderableFiles` in the template configuration
1. New lines are automatically added after each `Text` component.
1. The props you have access to in the rendering function are:
   - `asyncapi` which is a parsed spec file object. Read the [API](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#asyncapidocument) of the Parser to understand what structure you have access to in this parameter.
   - `originalAsyncAPI` which is an original spec file before it is parsed. 
   - `params` that contain the parameters provided when generating.
1. All the file templates are supported where the variables are provided after the default props as listed above. 