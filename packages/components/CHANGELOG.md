# @asyncapi/generator-components

## 0.4.0

### Minor Changes

- 715c1d2: Centralize reusable README components for consistent template rendering across languages

## 0.3.1

### Patch Changes

- 91735c3: Fix invalid Java method name generation and properly handle multiple WebSocket handlers

  - Generate valid Java method names for WebSocket operation handlers with strange identifiers.
  - Produce distinct @OnTextMessage handler methods for each send operation and add safe default routing for unrecognized messages.
  - Update onClose/onOpen formatting.

## 0.3.0

### Minor Changes

- 62d1eda: Introduced new WebSocket client template components in `@asyncapi/generator-components`:

  - **RegisterErrorHandler** ([PR #1675](https://github.com/asyncapi/generator/pull/1675))
  - **QueryParamsVariables** ([PR #1709](https://github.com/asyncapi/generator/pull/1709))
  - **SendOperations** ([PR #1715](https://github.com/asyncapi/generator/pull/1715))
  - **Connect**, **OnClose**, **OnOpen**, **OnError**, and **OnMessage** ([PR #1717](https://github.com/asyncapi/generator/pull/1717))

## 0.2.0

### Minor Changes

- 32c321b: Initial release of `@asyncapi/generator-components` and `@asyncapi/generator-helpers` to make them available for `@asyncapi/generator`
