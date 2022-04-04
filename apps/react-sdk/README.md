[![AsyncAPI React SDK](./assets/readme-banner.png)](https://www.asyncapi.com)

AsyncAPI React SDK is a set of components/functions to use React as render engine in the [Generator](https://github.com/asyncapi/generator).

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Installation](#installation)
- [How it works](#how-it-works)
  * [The Transpile Process](#the-transpile-process)
  * [The Rendering Process](#the-rendering-process)
    + [Requirements](#requirements)
- [The debug flag](#the-debug-flag)
- [Example](#example)
- [Resources](#resources)
- [Development](#development)
- [Contributing](#contributing)

<!-- tocstop -->

## Installation

Run this command to install the SDK in your project:

```bash
npm install --save @asyncapi/generator-react-sdk
```

## How it works

The process of creating content from React components consists of two main process: transpile and rendering.

### The Transpile Process

The SDK has a custom transpiler which ensures that any directory are transpiled using [Rollup](https://www.npmjs.com/package/rollup). Rollup helps bundling all dependencies and transpile them into CommonJS modules. This is required because this library will be used through NodeJS which does not understand these new modules natively and we do not want to limit the developer in which syntax they prefer nor how they want to separate code.

### The Rendering Process

SDK has its own reconciler for React components. It traverses through each element in the template structure and transforms it into a pure string. Additionally, prop `children` is also converted to a regular string and stored in the` childrenContent` prop, which is appended to each component. See [example](#example).

Restrictions:

- React hooks is not allowed.
- HTML tags at the moment is not supported.
- React internal components like Fragments, Suspense etc. are skipped.

#### Requirements

To render the transpiled template SDK requires:

* Node.js v12.16 and higher

## The debug flag

When rendering you have the option of passing a `debug` flag which does not remove the transpiled files after the rendering process is done.

## Example

```js
import { Text, Indent, IndentationTypes, render } from '@asyncapi/generator-react-sdk';

class ClassComponent extends React.Component {
  constructor(props) { 
    super(props);
  }

  render() {
    // In `childrenContent` prop is stored `text wrapped by custom component\n\n`.
    // The content of the `children` prop is transformed to string and saved to the `childrenContent` prop.
    return this.props.childrenContent;
  }
}

function FunctionComponent() {
  return (
    <Indent size={3} type={IndentationTypes.TABS}>
      indented text
      <ClassComponent>
        <Text newLines={2}>
          text wrapped by custom component
        </Text>
      </ClassComponent>
    </Indent>
  );
}

// content will be `\t\t\tindented text text wrapped by custom component\n\n`
const content = render(<FunctionComponent />);
```

## Resources

- [`template-for-generator-templates`](https://github.com/asyncapi/template-for-generator-templates) template showcases features of [the AsyncAPI Generator](https://github.com/asyncapi/generator), including the React renderer. It shows how to write templates, reusable parts (components), what are the recommended patterns. It has simple and complex examples of using `React`.
- [`markdown-template`](https://github.com/asyncapi/markdown-template) is written using React. It generates documentation into a Markdown file.

For more help join our [Slack](https://www.asyncapi.com/slack-invite/) workspace.

## Development

1. Setup project by installing dependencies `npm install`
2. Write code and tests.
3. Make sure all tests pass `npm test`
4. Make sure code is well formatted and secure `npm run lint`

## Contributing

Read [CONTRIBUTING](https://github.com/asyncapi/.github/blob/master/CONTRIBUTING.md) guide.
