---
title: Reusable Components API
weight: 77
---

## Components

<dl>
  <dt>
    <a href="#CloseConnection">CloseConnection</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a WebSocket close connection method with optional pre- and post-execution logic.

  </dd> 
  <dt>
    <a href="#Connect">Connect</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a WebSocket connection method for the specified programming language.

  </dd> 
  <dt>
    <a href="#DependencyProvider">DependencyProvider</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders the top-of-file dependency statements for the selected programming language.

  </dd> 
  <dt>
    <a href="#FileHeaderInfo">FileHeaderInfo</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a file header with metadata information such as title, version, protocol, host, and path.

  </dd> 
  <dt>
    <a href="#HandleMessage">HandleMessage</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a WebSocket message handler method with optional pre- and post-execution logic.

  </dd> 
  <dt>
    <a href="#MethodGenerator">MethodGenerator</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a language-specific formatted method definition.

  </dd> 
  <dt>
    <a href="#Models">Models</a>
      ⇒ `Array.<File>`
  </dt>
  <dd>

Renders an array of model files based on the AsyncAPI document.

  </dd> 
  <dt>
    <a href="#OnClose">OnClose</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a WebSocket onClose event handler for the specified programming language.

  </dd> 
  <dt>
    <a href="#OnError">OnError</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a WebSocket onError event handler for the specified programming language.

  </dd> 
  <dt>
    <a href="#OnMessage">OnMessage</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a WebSocket onMessage event handler for the specified programming language.

  </dd> 
  <dt>
    <a href="#OnOpen">OnOpen</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a WebSocket onOpen event handler for the specified programming language.

  </dd> 
  <dt>
    <a href="#QueryParamsVariables">QueryParamsVariables</a>
      ⇒ `Array.<JSX.Element>`
  </dt>
  <dd>

Renders query parameter variables code blocks.

  </dd> 
  <dt>
    <a href="#AvailableOperations">AvailableOperations</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a list of AsyncAPI operations with their headers and message examples.

  </dd> 
  <dt>
    <a href="#CoreMethods">CoreMethods</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a list of core WebSocket client methods for a given target language.

  </dd> 
  <dt>
    <a href="#Installation">Installation</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders the Installation Command for a given language.

  </dd> 
  <dt>
    <a href="#MessageExamples">MessageExamples</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders Message Examples of a given AsyncAPI operation.

  </dd> 
  <dt>
    <a href="#OperationHeader">OperationHeader</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a header section for a single AsyncAPI operation.

  </dd> 
  <dt>
    <a href="#Overview">Overview</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders an overview section for a WebSocket client.
Displays the API description, version, and server URL.

  </dd> 
  <dt>
    <a href="#Readme">Readme</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a README.md file for a given AsyncAPI document.

Composes multiple sections (overview, installation, usage, core methods,
and available operations) into a single File component based on the
provided AsyncAPI document, generator parameters, and target language.

  </dd> 
  <dt>
    <a href="#Usage">Usage</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a usage example snippet for a generated WebSocket client in a given language.

  </dd> 
  <dt>
    <a href="#RegisterErrorHandler">RegisterErrorHandler</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a WebSocket error handler registration method with optional pre- and post-execution logic.

  </dd> 
  <dt>
    <a href="#RegisterMessageHandler">RegisterMessageHandler</a>
      ⇒ `JSX.Element`
  </dt>
  <dd>

Renders a WebSocket message handler registration method with optional pre- and post-execution logic.

  </dd> 
  <dt>
    <a href="#SendOperations">SendOperations</a>
      ⇒ `Array.<JSX.Element>`
  </dt>
  <dd>

Renders WebSocket send operation methods.
Generates both static and instance methods for sending messages through WebSocket connections.

  </dd> 
</dl>


