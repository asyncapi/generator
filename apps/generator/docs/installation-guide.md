---
title: "Installation guide"
weight: 20
---

You can use the generator library to generate whatever you want in your event-driven architecture apps. Find your preferred method below:
- [AsyncAPI CLI](#asyncapi-cli)
- [Generator library in Node.js apps](#generator-library-in-nodejs-apps)
  
## Prerequisites
Before you install and use the AsyncAPI CLI and the generator library, ensure you meet the prerequisites below, then [install the CLI](https://www.asyncapi.com/docs/tools/cli/installation).
1. Node.js v18.12.0 or higher
2. Npm v8.19.0 or higher
   
To verify the versions of Node and Npm you have, run the following command on your terminal:
```
npm -v
```
```
node -v
```

If you don't have either Node or Npm installed, use the [official node.js installer](https://nodejs.org/en/download/).

If you have the correct versions installed, proceed to the CLI installation guide below. Otherwise, upgrading the Npm or Node version is lower than the recommended versions specified above.

## AsyncAPI CLI
The AsyncAPI CLI tool allows you to do many different things with the [AsyncAPI document](asyncapi-document). You can generate message-based API boilerplate code, documentation, or anything else you need as long as you specify it in your [template](template) or the existing template already supports it. To use the generator via the AsyncAPI CLI, you need to install the AsyncAPI CLI tool. For the latest installation instructions, visit the official AsyncAPI CLI [installation guide](https://www.asyncapi.com/docs/tools/cli/installation).

> :memo: **Note:**  To use the generator in your CI/CD pipeline to automate whatever you generate for your event-driven architecture apps, install the AsyncAPI CLI in your pipeline. If you are using GitHub Actions, use [Github Actions for Generator](https://github.com/marketplace/actions/asyncapi-cli-action).

## Generator library in Node.js apps
Use the generator library in your Node.js projects by installing it via the following command: `npm install @asyncapi/generator`.

> Don't include the `-g` flag in the installation command above since you're not installing the generator library globally but in your Node.js project.
