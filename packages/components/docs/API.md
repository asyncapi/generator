## Functions
### **CloseConnection** - Renders a WebSocket close connection method with optional pre- and post-execution logic.

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

### **Connect** - Component that renders WebSocket connection method for the specified programming language.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component properties. |
| props.language | SupportedLanguage | The programming language for which to generate connection code. |
| props.title | string | The title of the WebSocket server. |


### **DependencyProvider** - Renders the top-of-file dependency statements for the selected programming language.

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

### **FileHeaderInfo** - Renders a file header with metadata information such as title, version, protocol, host, and path.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component props. |
| props.info | object | Info object from the AsyncAPI document. |
| props.server | object | Server object from the AsyncAPI document. |
| props.language | Language | Programming language used for comment formatting. |



### Returns

- **JSX.Element** - Rendered file header.

### **HandleMessage** - Renders a WebSocket message handler method with optional pre- and post-execution logic.

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

### **MethodGenerator** - Generic Method rendering component.

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


### **Models** - Generates and returns an array of model files based on the AsyncAPI document.

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

### **OnClose** - Component that renders WebSocket onClose event handler for the specified programming language.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component properties. |
| props.language | SupportedLanguage | The programming language for which to generate onClose handler code. |
| props.framework | string | Optional framework variant (e.g., &#x27;quarkus&#x27; for java). |
| props.title | string | The title of the WebSocket server. |


### **OnError** - Component that renders WebSocket onError event handler for the specified programming language.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component properties. |
| props.language | SupportedLanguage | The programming language for which to generate onError handler code. |


### **OnMessage** - Component that renders WebSocket onMessage event handler for the specified programming language.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component properties. |
| props.language | SupportedLanguage | The programming language for which to generate onMessage handler code. |


### **OnOpen** - Component that renders WebSocket onOpen event handler for the specified programming language.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component properties. |
| props.language | SupportedLanguage | The programming language for which to generate onOpen handler code. |
| props.framework | string | Optional framework variant (e.g., &#x27;quarkus&#x27; for java). |
| props.title | string | The title of the WebSocket server. |


### **QueryParamsVariables** - Component for rendering query parameter variables code.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component props. |
| props.language | SupportedLanguage | The target programming language. |
| props.framework | string | Optional framework for the language. |
| props.queryParams | Array.&lt;Array.&lt;string&gt;&gt; | Array of query parameters, each represented as [paramName, paramType?]. |



### Returns

- **Array.&lt;React.ReactNode&gt;** - Array of Text components for each query parameter, or null if queryParams is invalid.

### **RegisterErrorHandler** - Renders a WebSocket error handler registration method with optional pre- and post-execution logic.

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

### **RegisterMessageHandler** - Renders a WebSocket message handler registration method with optional pre- and post-execution logic.

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

### **SendOperations** - Component for rendering WebSocket send operation methods.
Generates both static and instance methods for sending messages through WebSocket connections.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| props | Object | Component props. |
| props.language | SupportedLanguage | The target programming language. |
| props.sendOperations | Array.&lt;Object&gt; | Array of send operations from AsyncAPI document. |
| props.clientName | string | The name of the client class. |


