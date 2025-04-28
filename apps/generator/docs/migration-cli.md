---
title: "Migrating from `ag` CLI to AsyncAPI CLI"
weight: 260
---

This guide provides detailed instructions on how to transition from the old `ag` Generator CLI  to the new AsyncAPI CLI.

## Options Overview

Here is a list of `ag` options and their equivalents in the AsyncAPI CLI:

- **-d, --disable-hook [hooks...]**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --disable-hook <hookType>=<hookName>`

- **--debug**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --debug`

- **-i, --install**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --install`

- **-n, --no-overwrite &#x3C;glob&#x3E;**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --no-overwrite <glob>`

- **-o, --output &#x3C;outputDir&#x3E;**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --output <outputDir>`

- **-p, --param &#x3C;name&#x3D;value&#x3E;**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --param <name=value>`

- **--force-write**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --force-write`

- **--watch-template**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --watch`

- **--map-base-url &#x3C;url:folder&#x3E;**
  - **AsyncAPI CLI equivalent:** `asyncapi generate fromTemplate <ASYNCAPI> <TEMPLATE> --map-base-url <url:folder>`

## Migration Steps

### 1. Install AsyncAPI CLI

There are multiple different artifacts that AsyncAPI CLI is provided as. Get familiar with the [official CLI installation guide](https://www.asyncapi.com/docs/tools/cli/installation).

### 2. Update Your Commands

Replace the deprecated `ag` commands with the AsyncAPI CLI equivalents. Below are examples of how to update your commands:

**Using `ag`**:
```
ag ./asyncapi.yaml ./template -o ./output -p param1=value1 --debug --install --disable-hook hookType=hookName
```

**Using AsyncAPI CLI**:
```
asyncapi generate fromTemplate ./asyncapi.yaml ./template -o ./output -p param1=value1 --debug --install --disable-hook hookType=hookName
```

Notice that the change basically related to changing from `ag` to `asyncapi generate fromTemplate`.

### 3. Verify and Test

Run the updated commands to ensure they work as expected and verify that the output files are generated correctly.

## Additional Resources

**CLI Documentation**: [AsyncAPI CLI Documentation](https://www.asyncapi.com/docs/tools/cli)
**Installation**: [AsyncAPI CLI Installation](https://www.asyncapi.com/docs/tools/cli/installation)
**Usage**: [AsyncAPI CLI Usage](https://www.asyncapi.com/docs/tools/cli/usage)
**Support**: For any issues with CLI, create an issue in [CLI repository](https://github.com/asyncapi/cli).
