--
title: "Migration guide from nunjucks render engine"
weight: 170
---

## Migration Guide from nunjucks render engine to react render engine

### Introduction

The asyncAPI generator is moving away from Nunjucks templates in favor of React templates. This guide will help you migrate your existing Nunjucks templates to React.

### Step-by-step migration guide

#### 1. Update package.json

Change your template configuration in `package.json`:

```json
{
"generator": {
"renderer": "react"
}
}
```

#### 2. Install dependencies

Install the necessary React dependencies:

```bash
npm install @asyncapi/generator-react-sdk
```

#### 3. File naming
In Nunjucks, the template's filename directly corresponds to the output file. For example, a template named index.html will generate an index.html file.

In React, the filename of the generated file is not controlled by the file itself, but rather by the File component. The React component itself can be named anything with a `.js` extension, but the output file is controlled by the `name` attribute of the File component:

#### 4. Basic template structure

Nunjucks:
```js
<h1>{{ asyncapi.info().title() }}</h1>
<p>{{ asyncapi.info().description() }}</p>
```

React:
```js
import { File } from '@asyncapi/generator-react-sdk';

export default function({ asyncapi }) {
  return (
    <File name="index.html">
      <h1>{asyncapi.info().title()}</h1>
      <p>{asyncapi.info().description()}</p>
    </File>
  );
}
```

#### 5. Macros

Replace macros with React components:

Nunjucks:
```js
{% macro renderChannel(channel) %}
  <div class="channel">
    <h3>{{ channel.address() }}</h3>
    <p>{{ channel.description() }}</p>
  </div>
{% endmacro %}

{{ renderChannel(someChannel) }}
```

React:
```js
// components/Channel.js
import { Text } from '@asyncapi/generator-react-sdk';

export function Channel({ channel }) {
  return (
    <Text>
      <div className="channel">
        <h3>{channel.address()}</h3>
        <p>{channel.description()}</p>
      </div>
    </Text>
  );
}

// Main template
import { File, Text } from '@asyncapi/generator-react-sdk';
import { Channel } from './components/Channel';

export default function({ asyncapi }) {
  return (
    <File name="channels.html">
      <Text>
        <h2>Channels</h2>
      </Text>
      {asyncapi.channels().map(channel => (
        <Channel channel={channel} />
      ))}
    </File>
  );
}
```

#### 6. File template 

//TODO: we can add a link to Florence docs once it is merged

### Testing your migration

After migrating, test your template thoroughly:

1. Run the generator using your new React template
2. Compare the output with the previous Nunjucks template output
3. Check for any missing or incorrectly rendered content

### Conclusion

Migrating from Nunjucks to React templates may require some initial effort, but it will result in more maintainable. You can learn more about why we introduced ther React render engine [here](https://www.asyncapi.com/blog/react-as-generator-engine)