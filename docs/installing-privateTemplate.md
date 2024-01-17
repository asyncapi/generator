Generator allow to fetch the template from the private repositories like verdaccio, nexus etc. Let's understand how can use the Generator fetch the private repositories. 


**Parameters that needs to pass in Generator to pull private template:**

* **URL:** The URL of the registry where is private template is present. 
* **Auth:** Optional parameter to pass npm registry username and password encoded with base64, formatted like username:password value should be encoded. 

**For example**: if the username and password is admin and nimda, we need to base64 encoded of admin:nimda.

* **token:**  Optional parameter to pass npm registry auth token that you can grab from .npmrc file

**Example:**

```javascript
const generator = new Generator(<privateTemplateName>, outputDir,
      { 
        debug: true,
        install: true, 
        forceWrite: true, 
        templateParams: { 
          singleFile: true 
        },
        registry: {
          url: 'http://verdaccio:4873',  
          auth: 'YWRtaW46bmltZGE='  // base64 encoded username and password represented as admin:nimda
          
        }
      });
```
In this way, we can pass the parameters and pull the template from the private registry. 