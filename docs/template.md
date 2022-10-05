---
title: "Template"
weight: 40
---

# What's a Template?

A Template is a project that specifies what exactly you get as an output of the generation process using AsyncAPI Generator and the [AsyncAPI file](asyncapi-file.md). It is just a set of files where you describe what should be the result of the generation depending on the contents of the AsyncAPI file. Some examples of these outputs can be things such as: code, documentation, diagrams, python and java applications, and much more. 

A template is an independent NodeJS project that’s not related to the `generator` repository. AsyncAPI templates are managed, released, and published separately. You can also create your own templates and manage them on your own.

The generator uses the official NPM library for installing NodeJS dependencies called [Arborist](https://www.npmjs.com/package/@npmcli/arborist). This means templates do not have to be published to package managers to use them, just make sure they have `package.json`.

Arborist helps the generator fetch the source code of the template and use that for the generation process. You can store template projects on a local drive during the development process, or just as a git repository. You can do anything that is already possible with `npm install`.








