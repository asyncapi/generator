---
title: "Deprecate ag"
weight: 170
---

# Migration Guide from “ag/asyncapi-generator” to AsyncAPI CLI

## Overview
With the introduction of the AsyncAPI CLI, the use of `ag` for documentation generation in the AsyncAPI generator repository is being deprecated. This guide provides detailed instructions on how to transition from `ag` to the new AsyncAPI CLI.

## Why Migrate?
- **Enhanced Features:** The AsyncAPI CLI offers advanced features and improvements.
- **Consistency:** Ensures consistent command usage across different environments.
- **Support and Maintenance:** Future updates and support will focus on the AsyncAPI CLI.

## Deprecated `ag/asyncapi-generator` Options and Their AsyncAPI CLI Equivalents
Here is a list of `ag/asyncapi-generator` options and their equivalents in the AsyncAPI CLI:

- **-d, --disable-hook [hooks...]**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --disable-hook <hookType>=<hookName>`

- **--debug**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --debug`

- **-i, --install**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --install`

- **-n, --no-overwrite <glob>**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --no-overwrite <glob>`

- **-o, --output <outputDir>**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --output <outputDir>`

- **-p, --param <name=value>**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --param <name=value>`

- **--force-write**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --force-write`

- **--watch-template**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --watch`

- **--map-base-url <url:folder>**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --map-base-url <url:folder>`

## Migration Steps

### 1. Install AsyncAPI CLI
First, ensure you have the AsyncAPI CLI installed:
```
npm install -g @asyncapi/cli
```

### 2. Update Your Commands
Replace the deprecated ag commands with their AsyncAPI CLI equivalents. Below are examples of how to update your commands:
**Example Migration**:
**Before Migration (Using ag)**:
```
ag ./asyncapi.yaml ./template -o ./output -p param1=value1 --debug --install --disable-hook hookType=hookName
```

**After Migration (Using AsyncAPI CLI)**:
```
asyncapi generate fromTemplate ./asyncapi.yaml ./template -o ./output -p param1=value1 --debug --install --disable-hook hookType=hookName
```

### 3. Verify and Test
Run the updated commands to ensure they work as expected. Verify the output and ensure that all files are generated correctly.

## Additional Resources
**CLI Documentation**: [AsyncAPI CLI Documentation](https://www.asyncapi.com/docs/tools/cli)
**Installation**: [AsyncAPI CLI Installation](https://www.asyncapi.com/docs/tools/cli/installation)
**Usage**: [AsyncAPI CLI Usage](https://www.asyncapi.com/docs/tools/cli/usage)
**Support**: For any issues or questions, please create an issue in our [CLI repository](https://github.com/asyncapi/cli).

## Conclusion
By following this migration guide, you can smoothly transition from ag to the AsyncAPI CLI, taking advantage of its enhanced features and improved performance. If you have any questions or need further assistance, feel free to contact us.

Happy coding!
