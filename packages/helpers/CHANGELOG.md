# @asyncapi/generator-helpers

## 1.1.0

### Minor Changes

- 11a1b8d: - **Updated Component**: `OnMessage` (Python) - Added discriminator-based routing logic that automatically dispatches messages to operation-specific handlers before falling back to generic handlers

  - **New Helpers**:
    - `getMessageDiscriminatorData` - Extracts discriminator key and value from individual messages
    - `getMessageDiscriminatorsFromOperations` - Collects all discriminator metadata from receive operations
  - Enhanced Python webSocket client generation with **automatic operation-based message routing**:

  ## How python routing works

  - Generated WebSocket clients now automatically route incoming messages to operation-specific handlers based on message discriminators. Users can register handlers for specific message types without manually parsing or filtering messages.
  - When a message arrives, the client checks it against registered discriminators (e.g., `type: "hello"`, `type: "events_api"`)
  - If a match is found, the message is routed to the specific operation handler (e.g., `onHelloMessage`, `onEvent`)
  - If no match is found, the message falls back to generic message handlers
  - This enables clean separation of message handling logic based on message types

  > `discriminator` is a `string` field that you can add to any AsyncAPI Schema. This also means that it is limited to AsyncAPI Schema only, and it won't work with other schema formats, like for example, Avro.

  The implementation automatically derives discriminator information from your AsyncAPI document:

  - Discriminator `key` is extracted from the `discriminator` field in your AsyncAPI spec
  - Discriminator `value` is extracted from the `const` property defined in message schemas

  Example AsyncAPI Schema with `discriminator` and `const`:

  ```yaml
  schemas:
    hello:
      type: object
      discriminator: type # you specify name of property
      properties:
        type:
          type: string
          const: hello # you specify the value of the discriminator property that is used for routing
          description: A hello string confirming WebSocket connection
  ```

  ## Fallback

  When defaults aren't available in the AsyncAPI document, users must provide **both** `discriminator_key` and `discriminator_value` when registering handlers. Providing only one parameter is not supported - you must provide either both or neither.

  > **Why this limitation exists**: When a receive operation has multiple messages sharing the same discriminator key (e.g., all use `"type"` field), we need the specific value (e.g., `"hello"`, `"disconnect"`) to distinguish between them. Without both pieces of information, the routing becomes ambiguous.

  Example:

  ```python
  # Default case - discriminator info auto-derived from AsyncAPI doc
  client.register_on_hello_message_handler(my_handler)

  # Custom case - must provide both key AND value
  client.register_on_hello_message_handler(
      my_handler,
      discriminator_key="message_type",
      discriminator_value="custom_hello"
  )
  ```

## 1.0.1

### Patch Changes

- c5be81a: Enforce new helpers and components release to use latest versions in generator. Required because of the recent misconfiguration of releases and Trusted Publishing.

## 1.0.0

### Major Changes

- df08ae7: ### Breaking Changes

  - You must use Node.js 24.11 or higher, and NPM 11.5.1 or higher
  - Nunjucks renderer removed — React is now the sole rendering engine. No need to specify render engine in config anymore
  - Nunjucks filters package and its public filters removed; filter-based template APIs no longer available.
  - `ag` CLI is no longer available. It was announced some time ago that it would be deprecated, and users are encouraged to switch to the [AsyncAPI CLI](https://github.com/asyncapi/cli/)

  ### Migration Guides

  - [Migrating from Nunjucks to React render engine](https://github.com/asyncapi/generator/blob/%40asyncapi/generator%402.8.4/apps/generator/docs/migration-nunjucks-react.md)
  - [Migrating from `ag` CLI to AsyncAPI CLI](https://github.com/asyncapi/generator/blob/%40asyncapi/generator%402.8.4/apps/generator/docs/migration-cli.md)

## 0.2.0

### Minor Changes

- 32c321b: Initial release of `@asyncapi/generator-components` and `@asyncapi/generator-helpers` to make them available for `@asyncapi/generator`
