---
title: "Using private templates"
weight: 180
---
Generator allows to fetch the template from the private repositories like verdaccio, nexus, npm etc.


## Private registry options

* **registry.url**: The URL of the registry where is private template is present. Defaults to `registry.npmjs.org`.
* **registry.auth**: Optional parameter to pass npm registry username and password encoded with base64, formatted like `username:password`. For example if the username and password is `admin` and `nimda`, you need to encode with base64 value like `admin:nimda` which results in `YWRtaW46bmltZGE=`.
* **registry.token** : Optional parameter to pass to npm registry auth token. To get the token you can first authenticate with registry using `npm login` and then grab generated token from `.npmrc` file.

## Pulling private template using library

```javascript
const generator = new Generator('@asyncapi/html-template', 'output',
      { 
        debug: true,
        registry: {
          url: 'http://verdaccio:4873',  
          auth: 'YWRtaW46bmltZGE=' 
            // base64 encoded username and password 
            // represented as admin:nimda
          
        }
      });
```
Let's assume you host `@asyncapi/html-template` in private package registry like Verdaccio. In order to pull this template you need to provide `registry.url` option that points to the registry URL and `registry.auth` as base64 encoded value that represents username and password. Instead of username and password you can also pass `registry.token`.