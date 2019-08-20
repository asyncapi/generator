<a name="Generator"></a>

## Generator
**Kind**: global class  

* [Generator](#Generator)
    * [new Generator(templateName, targetDir, options)](#new_Generator_new)
    * [.generate(asyncapiDocument)](#Generator+generate) ⇒ <code>Promise</code>
    * [.generateFromString(asyncapiString)](#Generator+generateFromString) ⇒ <code>Promise</code>
    * [.generateFromFile(asyncapiFile)](#Generator+generateFromFile) ⇒ <code>Promise</code>
    * [.generateTemplateFile(asyncapiDocument, filePath)](#Generator+generateTemplateFile) ⇒ <code>Promise</code>
    * [.getTemplateFile(filePath)](#Generator+getTemplateFile) ⇒ <code>Promise</code>

<a name="new_Generator_new"></a>

### new Generator(templateName, targetDir, options)
Instantiates a new Generator object.


| Param | Type | Description |
| --- | --- | --- |
| templateName | <code>String</code> | Name of the template to generate. |
| targetDir | <code>String</code> | Path to the directory where the files will be generated. |
| options | <code>Object</code> |  |
| options.templatesDir | <code>String</code> | Path to the directory where to find the given template. Defaults to internal `templates` directory. |
| options.templateParams | <code>String</code> | Optional parameters to pass to the template. Each template define their own params. |

<a name="Generator+generate"></a>

### generator.generate(asyncapiDocument) ⇒ <code>Promise</code>
Generates files from a given template and an AsyncAPIDocument object.

**Kind**: instance method of [<code>Generator</code>](#Generator)  

| Param | Type | Description |
| --- | --- | --- |
| asyncapiDocument | <code>AsyncAPIDocument</code> | AsyncAPIDocument object to use as source. |

<a name="Generator+generateFromString"></a>

### generator.generateFromString(asyncapiString) ⇒ <code>Promise</code>
Generates files from a given template and AsyncAPI string.

**Kind**: instance method of [<code>Generator</code>](#Generator)  

| Param | Type | Description |
| --- | --- | --- |
| asyncapiString | <code>String</code> | AsyncAPI string to use as source. |

<a name="Generator+generateFromFile"></a>

### generator.generateFromFile(asyncapiFile) ⇒ <code>Promise</code>
Generates files from a given template and AsyncAPI file.

**Kind**: instance method of [<code>Generator</code>](#Generator)  

| Param | Type | Description |
| --- | --- | --- |
| asyncapiFile | <code>String</code> | AsyncAPI file to use as source. |

<a name="Generator+generateTemplateFile"></a>

### generator.generateTemplateFile(asyncapiDocument, filePath) ⇒ <code>Promise</code>
Generates a given template file.

**Kind**: instance method of [<code>Generator</code>](#Generator)  

| Param | Type | Description |
| --- | --- | --- |
| asyncapiDocument | <code>AsyncAPIDocument</code> | AsyncAPI document to pass to the template. |
| filePath | <code>String</code> | Path to the file to render. Relative to the template directory. |

<a name="Generator+getTemplateFile"></a>

### generator.getTemplateFile(filePath) ⇒ <code>Promise</code>
Returns the content of a given template file.

**Kind**: instance method of [<code>Generator</code>](#Generator)  

| Param | Type | Description |
| --- | --- | --- |
| filePath | <code>String</code> | Path to the file to render. Relative to the template directory. |

