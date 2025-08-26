---
title: Library API
weight: 75
---

Reference API documentation for AsyncAPI Generator library.
## Classes

<dl>
<dt><a href="#Generator">Generator</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#listBakedInTemplates">listBakedInTemplates</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>List core templates, optionally filter by type, stack, protocol, or target.
Use name of returned templates as input for the <code>generate</code> method for template generation. Such core templates code is part of the @asyncapi/generator package.</p></dd>
</dl>


<a name="Generator"></a>

## Generator
**Kind**: global class  

* [Generator](#Generator)
    * [new Generator(templateName, targetDir, options)](#new_Generator_new)
    * _instance_
        * [.compile](#Generator+compile) : `Boolean`
        * [.registry](#Generator+registry) : `Object`
        * [.templateName](#Generator+templateName) : `String`
        * [.targetDir](#Generator+targetDir) : `String`
        * [.entrypoint](#Generator+entrypoint) : `String`
        * [.noOverwriteGlobs](#Generator+noOverwriteGlobs) : `Array.<String>`
        * [.disabledHooks](#Generator+disabledHooks) : `Object.<String, (Boolean|String|Array.<String>)>`
        * [.output](#Generator+output) : `String`
        * [.forceWrite](#Generator+forceWrite) : `Boolean`
        * [.debug](#Generator+debug) : `Boolean`
        * [.install](#Generator+install) : `Boolean`
        * [.templateConfig](#Generator+templateConfig) : `Object`
        * [.hooks](#Generator+hooks) : `Object`
        * [.mapBaseUrlToFolder](#Generator+mapBaseUrlToFolder) : `Object`
        * [.templateParams](#Generator+templateParams) : `Object`
        * [.generate(asyncapiDocument, [parseOptions])](#Generator+generate) ⇒ `Promise.<void>`
        * [.validateAsyncAPIDocument(asyncapiDocument)](#Generator+validateAsyncAPIDocument)
        * [.setupOutput()](#Generator+setupOutput)
        * [.setupFSOutput()](#Generator+setupFSOutput) ⇒ `Promise.<void>`
        * [.setLogLevel()](#Generator+setLogLevel) ⇒ `void`
        * [.installAndSetupTemplate()](#Generator+installAndSetupTemplate) ⇒ `Promise.<{templatePkgName: string, templatePkgPath: string}>`
        * [.configureTemplateWorkflow(parseOptions)](#Generator+configureTemplateWorkflow) ⇒ `Promise.<void>`
        * [.handleEntrypoint()](#Generator+handleEntrypoint) ⇒ `Promise.<void>`
        * [.executeAfterHook()](#Generator+executeAfterHook) ⇒ `Promise.<void>`
        * [.parseInput()](#Generator+parseInput)
        * [.configureTemplate()](#Generator+configureTemplate)
        * ~~[.generateFromString(asyncapiString, [parseOptions])](#Generator+generateFromString) ⇒ `Promise.<(TemplateRenderResult|undefined)>`~~
        * [.generateFromURL(asyncapiURL)](#Generator+generateFromURL) ⇒ `Promise.<(TemplateRenderResult|undefined)>`
        * [.generateFromFile(asyncapiFile)](#Generator+generateFromFile) ⇒ `Promise.<(TemplateRenderResult|undefined)>`
        * [.installTemplate([force])](#Generator+installTemplate)
    * _static_
        * [.getTemplateFile(templateName, filePath, [templatesDir])](#Generator.getTemplateFile) ⇒ `Promise`


<a name="new_Generator_new"></a>

### new Generator
Instantiates a new Generator object.

**Params**

- templateName `String` - Name of the template to generate.
- targetDir `String` - Path to the directory where the files will be generated.
- options `Object`
    - [.templateParams] `Object.<string, string>` - Optional parameters to pass to the template. Each template define their own params.
    - [.entrypoint] `String` - Name of the file to use as the entry point for the rendering process. Use in case you want to use only a specific template file. Note: this potentially avoids rendering every file in the template.
    - [.noOverwriteGlobs] `Array.<String>` - List of globs to skip when regenerating the template.
    - [.disabledHooks] `Object.<String, (Boolean|String|Array.<String>)>` - Object with hooks to disable. The key is a hook type. If key has "true" value, then the generator skips all hooks from the given type. If the value associated with a key is a string with the name of a single hook, then the generator skips only this single hook name. If the value associated with a key is an array of strings, then the generator skips only hooks from the array.
    - [.output] `String` ` = 'fs'` - Type of output. Can be either 'fs' (default) or 'string'. Only available when entrypoint is set.
    - [.forceWrite] `Boolean` ` = false` - Force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir. Default is set to false.
    - [.install] `Boolean` ` = false` - Install the template and its dependencies, even when the template has already been installed.
    - [.debug] `Boolean` ` = false` - Enable more specific errors in the console. At the moment it only shows specific errors about filters. Keep in mind that as a result errors about template are less descriptive.
    - [.compile] `Boolean` ` = true` - Whether to compile the template or use the cached transpiled version provided by template in '__transpiled' folder
    - [.mapBaseUrlToFolder] `Object.<String, String>` - Optional parameter to map schema references from a base url to a local base folder e.g. url=https://schema.example.com/crm/  folder=./test/docs/ .
    - [.registry] `Object` - Optional parameter with private registry configuration
        - [.url] `String` - Parameter to pass npm registry url
        - [.auth] `String` - Optional parameter to pass npm registry username and password encoded with base64, formatted like username:password value should be encoded
        - [.token] `String` - Optional parameter to pass npm registry auth token that you can grab from .npmrc file

**Example**  
```js
const path = require('path');
const generator = new Generator('@asyncapi/html-template', path.resolve(__dirname, 'example'));
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

* generator.compile : `Boolean`** :
Whether to compile the template or use the cached transpiled version provided by template in '__transpiled' folder.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+registry"></a>

* generator.registry : `Object`** :
Npm registry information.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+templateName"></a>

* generator.templateName : `String`** :
Name of the template to generate.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+targetDir"></a>

* generator.targetDir : `String`** :
Path to the directory where the files will be generated.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+entrypoint"></a>

* generator.entrypoint : `String`** :
Name of the file to use as the entry point for the rendering process. Use in case you want to use only a specific template file. Note: this potentially avoids rendering every file in the template.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+noOverwriteGlobs"></a>

* generator.noOverwriteGlobs : `Array.<String>`** :
List of globs to skip when regenerating the template.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+disabledHooks"></a>

* generator.disabledHooks : `Object.<String, (Boolean|String|Array.<String>)>`** :
Object with hooks to disable. The key is a hook type. If key has "true" value, then the generator skips all hooks from the given type. If the value associated with a key is a string with the name of a single hook, then the generator skips only this single hook name. If the value associated with a key is an array of strings, then the generator skips only hooks from the array.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+output"></a>

* generator.output : `String`** :
Type of output. Can be either 'fs' (default) or 'string'. Only available when entrypoint is set.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+forceWrite"></a>

* generator.forceWrite : `Boolean`** :
Force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir. Default is set to false.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+debug"></a>

* generator.debug : `Boolean`** :
Enable more specific errors in the console. At the moment it only shows specific errors about filters. Keep in mind that as a result errors about template are less descriptive.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+install"></a>

* generator.install : `Boolean`** :
Install the template and its dependencies, even when the template has already been installed.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+templateConfig"></a>

* generator.templateConfig : `Object`** :
The template configuration.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+hooks"></a>

* generator.hooks : `Object`** :
Hooks object with hooks functions grouped by the hook type.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+mapBaseUrlToFolder"></a>

* generator.mapBaseUrlToFolder : `Object`** :
Maps schema URL to folder.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+templateParams"></a>

* generator.templateParams : `Object`** :
The template parameters. The structure for this object is based on each individual template.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+generate"></a>

### generator.generate
Generates files from a given template and an AsyncAPIDocument object.

**Kind**: instance method of [`Generator`](#Generator)  
**Returns**: `Promise.<void>` - A Promise that resolves when the generation is completed.  
**Params**

- asyncapiDocument `AsyncAPIDocument` | `string` - AsyncAPIDocument object to use as source.
- [parseOptions] `Object` ` = {}` - AsyncAPI Parser parse options.
  Check out [@asyncapi/parser](https://www.github.com/asyncapi/parser-js) for more information.
  Remember to use the right options for the right parser depending on the template you are using.

**Example**  
```js
await generator.generate(myAsyncAPIdocument);
console.log('Done!');
```
**Example**  
```js
generator
  .generate(myAsyncAPIdocument)
  .then(() => {
    console.log('Done!');
  })
  .catch(console.error);
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

### generator.validateAsyncAPIDocument
Validates the provided AsyncAPI document.

**Kind**: instance method of [`Generator`](#Generator)  
**Throws**:

- `Error` Throws an error if the document is not valid.

**Since**: 10/9/2023 - 4:26:33 PM  
**Params**

- asyncapiDocument `*` - The AsyncAPI document to be validated.


<a name="Generator+setupOutput"></a>

* generator.setupOutput()** :
Sets up the output configuration based on the specified output type.

**Kind**: instance method of [`Generator`](#Generator)  
**Throws**:

- `Error` If 'output' is set to 'string' without providing 'entrypoint'.

**Example**  
```js
const generator = new Generator();
await generator.setupOutput();
```

<a name="Generator+setupFSOutput"></a>

* generator.setupFSOutput() ⇒ `Promise.<void>`** :
Sets up the file system (FS) output configuration.

This function creates the target directory if it does not exist and verifies
the target directory if forceWrite is not enabled.

**Kind**: instance method of [`Generator`](#Generator)  
**Returns**: `Promise.<void>` - A promise that fulfills when the setup is complete.  
**Throws**:

- `Error` If verification of the target directory fails and forceWrite is not enabled.


<a name="Generator+setLogLevel"></a>

* generator.setLogLevel() ⇒ `void`** :
Sets the log level based on the debug option.

If the debug option is enabled, the log level is set to 'debug'.

**Kind**: instance method of [`Generator`](#Generator)  

<a name="Generator+installAndSetupTemplate"></a>

* generator.installAndSetupTemplate() ⇒ `Promise.<{templatePkgName: string, templatePkgPath: string}>`** :
Installs and sets up the template for code generation.

This function installs the specified template using the provided installation option,
sets up the necessary directory paths, loads the template configuration, and returns
information about the installed template.

**Kind**: instance method of [`Generator`](#Generator)  
**Returns**: `Promise.<{templatePkgName: string, templatePkgPath: string}>` - A promise that resolves to an object containing the name and path of the installed template.  

<a name="Generator+configureTemplateWorkflow"></a>

### generator.configureTemplateWorkflow
Configures the template workflow based on provided parsing options.

This function performs the following steps:
1. Parses the input AsyncAPI document using the specified parse options.
2. Validates the template configuration and parameters.
3. Configures the template based on the parsed AsyncAPI document.
4. Registers filters, hooks, and launches the 'generate:before' hook if applicable.

**Kind**: instance method of [`Generator`](#Generator)  
**Returns**: `Promise.<void>` - A promise that resolves when the configuration is completed.  
**Params**

- parseOptions `*` - Options for parsing the AsyncAPI document.


<a name="Generator+handleEntrypoint"></a>

* generator.handleEntrypoint() ⇒ `Promise.<void>`** :
Handles the logic for the template entrypoint.

If an entrypoint is specified:
- Resolves the absolute path of the entrypoint file.
- Throws an error if the entrypoint file doesn't exist.
- Generates a file or renders content based on the output type.
- Launches the 'generate:after' hook if the output is 'fs'.

If no entrypoint is specified, generates the directory structure.

**Kind**: instance method of [`Generator`](#Generator)  
**Returns**: `Promise.<void>` - A promise that resolves when the entrypoint logic is completed.  

<a name="Generator+executeAfterHook"></a>

* generator.executeAfterHook() ⇒ `Promise.<void>`** :
Executes the 'generate:after' hook.

Launches the after-hook to perform additional actions after code generation.

**Kind**: instance method of [`Generator`](#Generator)  
**Returns**: `Promise.<void>` - A promise that resolves when the after-hook execution is completed.  

<a name="Generator+parseInput"></a>

* generator.parseInput()** :
Parse the generator input based on the template `templateConfig.apiVersion` value.

**Kind**: instance method of [`Generator`](#Generator)  

<a name="Generator+configureTemplate"></a>

* generator.configureTemplate()** :
Configure the templates based the desired renderer.

**Kind**: instance method of [`Generator`](#Generator)  

<a name="Generator+generateFromString"></a>

### ~~generator.generateFromString~~
***Deprecated***

Generates files from a given template and AsyncAPI string.

**Kind**: instance method of [`Generator`](#Generator)  
**Params**

- asyncapiString `String` - AsyncAPI string to use as source.
- [parseOptions] `Object` ` = {}` - AsyncAPI Parser parse options. Check out [@asyncapi/parser](https://www.github.com/asyncapi/parser-js) for more information.

**Example**  
```js
const asyncapiString = `
asyncapi: '2.0.0'
info:
  title: Example
  version: 1.0.0
...
`;
generator
  .generateFromString(asyncapiString)
  .then(() => {
    console.log('Done!');
  })
  .catch(console.error);
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

### generator.generateFromURL
Generates files from a given template and AsyncAPI file stored on external server.

**Kind**: instance method of [`Generator`](#Generator)  
**Params**

- asyncapiURL `String` - Link to AsyncAPI file

**Example**  
```js
generator
  .generateFromURL('https://example.com/asyncapi.yaml')
  .then(() => {
    console.log('Done!');
  })
  .catch(console.error);
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

### generator.generateFromFile
Generates files from a given template and AsyncAPI file.

**Kind**: instance method of [`Generator`](#Generator)  
**Params**

- asyncapiFile `String` - AsyncAPI file to use as source.

**Example**  
```js
generator
  .generateFromFile('asyncapi.yaml')
  .then(() => {
    console.log('Done!');
  })
  .catch(console.error);
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

### generator.installTemplate
Downloads and installs a template and its dependencies

**Kind**: instance method of [`Generator`](#Generator)  
**Params**

- [force] `Boolean` ` = false` - Whether to force installation (and skip cache) or not.


<a name="Generator.getTemplateFile"></a>

### Generator.getTemplateFile
Returns the content of a given template file.

**Kind**: static method of [`Generator`](#Generator)  
**Params**

- templateName `String` - Name of the template to generate.
- filePath `String` - Path to the file to render. Relative to the template directory.
- [templatesDir] `String` ` = DEFAULT_TEMPLATES_DIR` - Path to the directory where the templates are installed.

**Example**  
```js
const Generator = require('@asyncapi/generator');
const content = await Generator.getTemplateFile('@asyncapi/html-template', 'partials/content.html');
```
**Example** *(Using a custom &#x60;templatesDir&#x60;)*  
```js
const Generator = require('@asyncapi/generator');
const content = await Generator.getTemplateFile('@asyncapi/html-template', 'partials/content.html', '~/my-templates');
```

<a name="listBakedInTemplates"></a>

## listBakedInTemplates
List core templates, optionally filter by type, stack, protocol, or target.
Use name of returned templates as input for the `generate` method for template generation. Such core templates code is part of the @asyncapi/generator package.

**Kind**: global variable  
**Returns**: `Array.<Object>` - Array of template objects matching the filter.  
**Params**

- [filter] `Object` - Optional filter object.
    - [.type] `string` - Filter by template type (e.g., 'client', 'docs').
    - [.stack] `string` - Filter by stack (e.g., 'quarkus', 'express').
    - [.protocol] `string` - Filter by protocol (e.g., 'websocket', 'http').
    - [.target] `string` - Filter by target language or format (e.g., 'javascript', 'html').

