<!-- markdownlint-disable MD024 -->
## Components

<dl>
  <dt>
    <a href="#CloseConnection">CloseConnection</a>
      ⇒ <code>JSX.Element</code>
  </dt>
  <dd>
    <p>Renders a WebSocket close connection method with optional pre- and post-execution logic.</p>
  </dd> 
  <dt>
    <a href="#Connect">Connect</a>
      ⇒ <code>JSX.Element</code>
  </dt>
  <dd>
    <p>Component that renders WebSocket connection method for the specified programming language.</p>
  </dd> 
  <dt>
    <a href="#DependencyProvider">DependencyProvider</a>
      ⇒ <code>JSX.Element</code>
  </dt>
  <dd>
    <p>Renders the top-of-file dependency statements for the selected programming language.</p>
  </dd> 
  <dt>
    <a href="#FileHeaderInfo">FileHeaderInfo</a>
      ⇒ <code>JSX.Element</code>
  </dt>
  <dd>
    <p>Renders a file header with metadata information such as title, version, protocol, host, and path.</p>
  </dd> 
  <dt>
    <a href="#HandleMessage">HandleMessage</a>
      ⇒ <code>JSX.Element</code>
  </dt>
  <dd>
    <p>Renders a WebSocket message handler method with optional pre- and post-execution logic.</p>
  </dd> 
  <dt>
    <a href="#MethodGenerator">MethodGenerator</a>
      ⇒ <code>JSX.Element</code>
  </dt>
  <dd>
    <p>Generic Method rendering component.</p>
  </dd> 
  <dt>
    <a href="#Models">Models</a>
      ⇒ <code>Array.&lt;File&gt;</code>
  </dt>
  <dd>
    <p>Generates and returns an array of model files based on the AsyncAPI document.</p>
  </dd> 
  <dt>
    <a href="#OnClose">OnClose</a>
      ⇒ <code>JSX.Element</code>
  </dt>
  <dd>
    <p>Component that renders WebSocket onClose event handler for the specified programming language.</p>
  </dd> 
  <dt>
    <a href="#OnError">OnError</a>
      ⇒ <code>JSX.Element</code>
  </dt>
  <dd>
    <p>Component that renders WebSocket onError event handler for the specified programming language.</p>
  </dd> 
  <dt>
    <a href="#OnMessage">OnMessage</a>
      ⇒ <code>JSX.Element</code>
  </dt>
  <dd>
    <p>Component that renders WebSocket onMessage event handler for the specified programming language.</p>
  </dd> 
  <dt>
    <a href="#OnOpen">OnOpen</a>
      ⇒ <code>JSX.Element</code>
  </dt>
  <dd>
    <p>Component that renders WebSocket onOpen event handler for the specified programming language.</p>
  </dd> 
  <dt>
    <a href="#QueryParamsVariables">QueryParamsVariables</a>
      ⇒ <code>Array.&lt;React.ReactNode&gt;</code>
  </dt>
  <dd>
    <p>Component for rendering query parameter variables code.</p>
  </dd> 
  <dt>
    <a href="#RegisterErrorHandler">RegisterErrorHandler</a>
      ⇒ <code>JSX.Element</code>
  </dt>
  <dd>
    <p>Renders a WebSocket error handler registration method with optional pre- and post-execution logic.</p>
  </dd> 
  <dt>
    <a href="#RegisterMessageHandler">RegisterMessageHandler</a>
      ⇒ <code>JSX.Element</code>
  </dt>
  <dd>
    <p>Renders a WebSocket message handler registration method with optional pre- and post-execution logic.</p>
  </dd> 
  <dt>
    <a href="#SendOperations">SendOperations</a>
      ⇒ <code>Array.&lt;React.ReactNode&gt;</code>
  </dt>
  <dd>
    <p>Component for rendering WebSocket send operation methods.
Generates both static and instance methods for sending messages through WebSocket connections.</p>
  </dd> 
</dl>


