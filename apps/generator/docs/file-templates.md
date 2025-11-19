---
title: "File templates"
weight: 140
---

## Generating files with the React render engine

The React render engine allows for a more generic way to render multiple files by returning an array of `File` components in the rendering component. This can be particularly useful for complex templates or when you need to generate a large number of files with varying content.

### Example 1: Rendering hardcoded files

The following is a simple hardcoded example of how to render multiple files using the React render engine:

```tsx
import { File} from "@asyncapi/generator-react-sdk";

export default function({ asyncapi }) {
  return [
    <File name={`file1.html`}>Content</File>,
    <File name={`file2.html`}>Content</File>
  ]
}
```

### Example 2: Rendering files based on the AsyncAPI Schema

In practice, to render the multiple files, that are generated from the data defined in your AsyncAPI, you'll iterate over the array of schemas and generate a file for each schema as shown in the example below:

```js
import { File} from "@asyncapi/generator-react-sdk";

/*
 * To render multiple files, it is enough to return an array of `File` components in the rendering component, like in following example.
 */
export default function({ asyncapi }) {
  const schemas = asyncapi.allSchemas();
  const files = [];
  // schemas is an instance of the Map
  schemas.forEach((schema) => {
    
    files.push(
      // We return a react file component and each time we do it, the name of the generated file will be a schema name
      // Content of the file will be a variable representing schema
      <File name={`${schema.id()}.js`}>
        const { schema.id() } = { JSON.stringify(schema._json, null, 2) }
      </File>
    );
  });
  return files;
}
```

### Example 3: Rendering files for each channel

Additionally, you can generate multiple files for each channel defined in your AsyncAPI specification using the React render engine as shown in the example below:

```js
import { File, Text } from "@asyncapi/generator-react-sdk";


export default function ({ asyncapi }) {
  const files = [];

  // Generate files for channels
  asyncapi.channels().forEach((channel) => {
    const channelName = channel.id();

    files.push(
      <File name={`${channelName}.md`}>
        <Text newLines={2}># Channel: {channelName}</Text>
        <Text>
          {channel.hasDescription() && `${channel.description()}`}
        </Text>
      </File>
    );
  });
  return files;
}
```
The code snippet above uses the `Text` component to write file content to the `.md` markdown file. The `newline` property is used to ensure that the content isn't all rendered in one line in the markdown file. In summary, the code snippet above is a practical guide on generating properly formatted multiline Markdown files for each channel in an AsyncAPI document.

> You can see an example of a file template that uses the React render engine [here](https://github.com/asyncapi/template-for-generator-templates/blob/master/template/schemas/schema.js).
