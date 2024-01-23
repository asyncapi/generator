---
title: "Adding models generation in template"
weight: 200
---

This guide will walk you through the process of enabling models/types generation in a template by using [Modelina](https://www.asyncapi.com/tools/modelina).

Modelina is an AsyncAPI library designed for generating data models by utilizing inputs like [AsyncAPI](generator/asyncapi-document), OpenAPI, or JSON schema inputs. Its functionality revolves around creating data models from the provided AsyncAPI document and the model template, which defines message payloads. It is better to use Modelina in your template to handle model generation rather than providing custom templates.

You can integrate work shown in this guide in a template that you can create by following [tutorial about creating a template](https://www.asyncapi.com/docs/tools/generator/generator-template).

In this guide, you'll learn how to use Modelina in a template code to enable support for Python data models generation. 

## Add Modelina dependency

Install Modelina in your project using npm: `npm install --save @asyncapi/modelina`.

Your template's `package.json` file should now contain Modelina pointing to its latest version:

 ```json
 "dependencies": {
    ...
    "@asyncapi/modelina": "^2.0.5"
    ...
  },
