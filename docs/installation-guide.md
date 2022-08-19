---
title: "Installation Guide"
weight: 10
---


## AsyncAPI CLI Installation
In order to use the AsyncAPI generator, you will need to install the AsyncApi generator CLI tool. The CLI tool allows you to generate message-based APIs boilerplate code or documentation. This guide will show you how to set up your local developer environment to start using the generator library.

### Pre-installation
Before you install and use the AsyncAPI CLI, you'll need to have installed:
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

If you have the right versions installed, you can proceed to the CLI installation guide below else, kindly upgrade the versions of your npm or node if lower than the versions specified above.

> The generator library is tested at the moment against Node 14 and NPM 6. Using newer versions is enabled but we do not guarantee they work well. Please provide feedback on the issues.

### Installation
Install the AsyncAPI CLI globally on your computer using the npm command below:
```
npm install -g @asyncapi/cli
```

To install a specific version of the tool, pass the version during installation:
```
npm install -g @asyncapi/generator@{version}
```

#### MacOS
1. **Using Brew**
For MACOS users you can install the CLI using the brew command below:
```
# Install brew 
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# Install AsyncAPI CLI
brew install asyncapi
```
2. **Using pkg**
Each release of CLI produces a MacOS dedicated pkg file that enables you to install this CLI as MacOS application.

```
# Download latest release. To download specific release, your link should look similar to https://github.com/asyncapi/cli/releases/download/v0.13.0/asyncapi.pkg. # # All releases are listed in https://github.com/asyncapi/cli/releases
curl -OL https://github.com/asyncapi/cli/releases/latest/download/asyncapi.pkg
# Install AsyncAPI CLI
sudo installer -pkg asyncapi.pkg -target /
```
#### Updating the CLI
You might want to update the generator CLi for various reasons:
1. You have the generator CLI installed but you want to use the latest released features. To upgrade to the latest version, use the command below:
```
npm install -g @asyncapi/generator
```
1. Your template might not be compatible with the latest generator version so you update to a specific version of the generator. Check the [version you need](https://github.com/asyncapi/generator/releases) and specify the version you want to use using the **@** symbol as shown in the command below:
```
npm install -g @asyncapi/generator@1.9.3
```
> Sometimes you have to force additional npm installation like this: npm install -g --force @asyncapi/generator