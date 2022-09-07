---
title: "Generator Version vs Template Version"
weight: 60
---
< Should I link about the list of existing templates>
The generator tool is used to generate whatever you want based on an [AsyncAPI specification file](asyncapi-file.md). The template on the other hand is a file or group of files that specify the kind of output you want from using the generators features. For example you may want to generate boilerplate code for your message based API using the [nodejs template](https://github.com/asyncapi/nodejs-template). 
The templates are dependent on the generators' features and therefore the template you want to use for example, may be compatible with the latest version of the generator and incompatible with the previous versions. The author of the template specifies in the configuration file or ReadMe what versions of the generator the template is compatible with. If the version of the generator you have installed isn't compatible with the template you want to use, the generator wont work. In such a scenario, you will see an error output similar to the following:
```
Something went wrong:
Error: This template is not compatible with the current version of the generator (0.50.0). This template is compatible with the following version range: >=0.60.0 <2.0.0.
    at Generator.validateTemplateConfig (/Users/wookiee/.nvm/versions/node/v12.16.1/lib/node_modules/@asyncapi/generator/lib/generator.js:678:13)
    at Generator.loadTemplateConfig (/Users/wookiee/.nvm/versions/node/v12.16.1/lib/node_modules/@asyncapi/generator/lib/generator.js:663:16)
    at Generator.generate (/Users/wookiee/.nvm/versions/node/v12.16.1/lib/node_modules/@asyncapi/generator/lib/generator.js:146:18)
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
    at async /Users/wookiee/.nvm/versions/node/v12.16.1/lib/node_modules/@asyncapi/generator/cli.js:135:7
```
> :bulb: **Remember:** 
>Use the following command to check the version of the generator installed in the AsyncAPI Generator CLI `ag --version`

In case you use Generator CLI and a specific template on production, it is safer to lock to a specific version of the template and the Generator.

Instead of generating HTML with latest html-template and the generator CLI:
```
npm install -g @asyncapi/generator
ag asyncapi.yaml @asyncapi/html-template -o ./docs
```
Generate HTML with the version of the html-template and the Generator CLI that you are happy with:
```
npm install -g @asyncapi/generator@0.50.0
ag asyncapi.yaml @asyncapi/html-template@0.7.0 -o ./docs
```
Before using newer versions of the template, always look at the [changelog](https://github.com/asyncapi/html-template/releases) first. if the generator's features are not important for you, just make sure to use a version compatible with the template.