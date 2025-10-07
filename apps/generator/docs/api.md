## Classes

<dl>
<dt><a href="#Generator">Generator</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#listBakedInTemplates">listBakedInTemplates</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd>List core templates, optionally filter by type, stack, protocol, or target.Use name of returned templates as input for the `generate` method for template generation. Such core templates code is part of the @asyncapi/generator package.</dd>
</dl>

<a name="Generator"></a>

## Generator
**Kind**: global class  

* [Generator](#Generator)
    * [new Generator(templateName, targetDir, options)](#new_Generator_new)
    * _instance_
        * [.compile](#Generator+compile) : <code>Boolean</code>
        * [.registry](#Generator+registry) : <code>Object</code>
        * [.templateName](#Generator+templateName) : <code>String</code>
        * [.targetDir](#Generator+targetDir) : <code>String</code>
        * [.entrypoint](#Generator+entrypoint) : <code>String</code>
        * [.noOverwriteGlobs](#Generator+noOverwriteGlobs) : <code>Array.&lt;String&gt;</code>
        * [.disabledHooks](#Generator+disabledHooks) : <code>Object.&lt;String, (Boolean\|String\|Array.&lt;String&gt;)&gt;</code>
        * [.output](#Generator+output) : <code>String</code>
        * [.forceWrite](#Generator+forceWrite) : <code>Boolean</code>
        * [.debug](#Generator+debug) : <code>Boolean</code>
        * [.install](#Generator+install) : <code>Boolean</code>
        * [.templateConfig](#Generator+templateConfig) : <code>Object</code>
        * [.hooks](#Generator+hooks) : <code>Object</code>
        * [.mapBaseUrlToFolder](#Generator+mapBaseUrlToFolder) : <code>Object</code>
        * [.templateParams](#Generator+templateParams) : <code>Object</code>
        * [.generate(asyncapiDocument, [parseOptions])](#Generator+generate) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.validateAsyncAPIDocument(asyncapiDocument)](#Generator+validateAsyncAPIDocument)
        * [.setupOutput()](#Generator+setupOutput)
        * [.setupFSOutput()](#Generator+setupFSOutput) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.setLogLevel()](#Generator+setLogLevel) ⇒ <code>void</code>
        * [.installAndSetupTemplate()](#Generator+installAndSetupTemplate) ⇒ <code>Promise.&lt;{templatePkgName: string, templatePkgPath: string}&gt;</code>
        * [.configureTemplateWorkflow(parseOptions)](#Generator+configureTemplateWorkflow) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.handleEntrypoint()](#Generator+handleEntrypoint) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.executeAfterHook()](#Generator+executeAfterHook) ⇒ <code>Promise.&lt;void&gt;</code>
        * [.parseInput()](#Generator+parseInput)
        * [.configureTemplate()](#Generator+configureTemplate)
        * ~~[.generateFromString(asyncapiString, [parseOptions])](#Generator+generateFromString) ⇒ <code>Promise.&lt;(TemplateRenderResult\|undefined)&gt;</code>~~
        * [.generateFromURL(asyncapiURL)](#Generator+generateFromURL) ⇒ <code>Promise.&lt;(TemplateRenderResult\|undefined)&gt;</code>
        * [.generateFromFile(asyncapiFile)](#Generator+generateFromFile) ⇒ <code>Promise.&lt;(TemplateRenderResult\|undefined)&gt;</code>
        * [.installTemplate([force])](#Generator+installTemplate)
    * _static_
        * [.getTemplateFile(templateName, filePath, [templatesDir])](#Generator.getTemplateFile) ⇒ <code>Promise</code>

<a name="new_Generator_new"></a>

### new Generator(templateName, targetDir, options)
Instantiates a new Generator object.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| templateName | <code>String</code> |  | Name of the template to generate. |
| targetDir | <code>String</code> |  | Path to the directory where the files will be generated. |
| options | <code>Object</code> |  |  |
| [options.templateParams] | <code>Object.&lt;string, string&gt;</code> |  | Optional parameters to pass to the template. Each template define their own params. |
| [options.entrypoint] | <code>String</code> |  | Name of the file to use as the entry point for the rendering process. Use in case you want to use only a specific template file. Note: this potentially avoids rendering every file in the template. |
| [options.noOverwriteGlobs] | <code>Array.&lt;String&gt;</code> |  | List of globs to skip when regenerating the template. |
| [options.disabledHooks] | <code>Object.&lt;String, (Boolean\|String\|Array.&lt;String&gt;)&gt;</code> |  | Object with hooks to disable. The key is a hook type. If key has "true" value, then the generator skips all hooks from the given type. If the value associated with a key is a string with the name of a single hook, then the generator skips only this single hook name. If the value associated with a key is an array of strings, then the generator skips only hooks from the array. |
| [options.output] | <code>String</code> | <code>&#x27;fs&#x27;</code> | Type of output. Can be either 'fs' (default) or 'string'. Only available when entrypoint is set. |
| [options.forceWrite] | <code>Boolean</code> | <code>false</code> | Force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir. Default is set to false. |
| [options.install] | <code>Boolean</code> | <code>false</code> | Install the template and its dependencies, even when the template has already been installed. |
| [options.debug] | <code>Boolean</code> | <code>false</code> | Enable more specific errors in the console. At the moment it only shows specific errors about filters. Keep in mind that as a result errors about template are less descriptive. |
| [options.compile] | <code>Boolean</code> | <code>true</code> | Whether to compile the template or use the cached transpiled version provided by template in '__transpiled' folder |
| [options.mapBaseUrlToFolder] | <code>Object.&lt;String, String&gt;</code> |  | Optional parameter to map schema references from a base url to a local base folder e.g. url=https://schema.example.com/crm/  folder=./test/docs/ . |
| [options.registry] | <code>Object</code> |  | Optional parameter with private registry configuration |
| [options.registry.url] | <code>String</code> |  | Parameter to pass npm registry url |
| [options.registry.auth] | <code>String</code> |  | Optional parameter to pass npm registry username and password encoded with base64, formatted like username:password value should be encoded |
| [options.registry.token] | <code>String</code> |  | Optional parameter to pass npm registry auth token that you can grab from .npmrc file |

**Example**  
```js
const path = require('path');const generator = new Generator('@asyncapi/html-template', path.resolve(__dirname, 'example'));
```
**Example** *(Passing custom params to the template)*  
```js
const path = require('path');
const generator = new Generator('@asyncapi/html-template', path.resolve(__dirname, 'example'), {
  templateParams: {
    sidebarOrganization: 'byTags'
  }
});
```
<a name="Generator+compile"></a>

### generator.compile : <code>Boolean</code>
Whether to compile the template or use the cached transpiled version provided by template in '__transpiled' folder.

**Kind**: instance property of [<code>Generator</code>](#Generator)  
<a name="Generator+registry"></a>

### generator.registry : <code>Object</code>
Npm registry information.

**Kind**: instance property of [<code>Generator</code>](#Generator)  
<a name="Generator+templateName"></a>

### generator.templateName : <code>String</code>
Name of the template to generate.

**Kind**: instance property of [<code>Generator</code>](#Generator)  
<a name="Generator+targetDir"></a>

### generator.targetDir : <code>String</code>
Path to the directory where the files will be generated.

**Kind**: instance property of [<code>Generator</code>](#Generator)  
<a name="Generator+entrypoint"></a>

### generator.entrypoint : <code>String</code>
Name of the file to use as the entry point for the rendering process. Use in case you want to use only a specific template file. Note: this potentially avoids rendering every file in the template.

**Kind**: instance property of [<code>Generator</code>](#Generator)  
<a name="Generator+noOverwriteGlobs"></a>

### generator.noOverwriteGlobs : <code>Array.&lt;String&gt;</code>
List of globs to skip when regenerating the template.

**Kind**: instance property of [<code>Generator</code>](#Generator)  
<a name="Generator+disabledHooks"></a>

### generator.disabledHooks : <code>Object.&lt;String, (Boolean\|String\|Array.&lt;String&gt;)&gt;</code>
Object with hooks to disable. The key is a hook type. If key has "true" value, then the generator skips all hooks from the given type. If the value associated with a key is a string with the name of a single hook, then the generator skips only this single hook name. If the value associated with a key is an array of strings, then the generator skips only hooks from the array.

**Kind**: instance property of [<code>Generator</code>](#Generator)  
<a name="Generator+output"></a>

### generator.output : <code>String</code>
Type of output. Can be either 'fs' (default) or 'string'. Only available when entrypoint is set.

**Kind**: instance property of [<code>Generator</code>](#Generator)  
<a name="Generator+forceWrite"></a>

### generator.forceWrite : <code>Boolean</code>
Force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir. Default is set to false.

**Kind**: instance property of [<code>Generator</code>](#Generator)  
<a name="Generator+debug"></a>

### generator.debug : <code>Boolean</code>
Enable more specific errors in the console. At the moment it only shows specific errors about filters. Keep in mind that as a result errors about template are less descriptive.

**Kind**: instance property of [<code>Generator</code>](#Generator)  
<a name="Generator+install"></a>

### generator.install : <code>Boolean</code>
Install the template and its dependencies, even when the template has already been installed.

**Kind**: instance property of [<code>Generator</code>](#Generator)  
<a name="Generator+templateConfig"></a>

### generator.templateConfig : <code>Object</code>
The template configuration.

**Kind**: instance property of [<code>Generator</code>](#Generator)  
<a name="Generator+hooks"></a>

### generator.hooks : <code>Object</code>
Hooks object with hooks functions grouped by the hook type.

**Kind**: instance property of [<code>Generator</code>](#Generator)  
<a name="Generator+mapBaseUrlToFolder"></a>

### generator.mapBaseUrlToFolder : <code>Object</code>
Maps schema URL to folder.

**Kind**: instance property of [<code>Generator</code>](#Generator)  
<a name="Generator+templateParams"></a>

### generator.templateParams : <code>Object</code>
The template parameters. The structure for this object is based on each individual template.

**Kind**: instance property of [<code>Generator</code>](#Generator)  
<a name="Generator+generate"></a>

### generator.generate(asyncapiDocument, [parseOptions]) ⇒ <code>Promise.&lt;void&gt;</code>
Generates files from a given template and an AsyncAPIDocument object.

**Kind**: instance method of [<code>Generator</code>](#Generator)  
**Returns**: <code>Promise.&lt;void&gt;</code> - A Promise that resolves when the generation is completed.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| asyncapiDocument | <code>AsyncAPIDocument</code> \| <code>string</code> |  | AsyncAPIDocument object to use as source. |
| [parseOptions] | <code>Object</code> | <code>{}</code> | AsyncAPI Parser parse options.   Check out [@asyncapi/parser](https://www.github.com/asyncapi/parser-js) for more information.   Remember to use the right options for the right parser depending on the template you are using. |

**Example**  
```js
await generator.generate(myAsyncAPIdocument);console.log('Done!');
```
**Example**  
```js
generator  .generate(myAsyncAPIdocument)  .then(() => {    console.log('Done!');  })  .catch(console.error);
```
**Example** *(Using async/await)*  
```js
try {
  await generator.generate(myAsyncAPIdocument);
  console.log('Done!');
} catch (e) {
  console.error(e);
}
```
<a name="Generator+validateAsyncAPIDocument"></a>

### generator.validateAsyncAPIDocument(asyncapiDocument)
Validates the provided AsyncAPI document.

**Kind**: instance method of [<code>Generator</code>](#Generator)  
**Throws**:

- <code>Error</code> Throws an error if the document is not valid.

**Since**: 10/9/2023 - 4:26:33 PM  

| Param | Type | Description |
| --- | --- | --- |
| asyncapiDocument | <code>\*</code> | The AsyncAPI document to be validated. |

<a name="Generator+setupOutput"></a>

### generator.setupOutput()
Sets up the output configuration based on the specified output type.

**Kind**: instance method of [<code>Generator</code>](#Generator)  
**Throws**:

- <code>Error</code> If 'output' is set to 'string' without providing 'entrypoint'.

**Example**  
```js
const generator = new Generator();await generator.setupOutput();
```
<a name="Generator+setupFSOutput"></a>

### generator.setupFSOutput() ⇒ <code>Promise.&lt;void&gt;</code>
Sets up the file system (FS) output configuration.This function creates the target directory if it does not exist and verifiesthe target directory if forceWrite is not enabled.

**Kind**: instance method of [<code>Generator</code>](#Generator)  
**Returns**: <code>Promise.&lt;void&gt;</code> - A promise that fulfills when the setup is complete.  
**Throws**:

- <code>Error</code> If verification of the target directory fails and forceWrite is not enabled.

<a name="Generator+setLogLevel"></a>

### generator.setLogLevel() ⇒ <code>void</code>
Sets the log level based on the debug option.If the debug option is enabled, the log level is set to 'debug'.

**Kind**: instance method of [<code>Generator</code>](#Generator)  
<a name="Generator+installAndSetupTemplate"></a>

### generator.installAndSetupTemplate() ⇒ <code>Promise.&lt;{templatePkgName: string, templatePkgPath: string}&gt;</code>
Installs and sets up the template for code generation.This function installs the specified template using the provided installation option,sets up the necessary directory paths, loads the template configuration, and returnsinformation about the installed template.

**Kind**: instance method of [<code>Generator</code>](#Generator)  
**Returns**: <code>Promise.&lt;{templatePkgName: string, templatePkgPath: string}&gt;</code> - A promise that resolves to an object containing the name and path of the installed template.  
<a name="Generator+configureTemplateWorkflow"></a>

### generator.configureTemplateWorkflow(parseOptions) ⇒ <code>Promise.&lt;void&gt;</code>
Configures the template workflow based on provided parsing options.This function performs the following steps:1. Parses the input AsyncAPI document using the specified parse options.2. Validates the template configuration and parameters.3. Configures the template based on the parsed AsyncAPI document.4. Registers filters, hooks, and launches the 'generate:before' hook if applicable.

**Kind**: instance method of [<code>Generator</code>](#Generator)  
**Returns**: <code>Promise.&lt;void&gt;</code> - A promise that resolves when the configuration is completed.  

| Param | Type | Description |
| --- | --- | --- |
| parseOptions | <code>\*</code> | Options for parsing the AsyncAPI document. |

<a name="Generator+handleEntrypoint"></a>

### generator.handleEntrypoint() ⇒ <code>Promise.&lt;void&gt;</code>
Handles the logic for the template entrypoint.If an entrypoint is specified:- Resolves the absolute path of the entrypoint file.- Throws an error if the entrypoint file doesn't exist.- Generates a file or renders content based on the output type.- Launches the 'generate:after' hook if the output is 'fs'.If no entrypoint is specified, generates the directory structure.

**Kind**: instance method of [<code>Generator</code>](#Generator)  
**Returns**: <code>Promise.&lt;void&gt;</code> - A promise that resolves when the entrypoint logic is completed.  
<a name="Generator+executeAfterHook"></a>

### generator.executeAfterHook() ⇒ <code>Promise.&lt;void&gt;</code>
Executes the 'generate:after' hook.Launches the after-hook to perform additional actions after code generation.

**Kind**: instance method of [<code>Generator</code>](#Generator)  
**Returns**: <code>Promise.&lt;void&gt;</code> - A promise that resolves when the after-hook execution is completed.  
<a name="Generator+parseInput"></a>

### generator.parseInput()
Parse the generator input based on the template `templateConfig.apiVersion` value.

**Kind**: instance method of [<code>Generator</code>](#Generator)  
<a name="Generator+configureTemplate"></a>

### generator.configureTemplate()
Configure the templates based the desired renderer.

**Kind**: instance method of [<code>Generator</code>](#Generator)  
<a name="Generator+generateFromString"></a>

### ~~generator.generateFromString(asyncapiString, [parseOptions]) ⇒ <code>Promise.&lt;(TemplateRenderResult\|undefined)&gt;</code>~~
***Deprecated***

Generates files from a given template and AsyncAPI string.

**Kind**: instance method of [<code>Generator</code>](#Generator)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| asyncapiString | <code>String</code> |  | AsyncAPI string to use as source. |
| [parseOptions] | <code>Object</code> | <code>{}</code> | AsyncAPI Parser parse options. Check out [@asyncapi/parser](https://www.github.com/asyncapi/parser-js) for more information. |

**Example**  
```js
const asyncapiString = `asyncapi: '2.0.0'info:  title: Example  version: 1.0.0...`;generator  .generateFromString(asyncapiString)  .then(() => {    console.log('Done!');  })  .catch(console.error);
```
**Example** *(Using async/await)*  
```js
const asyncapiString = `
asyncapi: '2.0.0'
info:
  title: Example
  version: 1.0.0
...
`;

try {
  await generator.generateFromString(asyncapiString);
  console.log('Done!');
} catch (e) {
  console.error(e);
}
```
<a name="Generator+generateFromURL"></a>

### generator.generateFromURL(asyncapiURL) ⇒ <code>Promise.&lt;(TemplateRenderResult\|undefined)&gt;</code>
Generates files from a given template and AsyncAPI file stored on external server.

**Kind**: instance method of [<code>Generator</code>](#Generator)  

| Param | Type | Description |
| --- | --- | --- |
| asyncapiURL | <code>String</code> | Link to AsyncAPI file |

**Example**  
```js
generator  .generateFromURL('https://example.com/asyncapi.yaml')  .then(() => {    console.log('Done!');  })  .catch(console.error);
```
**Example** *(Using async/await)*  
```js
try {
  await generator.generateFromURL('https://example.com/asyncapi.yaml');
  console.log('Done!');
} catch (e) {
  console.error(e);
}
```
<a name="Generator+generateFromFile"></a>

### generator.generateFromFile(asyncapiFile) ⇒ <code>Promise.&lt;(TemplateRenderResult\|undefined)&gt;</code>
Generates files from a given template and AsyncAPI file.

**Kind**: instance method of [<code>Generator</code>](#Generator)  

| Param | Type | Description |
| --- | --- | --- |
| asyncapiFile | <code>String</code> | AsyncAPI file to use as source. |

**Example**  
```js
generator  .generateFromFile('asyncapi.yaml')  .then(() => {    console.log('Done!');  })  .catch(console.error);
```
**Example** *(Using async/await)*  
```js
try {
  await generator.generateFromFile('asyncapi.yaml');
  console.log('Done!');
} catch (e) {
  console.error(e);
}
```
<a name="Generator+installTemplate"></a>

### generator.installTemplate([force])
Downloads and installs a template and its dependencies

**Kind**: instance method of [<code>Generator</code>](#Generator)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [force] | <code>Boolean</code> | <code>false</code> | Whether to force installation (and skip cache) or not. |

<a name="Generator.getTemplateFile"></a>

### Generator.getTemplateFile(templateName, filePath, [templatesDir]) ⇒ <code>Promise</code>
Returns the content of a given template file.

**Kind**: static method of [<code>Generator</code>](#Generator)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| templateName | <code>String</code> |  | Name of the template to generate. |
| filePath | <code>String</code> |  | Path to the file to render. Relative to the template directory. |
| [templatesDir] | <code>String</code> | <code>DEFAULT_TEMPLATES_DIR</code> | Path to the directory where the templates are installed. |

**Example**  
```js
const Generator = require('@asyncapi/generator');const content = await Generator.getTemplateFile('@asyncapi/html-template', 'partials/content.html');
```
**Example** *(Using a custom &#x60;templatesDir&#x60;)*  
```js
const Generator = require('@asyncapi/generator');
const content = await Generator.getTemplateFile('@asyncapi/html-template', 'partials/content.html', '~/my-templates');
```
<a name="listBakedInTemplates"></a>

## listBakedInTemplates ⇒ <code>Array.&lt;Object&gt;</code>
List core templates, optionally filter by type, stack, protocol, or target.Use name of returned templates as input for the `generate` method for template generation. Such core templates code is part of the @asyncapi/generator package.

**Kind**: global variable  
**Returns**: <code>Array.&lt;Object&gt;</code> - Array of template objects matching the filter.  

| Param | Type | Description |
| --- | --- | --- |
| [filter] | <code>Object</code> | Optional filter object. |
| [filter.type] | <code>string</code> | Filter by template type (e.g., 'client', 'docs'). |
| [filter.stack] | <code>string</code> | Filter by stack (e.g., 'quarkus', 'express'). |
| [filter.protocol] | <code>string</code> | Filter by protocol (e.g., 'websocket', 'http'). |
| [filter.target] | <code>string</code> | Filter by target language or format (e.g., 'javascript', 'html'). |

