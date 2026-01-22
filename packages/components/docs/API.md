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
  </dt>
  <dd>
    <p>Component that renders WebSocket onClose event handler for the specified programming language.</p>
  </dd> 
  <dt>
    <a href="#OnError">OnError</a>
  </dt>
  <dd>
    <p>Component that renders WebSocket onError event handler for the specified programming language.</p>
  </dd> 
  <dt>
    <a href="#OnMessage">OnMessage</a>
  </dt>
  <dd>
    <p>Component that renders WebSocket onMessage event handler for the specified programming language.</p>
  </dd> 
  <dt>
    <a href="#OnOpen">OnOpen</a>
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
  </dt>
  <dd>
    <p>Component for rendering WebSocket send operation methods.
Generates both static and instance methods for sending messages through WebSocket connections.</p>
  </dd> 
</dl>


<a name="CloseConnection"></a>
## **CloseConnection** 
Renders a WebSocket close connection method with optional pre- and post-execution logic.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component props. |
| props.language | Language | Programming language used for method formatting. |
| props.framework | string | Framework used, if any (e.g., &#x27;quarkus&#x27; for Java). |
| props.methodName | string | Name of the method to generate. |
| props.methodParams | Array.&lt;string&gt; | List of parameters for the method. |
| props.preExecutionCode | string | Code to insert before the main function logic. |
| props.postExecutionCode | string | Code to insert after the main function logic. |
| props.indent | number | Indentation level for the method block. |



### Returns

- **JSX.Element** - Rendered method block with appropriate formatting.



### Example

```js
const language = "java"
const framework = "quarkus"
const methodName = "terminateConnection"
const methodParams = ["self"]
const preExecutionCode = "// About to terminate connection"
const postExecutionCode = "// Connection terminated"
const indent = 2

return (
  <CloseConnection language={language} framework={framework} methodName={methodName} methodParams={methodParams} preExecutionCode={preExecutionCode} postExecutionCode={postExecutionCode} indent={indent} />
);
```



<a name="Connect"></a>
## **Connect** 
Component that renders WebSocket connection method for the specified programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component properties. |
| props.language | SupportedLanguage | The programming language for which to generate connection code. |
| props.title | string | The title of the WebSocket server. |




### Example

```js
const language = "python"
const title = "HoppscotchEchoWebSocketClient"

return(
 <Connect language={language} title={title} />
)
```



<a name="DependencyProvider"></a>
## **DependencyProvider** 
Renders the top-of-file dependency statements for the selected programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component props. |
| props.language | Language | The programming language for which to render dependency statements. |
| props.framework | string | The framework (e.g., &#x27;quarkus&#x27; for Java). |
| props.role | string | The role (e.g., &#x27;client&#x27;, &#x27;connector&#x27; for Java). |
| props.additionalDependencies | Array.&lt;string&gt; | Optional additional dependencies to include. |



### Returns

- **JSX.Element** - Rendered list of import/require statements.



### Example

```js
const language = "java"
const framework = "quarkus"
const role = "client"
const additionalDependencies = ["import java.util.concurrent.CompletableFuture;", "import java.time.Duration;"]

return (
  <DependencyProvider language={language} framework={framework} role={role} additionalDependencies={additionalDependencies} />
)
```



<a name="FileHeaderInfo"></a>
## **FileHeaderInfo** 
Renders a file header with metadata information such as title, version, protocol, host, and path.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component props. |
| props.info | object | Info object from the AsyncAPI document. |
| props.server | object | Server object from the AsyncAPI document. |
| props.language | Language | Programming language used for comment formatting. |



### Returns

- **JSX.Element** - Rendered file header.



### Example

```js
import path from "path";
import { Parser, fromFile } from "@asyncapi/parser";

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, "../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml");
const language = "javascript"
let parsedAsyncAPIDocument;

async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    parsedAsyncAPIDocument = parseResult.document;
}

return (
  <FileHeaderInfo info={parsedAsyncAPIDocument.info()} server={parsedAsyncAPIDocument.servers().get("withPathname")} language={javascript} />
)
```



<a name="HandleMessage"></a>
## **HandleMessage** 
Renders a WebSocket message handler method with optional pre- and post-execution logic.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component props. |
| props.language | Language | Programming language used for method formatting. |
| props.methodName | string | Name of the method to generate. |
| props.methodParams | Array.&lt;string&gt; | List of parameters for the method. |
| props.preExecutionCode | string | Code to insert before the main function logic. |
| props.postExecutionCode | string | Code to insert after the main function logic. |
| props.customMethodConfig | Object | Optional overrides for default method configuration. |



### Returns

- **JSX.Element** - Rendered method block with appropriate formatting.



### Example

```js
const language = "javascript"
const methodName = "handleMessage"
const methodParams = ["self", "message"]
const preExecutionCode = "# Pass the incoming message to all registered message handlers."
const postExecutionCode = "# Passed the incoming message to all registered message handlers."
const customMethodConfig = {
  javascript: {
    methodDocs: "// Method to handle message with callback",
    methodLogic: "if (cb) cb(message);"
  }
};
return (
  <HandleMessage language={language} methodName={methodName} methodParams={methodParams} preExecutionCode={preExecutionCode} postExecutionCode = {postExecutionCode} customMethodConfig={customMethodConfig} />
)
```



<a name="MethodGenerator"></a>
## **MethodGenerator** 
Generic Method rendering component.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component props. |
| props.language | Language | Programming language used for method formatting. |
| props.methodName | string | Name of the method. |
| props.methodParams | Array.&lt;string&gt; | Method parameters. |
| props.methodDocs | string | Optional documentation string. |
| props.methodLogic | string | Core method logic. |
| props.preExecutionCode | string | Code before main logic. |
| props.postExecutionCode | string | Code after main logic. |
| props.indent | number | Indentation for the method block. |
| props.newLines | number | Number of new lines after method. |
| props.customMethodConfig | Object | Optional custom syntax configuration for the current language. |
| props.methodConfig | Record.&lt;Language, ({methodDocs: string, methodLogic: string}&amp;#124;Record.&lt;string, {methodDocs: string, methodLogic: string}&gt;)&gt; | Language-level or framework-level configuration. |
| props.framework | string | Framework name for nested configurations (e.g., &#x27;quarkus&#x27; for Java). |




### Example

```js
const language = "java"
const methodName = "registerHandler"
const methodParams = ["self", "handler"]
const methodDocs = "# Process the input data."
const methodLogic = "pass"
const preExecutionCode = "# Before handler registration"
const postExecutionCode = "# After handler registration"
const customMethodConfig={ openingTag: "{", closingTag: "}", indentSize: 6 }
const methodConfig = {"java" : {methodDocs : methodDocs, methodLogic: methodLogic }}
const framework = "quarkus"

return (
  <MethodGenerator language={language} methodName={methodName} methodParams={methodParams} methodDocs={methodDocs} methodLogic={methodLogic} preExecutionCode={preExecutionCode} postExecutionCode={postExecutionCode} customMethodConfig={customMethodConfig} methodConfig={methodConfig} framework={framework} />
)
```



<a name="Models"></a>
## **Models** 
Generates and returns an array of model files based on the AsyncAPI document.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| params | Object | The parameters for the function. |
| params.asyncapi | AsyncAPIDocumentInterface | Parsed AsyncAPI document object. |
| params.language | Language | Target programming language for the generated models. |
| params.format | Format | Naming format for generated files. |
| params.presets | object | Custom presets for the generator instance. |
| params.constraints | object | Custom constraints for the generator instance. |



### Returns

- **Array.&lt;File&gt;** - Array of File components with generated model content.



### Example

```js
import path from "path";
import { Parser, fromFile } from "@asyncapi/parser";

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, "../__fixtures__/asyncapi-v3.yml");
async () => {
   const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
   parsedAsyncAPIDocument = parseResult.document;
}

const language = "java"

return (
  <Models asyncapi={parsedAsyncAPIDocument} language={language} />
)
```



<a name="OnClose"></a>
## **OnClose** 
Component that renders WebSocket onClose event handler for the specified programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component properties. |
| props.language | SupportedLanguage | The programming language for which to generate onClose handler code. |
| props.framework | string | Optional framework variant (e.g., &#x27;quarkus&#x27; for java). |
| props.title | string | The title of the WebSocket server. |




### Example

```js
const language = "java"
const framework = "quarkus"
const title = "HoppscotchEchoWebSocketClient"

return (
  <OnClose language={language} framework={framework} title={title}  />
)
```



<a name="OnError"></a>
## **OnError** 
Component that renders WebSocket onError event handler for the specified programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component properties. |
| props.language | SupportedLanguage | The programming language for which to generate onError handler code. |




### Example

```js
const language = "java"
return (
  <OnError language={language} />
)
```



<a name="OnMessage"></a>
## **OnMessage** 
Component that renders WebSocket onMessage event handler for the specified programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component properties. |
| props.language | SupportedLanguage | The programming language for which to generate onMessage handler code. |




### Example

```js
const language = "java"
return (
  <OnMessage language={language} />
)
```



<a name="OnOpen"></a>
## **OnOpen** 
Component that renders WebSocket onOpen event handler for the specified programming language.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component properties. |
| props.language | SupportedLanguage | The programming language for which to generate onOpen handler code. |
| props.framework | string | Optional framework variant (e.g., &#x27;quarkus&#x27; for java). |
| props.title | string | The title of the WebSocket server. |




### Example

```js
const language = "java"
const framework = "quarkus"
const title = "HoppscotchEchoWebSocketClient"

return (
  <OnOpen language={language} framework={framework} title={title} />
)
```



<a name="QueryParamsVariables"></a>
## **QueryParamsVariables** 
Component for rendering query parameter variables code.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component props. |
| props.language | SupportedLanguage | The target programming language. |
| props.framework | string | Optional framework for the language. |
| props.queryParams | Array.&lt;Array.&lt;string&gt;&gt; | Array of query parameters, each represented as [paramName, paramType?]. |



### Returns

- **Array.&lt;React.ReactNode&gt;** - Array of Text components for each query parameter, or null if queryParams is invalid.



### Example

```js
import path from "path"
import { Parser, fromFile } from "@asyncapi/parser";

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, "../__fixtures__/asyncapi-v3.yml");
let parsedAsyncAPIDocument

async () => {
   const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
   parsedAsyncAPIDocument = parseResult.document;
}

const channels = parsedAsyncAPIDocument.channels();
const queryParamsObject = getQueryParams(channels);
const queryParamsArray = queryParamsObject ? Array.from(queryParamsObject.entries()) : [];

const language = "java"
const framework = "quarkus"

return (
  <QueryParamsVariables language={language} framework={framework} queryParams={queryParamsArray} />
)
```



<a name="RegisterErrorHandler"></a>
## **RegisterErrorHandler** 
Renders a WebSocket error handler registration method with optional pre- and post-execution logic.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component props. |
| props.language | Language | Programming language used for method formatting. |
| props.methodName | string | Name of the method to generate. |
| props.methodParams | Array.&lt;string&gt; | List of parameters for the method. |
| props.preExecutionCode | string | Code to insert before the main function logic. |
| props.postExecutionCode | string | Code to insert after the main function logic. |
| props.customMethodConfig | Object | Optional overrides for default method configuration. |



### Returns

- **JSX.Element** - Rendered method block with appropriate formatting.



### Example

```js
const language = "python"
const methodName = "registerErrorHandler"
const methodParams = ["self", "handler"]
const preExecutionCode = "# Pre-register operations"
const postExecutionCode = "# Post-register operations"
const customMethodConfig = { returnType: "int", openingTag: "{", closingTag: "}", indentSize: 2};

return (
  <RegisterErrorHandler language={language} methodName={methodName} methodParams={methodParams} preExecutionCode={preExecutionCode} postExecutionCode={postExecutionCode} customMethodConfig={customMethodConfig} />
)
```



<a name="RegisterMessageHandler"></a>
## **RegisterMessageHandler** 
Renders a WebSocket message handler registration method with optional pre- and post-execution logic.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component props. |
| props.language | Language | Programming language used for method formatting. |
| props.methodName | string | Name of the method to generate. |
| props.methodParams | Array.&lt;string&gt; | List of parameters for the method. |
| props.preExecutionCode | string | Code to insert before the main function logic. |
| props.postExecutionCode | string | Code to insert after the main function logic. |



### Returns

- **JSX.Element** - Rendered method block with appropriate formatting.



### Example

```js
const language = "python"
const methodName = "registerMessageHandler"
const methodParams = ["self", "handler"]
const preExecutionCode = "# Pre-register operations"
const postExecutionCode = "# Post-register operations"

return (
   <RegisterMessageHandler language={language} methodName={methodName} methodParams={methodParams} preExecutionCode={preExecutionCode} postExecutionCode={postExecutionCode} />
)
```



<a name="SendOperations"></a>
## **SendOperations** 
Component for rendering WebSocket send operation methods.
Generates both static and instance methods for sending messages through WebSocket connections.


### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component props. |
| props.language | SupportedLanguage | The target programming language. |
| props.sendOperations | Array.&lt;Object&gt; | Array of send operations from AsyncAPI document. |
| props.clientName | string | The name of the client class. |




### Example

```js
import path from "path";
import { Parser, fromFile } from "@asyncapi/parser";

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, '../__fixtures__/asyncapi-v3.yml');
let parsedAsyncAPIDocument;

async () => {
   const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
   parsedAsyncAPIDocument = parseResult.document;
}

const language = "javascript"
const clientName = "AccountServiceAPI"
const sendOperations = parsedAsyncAPIDocument.operations().filterBySend()

return (
   <SendOperations language={language} clientName={clientName} sendOperations={sendOperations} />
)
```


