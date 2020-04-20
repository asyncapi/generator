<a name="Generator"></a>

## Generator
**Kind**: global class  

* [Generator](#Generator)
    * [new Generator(templateName, targetDir, options)](#new_Generator_new)
    * _instance_
        * [.generate(asyncapiDocument)](#Generator+generate) ⇒ <code>Promise</code>
        * [.generateFromString(asyncapiString, [parserOptions])](#Generator+generateFromString) ⇒ <code>Promise</code>
        * [.generateFromFile(asyncapiFile)](#Generator+generateFromFile) ⇒ <code>Promise</code>
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
| [options.templateParams] | <code>String</code> |  | Optional parameters to pass to the template. Each template define their own params. |
| [options.entrypoint] | <code>String</code> |  | Name of the file to use as the entry point for the rendering process. Use in case you want to use only a specific template file. Note: this potentially avoids rendering every file in the template. |
| [options.noOverwriteGlobs] | <code>Array.&lt;String&gt;</code> |  | List of globs to skip when regenerating the template. |
| [options.disabledHooks] | <code>Array.&lt;String&gt;</code> |  | List of hooks to disable. |
| [options.output] | <code>String</code> | <code>&#x27;fs&#x27;</code> | Type of output. Can be either 'fs' (default) or 'string'. Only available when entrypoint is set. |
| [options.forceWrite] | <code>Boolean</code> | <code>false</code> | Force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir. Default is set to false. |
| [options.install] | <code>Boolean</code> | <code>false</code> | Install the template and its dependencies, even when the template has already been installed. |

**Example**  
```js
const path = require('path');
const generator = new Generator('html', path.resolve(__dirname, 'example'));
```
**Example** *(Passing custom params to the template)*  
```js
const path = require('path');
const generator = new Generator('html', path.resolve(__dirname, 'example'), {
  templateParams: {
    sidebarOrganization: 'byTags'
  }
});
```
<a name="Generator+generate"></a>

### generator.generate(asyncapiDocument) ⇒ <code>Promise</code>
Generates files from a given template and an AsyncAPIDocument object.

**Kind**: instance method of [<code>Generator</code>](#Generator)  

| Param | Type | Description |
| --- | --- | --- |
| asyncapiDocument | <code>AsyncAPIDocument</code> | AsyncAPIDocument object to use as source. |

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
<a name="Generator+generateFromString"></a>

### generator.generateFromString(asyncapiString, [parserOptions]) ⇒ <code>Promise</code>
Generates files from a given template and AsyncAPI string.

**Kind**: instance method of [<code>Generator</code>](#Generator)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| asyncapiString | <code>String</code> |  | AsyncAPI string to use as source. |
| [parserOptions] | <code>Object</code> | <code>{}</code> | AsyncAPI parser options. Check out [@asyncapi/parser](https://www.github.com/asyncapi/parser-js) for more information. |

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
<a name="Generator+generateFromFile"></a>

### generator.generateFromFile(asyncapiFile) ⇒ <code>Promise</code>
Generates files from a given template and AsyncAPI file.

**Kind**: instance method of [<code>Generator</code>](#Generator)  

| Param | Type | Description |
| --- | --- | --- |
| asyncapiFile | <code>String</code> | AsyncAPI file to use as source. |

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

### generator.installTemplate([force])
Downloads and installs a template and its dependencies.

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
const Generator = require('asyncapi-generator');
const content = await Generator.getTemplateFile('@asyncapi/html-template', 'partials/content.html');
```
**Example** *(Using a custom &#x60;templatesDir&#x60;)*  
```js
const Generator = require('asyncapi-generator');
const content = await Generator.getTemplateFile('@asyncapi/html-template', 'partials/content.html', '~/my-templates');
```
