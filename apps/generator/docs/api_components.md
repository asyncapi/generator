---
title: Reusable Components API
weight: 77
---

## Components

* [CloseConnection](#CloseConnection) ⇒ `JSX.Element`<br/>
  
  Renders a WebSocket close connection method with optional pre- and post-execution logic.

* [Connect](#Connect) ⇒ `JSX.Element`<br/>
  
  Renders a WebSocket connection method for the specified programming language.

* [DependencyProvider](#DependencyProvider) ⇒ `JSX.Element`<br/>
  
  Renders the top-of-file dependency statements for the selected programming language.

* [Close](#Close) ⇒ `JSX.Element`<br/>
  
  Renders the `client.close()` invocation line for the runnable example
script in the chosen language. Sibling of {@link OpenConnection}; meant to
be embedded inside the `finally` block of {@link Main}.

* [Example](#Example) ⇒ `JSX.Element`<br/>
  
  Renders a complete runnable example script (`example.js` / `example.py` /
`example.dart`) for the generated WebSocket client. Composes
{@link Imports}, {@link Handlers}, {@link OutgoingProcessor} (JS/Python
only), and {@link Main}, resolving the client/instance names and the
relevant send/receive operations from the AsyncAPI document.

* [Handlers](#Handlers) ⇒ `JSX.Element`<br/>
  
  Renders the message/error handler definitions block for the runnable
example script. JavaScript and Dart render a static pair of placeholder
handlers; Python renders one per-receive-operation handler plus a custom
error handler.

* [Imports](#Imports) ⇒ `JSX.Element`<br/>
  
  Renders the top-of-file imports block for the runnable example script.

* [Main](#Main) ⇒ `JSX.Element`<br/>
  
  Renders the runnable example's `main` function body for the chosen language.
Composes {@link OpenConnection}, {@link Close}, and {@link SendInvocations},
and wires up message-handler / error-handler registration appropriate to the
language. Python additionally registers per-receive-operation handlers and
blocks at the end of `try` so the worker thread stays alive long enough to
receive messages.

* [OpenConnection](#OpenConnection) ⇒ `JSX.Element`<br/>
  
  Renders the `client.connect()` invocation line for the runnable example
script in the chosen language. Sibling of {@link Close} and
{@link SendInvocations}; meant to be embedded inside {@link Main}.

* [OutgoingProcessor](#OutgoingProcessor) ⇒ `JSX.Element`<br/>
  
  Renders an example outgoing message processor function for the runnable
example script. The body is a starter implementation; users customize it
after generation.

* [SendInvocations](#SendInvocations) ⇒ `JSX.Element`<br/>
  
  Renders the send-invocations loop for the runnable example script: a fixed
5-iteration loop that invokes each send operation in turn, with sample
payloads resolved from the AsyncAPI message examples (or `TODO:` placeholders
when no example is present).

Returns `null` when `sendOps` is missing or empty so the caller can render
nothing without conditional wrapping.

* [FileHeaderInfo](#FileHeaderInfo) ⇒ `JSX.Element`<br/>
  
  Renders a file header with metadata information such as title, version, protocol, host, and path.

* [HandleError](#HandleError) ⇒ `JSX.Element`<br/>
  
  Renders the `handleError` (or framework-equivalent) method body that dispatches
an error to registered handlers (or logs it when none are registered).

* [HandleMessage](#HandleMessage) ⇒ `JSX.Element`<br/>
  
  Renders a WebSocket message handler method with optional pre- and post-execution logic.

* [MethodGenerator](#MethodGenerator) ⇒ `JSX.Element`<br/>
  
  Renders a language-specific formatted method definition.

* [Models](#Models) ⇒ `Array.<File>`<br/>
  
  Renders an array of model files based on the AsyncAPI document.

* [OnClose](#OnClose) ⇒ `JSX.Element`<br/>
  
  Renders a WebSocket onClose event handler for the specified programming language.

* [OnError](#OnError) ⇒ `JSX.Element`<br/>
  
  Renders a WebSocket onError event handler for the specified programming language.

* [OnMessage](#OnMessage) ⇒ `JSX.Element`<br/>
  
  Renders a WebSocket onMessage event handler for the specified programming language.

* [OnOpen](#OnOpen) ⇒ `JSX.Element`<br/>
  
  Renders a WebSocket onOpen event handler for the specified programming language.

* [QueryParamsVariables](#QueryParamsVariables) ⇒ `Array.<JSX.Element>`<br/>
  
  Renders query parameter variables code blocks.

* [AvailableOperations](#AvailableOperations) ⇒ `JSX.Element`<br/>
  
  Renders a list of AsyncAPI operations with their headers and message examples.

* [CoreMethods](#CoreMethods) ⇒ `JSX.Element`<br/>
  
  Renders a list of core WebSocket client methods for a given target language.

* [Installation](#Installation) ⇒ `JSX.Element`<br/>
  
  Renders the Installation Command for a given language.

* [MessageExamples](#MessageExamples) ⇒ `JSX.Element`<br/>
  
  Renders Message Examples of a given AsyncAPI operation.

* [OperationHeader](#OperationHeader) ⇒ `JSX.Element`<br/>
  
  Renders a header section for a single AsyncAPI operation.

* [Overview](#Overview) ⇒ `JSX.Element`<br/>
  
  Renders an overview section for a WebSocket client. Displays the API description, version, and server URL.

* [Readme](#Readme) ⇒ `JSX.Element`<br/>
  
  Renders a README.md file for a given AsyncAPI document. Composes multiple sections (overview, installation, usage, core methods, and available operations) into a single File component based on the provided AsyncAPI document, generator parameters, and target language.

* [Usage](#Usage) ⇒ `JSX.Element`<br/>
  
  Renders a usage example snippet for a generated WebSocket client in a given language.

* [RegisterErrorHandler](#RegisterErrorHandler) ⇒ `JSX.Element`<br/>
  
  Renders a WebSocket error handler registration method with optional pre- and post-execution logic.

* [RegisterMessageHandler](#RegisterMessageHandler) ⇒ `JSX.Element`<br/>
  
  Renders a WebSocket message handler registration method with optional pre- and post-execution logic.

* [SendOperations](#SendOperations) ⇒ `Array.<JSX.Element>`<br/>
  
  Renders WebSocket send operation methods. Generates both static and instance methods for sending messages through WebSocket connections.

* [createError](#createError) ⇒ `Error`<br/>
  
  Creates an error with a specific error code for programmatic handling


<a name="CloseConnection"></a>
### CloseConnection()
Renders a WebSocket close connection method with optional pre- and post-execution logic.


**Parameters**

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



**Returns**

- `JSX.Element` - A Text component that contains method block with appropriate formatting.



**Example**

```js
import { CloseConnection } from "@asyncapi/generator-components";
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
### Connect()
Renders a WebSocket connection method for the specified programming language.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The programming language for which to generate connection code. |
| props.title | `string` | The title of the WebSocket server. |



**Returns**

- `JSX.Element` - A Text component containing the generated WebSocket connection code for the specified language.



**Example**

```js
import { Connect } from "@asyncapi/generator-components";
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
### DependencyProvider()
Renders the top-of-file dependency statements for the selected programming language.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The programming language for which to render dependency statements. |
| props.framework | `string` | The framework (e.g., &#x27;quarkus&#x27; for Java). |
| props.role | `string` | The role (e.g., &#x27;client&#x27;, &#x27;connector&#x27; for Java). |
| props.additionalDependencies | `Array.<string>` | Optional additional dependencies to include. |



**Returns**

- `JSX.Element` - A Text component that contains list of import/require statements.



**Example**

```js
import { DependencyProvider } from "@asyncapi/generator-components";
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



<a name="Close"></a>
### Close()
Renders the &#x60;client.close()&#x60; invocation line for the runnable example
script in the chosen language. Sibling of {@link OpenConnection}; meant to
be embedded inside the &#x60;finally&#x60; block of {@link Main}.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Target programming language. |
| props.instanceName | `string` | The client instance variable name (e.g. &#x60;echoClient&#x60;, &#x60;echo_client&#x60;). |



**Returns**

- `JSX.Element` - A &#x60;Text&#x60; component containing the close invocation line.



**Example**

```js
import { Close } from "@asyncapi/generator-components";

function renderClose() {
  return (
    <Close language="javascript" instanceName="echoClient" />
  );
}

renderClose();
```



<a name="Example"></a>
### Example()
Renders a complete runnable example script (&#x60;example.js&#x60; / &#x60;example.py&#x60; /
&#x60;example.dart&#x60;) for the generated WebSocket client. Composes
{@link Imports}, {@link Handlers}, {@link OutgoingProcessor} (JS/Python
only), and {@link Main}, resolving the client/instance names and the
relevant send/receive operations from the AsyncAPI document.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.asyncapi | `AsyncAPIDocumentInterface` | Parsed AsyncAPI document instance. |
| props.params | `Object` | Generator parameters used to customize output (&#x60;clientFileName&#x60;, optional &#x60;appendClientSuffix&#x60;, &#x60;customClientName&#x60;). |
| props.language | `Language` | Target programming language. |



**Returns**

- `JSX.Element` - A &#x60;Text&#x60; tree containing the full example script.



**Example**

```js
import path from "path";
import { Parser, fromFile } from "@asyncapi/parser";
import { buildParams } from "@asyncapi/generator-helpers";
import { Example } from "@asyncapi/generator-components";

async function renderExample() {
  const parser = new Parser();
  const fixture = path.resolve(__dirname, "../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml");
  const parseResult = await fromFile(parser, fixture).parse();
  const params = buildParams("javascript", { clientFileName: "myClient.js" }, "withPathname");
  return (
    <Example
      asyncapi={parseResult.document}
      params={params}
      language="javascript"
    />
  );
}

renderExample().catch(console.error);
```



<a name="Handlers"></a>
### Handlers()
Renders the message/error handler definitions block for the runnable
example script. JavaScript and Dart render a static pair of placeholder
handlers; Python renders one per-receive-operation handler plus a custom
error handler.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Target programming language. |
| props.receiveOps | `Array.<object>` | Python-only: the AsyncAPI receive operations to generate handler definitions for. Defaults to an empty array. Ignored for JavaScript and Dart. |



**Returns**

- `JSX.Element` - A &#x60;Text&#x60; component containing the handler definitions.



**Example**

```js
import { Handlers } from "@asyncapi/generator-components";

function renderHandlers() {
  return (
    <Handlers language="dart" />
  );
}

renderHandlers();
```



<a name="Imports"></a>
### Imports()
Renders the top-of-file imports block for the runnable example script.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Target programming language. |
| props.clientFileName | `string` | The generated client file name (e.g. &#x60;myClient.js&#x60;, &#x60;my_client.py&#x60;, &#x60;my_client.dart&#x60;). |
| props.clientName | `string` | The generated client class/symbol name. Required for JavaScript/Python; unused for Dart. |
| props.needsTime | `boolean` | Python-only: when true, prepends &#x60;import time&#x60; (used when the example contains a send loop or a long-running receive wait). |



**Returns**

- `JSX.Element` - A &#x60;Text&#x60; component containing the imports block.



**Example**

```js
import { Imports } from "@asyncapi/generator-components";

function renderImports() {
  return (
    <Imports
      language="python"
      clientName="EchoClient"
      clientFileName="echo_client.py"
      needsTime
    />
  );
}

renderImports();
```



<a name="Main"></a>
### Main()
Renders the runnable example&#x27;s &#x60;main&#x60; function body for the chosen language.
Composes {@link OpenConnection}, {@link Close}, and {@link SendInvocations},
and wires up message-handler / error-handler registration appropriate to the
language. Python additionally registers per-receive-operation handlers and
blocks at the end of &#x60;try&#x60; so the worker thread stays alive long enough to
receive messages.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Target programming language. |
| props.clientName | `string` | The generated client class/symbol name. |
| props.instanceName | `string` | The variable name to bind the client instance to inside &#x60;main&#x60;. |
| props.sendOps | `Array.<object>` | AsyncAPI send operations. When non-empty, the example registers an outgoing processor (JS/Python) and runs the send loop. |
| props.receiveOps | `Array.<object>` | Python-only: AsyncAPI receive operations. Each one gets a registered handler and the example blocks on &#x60;time.sleep(30)&#x60; so the worker thread can deliver messages. |



**Returns**

- `JSX.Element` - A &#x60;Text&#x60; tree containing the rendered &#x60;main&#x60; function.



**Example**

```js
import { Main } from "@asyncapi/generator-components";

function renderMain() {
  return (
    <Main
      language="javascript"
      clientName="EchoClient"
      instanceName="echoClient"
      sendOps={[]}
    />
  );
}

renderMain();
```



<a name="OpenConnection"></a>
### OpenConnection()
Renders the &#x60;client.connect()&#x60; invocation line for the runnable example
script in the chosen language. Sibling of {@link Close} and
{@link SendInvocations}; meant to be embedded inside {@link Main}.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Target programming language. |
| props.instanceName | `string` | The client instance variable name (e.g. &#x60;echoClient&#x60;, &#x60;echo_client&#x60;). |



**Returns**

- `JSX.Element` - A &#x60;Text&#x60; component containing the connect invocation line.



**Example**

```js
import { OpenConnection } from "@asyncapi/generator-components";

function renderOpenConnection() {
  return (
    <OpenConnection language="javascript" instanceName="echoClient" />
  );
}

renderOpenConnection();
```



<a name="OutgoingProcessor"></a>
### OutgoingProcessor()
Renders an example outgoing message processor function for the runnable
example script. The body is a starter implementation; users customize it
after generation.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Target programming language. |



**Returns**

- `JSX.Element` - A &#x60;Text&#x60; component containing the processor function definition.



**Example**

```js
import { OutgoingProcessor } from "@asyncapi/generator-components";

function renderOutgoingProcessor() {
  return (
    <OutgoingProcessor language="python" />
  );
}

renderOutgoingProcessor();
```



<a name="SendInvocations"></a>
### SendInvocations()
Renders the send-invocations loop for the runnable example script: a fixed
5-iteration loop that invokes each send operation in turn, with sample
payloads resolved from the AsyncAPI message examples (or &#x60;TODO:&#x60; placeholders
when no example is present).

Returns &#x60;null&#x60; when &#x60;sendOps&#x60; is missing or empty so the caller can render
nothing without conditional wrapping.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Target programming language. |
| props.instanceName | `string` | The client instance variable name. |
| props.sendOps | `Array.<object>` | AsyncAPI send operations to invoke. When empty or missing, the component renders nothing. |



**Returns**

- `JSX.Element` - A &#x60;Text&#x60; component containing the loop, or &#x60;null&#x60; when there are no send operations.



**Example**

```js
import path from "path";
import { Parser, fromFile } from "@asyncapi/parser";
import { SendInvocations } from "@asyncapi/generator-components";

async function renderSendInvocations() {
  const parser = new Parser();
  const fixture = path.resolve(__dirname, "../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml");
  const parseResult = await fromFile(parser, fixture).parse();
  const sendOps = parseResult.document.operations().filterBySend();

  return (
    <SendInvocations
      language="javascript"
      instanceName="echoClient"
      sendOps={sendOps}
    />
  );
}

renderSendInvocations().catch(console.error);
```



<a name="FileHeaderInfo"></a>
### FileHeaderInfo()
Renders a file header with metadata information such as title, version, protocol, host, and path.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.info | `Object` | Info object from the AsyncAPI document. |
| props.server | `Object` | Server object from the AsyncAPI document. |
| props.language | `Language` | Programming language used for comment formatting. |



**Returns**

- `JSX.Element` - A Text component that contains file header.



**Example**

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



<a name="HandleError"></a>
### HandleError()
Renders the &#x60;handleError&#x60; (or framework-equivalent) method body that dispatches
an error to registered handlers (or logs it when none are registered).


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` |  |
| props.language | `Language` | Target programming language. |
| props.framework | `string` | Framework discriminator (required for languages with multiple frameworks, e.g. &#x60;java&#x60; → &#x60;quarkus&#x60;). |



**Returns**

- `JSX.Element` - A &#x60;&lt;Text&gt;&#x60; block containing the rendered method.



**Example**

```js
import { HandleError } from '@asyncapi/generator-components';

function renderHandleError() {
  return <HandleError language='python' />;
}
```



<a name="HandleMessage"></a>
### HandleMessage()
Renders a WebSocket message handler method with optional pre- and post-execution logic.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Programming language used for method formatting. |
| props.methodName | `string` | Name of the method to generate. |
| props.methodParams | `Array.<string>` | List of parameters for the method. |
| props.preExecutionCode | `string` | Code to insert before the main function logic. |
| props.postExecutionCode | `string` | Code to insert after the main function logic. |
| props.customMethodConfig | `Object` | Optional overrides for default method configuration. |



**Returns**

- `JSX.Element` - A Text component that contains method block with appropriate formatting.



**Example**

```js
import { HandleMessage } from "@asyncapi/generator-components";
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
### MethodGenerator()
Renders a language-specific formatted method definition.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Programming language used for method formatting. |
| props.methodName | `string` | Name of the method (non-empty string required). |
| props.methodParams | `Array.<string>` | Method parameters. |
| props.methodDocs | `string` | Optional documentation string. |
| props.methodLogic | `string` | Core method logic. |
| props.preExecutionCode | `string` | Code before main logic. |
| props.postExecutionCode | `string` | Code after main logic. |
| props.indent | `number` | Indentation for the method block (must be &gt;&#x3D; 0). |
| props.newLines | `number` | Number of new lines after method. |
| props.customMethodConfig | `Object` | Optional custom syntax configuration for the current language. |
| props.methodConfig | `Object` | Language-level or framework-level configuration. |
| props.framework | `string` | Framework name for nested configurations (e.g., &#x27;quarkus&#x27; for Java). |



**Returns**

- `JSX.Element` - A Text component that contains method block with appropriate formatting.



**Example**

```js
import { MethodGenerator } from "@asyncapi/generator-components";
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
### Models()
Renders an array of model files based on the AsyncAPI document.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.asyncapi | `AsyncAPIDocumentInterface` | Parsed AsyncAPI document object. |
| props.language | `Language` | Target programming language for the generated models. |
| props.format | `Format` | Naming format for generated files. |
| props.presets | `Object` | Custom presets for the generator instance. |
| props.constraints | `Object` | Custom constraints for the generator instance. |



**Returns**

- `Array.<File>` - Array of File components with generated model content.



**Example**

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
### OnClose()
Renders a WebSocket onClose event handler for the specified programming language.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The programming language for which to generate onClose handler code. |
| props.framework | `string` | Framework variant; required for framework-specific languages (e.g., &#x27;quarkus&#x27; for java). |
| props.title | `string` | The title of the WebSocket server. |



**Returns**

- `JSX.Element` - A Text component containing the onClose handler code for the specified language.



**Example**

```js
import { OnClose } from "@asyncapi/generator-components";
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
### OnError()
Renders a WebSocket onError event handler for the specified programming language.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The programming language for which to generate onError handler code. |



**Returns**

- `JSX.Element` - A Text component containing the onError handler code for the specified language.



**Example**

```js
import { OnError } from "@asyncapi/generator-components";
const language = "javascript";

function renderOnError() {
  return (
    <OnError language={language} />
  )
}

renderOnError();
```



<a name="OnMessage"></a>
### OnMessage()
Renders a WebSocket onMessage event handler for the specified programming language.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The programming language for which to generate onMessage handler code. |



**Returns**

- `JSX.Element` - A Text component containing the onMessage handler code for the specified language.



**Example**

```js
import { OnMessage } from "@asyncapi/generator-components";
const language = "javascript";

function renderOnMessage() {
  return (
    <OnMessage language={language} />
  )
}

renderOnMessage();
```



<a name="OnOpen"></a>
### OnOpen()
Renders a WebSocket onOpen event handler for the specified programming language.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The programming language for which to generate onOpen handler code. |
| props.framework | `string` | Optional framework variant (e.g., &#x27;quarkus&#x27; for java). |
| props.title | `string` | The title of the WebSocket server. |



**Returns**

- `JSX.Element` - A Text component containing the onOpen handler code for the specified language.



**Example**

```js
import { OnOpen } from "@asyncapi/generator-components";
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
### QueryParamsVariables()
Renders query parameter variables code blocks.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The target programming language. |
| props.framework | `string` | Optional framework for the language. |
| props.queryParams | `Array.<Array.<string>>` | Array of query parameters, each represented as [paramName, paramType?]. |



**Returns**

- `Array.<JSX.Element>` - Array of Text components for each query parameter, or null if queryParams is invalid.



**Example**

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
### AvailableOperations()
Renders a list of AsyncAPI operations with their headers and message examples.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component Props |
| props.operations | `Array.<Object>` | Array of AsyncAPI Operation objects. |



**Returns**

- `JSX.Element` - A Component containing rendered operations, or null if no operations are provided



**Example**

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
### CoreMethods()
Renders a list of core WebSocket client methods for a given target language.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props |
| props.language | `Language` | Target language used to select method names. |



**Returns**

- `JSX.Element` - A Text component that contains a list of core client methods.



**Example**

```js
import { CoreMethods } from "@asyncapi/generator-components";
const language = "javascript";

function renderCoreMethods() {
  return (
    <CoreMethods language={language} />
  )
}

renderCoreMethods();
```



<a name="Installation"></a>
### Installation()
Renders the Installation Command for a given language.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props |
| props.language | `Language` | The programming language for which to generate Installation Command. |



**Returns**

- `JSX.Element` - A Text component that contains Installation Command.



**Example**

```js
import { Installation } from "@asyncapi/generator-components";
const language = "javascript";

function renderInstallation() {
  return (
    <Installation language={language} />
  )
}

renderInstallation()
```



<a name="MessageExamples"></a>
### MessageExamples()
Renders Message Examples of a given AsyncAPI operation.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component Props |
| props.operation | `Object` | An AsyncAPI Operation object. |



**Returns**

- `JSX.Element` - A Text component that contains message examples, or null when no examples exist.



**Example**

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
### OperationHeader()
Renders a header section for a single AsyncAPI operation.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component properties. |
| props.operation | `Object` | An AsyncAPI Operation object. |



**Returns**

- `JSX.Element` - A Text component that contains formatted operation header.



**Example**

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
### Overview()
Renders an overview section for a WebSocket client. Displays the API description, version, and server URL.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props |
| props.info | `Object` | Info object from the AsyncAPI document. |
| props.title | `string` | Title from the AsyncAPI document. |
| props.serverUrl | `string` | ServerUrl from a specific server from the AsyncAPI document. |



**Returns**

- `JSX.Element` - A Text component that contains the Overview of a Websocket client.



**Example**

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
### Readme()
Renders a README.md file for a given AsyncAPI document. Composes multiple sections (overview, installation, usage, core methods, and available operations) into a single File component based on the provided AsyncAPI document, generator parameters, and target language.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props |
| props.asyncapi | `AsyncAPIDocumentInterface` | Parsed AsyncAPI document instance. |
| props.params | `Object` | Generator parameters used to customize output |
| props.language | `Language` | Target language used to render language-specific sections. |



**Returns**

- `JSX.Element` - A File component representing the generated README.md.



**Example**

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
### Usage()
Renders a usage example snippet for a generated WebSocket client in a given language.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props |
| props.clientName | `string` | The exported name of the client. |
| props.clientFileName | `string` | The file name where the client is defined. |
| props.language | `Language` | The target language for which to render the usage snippet |



**Returns**

- `JSX.Element` - A Text component containing a formatted usage example snippet.



**Example**

```js
import { Usage } from "@asyncapi/generator-components";
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
### RegisterErrorHandler()
Renders a WebSocket error handler registration method with optional pre- and post-execution logic.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Programming language used for method formatting. |
| props.methodName | `string` | Name of the method to generate. |
| props.methodParams | `Array.<string>` | List of parameters for the method. |
| props.preExecutionCode | `string` | Code to insert before the main function logic. |
| props.postExecutionCode | `string` | Code to insert after the main function logic. |
| props.customMethodConfig | `Object` | Optional overrides for default method configuration. |



**Returns**

- `JSX.Element` - A Text component that contains method block with appropriate formatting.



**Example**

```js
import { RegisterErrorHandler } from "@asyncapi/generator-components";
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
### RegisterMessageHandler()
Renders a WebSocket message handler registration method with optional pre- and post-execution logic.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | Programming language used for method formatting. |
| props.methodName | `string` | Name of the method to generate. |
| props.methodParams | `Array.<string>` | List of parameters for the method. |
| props.preExecutionCode | `string` | Code to insert before the main function logic. |
| props.postExecutionCode | `string` | Code to insert after the main function logic. |



**Returns**

- `JSX.Element` - A Text component that contains method block with appropriate formatting.



**Example**

```js
import { RegisterMessageHandler } from "@asyncapi/generator-components";
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
### SendOperations()
Renders WebSocket send operation methods. Generates both static and instance methods for sending messages through WebSocket connections.


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| props | `Object` | Component props. |
| props.language | `Language` | The target programming language. |
| props.sendOperations | `Array.<Object>` | Array of send operations from AsyncAPI document. |
| props.clientName | `string` | The name of the client class. |



**Returns**

- `Array.<JSX.Element>` - Array of Text components for static and non-static WebSocket send operation methods, or null if no send operations are provided.



**Example**

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



<a name="createError"></a>
### createError()
Creates an error with a specific error code for programmatic handling


**Parameters**

| Name | Type | Description |
|------|------|-------------|
| code | `string` | The error code (from ERROR_CODES) |
| message | `string` | The error message |



**Returns**

- `Error` - An error object with an attached code property



