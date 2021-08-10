## Functions

<dl>
<dt><a href="#markdown2html">markdown2html()</a> ⇒ <code>string</code></dt>
<dd><p>Turns Markdown into HTML</p>
</dd>
<dt><a href="#log">log()</a></dt>
<dd><p>Logs input to server logs to stdout</p>
</dd>
<dt><a href="#logError">logError()</a></dt>
<dd><p>Logs input to server as error to stderr</p>
</dd>
<dt><a href="#getPayloadExamples">getPayloadExamples()</a> ⇒ <code>object</code></dt>
<dd><p>Extracts example from the message payload</p>
</dd>
<dt><a href="#getHeadersExamples">getHeadersExamples()</a> ⇒ <code>object</code></dt>
<dd><p>Extracts example from the message header</p>
</dd>
<dt><a href="#generateExample">generateExample()</a> ⇒ <code>string</code></dt>
<dd><p>Generate string with example from provided schema</p>
</dd>
<dt><a href="#oneLine">oneLine()</a> ⇒ <code>string</code></dt>
<dd><p>Turns multiline string into one liner</p>
</dd>
<dt><a href="#docline">docline()</a> ⇒ <code>string</code></dt>
<dd><p>Generate JSDoc from message properties of the header and the payload</p>
</dd>
<dt><a href="#replaceServerVariablesWithValues">replaceServerVariablesWithValues()</a> ⇒ <code>string</code></dt>
<dd><p>Helper function toreplace server varaibles in the URL</p>
</dd>
</dl>

<a name="markdown2html"></a>

## markdown2html() ⇒ <code>string</code>
Turns Markdown into HTML

**Kind**: global function  
**Returns**: <code>string</code> - HTML string  
**Md**: <code>string</code> - String with valid Markdown syntax  
<a name="log"></a>

## log()
Logs input to server logs to stdout

**Kind**: global function  
**Str**: <code>string</code> Info that is logged  
<a name="logError"></a>

## logError()
Logs input to server as error to stderr

**Kind**: global function  
**Str**: <code>string</code> Info that is logged  
<a name="getPayloadExamples"></a>

## getPayloadExamples() ⇒ <code>object</code>
Extracts example from the message payload

**Kind**: global function  
**Msg**: <code>object</code> - Parser Message function  
<a name="getHeadersExamples"></a>

## getHeadersExamples() ⇒ <code>object</code>
Extracts example from the message header

**Kind**: global function  
**Msg**: <code>object</code> - Parser Message function  
<a name="generateExample"></a>

## generateExample() ⇒ <code>string</code>
Generate string with example from provided schema

**Kind**: global function  
**Schema**: <code>object</code> - Schema object as JSON and not Schema model map  
**Options**: <code>object</code> - Options object. Supported options are listed here https://github.com/Redocly/openapi-sampler#usage  
<a name="oneLine"></a>

## oneLine() ⇒ <code>string</code>
Turns multiline string into one liner

**Kind**: global function  
**Str**: <code>string</code> - Any multiline string  
<a name="docline"></a>

## docline() ⇒ <code>string</code>
Generate JSDoc from message properties of the header and the payload

**Kind**: global function  
**Returns**: <code>string</code> - JSDoc compatible entry  
**Field**: <code>object</code> - Property object  
**Fieldname**: <code>string</code> - Name of documented property  
**Scopepropname**: <code>string</code> - Name of param for JSDocs  
**Example**  
```js
docline(
 Schema {
    _json: {
      type: 'integer',
      minimum: 0,
      maximum: 100,
      'x-parser-schema-id': '<anonymous-schema-3>'
    }
  },
  my-app-header,
  options.message.headers
)

Returned value will be ->  * @param {integer} options.message.headers.my-app-header
```
## replaceServerVariablesWithValues () ⇒ <code>string</code>
Helper function to replace server variables in the URL

**Kind**: Global function  
**Returns**: <code>string</code> - URL string with replaced variable values  
**url**: <code>string</code> - Input URL with variables  
**serverVariables**: <code>Object</code> - Varibles model map
