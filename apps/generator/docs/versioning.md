---
title: "Generator version vs template version"
weight: 70
---

The generator tool generates whatever you want, as long as it can be defined in a template based on the [AsyncAPI document](asyncapi-document). On the other hand, a **template** is a file or group of files that specify the kind of output you expect from using the generator's features. For example, you may want to use the [NodeJS template](https://github.com/asyncapi/nodejs-template) to generate boilerplate code for your message-based APIs.

Templates are dependent on the generators' features. For example, the template you want to use may be compatible with the latest generator version but incompatible with the previous versions. Check the configuration file or ReadME of the template to see the version of the generator it supports. The generator has an `isTemplateCompatible` function that checks if the template is compatible with the version of the generator you want to use. If the template isn't compatible, you will see a terminal error output similar to the following:
```
Something went wrong:
Error: This template is not compatible with the current version of the generator (${generatorVersion}). This template is compatible with the following version range: ${generator}.`)
```

> Use the following command to check the version of the AsyncAPI CLI you have installed with all its dependencies, like AsyncAPI Generator;  `asyncapi config versions`

It is better to lock a specific version of the template and the generator if you plan to use the AsyncAPI CLI and a particular template in production. The differences between using the version of the AsyncAPI CLI you have installed and locking a certain version on production are demonstrated in the following code snippets.

Generate HTML with the latest AsyncAPI CLI using the html-template.
```
npm install -g @asyncapi/cli
asyncapi generate fromTemplate asyncapi.yaml @asyncapi/html-template@3.0.0 --use-new-generator
```

> AsyncAPI CLI has multiple versions of the generator, and to use the latest version, you may need to pass the `--use-new-generator` flag. For more details you can also check [asyncapi generate fromTemplate ASYNCAPI TEMPLATE](https://www.asyncapi.com/docs/tools/cli/usage#asyncapi-generate-fromtemplate-asyncapi-template)

Generate HTML using a particular version of the AsyncAPI CLI using the html-template.

```
npm install -g @asyncapi/cli@0.20.0
asyncapi generate fromTemplate asyncapi.yaml @asyncapi/html-template@0.7.0 -o ./docs
```

> Before using newer versions of the template, always look at the [changelog](https://github.com/asyncapi/html-template/releases) first. If the generator's features are not important to you, just make sure to use a version compatible with your template.