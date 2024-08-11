--
title: "Depreciation of nunjucks render engine"
weight: 170
---

# Migration Guide from nunjucks render engine to react render engine

## Introduction

AsyncAPI Generator is moving away from Nunjucks templates in favor of React templates. This guide will help you migrate your existing Nunjucks templates to React.

## Step-by-Step Migration Guide

### 1. Update package.json

Change your template configuration in `package.json`:

```json
{
"generator": {
"renderer": "react"
}
}
```

### 2. Install Dependencies

Install the necessary React dependencies:

```bash
npm install @asyncapi/generator-react-sdk
```

### 3. Basic Template Structure

Nunjucks:
```jsx
<h1>{{ asyncapi.info().title() }}</h1>
<p>{{ asyncapi.info().description() }}</p>
```

React:
```jsx
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

### 4. Macros

Replace macros with React components:

Nunjucks:
```jsx
{% macro renderChannel(channel) %}
  <div class="channel">
    <h3>{{ channel.address() }}</h3>
    <p>{{ channel.description() }}</p>
  </div>
{% endmacro %}

{{ renderChannel(someChannel) }}
```

React:
```jsx
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
        <Channel key={channel.address()} channel={channel} />
      ))}
    </File>
  );
}
```

### 5. File template 

//TODO: we can add a link to Florence docs once it is merged

## Testing Your Migration

After migrating, test your template thoroughly:

1. Run the generator with your new React template
2. Compare the output with the previous Nunjucks template output
3. Check for any missing or incorrectly rendered content

## Conclusion

Migrating from Nunjucks to React templates may require some initial effort, but it will result in more maintainable. You can read why we introduced react render engine [here](https://www.asyncapi.com/blog/react-as-generator-engine)