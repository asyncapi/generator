## Functions

<dl>
<dt><a href="#File">File()</a></dt>
<dd><p>Component is used to describe to the generator that you want a file to be created and rendered based on the defined children.</p>
</dd>
<dt><a href="#Indent">Indent()</a></dt>
<dd><p>Component is for wrapping multiple components and apply an indentation on those.</p>
<p>It supports any form of nested components as well, meaning you can have as many nested <code>Indent</code> components as you would like.</p>
</dd>
<dt><a href="#Text">Text()</a></dt>
<dd><p>Component is for defining a group of text which should be rendered on the same line.</p>
</dd>
<dt><a href="#render">render(component)</a> ⇒ <code>string</code></dt>
<dd><p>Renders given component to string</p>
</dd>
<dt><a href="#renderTemplate">renderTemplate(filepath)</a></dt>
<dd><p>render a file with react. This function automatically transforms jsx to js before importing the component.</p>
</dd>
<dt><a href="#transpileFiles">transpileFiles(directory, outputDir, options)</a></dt>
<dd><p>Transpile files in a given directory (and sub directory if recursive option are passed) and write it to an output directory, if no errors are thrown it completed successfully.</p>
</dd>
</dl>

<a name="IndentationTypes"></a>

## IndentationTypes : <code>enum</code>
Type of indentation to use

**Kind**: global enum  
**Read only**: true  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| TABS | <code>string</code> | indicate to use tabs as separator |
| SPACES | <code>string</code> | indicate to use spaces as separator |

<a name="File"></a>

## File()
Component is used to describe to the generator that you want a file to be created and rendered based on the defined children.

**Kind**: global function  
**Component**:   
**Example**  
```js
const name = "test.js"
const permissions = 0o777
return (
  <File name={name} permissions={permissions}>Test</File>
)
```
<a name="Indent"></a>

## Indent()
Component is for wrapping multiple components and apply an indentation on those.

It supports any form of nested components as well, meaning you can have as many nested `Indent` components as you would like.

**Kind**: global function  
**Component**:   
**Example**  
```js
const size = 4
const type = IndentationTypes.SPACES
return (
  <Indent size={size} type={type}>test</Indent>
)
```
<a name="Text"></a>

## Text()
Component is for defining a group of text which should be rendered on the same line.

**Kind**: global function  
**Component**:   
**Example**  
```js
const indent = 4
const type = IndentationTypes.SPACES
const newLines = 2
return (
  <Text indent={size} type={type} newLines={newLines}>Test</Text>
)
```
<a name="render"></a>

## render(component) ⇒ <code>string</code>
Renders given component to string

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| component | <code>ReactNode</code> | a given component to rendering |

**Example**  
```js
function Component({ textProp }) {
  return <>{textProp}</>
}
render(<Component textProp="someText" />)
```
<a name="renderTemplate"></a>

## renderTemplate(filepath)
render a file with react. This function automatically transforms jsx to js before importing the component.

**Kind**: global function  

| Param | Description |
| --- | --- |
| filepath | the path to file to render |

<a name="transpileFiles"></a>

## transpileFiles(directory, outputDir, options)
Transpile files in a given directory (and sub directory if recursive option are passed) and write it to an output directory, if no errors are thrown it completed successfully.

**Kind**: global function  

| Param | Description |
| --- | --- |
| directory | to transpile. |
| outputDir | to write the transpiled files to. |
| options | any extra options that should be passed. |

