---
title: "Installation Guide"
weight: 10
---


To use the AsyncAPI generator, you will need to install the AsyncApi generator CLI tool. The CLI tool allows you to generate message-based API boilerplate code or documentation. This guide will show you how to set up your local development environment to start using the generator library.

## Prerequisites
Before you install and use the AsyncAPI CLI, make sure you meet the prerequisites below then [install the CLI](#installation).
1. Node.js v12.16 and higher
2. Npm v6.13.7 and higher
   
To verify the versions of node and npm you have, run the following command on your terminal:
```
npm -v
```
```
node -v
```

If you don't have either Node or Npm installed, do so using the [official node.js installer](https://nodejs.org/en/download/).

If you have the right versions installed, you can proceed to the CLI installation guide below else, upgrade the version of npm or node if lower than the recommended versions specified above.

> The generator library is tested at the moment against Node 14 and NPM 6. Using newer versions is enabled but we do not guarantee they work well. Please provide feedback on the issues.

## Installation
### npm
The recommended method to interact with the generator tool is by using its CLI. To use the CLI, install the generator using the following `npm` command:
```
npm install -g @asyncapi/generator
```

> **Note:** To install a specific version of the generator tool, pass the version during installation:
```
npm install -g @asyncapi/generator@{version}
```

## Updating the generator
You might want to update your version of the generator for various reasons:
1. You have the generator tool installed but you want to use the latest released features. To upgrade to the latest version, use the command below:
```
npm install -g @asyncapi/generator
```
2. Your template might not be compatible with the latest generator version so you update to a specific version of the generator. Check the [version you need](https://github.com/asyncapi/generator/releases) and specify the version you want to use using the **@** symbol as shown in the command below:
```
npm install -g @asyncapi/generator@{version}
```
> Sometimes you have to force additional npm installation like this: `npm install -g --force @asyncapi/generator`