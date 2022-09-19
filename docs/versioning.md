---
title: "Generator Version vs Template Version"
weight: 60
---

The generator tool generates whatever you want, as long as it can be defined in a template, based on the [AsyncAPI specification file](asyncapi-file.md). On the other hand, a **template** is a file or group of files that specify the kind of output you expect from using the generators features. For example, you may want to use the [nodejs template](https://github.com/asyncapi/nodejs-template) to build boilerplate code for your message based APIs.

Templates are dependent on the generators' features. For example, the template you want to use may be compatible with the latest version of the generator but incompatible with the previous versions. Check the configuration file or ReadMe of the template to see the version of the Generator it supports. The generator won't work if the the version you have installed isn't supported by the template you want to use. In such a scenario, you will see an error output similar to the following on your terminal:
```
Something went wrong:
Error: This template is not compatible with the current version of the generator (0.50.0). This template is compatible with the following version range: >=0.60.0 <2.0.0.
    at Generator.validateTemplateConfig (/Users/wookiee/.nvm/versions/node/v12.16.1/lib/node_modules/@asyncapi/generator/lib/generator.js:678:13)
    at Generator.loadTemplateConfig (/Users/wookiee/.nvm/versions/node/v12.16.1/lib/node_modules/@asyncapi/generator/lib/generator.js:663:16)
    at Generator.generate (/Users/wookiee/.nvm/versions/node/v12.16.1/lib/node_modules/@asyncapi/generator/lib/generator.js:146:18)
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
    at async /Users/wookiee/.nvm/versions/node/v12.16.1/lib/node_modules/@asyncapi/generator/cli.js:135:7
```

> Use the following command to check the version of the AsyncAPI Generator CLI you have installed;  `ag --version`

It is better to lock to a specific version of the template and the Generator if you plan to use the Generator CLI and a particular template in production. The differences between using the version of the Generator CLI you have installed and locking a certain version on production are demonstrated in the following code snippets.

To generate HTML with latest AsyncAPI Generator CLI using the html-template.
```
npm install -g @asyncapi/generator
ag asyncapi.yaml @asyncapi/html-template -o ./docs
```

To generate HTML using a partcular version of the AsyncAPI Generator CLI using the html-template.

```
npm install -g @asyncapi/generator@0.50.0
ag asyncapi.yaml @asyncapi/html-template@0.7.0 -o ./docs
```

> Before using newer versions of the template, always look at the [changelog](https://github.com/asyncapi/html-template/releases) first. if the generator's features are not important for you, just make sure to use a version compatible with the template.