---
title: "Installation guide"
weight: 20
---

You can use the generator library to generate whatever you want in your event-driven architecture apps. Find your preferred method below:
- [AsyncAPI CLI](#asyncapi-cli)
- [Generator library in Node.js apps](#generator-library-in-nodejs-apps)
  
## Prerequisites
Before you install and use the AsyncAPI CLI and the generator library, ensure you meet the prerequisites below, then [install the CLI](#installation).
1. Node.js v12.16 and higher
2. Npm v6.13.7 and higher
   
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
The AsyncAPI CLI tool allows you to do many different things with the [AsyncAPI document](asyncapi-document). You can generate message-based API boilerplate code, documentation, or anything else you need as long as you specify it in your [template](template) or the existing template already supports it. To use the generator via the AsyncAPI CLI, you need to install the AsyncAPI CLI tool.

### Installation

#### Install AsyncAPI CLI using NPM

The AsyncAPI CLI is a NodeJS project, so the easiest way to install it is by using the following `npm` command:
```
npm install -g @asyncapi/cli
```

To install a specific version of the generator tool, pass the version during installation:
```
npm install -g @asyncapi/cli@{version}
```

#### MacOS 
You can install in MacOS by using brew: `brew install asyncapi`. 

#### Linux 
You can install in Linux by using `dpkg`, a package manager for debian:
1. `curl -OL https://github.com/asyncapi/cli/releases/latest/download/asyncapi.deb`
2. `sudo dpkg -i asyncapi.deb`

#### Other operating systems
For further installation instructions for different operating systems, read the [AsyncAPI CLI documentation](https://github.com/asyncapi/cli#installation).

> **Remember:** 
> Each [community-developed template](https://github.com/search?q=topic%3Aasyncapi+topic%3Agenerator+topic%3Atemplate) is dependent on a certain version of the generator for it to work correctly. Before you install the generator CLI, check the template's `package.json` for the version of the generator CLI your template is compatible with. Read the [versioning docs](versioning) to learn why it's important to use certain generator versions with your templates.

### Update AsyncAPI CLI
There are several reasons why you might want to update your generator version:
* You have the generator tool installed but want to use the latest released features. To upgrade to the latest version, use the command below:
```
npm install -g @asyncapi/cli
```
* If your template isn't compatible with the latest generator version, you can update it to a specific version of the generator. Check the [version you need](https://github.com/asyncapi/cli/releases) and specify the version you want by using the **@** symbol as shown in the command below:
```
npm install -g @asyncapi/cli@{version}
```
> Sometimes you have to force additional npm installation like this: `npm install -g --force @asyncapi/cli`

### Uninstall AsyncAPI CLI
To uninstall the generator, use the following command:
```
npm uninstall @asyncapi/cli -g
``` 

> :memo: **Note:**  To use the generator in your CI/CD pipeline to automate whatever you generate for your event-driven architecture apps, install the AsyncAPI CLI in your pipeline. If you are using GitHub Actions, use [Github Actions for Generator](https://github.com/marketplace/actions/generator-for-asyncapi-documents).

## Generator library in Node.js apps
Use the generator library in your Node.js projects by installing it via the following command: `npm install @asyncapi/generator`.

> Don't include the `-g` flag in the installation command above since you're not installing the generator library globally but in your Node.js project.