<a name="CloseConnection"></a>
## **CloseConnection()** 
Renders a WebSocket close connection method with optional pre- and post-execution logic.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Programming language used for method formatting. |
| props.framework | `string` | Framework used, if any (e.g., &#x27;quarkus&#x27; for Java). |
| props.methodName | `string` | Name of the method to generate. |
| props.methodParams | `Array.<string>` | List of parameters for the method. |
| props.preExecutionCode | `string` | Code to insert before the main function logic. |
| props.postExecutionCode | `string` | Code to insert after the main function logic. |
| props.indent | `number` | Indentation level for the method block. |



### Returns

- **`JSX.Element`** - A Text component that contains method block with appropriate formatting.



### Example

```js
const language = "java";
const framework = "quarkus";
const methodName = "terminateConnection";
const methodParams = ["String reason"];
const preExecutionCode = "// About to terminate connection";
const postExecutionCode = "// Connection terminated";
const indent = 2;

function renderCloseConnection() {
  return (
    <CloseConnection 
       language={language}
       framework={framework}
       methodName={methodName}
       methodParams={methodParams}
       preExecutionCode={preExecutionCode} 
       postExecutionCode={postExecutionCode} 
       indent={indent} 
     />
  );
}

renderCloseConnection();
```



<a name="Connect"></a>
## **Connect()** 
Renders a WebSocket connection method for the specified programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The programming language for which to generate connection code. |
| props.title | `string` | The title of the WebSocket server. |



### Returns

- **`JSX.Element`** - A Text component containing the generated WebSocket connection code for the specified language.



### Example

```js
const language = "python";
const title = "HoppscotchEchoWebSocketClient";

function renderConnect() {
  return(
   <Connect 
       language={language} 
       title={title} 
   />
  )
}

renderConnect();
```



<a name="DependencyProvider"></a>
## **DependencyProvider()** 
Renders the top-of-file dependency statements for the selected programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The programming language for which to render dependency statements. |
| props.framework | `string` | The framework (e.g., &#x27;quarkus&#x27; for Java). |
| props.role | `string` | The role (e.g., &#x27;client&#x27;, &#x27;connector&#x27; for Java). |
| props.additionalDependencies | `Array.<string>` | Optional additional dependencies to include. |



### Returns

- **`JSX.Element`** - A Text component that contains list of import/require statements.



### Example

```js
const language = "java";
const framework = "quarkus";
const role = "client";
const additionalDependencies = ["import java.util.concurrent.CompletableFuture;", "import java.time.Duration;"];

function renderDependencyProvider() {
  return (
    <DependencyProvider 
       language={language} 
       framework={framework} 
       role={role} 
       additionalDependencies={additionalDependencies} 
    />
  )
}
renderDependencyProvider();
```



<a name="FileHeaderInfo"></a>
## **FileHeaderInfo()** 
Renders a file header with metadata information such as title, version, protocol, host, and path.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.info | `Object` | Info object from the AsyncAPI document. |
| props.server | `Object` | Server object from the AsyncAPI document. |
| props.language | `Language` | Programming language used for comment formatting. |



### Returns

- **`JSX.Element`** - A Text component that contains file header.



### Example

```js
import path from "path";
import { Parser, fromFile } from "@asyncapi/parser";
import { FileHeaderInfo } from "@asyncapi/generator-components";

async function renderFileHeader() {
  const parser = new Parser();
  const asyncapi_websocket_query = path.resolve(__dirname, "../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml");
  const language = "javascript";
  
  // Parse the AsyncAPI document 
  const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
  const parsedAsyncAPIDocument = parseResult.document;
  
  return (
    <FileHeaderInfo 
      info={parsedAsyncAPIDocument.info()} 
      server={parsedAsyncAPIDocument.servers().get("withPathname")} 
      language={language} 
    />
  )
}

renderFileHeader().catch(console.error);
```



<a name="HandleMessage"></a>
## **HandleMessage()** 
Renders a WebSocket message handler method with optional pre- and post-execution logic.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Programming language used for method formatting. |
| props.methodName | `string` | Name of the method to generate. |
| props.methodParams | `Array.<string>` | List of parameters for the method. |
| props.preExecutionCode | `string` | Code to insert before the main function logic. |
| props.postExecutionCode | `string` | Code to insert after the main function logic. |
| props.customMethodConfig | `Object` | Optional overrides for default method configuration. |



### Returns

- **`JSX.Element`** - A Text component that contains method block with appropriate formatting.



### Example

```js
const language = "javascript";
const methodName = "handleMessage";
const methodParams = ["message","cb"];
const preExecutionCode = "// Pass the incoming message to all registered message handlers.";
const postExecutionCode = "// Passed the incoming message to all registered message handlers.";
const customMethodConfig = {
  javascript: {
    methodDocs: "// Method to handle message with callback",
    methodLogic: "if (cb) cb(message);"
  }
};

function renderHandleMessage() {
  return (
    <HandleMessage 
       language={language} 
       methodName={methodName} 
       methodParams={methodParams} 
       preExecutionCode={preExecutionCode} 
       postExecutionCode={postExecutionCode} 
       customMethodConfig={customMethodConfig} 
    />
  )
}

renderHandleMessage();
```



<a name="MethodGenerator"></a>
## **MethodGenerator()** 
Renders a language-specific formatted method definition.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Programming language used for method formatting. |
| props.methodName | `string` | Name of the method. |
| props.methodParams | `Array.<string>` | Method parameters. |
| props.methodDocs | `string` | Optional documentation string. |
| props.methodLogic | `string` | Core method logic. |
| props.preExecutionCode | `string` | Code before main logic. |
| props.postExecutionCode | `string` | Code after main logic. |
| props.indent | `number` | Indentation for the method block. |
| props.newLines | `number` | Number of new lines after method. |
| props.customMethodConfig | `Object` | Optional custom syntax configuration for the current language. |
| props.methodConfig | `Record.<Language, (\{methodDocs: (string|undefined), methodLogic: (string|undefined)\}|Record.<string, \{methodDocs: (string|undefined), methodLogic: (string|undefined)\}>)>` | Language-level or framework-level configuration. |
| props.framework | `string` | Framework name for nested configurations (e.g., &#x27;quarkus&#x27; for Java). |



### Returns

- **`JSX.Element`** - A Text component that contains method block with appropriate formatting.



### Example

```js
const language = "java";
const methodName = "registerHandler";
const methodParams = ["Handler handler"];
const methodDocs = "// Process the input data.";
const methodLogic = "// TODO: implement";
const preExecutionCode = "// Before handler registration";
const postExecutionCode = "// After handler registration";
const customMethodConfig={ openingTag: "{", closingTag: "}", indentSize: 6 };
const methodConfig = {"java" : {"quarkus": {methodDocs : methodDocs, methodLogic: methodLogic }}};
const framework = "quarkus";

function renderMethodGenerator() {
  return (
    <MethodGenerator 
       language={language}
       methodName={methodName} 
       methodParams={methodParams} 
       methodDocs={methodDocs} 
       methodLogic={methodLogic} 
       preExecutionCode={preExecutionCode} 
       postExecutionCode={postExecutionCode} 
       customMethodConfig={customMethodConfig} 
       methodConfig={methodConfig} 
       framework={framework} 
    />
  )
}

renderMethodGenerator();
```



<a name="Models"></a>
## **Models()** 
Renders an array of model files based on the AsyncAPI document.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.asyncapi | `AsyncAPIDocumentInterface` | Parsed AsyncAPI document object. |
| props.language | `Language` | Target programming language for the generated models. |
| props.format | `Format` | Naming format for generated files. |
| props.presets | `Object` | Custom presets for the generator instance. |
| props.constraints | `Object` | Custom constraints for the generator instance. |



### Returns

- **`Array.<File>`** - Array of File components with generated model content.



### Example

```js
import path from "path";
import { Parser, fromFile } from "@asyncapi/parser";
import { Models } from "@asyncapi/generator-components";

async function renderModel() {
   const parser = new Parser();
   const asyncapi_v3_path = path.resolve(__dirname, "../__fixtures__/asyncapi-v3.yml");

    // Parse the AsyncAPI document
   const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
   const parsedAsyncAPIDocument = parseResult.document;
   
   const language = "java";
   
   return (
     <Models 
        asyncapi={parsedAsyncAPIDocument} 
        language={language}
     />
   )
}

renderModel().catch(console.error);
```



<a name="OnClose"></a>
## **OnClose()** 
Renders a WebSocket onClose event handler for the specified programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The programming language for which to generate onClose handler code. |
| props.framework | `string` | Framework variant; required for framework-specific languages (e.g., &#x27;quarkus&#x27; for java). |
| props.title | `string` | The title of the WebSocket server. |



### Returns

- **`JSX.Element`** - A Text component containing the onClose handler code for the specified language.



### Example

```js
const language = "java";
const framework = "quarkus";
const title = "HoppscotchEchoWebSocketClient";

function renderOnClose() {
 return (
   <OnClose 
      language={language} 
      framework={framework} 
      title={title}  
   />
 )
}

renderOnClose();
```



<a name="OnError"></a>
## **OnError()** 
Renders a WebSocket onError event handler for the specified programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The programming language for which to generate onError handler code. |



### Returns

- **`JSX.Element`** - A Text component containing the onError handler code for the specified language.



### Example

```js
const language = "javascript";

function renderOnError() {
  return (
    <OnError language={language} />
  )
}

renderOnError();
```



<a name="OnMessage"></a>
## **OnMessage()** 
Renders a WebSocket onMessage event handler for the specified programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The programming language for which to generate onMessage handler code. |



### Returns

- **`JSX.Element`** - A Text component containing the onMessage handler code for the specified language.



### Example

```js
const language = "javascript";

function renderOnMessage() {
  return (
    <OnMessage language={language} />
  )
}

renderOnMessage();
```



<a name="OnOpen"></a>
## **OnOpen()** 
Renders a WebSocket onOpen event handler for the specified programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The programming language for which to generate onOpen handler code. |
| props.framework | `string` | Optional framework variant (e.g., &#x27;quarkus&#x27; for java). |
| props.title | `string` | The title of the WebSocket server. |



### Returns

- **`JSX.Element`** - A Text component containing the onOpen handler code for the specified language.



### Example

```js
const language = "java";
const framework = "quarkus";
const title = "HoppscotchEchoWebSocketClient";

function renderOnOpen() {
  return (
    <OnOpen 
       language={language} 
       framework={framework} 
       title={title} 
    />
  )
}

renderOnOpen();
```



<a name="QueryParamsVariables"></a>
## **QueryParamsVariables()** 
Renders query parameter variables code blocks.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The target programming language. |
| props.framework | `string` | Optional framework for the language. |
| props.queryParams | `Array.<Array.<string>>` | Array of query parameters, each represented as [paramName, paramType?]. |



### Returns

- **`Array.<JSX.Element>`** - Array of Text components for each query parameter, or null if queryParams is invalid.



### Example

```js
import path from "path";
import { Parser, fromFile } from "@asyncapi/parser";
import { getQueryParams } from "@asyncapi/generator-helpers";
import { QueryParamsVariables } from "@asyncapi/generator-components";

async function renderQueryParamsVariable(){
   const parser = new Parser();
   const asyncapi_v3_path = path.resolve(__dirname, "../__fixtures__/asyncapi-v3.yml");
   
   // Parse the AsyncAPI document
   const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
   const parsedAsyncAPIDocument = parseResult.document;
   
   const channels = parsedAsyncAPIDocument.channels();
   const queryParamsObject = getQueryParams(channels);
   const queryParamsArray = queryParamsObject ? Array.from(queryParamsObject.entries()) : [];
   
   const language = "java";
   const framework = "quarkus";
   
   return (
     <QueryParamsVariables 
         language={language} 
         framework={framework}   
         queryParams={queryParamsArray} 
     />
   )
}

renderQueryParamsVariable().catch(console.error);
```



<a name="AvailableOperations"></a>
## **AvailableOperations()** 
Renders a list of AsyncAPI operations with their headers and message examples.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component Props |
| props.operations | `Array.<Object>` | Array of AsyncAPI Operation objects. |



### Returns

- **`JSX.Element`** - A Component containing rendered operations, or null if no operations are provided



### Example

```js
import path from "path";
import { Parser, fromFile } from "@asyncapi/parser";
import { AvailableOperations } from "@asyncapi/generator-components";

async function renderAvailableOperations(){
  const parser = new Parser();
  const asyncapi_websocket_query = path.resolve(__dirname, '../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

  //parse the AsyncAPI document
  const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
  const parsedAsyncAPIDocument = parseResult.document;

  return (
   <AvailableOperations operations={parsedAsyncAPIDocument.operations().all()} />
  )    
}

renderAvailableOperations().catch(console.error);
```



<a name="CoreMethods"></a>
## **CoreMethods()** 
Renders a list of core WebSocket client methods for a given target language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props |
| props.language | `Language` | Target language used to select method names. |



### Returns

- **`JSX.Element`** - A Text component that contains a list of core client methods.



### Example

```js
const language = "javascript";

function renderCoreMethods() {
  return (
    <CoreMethods language={language} />
  )
}

renderCoreMethods();
```



<a name="Installation"></a>
## **Installation()** 
Renders the Installation Command for a given language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props |
| props.language | `Language` | The programming language for which to generate Installation Command. |



### Returns

- **`JSX.Element`** - A Text component that contains Installation Command.



### Example

```js
const language = "javascript";

function renderInstallation() {
  return (
    <Installation language={language} />
  )
}

renderInstallation()
```



<a name="MessageExamples"></a>
## **MessageExamples()** 
Renders Message Examples of a given AsyncAPI operation.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component Props |
| props.operation | `Object` | An AsyncAPI Operation object. |



### Returns

- **`JSX.Element`** - A Text component that contains message examples, or null when no examples exist.



### Example

```js
import path from "path";
import { Parser, fromFile } from "@asyncapi/parser";
import { MessageExamples } from "@asyncapi/generator-components";

async function renderMessageExamples(){
  const parser = new Parser();
  const asyncapi_websocket_query = path.resolve(__dirname, '../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

  //parse the AsyncAPI document
  const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
  const parsedAsyncAPIDocument = parseResult.document;
  const operations = parsedAsyncAPIDocument.operations().all();

  return operations.map((operation) => {
     return (
       <MessageExamples operation={operation} />
     )    
  });
}

renderMessageExamples().catch(console.error);
```



<a name="OperationHeader"></a>
## **OperationHeader()** 
Renders a header section for a single AsyncAPI operation.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component properties. |
| props.operation | `Object` | An AsyncAPI Operation object. |



### Returns

- **`JSX.Element`** - A Text component that contains formatted operation header.



### Example

```js
import path from "path";
import { Parser, fromFile } from "@asyncapi/parser";
import { OperationHeader } from "@asyncapi/generator-components";

async function renderOperationHeader(){
  const parser = new Parser();
  const asyncapi_websocket_query = path.resolve(__dirname, '../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

  //parse the AsyncAPI document
  const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
  const parsedAsyncAPIDocument = parseResult.document;
  const operations = parsedAsyncAPIDocument.operations().all();

  return operations.map((operation) => {
     return (
       <OperationHeader operation={operation} />
     )    
  });
}

renderOperationHeader().catch(console.error);
```



<a name="Overview"></a>
## **Overview()** 
Renders an overview section for a WebSocket client.
Displays the API description, version, and server URL.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props |
| props.info | `Object` | Info object from the AsyncAPI document. |
| props.title | `string` | Title from the AsyncAPI document. |
| props.serverUrl | `string` | ServerUrl from a specific server from the AsyncAPI document. |



### Returns

- **`JSX.Element`** - A Text component that contains the Overview of a Websocket client.



### Example

```js
import path from "path";
import { Parser, fromFile } from "@asyncapi/parser";
import { getServer, getServerUrl } from '@asyncapi/generator-helpers';
import { Overview } from "@asyncapi/generator-components";

async function renderOverview(){
  const parser = new Parser();
  const asyncapi_websocket_query = path.resolve(__dirname, '../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

  //parse the AsyncAPI document
  const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
  const parsedAsyncAPIDocument = parseResult.document;

  const info = parsedAsyncAPIDocument.info();
  const title = info.title();
  const server = getServer(parsedAsyncAPIDocument.servers(), 'withoutPathName');
  const serverUrl = getServerUrl(server);

  return (
     <Overview 
       info={info} 
       title={title} 
       serverUrl={serverUrl} 
     />
  )
}

renderOverview().catch(console.error);
```



<a name="Readme"></a>
## **Readme()** 
Renders a README.md file for a given AsyncAPI document.

Composes multiple sections (overview, installation, usage, core methods,
and available operations) into a single File component based on the
provided AsyncAPI document, generator parameters, and target language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props |
| props.asyncapi | `AsyncAPIDocumentInterface` | Parsed AsyncAPI document instance. |
| props.params | `Object` | Generator parameters used to customize output |
| props.language | `Language` | Target language used to render language-specific sections. |



### Returns

- **`JSX.Element`** - A File component representing the generated README.md.



### Example

```js
import path from "path";
import { Parser, fromFile } from "@asyncapi/parser";
import { buildParams } from '@asyncapi/generator-helpers';
import { Readme } from "@asyncapi/generator-components";

async function renderReadme(){
  const parser = new Parser();
  const asyncapi_websocket_query = path.resolve(__dirname, '../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

  // parse the AsyncAPI document
  const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
  const parsedAsyncAPIDocument = parseResult.document;
  const language = "javascript";
  const config = { clientFileName: 'myClient.js' };
  const params = buildParams('javascript', config, 'echoServer');
  
  return (
    <Readme 
      asyncapi={parsedAsyncAPIDocument} 
      params={params} 
      language={language}
    />
  )
}

renderReadme().catch(console.error);
```



<a name="Usage"></a>
## **Usage()** 
Renders a usage example snippet for a generated WebSocket client in a given language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props |
| props.clientName | `string` | The exported name of the client. |
| props.clientFileName | `string` | The file name where the client is defined. |
| props.language | `Language` | The target language for which to render the usage snippet |



### Returns

- **`JSX.Element`** - A Text component containing a formatted usage example snippet.



### Example

```js
const clientName = "MyClient";
const clientFileName = "myClient.js";
const language = "javascript";

function renderUsage(){
  return (
    <Usage 
       clientName={clientName} 
       clientFileName={clientFileName} 
       language={language}
    />
  )
}

renderUsage();
```



<a name="RegisterErrorHandler"></a>
## **RegisterErrorHandler()** 
Renders a WebSocket error handler registration method with optional pre- and post-execution logic.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Programming language used for method formatting. |
| props.methodName | `string` | Name of the method to generate. |
| props.methodParams | `Array.<string>` | List of parameters for the method. |
| props.preExecutionCode | `string` | Code to insert before the main function logic. |
| props.postExecutionCode | `string` | Code to insert after the main function logic. |
| props.customMethodConfig | `Object` | Optional overrides for default method configuration. |



### Returns

- **`JSX.Element`** - A Text component that contains method block with appropriate formatting.



### Example

```js
const language = "python";
const methodName = "registerErrorHandler";
const methodParams = ["self", "handler"];
const preExecutionCode = "# Pre-register operations";
const postExecutionCode = "# Post-register operations";
const customMethodConfig = { returnType: "int", openingTag: "{", closingTag: "}", indentSize: 2};

function renderRegisterErrorHandler() {
 return (
   <RegisterErrorHandler 
      language={language} 
      methodName={methodName} 
      methodParams={methodParams} 
      preExecutionCode={preExecutionCode} 
      postExecutionCode={postExecutionCode} 
      customMethodConfig={customMethodConfig}   
   />
 )
}

renderRegisterErrorHandler();
```



<a name="RegisterMessageHandler"></a>
## **RegisterMessageHandler()** 
Renders a WebSocket message handler registration method with optional pre- and post-execution logic.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Programming language used for method formatting. |
| props.methodName | `string` | Name of the method to generate. |
| props.methodParams | `Array.<string>` | List of parameters for the method. |
| props.preExecutionCode | `string` | Code to insert before the main function logic. |
| props.postExecutionCode | `string` | Code to insert after the main function logic. |



### Returns

- **`JSX.Element`** - A Text component that contains method block with appropriate formatting.



### Example

```js
const language = "python";
const methodName = "registerMessageHandler";
const methodParams = ["self", "handler"];
const preExecutionCode = "# Pre-register operations";
const postExecutionCode = "# Post-register operations";

function renderRegisterMessageHandler(){
  return (
     <RegisterMessageHandler 
       language={language} 
       methodName={methodName} 
       methodParams={methodParams} 
       preExecutionCode={preExecutionCode} 
       postExecutionCode={postExecutionCode} 
     />
  )
}

renderRegisterMessageHandler();
```



<a name="SendOperations"></a>
## **SendOperations()** 
Renders WebSocket send operation methods.
Generates both static and instance methods for sending messages through WebSocket connections.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The target programming language. |
| props.sendOperations | `Array.<Object>` | Array of send operations from AsyncAPI document. |
| props.clientName | `string` | The name of the client class. |



### Returns

- **`Array.<JSX.Element>`** - Array of Text components for static and non-static WebSocket send operation methods, or null if no send operations are provided.



### Example

```js
import path from "path";
import { Parser, fromFile } from "@asyncapi/parser";
import { SendOperations } from "@asyncapi/generator-components";

async function renderSendOperations(){
   const parser = new Parser();
   const asyncapi_v3_path = path.resolve(__dirname, '../__fixtures__/asyncapi-v3.yml');
   
   // Parse the AsyncAPI document
   const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
   const parsedAsyncAPIDocument = parseResult.document;
   
   const language = "javascript";
   const clientName = "AccountServiceAPI";
   const sendOperations = parsedAsyncAPIDocument.operations().filterBySend();
   
   return (
      <SendOperations 
         language={language} 
         clientName={clientName} 
         sendOperations={sendOperations} 
      />
   )
}

renderSendOperations().catch(console.error);
```


