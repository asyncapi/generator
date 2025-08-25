---
"@asyncapi/generator": minor
---

This release introduces the concept of [`Baked-in Templates`](https://www.asyncapi.com/docs/tools/generator/baked-in-templates).

List of currently available baked-in templates is located in [BakedInTemplatesList.json](https://github.com/asyncapi/generator/blob/master/apps/generator/lib/templates/BakedInTemplatesList.json) file that is dynamically regenerated on each release.

### 🚀 New Experimental Feature: **Baked-in Templates**

Baked-in Templates are **official AsyncAPI templates that are developed, versioned, and shipped directly inside the `generator` repository**, and are exposed via the `@asyncapi/generator` library. This approach provides a faster, more consistent, and opinionated way to generate code, SDKs, clients, and more—without relying on external packages.  

All baked-in templates live under the `packages/templates` directory, follow a strict folder structure for maintainability, and are automatically registered in the generator during build time.  

### ⚠️ Important Notes
- **Experimental**: Baked-in templates are **not recommended for production use yet**. The number of available templates is currently limited, and we’re actively refining the concept. 
- **We need your feedback**: Try them out with your AsyncAPI documents and share your use cases to help us improve them.  
- **No changes to existing templates**: Your current workflow with external templates remains fully supported and works exactly the same as before. Nothing breaks, nothing changes.  

### Benefits
- Such templates are versioned together with the generator → no mismatches.  
- Faster template discovery and generation process.  
- Clear naming conventions and metadata, making templates easier to maintain and extend.  

### What’s Next

- We’ll be gradually expanding template coverage (e.g., docs, configs, SDKs) and stabilizing this feature based on community input before recommending production use.

- Dedicated support for such templates will be enabled in AsyncAPI CLI. [The PR](https://github.com/asyncapi/cli/pull/1830) is already opened.