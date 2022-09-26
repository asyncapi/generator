---
title: "Installation Guide"
weight: 10
---

You can use the Generator library to generate whatever you want in your event-driven architecture apps. Find your preferred method below:
- [Generator CLI](#generator-cli)
- [Use the Generator Library in Node.js Apps](#2-use-the-generator-library-in-your-nodejs-apps)
  
## Prerequisites
Before you install and use the AsyncAPI CLI and the generator library, ensure you meet the prerequisites below, then [install the CLI](#installation).
1. Node.js v12.16 and higher
2. Npm v6.13.7 and higher
   
To verify the versions of node and npm you have, run the following command on your terminal:
```
npm -v
```
```
node -v
```

If you don't have either Node or Npm installed, use the [official node.js installer](https://nodejs.org/en/download/).

If you have the correct versions installed, proceed to the CLI installation guide below. Otherwise, upgrading the npm or node version is lower than the recommended versions specified above.

## Generator CLI
The CLI tool allows you to generate message-based API boilerplate code, documentation, or anything else you need as long as you specify it in your [template](template.md). To use the Generator via the CLI, you will need to install the AsyncApi Generator CLI tool in your local development environment.

### Installation

The recommended method to interact with the generator tool is its CLI. To use the CLI, install it  using the following `npm` command:
```
npm install -g @asyncapi/generator
```

To install a specific version of the generator tool, pass the version during installation:
```
npm install -g @asyncapi/generator@{version}
```
> :bulb: **Remember:** 
> Each [community developed template](https://github.com/search?q=topic%3Aasyncapi+topic%3Agenerator+topic%3Atemplate) is dependent on a certain version of the generator for it to work correctly. Before you install the generator CLI, check the templates' `package.json` for the version of the Generator CLI your template is compatible with. To learn more about the generator version and how it correlates to the template you use check the [versioning docs](versioning.md).

### Update Generator CLI
There are several reasons why you might want to update your generator version:
1. You have the generator tool installed but you want to use the latest released features. To upgrade to the latest version, use the command below:
```
npm install -g @asyncapi/generator
```
2. Your template might not be compatible with the latest generator version so you update to a specific version of the generator. Check the [version you need](https://github.com/asyncapi/generator/releases) and specify the version you want to use using the **@** symbol as shown in the command below:
```
npm install -g @asyncapi/generator@{version}
```
> Sometimes you have to force additional npm installation like this: `npm install -g --force @asyncapi/generator`

### Uninstall Generator CLI
To uninstall the generator, use the following command:
```
npm uninstall @asyncapi/generator -gnpm uninstall @asyncapi/generator -g
``` 

> :memo: **Note:**  If you want to use the Generator CLI in your CI/CD pipeline to automate whatever you want generated for your event driven architecture apps, install the AsyncAPI Generator CLI in your pipeline. Incase you are using Github Actions, use [Github Actions for Generator](https://github.com/marketplace/actions/generator-for-asyncapi-documents).

## Generator Library in Node.js Apps
To use the generator library in your Node.js projects by installing it using the `npm install @asyncapi/generator` command withing your Node.js project.

> Don't include the `-g` flag in the installation command above since you're not installing the generator library globally but in your individual Node.js project.
