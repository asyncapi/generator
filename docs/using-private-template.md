---
title: "Using private templates"
weight: 180
---
Generator allows fetching the template from private repositories like Verdaccio, Nexus, npm, etc.


## Private registry options:

* **registry.url**: The URL of the registry where the private template is located. Defaults to `registry.npmjs.org`.
* **registry.auth**: An optional parameter to pass the npm registry username and password encoded with base64, formatted as `username:password`. For example, if the username and password are `admin` and `nimda`, you need to encode them with the base64 value like `admin:nimda` which results in `YWRtaW46bmltZGE=`.
**registry.token**: An optional parameter to pass to the npm registry authentication token. To get the token, you can first authenticate with the registry using `npm login` and then grab the generated token from the `.npmrc` file.

## Pulling private template using library:

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
Assuming you host `@asyncapi/html-template` in a private package registry like Verdaccio. To pull this template, you need to provide `registry.url` option that points to the registry URL and `registry.auth` as a base64 encoded value that represents the username and password. Instead of username and password, you can also pass `registry.token`.