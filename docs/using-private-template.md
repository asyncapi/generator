---
title: "Using private templates"
weight: 180
---
[Generator](https://www.asyncapi.com/tools/generator) allows to fetch the template from the private repositories like verdaccio, nexus, npm etc. Let's understand how can use the Generator to fetch the templates from the private repositories.


## Parameters that needs to pass in Generator to pull private template:

* **URL:** The URL of the registry where is private template is present. 
* **Auth:** Optional parameter to pass npm registry username and password encoded with base64, formatted like username:password value should be encoded. 

**For example**: if the username and password is admin and nimda, we need to base64 encoded of admin:nimda.

* **token:**  Optional parameter to pass npm registry auth token that you can grab from .npmrc file

## Example to pull Private template:

```javascript
const generator = new Generator('@asyncapi/html-template', outputDir,
      { 
        debug: true,
        install: true, 
        forceWrite: true, 
        templateParams: { 
          singleFile: true 
        },
        registry: {
          url: 'http://verdaccio:4873',  
          auth: 'YWRtaW46bmltZGE=' 
            // base64 encoded username and password 
            // represented as admin:nimda
          
        }
      });
```
Let's suppose the template name as @asyncapi/html-template is present in the private repository, In order to pull the template from the private repository, we need to pass the url and auth as a parameters. 