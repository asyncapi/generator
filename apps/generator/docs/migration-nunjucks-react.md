---
title: "Migrating from Nunjucks to React render engine"
weight: 250
---

The AsyncAPI Generator is moving away from Nunjucks templates in favor of React templates. This guide will help you migrate your existing Nunjucks templates to React. For a comprehensive understanding of why we introduced React as an alternative in 2021 and why we're now removing Nunjucks entirely, please read our article [React as a Generator Engine](https://www.asyncapi.com/blog/react-as-generator-engine). The principles discussed in this article still apply to our current transition.

## Step-by-step migration guide

### 1. Update package.json

Change your template configuration in `package.json`:

```json
{
"generator": {
"renderer": "react"
}
}
```

Once the deprecation period has ended, and we remove the default Nunjucks, the React render engine will be used by default and this setting will no longer be needed to configure

### 2. Install dependencies

Install the necessary React dependencies:

```bash
npm install @asyncapi/generator-react-sdk
```

### 3. File naming

In Nunjucks, the template's filename directly corresponds to the output file. For example, a template named **index.html** will generate an **index.html** file.

In React, the filename of the generated file is not controlled by the file itself, but rather by the `File` component. The React component itself can be named anything with a `.js` extension because the output filename is controlled by the `name` attribute of the `File` component used inside the template file. Below you can see some examples of filenames: 

Nunjucks: `index.html`
React: `index.js` or `index.html.js` or `anything-you-want.js`

### 4. Basic template structure

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

### 5. Macros and Partials

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

### 6. File template 

Check the [detailed guide on file templates](file-templates) to learn what is the difference between templating multiple file outputs in Nunjucks and React.

### 7. Models generation

If you have a template written with Nunjucks, it is almost certain that you have your own custom models, classes, or types templates in place. Instead of migrating them to React render engine we strongly advise you to delegate models generation to AsyncAPI Modelina project. Learn more about [how to add models generation using Modelina](https://www.asyncapi.com/docs/tools/generator/model-generation).

## Additional Resources and Information

### Template Examples
For a complete example of React features in use, please refer to the [AsyncAPI Template for Generator Templates](https://github.com/asyncapi/template-for-generator-templates). The `master` branch demonstrates all React features, while the `nunjucks` branch shows the old Nunjucks implementation. This comparison can be particularly helpful in understanding the differences and migration process.

### Filters to Helpers
If you've been using Nunjucks filters placed in the `filters` directory, you can still use this functionality in React. However, they should be treated as normal functions that you import into your components. We recommend renaming the `filters` directory to `helpers` to better reflect their new usage in React.

### Hooks Remain Unchanged
It's important to note that hooks remain unchanged in this migration process. Hooks are not related to the render engine functionality, so you can continue to use them as you have been.

### Testing your migration

After migrating, test your template thoroughly:

1. Run the generator using your new React template
2. Compare the output with the previous Nunjucks template output
3. Check for any missing or incorrectly rendered content

Consider implementing snapshot tests for your template before starting the migration. This will ease the review of changes in comparing the content rendered after render engine changes. Snapshot tests allow you to have tests that will persist expected output from Nunjucks template, and compare it with output generated after the migration. Check out an [example of such snapshot integration test for our internal react template we use for development and testing](https://github.com/asyncapi/generator/blob/master/apps/generator/test/integration.test.js#L66).

## Conclusion

Migrating from Nunjucks to React templates may require some initial effort, but it will result in more maintainable code. You can learn more about why we introduced the React render engine from article [React as a Generator Engine](https://www.asyncapi.com/blog/react-as-generator-engine).