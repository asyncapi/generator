---
title: "File templates"
weight: 140
---

## Generating files with nun-jucks render engine

> **Note**: This section applies only to the Nunjucks render engine. For information on using the React render engine, refer to the section below.
It is possible to generate files for each specific object in your AsyncAPI documentation using the Nunjucks render engine. For example, you can specify a filename like `$$channel$$.js` to generate a file for each channel defined in your AsyncAPI. The following file-template names and extra variables in them are available:

   - `$$channel$$`, within the template-file you have access to two variables [`channel`](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#channel) and [`channelName`](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#channels). Where the `channel` contains the current channel being rendered.
   - `$$message$$`, within the template-file you have access to two variables [`message`](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#message) and [`messageName`](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#message). Where `message` contains the current message being rendered.
   - `$$schema$$`, within the template-file you have access to two variables [`schema`](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#schema) and [`schemaName`](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#schema). Where `schema` contains the current schema being rendered. Only schemas from [Components object](https://www.asyncapi.com/docs/reference/specification/latest#componentsObject) are used. 
   - `$$everySchema$$`, within the template-file you have access to two variables [`schema`](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#schema) and [`schemaName`](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#schemas). Where `schema` contains the current schema being rendered. Every [Schema object](https://www.asyncapi.com/docs/specifications/2.0.0/#schemaObject) from the entire AsyncAPI file is used.
   - `$$objectSchema$$`, within the template-file you have access to two variables [`schema`](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#schema) and [`schemaName`](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#schemas). Where `schema` contains the current schema being rendered. All the [Schema objects](https://www.asyncapi.com/docs/reference/specification/latest#multiFormatSchemaObject) with type object is used.
   - `$$parameter$$`, within the template-file you have access to two variables [`parameter`](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#channelparameter) and [`parameterName`](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#channelparameters). Where the `parameter` contains the current parameter being rendered.
   - `$$securityScheme$$`, within the template-file you have access to two variables [`securityScheme`](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#securityscheme) and [`securitySchemeName`](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#securityschemes). Where `securityScheme` contains the current security scheme being rendered.

The file name will be equal to `*Name` variable.

### Example

The file name is `$$schema$$.txt`, the content of this file is:
```
Schema name is '{{schemaName}}' and properties are:
{% for propName, prop in schema.properties() %}
- {{prop.uid()}}
{% endfor %}
```

With following AsyncAPI:
```
components:
  schemas: 
    peoplePayload:
      type: object
      properties:
        event:
          $ref: "#/components/schemas/people"
    people:
      type: object
      properties:
        id:
          type: integer
```

The generator creates two files `peoplePayload.txt` and `people.txt` with the following content:
```
Schema name is 'peoplePayload' and properties are:
- people
```

and
```
Schema name is 'people' and properties are:
- id
```

> You can see an example of a file template that uses the Nunjucks render engine [here](https://github.com/asyncapi/template-for-generator-templates/tree/nunjucks/template/schemas)

## Generating files with nun-jucks render engine

The above way of rendering **file templates** only works for the Nunjucks render engines. To use the React render engine, you need to follow a different approach. The React render engine allows for a more generic way to render multiple files by returning an array of `File` components in the rendering component.

### Example

The following is a simple hardcoded way to render multiple files using the React render engine:

```tsx
export default function({ asyncapi }) {
  return [
    <File name={`file1.html`}>Content</File>,
    <File name={`file2.html`}>Content</File>
  ]
}
```

In real life, to render multiple files, you'll iterate over the array of files as shown in the example below:

```js
/*
 * To render multiple files, it is enough to return an array of `File` components in the rendering component, like in following example.
 */
export default function({ asyncapi }) {
  const schemas = asyncapi.allSchemas();
  // schemas is an instance of the Map
  return Array.from(schemas).map(([schemaName, schema]) => {
    return (
      // We return a react file component and each time we do it, the name of the generated file will be a schema name
      <File name={`${schemaName}.js`}>
        // Content of the file will be a single schema definition
        {schema}
      </File>
    );
  });
}
```

> You can see an example of a file template that uses the React render engine [here](https://github.com/asyncapi/template-for-generator-templates/blob/master/template/schemas/schema.js).