<a name="CloseConnection"></a>
## **CloseConnection()** 
Renders a WebSocket close connection method with optional pre- and post-execution logic.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | <code>Object</code> | Component props. |
| props.language | <code>Language</code> | Programming language used for method formatting. |
| props.framework | <code>string</code> | Framework used, if any (e.g., &#x27;quarkus&#x27; for Java). |
| props.methodName | <code>string</code> | Name of the method to generate. |
| props.methodParams | <code>Array.&lt;string&gt;</code> | List of parameters for the method. |
| props.preExecutionCode | <code>string</code> | Code to insert before the main function logic. |
| props.postExecutionCode | <code>string</code> | Code to insert after the main function logic. |
| props.indent | <code>number</code> | Indentation level for the method block. |



### Returns

- **JSX.Element** - Rendered method block with appropriate formatting.



### Example

```js
const language = "java";
const framework = "quarkus";
const methodName = "terminateConnection";
const methodParams = ["self"];
const preExecutionCode = "// About to terminate connection";
const postExecutionCode = "// Connection terminated";
const indent = 2;

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
```



<a name="Connect"></a>
## **Connect()** 
Component that renders WebSocket connection method for the specified programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | <code>Object</code> | Component properties. |
| props.language | <code>Language</code> | The programming language for which to generate connection code. |
| props.title | <code>string</code> | The title of the WebSocket server. |



### Returns

- **JSX.Element** - A Text component containing the generated WebSocket connection code for the specified language.



### Example

```js
const language = "python";
const title = "HoppscotchEchoWebSocketClient";

return(
 <Connect 
     language={language} 
     title={title} 
 />
)
```



<a name="DependencyProvider"></a>
## **DependencyProvider()** 
Renders the top-of-file dependency statements for the selected programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | <code>Object</code> | Component props. |
| props.language | <code>Language</code> | The programming language for which to render dependency statements. |
| props.framework | <code>string</code> | The framework (e.g., &#x27;quarkus&#x27; for Java). |
| props.role | <code>string</code> | The role (e.g., &#x27;client&#x27;, &#x27;connector&#x27; for Java). |
| props.additionalDependencies | <code>Array.&lt;string&gt;</code> | Optional additional dependencies to include. |



### Returns

- **JSX.Element** - Rendered list of import/require statements.



### Example

```js
const language = "java";
const framework = "quarkus";
const role = "client";
const additionalDependencies = ["import java.util.concurrent.CompletableFuture;", "import java.time.Duration;"];

return (
  <DependencyProvider 
     language={language} 
     framework={framework} 
     role={role} 
     additionalDependencies={additionalDependencies} 
  />
)
```



<a name="FileHeaderInfo"></a>
## **FileHeaderInfo()** 
Renders a file header with metadata information such as title, version, protocol, host, and path.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | <code>Object</code> | Component props. |
| props.info | <code>object</code> | Info object from the AsyncAPI document. |
| props.server | <code>object</code> | Server object from the AsyncAPI document. |
| props.language | <code>Language</code> | Programming language used for comment formatting. |



### Returns

- **JSX.Element** - Rendered file header.



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
```



<a name="HandleMessage"></a>
## **HandleMessage()** 
Renders a WebSocket message handler method with optional pre- and post-execution logic.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | <code>Object</code> | Component props. |
| props.language | <code>Language</code> | Programming language used for method formatting. |
| props.methodName | <code>string</code> | Name of the method to generate. |
| props.methodParams | <code>Array.&lt;string&gt;</code> | List of parameters for the method. |
| props.preExecutionCode | <code>string</code> | Code to insert before the main function logic. |
| props.postExecutionCode | <code>string</code> | Code to insert after the main function logic. |
| props.customMethodConfig | <code>Object</code> | Optional overrides for default method configuration. |



### Returns

- **JSX.Element** - Rendered method block with appropriate formatting.



### Example

```js
const language = "javascript";
const methodName = "handleMessage";
const methodParams = ["self", "message"];
const preExecutionCode = "// Pass the incoming message to all registered message handlers.";
const postExecutionCode = "// Passed the incoming message to all registered message handlers.";
const customMethodConfig = {
  javascript: {
    methodDocs: "// Method to handle message with callback",
    methodLogic: "if (cb) cb(message);"
  }
};
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
```



<a name="MethodGenerator"></a>
## **MethodGenerator()** 
Generic Method rendering component.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | <code>Object</code> | Component props. |
| props.language | <code>Language</code> | Programming language used for method formatting. |
| props.methodName | <code>string</code> | Name of the method. |
| props.methodParams | <code>Array.&lt;string&gt;</code> | Method parameters. |
| props.methodDocs | <code>string</code> | Optional documentation string. |
| props.methodLogic | <code>string</code> | Core method logic. |
| props.preExecutionCode | <code>string</code> | Code before main logic. |
| props.postExecutionCode | <code>string</code> | Code after main logic. |
| props.indent | <code>number</code> | Indentation for the method block. |
| props.newLines | <code>number</code> | Number of new lines after method. |
| props.customMethodConfig | <code>Object</code> | Optional custom syntax configuration for the current language. |
| props.methodConfig | <code>Record.&lt;Language, ({methodDocs: (string&#124;undefined), methodLogic: (string&#124;undefined)}&#124;Record.&lt;string, {methodDocs: (string&#124;undefined), methodLogic: (string&#124;undefined)}&gt;)&gt;</code> | Language-level or framework-level configuration. |
| props.framework | <code>string</code> | Framework name for nested configurations (e.g., &#x27;quarkus&#x27; for Java). |



### Returns

- **JSX.Element** - Rendered method block with appropriate formatting.



### Example

```js
const language = "java";
const methodName = "registerHandler";
const methodParams = ["self", "handler"];
const methodDocs = "// Process the input data.";
const methodLogic = "// TODO: implement";
const preExecutionCode = "// Before handler registration";
const postExecutionCode = "// After handler registration";
const customMethodConfig={ openingTag: "{", closingTag: "}", indentSize: 6 };
const methodConfig = {"java" : {methodDocs : methodDocs, methodLogic: methodLogic }};
const framework = "quarkus";


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
```



<a name="Models"></a>
## **Models()** 
Generates and returns an array of model files based on the AsyncAPI document.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| params | <code>Object</code> | The parameters for the function. |
| params.asyncapi | <code>AsyncAPIDocumentInterface</code> | Parsed AsyncAPI document object. |
| params.language | <code>Language</code> | Target programming language for the generated models. |
| params.format | <code>Format</code> | Naming format for generated files. |
| params.presets | <code>object</code> | Custom presets for the generator instance. |
| params.constraints | <code>object</code> | Custom constraints for the generator instance. |



### Returns

- **Array.&lt;File&gt;** - Array of File components with generated model content.



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
```



<a name="OnClose"></a>
## **OnClose()** 
Component that renders WebSocket onClose event handler for the specified programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | <code>Object</code> | Component properties. |
| props.language | <code>Language</code> | The programming language for which to generate onClose handler code. |
| props.framework | <code>string</code> | Optional framework variant (e.g., &#x27;quarkus&#x27; for java). |
| props.title | <code>string</code> | The title of the WebSocket server. |



### Returns

- **JSX.Element** - A Text component containing the onClose handler code for the specified language.



### Example

```js
const language = "java";
const framework = "quarkus";
const title = "HoppscotchEchoWebSocketClient";

return (
  <OnClose 
     language={language} 
     framework={framework} 
     title={title}  
  />
)
```



<a name="OnError"></a>
## **OnError()** 
Component that renders WebSocket onError event handler for the specified programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | <code>Object</code> | Component properties. |
| props.language | <code>Language</code> | The programming language for which to generate onError handler code. |



### Returns

- **JSX.Element** - A Text component containing the onError handler code for the specified language.



### Example

```js
const language = "javascript";
return (
  <OnError language={language} />
)
```



<a name="OnMessage"></a>
## **OnMessage()** 
Component that renders WebSocket onMessage event handler for the specified programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | <code>Object</code> | Component properties. |
| props.language | <code>Language</code> | The programming language for which to generate onMessage handler code. |



### Returns

- **JSX.Element** - A Text component containing the onMessage handler code for the specified language.



### Example

```js
const language = "javascript";
return (
  <OnMessage language={language} />
)
```



<a name="OnOpen"></a>
## **OnOpen()** 
Component that renders WebSocket onOpen event handler for the specified programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | <code>Object</code> | Component properties. |
| props.language | <code>Language</code> | The programming language for which to generate onOpen handler code. |
| props.framework | <code>string</code> | Optional framework variant (e.g., &#x27;quarkus&#x27; for java). |
| props.title | <code>string</code> | The title of the WebSocket server. |



### Returns

- **JSX.Element** - A Text component containing the onOpen handler code for the specified language.



### Example

```js
const language = "java";
const framework = "quarkus";
const title = "HoppscotchEchoWebSocketClient";

return (
  <OnOpen 
     language={language} 
     framework={framework} 
     title={title} 
  />
)
```



<a name="QueryParamsVariables"></a>
## **QueryParamsVariables()** 
Component for rendering query parameter variables code.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | <code>Object</code> | Component props. |
| props.language | <code>Language</code> | The target programming language. |
| props.framework | <code>string</code> | Optional framework for the language. |
| props.queryParams | <code>Array.&lt;Array.&lt;string&gt;&gt;</code> | Array of query parameters, each represented as [paramName, paramType?]. |



### Returns

- **Array.&lt;React.ReactNode&gt;** - Array of Text components for each query parameter, or null if queryParams is invalid.



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
```



<a name="RegisterErrorHandler"></a>
## **RegisterErrorHandler()** 
Renders a WebSocket error handler registration method with optional pre- and post-execution logic.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | <code>Object</code> | Component props. |
| props.language | <code>Language</code> | Programming language used for method formatting. |
| props.methodName | <code>string</code> | Name of the method to generate. |
| props.methodParams | <code>Array.&lt;string&gt;</code> | List of parameters for the method. |
| props.preExecutionCode | <code>string</code> | Code to insert before the main function logic. |
| props.postExecutionCode | <code>string</code> | Code to insert after the main function logic. |
| props.customMethodConfig | <code>Object</code> | Optional overrides for default method configuration. |



### Returns

- **JSX.Element** - Rendered method block with appropriate formatting.



### Example

```js
const language = "python";
const methodName = "registerErrorHandler";
const methodParams = ["self", "handler"];
const preExecutionCode = "# Pre-register operations";
const postExecutionCode = "# Post-register operations";
const customMethodConfig = { returnType: "int", openingTag: "{", closingTag: "}", indentSize: 2};

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
```



<a name="RegisterMessageHandler"></a>
## **RegisterMessageHandler()** 
Renders a WebSocket message handler registration method with optional pre- and post-execution logic.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | <code>Object</code> | Component props. |
| props.language | <code>Language</code> | Programming language used for method formatting. |
| props.methodName | <code>string</code> | Name of the method to generate. |
| props.methodParams | <code>Array.&lt;string&gt;</code> | List of parameters for the method. |
| props.preExecutionCode | <code>string</code> | Code to insert before the main function logic. |
| props.postExecutionCode | <code>string</code> | Code to insert after the main function logic. |



### Returns

- **JSX.Element** - Rendered method block with appropriate formatting.



### Example

```js
const language = "python";
const methodName = "registerMessageHandler";
const methodParams = ["self", "handler"];
const preExecutionCode = "# Pre-register operations";
const postExecutionCode = "# Post-register operations";

return (
   <RegisterMessageHandler 
     language={language} 
     methodName={methodName} 
     methodParams={methodParams} 
     preExecutionCode={preExecutionCode} 
     postExecutionCode={postExecutionCode} 
   />
)
```



<a name="SendOperations"></a>
## **SendOperations()** 
Component for rendering WebSocket send operation methods.
Generates both static and instance methods for sending messages through WebSocket connections.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | <code>Object</code> | Component props. |
| props.language | <code>Language</code> | The target programming language. |
| props.sendOperations | <code>Array.&lt;Object&gt;</code> | Array of send operations from AsyncAPI document. |
| props.clientName | <code>string</code> | The name of the client class. |



### Returns

- **Array.&lt;React.ReactNode&gt;** - Array of Text components for static and non-static WebSocket send operation methods, or null if no send operations are provided.



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
```


