---
title: "Template"
weight: 40
---

## What's a Template?

Template is a project designed to give you some form of output with the help of Generator and [AsyncAPI file](asyncapi-file.md) as an input. It is just a set of files where you describe what you would like the Generator to generate as an output. Some examples of these outputs can be things such as—code, documentation, diagrams, python and java applications, and much more. 

Template is an independent NodeJS project that’s not related to the Generator repository. AsyncAPI templates are managed, released and published separately. Generator uses the Arborist library. Arborist connects both Template and Generator, It is also the dependency tree manager for npm. 

Arborist helps the generator fetch source code or hooks of the template and use that for the generation process. It also means templates are a set of customly designed files which can be stored anywhere like–in npm, on local during the development process, or just as a github repository. You can do anything that is already possible with npm install.

# Minimum for your template

The most basic template must have the following:

- `template directory`: this is where you keep the files that determine the output that will be generated. In other words, the Generator processes all the files stored in this directory.
- `package.json`: this file is necessary even if your template doesn't need any external dependencies. Before the generation process runs, the Generator must install the template into its dependencies, and `package.json` is necessary to identify the template name.

What are all the other directories and files? This template provides an example that includes: all of the best practices; a demonstration of the generator features; and anything else needed to provide a production-ready template. In the next section, we will cover which features are required and which features are optional.


