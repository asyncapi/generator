---
title: Library API
weight: 75
---

Reference API documentation for AsyncAPI Generator library.

<a name="Generator"></a>

## Generator
**Kind**: global class  

* [Generator](#Generator)
    * [new Generator(templateName, targetDir, options)](#new_Generator_new)
    * _instance_
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
        * [.originalAsyncAPI](#Generator+originalAsyncAPI) : `String`
        * [.generate(asyncapiDocument)](#Generator+generate) ⇒ `Promise`
        * [.configureTemplate()](#Generator+configureTemplate)
        * [.generateFromString(asyncapiString, [parserOptions])](#Generator+generateFromString) ⇒ `Promise`
        * [.generateFromURL(asyncapiURL)](#Generator+generateFromURL) ⇒ `Promise`
        * [.generateFromFile(asyncapiFile)](#Generator+generateFromFile) ⇒ `Promise`
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
    - [.templateParams] `String` - Optional parameters to pass to the template. Each template define their own params.
    - [.entrypoint] `String` - Name of the file to use as the entry point for the rendering process. Use in case you want to use only a specific template file. Note: this potentially avoids rendering every file in the template.
    - [.noOverwriteGlobs] `Array.<String>` - List of globs to skip when regenerating the template.
    - [.disabledHooks] `Object.<String, (Boolean|String|Array.<String>)>` - Object with hooks to disable. The key is a hook type. If key has "true" value, then the generator skips all hooks from the given type. If the value associated with a key is a string with the name of a single hook, then the generator skips only this single hook name. If the value associated with a key is an array of strings, then the generator skips only hooks from the array.
    - [.output] `String` ` = 'fs'` - Type of output. Can be either 'fs' (default) or 'string'. Only available when entrypoint is set.
    - [.forceWrite] `Boolean` ` = false` - Force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir. Default is set to false.
    - [.install] `Boolean` ` = false` - Install the template and its dependencies, even when the template has already been installed.
    - [.debug] `Boolean` ` = false` - Enable more specific errors in the console. At the moment it only shows specific errors about filters. Keep in mind that as a result errors about template are less descriptive.
    - [.mapBaseUrlToFolder] `Object.<String, String>` - Optional parameter to map schema references from a base url to a local base folder e.g. url=https://schema.example.com/crm/  folder=./test/docs/ .

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

<a name="Generator+originalAsyncAPI"></a>

* generator.originalAsyncAPI : `String`** :
AsyncAPI string to use as a source.

**Kind**: instance property of [`Generator`](#Generator)  

<a name="Generator+generate"></a>

### generator.generate
Generates files from a given template and an AsyncAPIDocument object.

**Kind**: instance method of [`Generator`](#Generator)  
**Params**

- asyncapiDocument `AsyncAPIDocument` - AsyncAPIDocument object to use as source.

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

<a name="Generator+configureTemplate"></a>

* generator.configureTemplate()** :
Configure the templates based the desired renderer.

**Kind**: instance method of [`Generator`](#Generator)  

<a name="Generator+generateFromString"></a>

### generator.generateFromString
Generates files from a given template and AsyncAPI string.

**Kind**: instance method of [`Generator`](#Generator)  
**Params**

- asyncapiString `String` - AsyncAPI string to use as source.
- [parserOptions] `Object` ` = {}` - AsyncAPI parser options. Check out [@asyncapi/parser](https://www.github.com/asyncapi/parser-js) for more information.

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
