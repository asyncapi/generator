---
title: "Installation Guide"
weight: 10
---


There are various ways you can use the Generator library to generate whaterver you want in your event driven architecture apps. Find your prefered method below:
- [1. Using the AsyncAPI Generator CLI](#1-using-the-asyncapi-generator-cli)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Updating the AsyncAPI Generator CLI](#updating-the-asyncapi-generator-cli)
  - [Uninstall the AsyncAPI Generator CLI](#uninstall-the-asyncapi-generator-cli)
- [2. Use the Generator Library In Your Node.js Apps](#2-use-the-generator-library-in-your-nodejs-apps)
  - [Prerequisites](#prerequisites-1)
 
## 1. Using the AsyncAPI Generator CLI
The CLI tool allows you to generate message-based API boilerplate code, documentation or anything else you need as long as you specify it in your [template](template.md). To use the Generator via the CLI with your event driven architecture, you will need to install the AsyncApi Generator CLI tool in your local development environment.

### Prerequisites
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

### Installation

The recommended method to interact with the generator tool is by using its CLI. To use the CLI, install it  using the following `npm` command:
```
npm install -g @asyncapi/generator
```

To install a specific version of the generator tool, pass the version during installation:
```
npm install -g @asyncapi/generator@{version}
```
> :memo: **Note:** 
> Each template that has been developed is dependent on a certain version of the generator for it to work correctly. So before you install the generator CLI, check the templates' WIKI for the version of the Generator CLI your template is compatible with. To learn more about the generator version and how it correlates to the template you use check the [versioning docs](versioning.md)

### Updating the AsyncAPI Generator CLI
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

### Uninstall the AsyncAPI Generator CLI
To uninstall the generator, use the following command:
```
npm uninstall @asyncapi/generator -gnpm uninstall @asyncapi/generator -g
```

> **Note:** If you want to use the Generator CLI in your CI/CD pipeline to automate whatever you want generated for your event driven architecture apps, install the AsyncAPI Generator CLI in your pipeline. Incase you are using Github Actions, you can use [Github Actions for Generator](https://github.com/marketplace/actions/generator-for-asyncapi-documents)

## 2. Use the Generator Library In Your Node.js Apps
You can use the generator library in your Nodejs projects by installing it using the `npm install @asyncapi/generator` command withing your nodejs project.

### Prerequisites
Check the [prerequisites](#prerequisites) above before you install the Generator CLI in your project.