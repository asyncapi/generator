---
title: "File templates"
weight: 140
---

It is possible to generate files for each specific object in your AsyncAPI documentation. For example, you can specify a filename like `$$channel$$.js` to generate a file for each channel defined in your AsyncAPI. The following file-template names and extra variables in them are available:

   - `$$channel$$`, within the template-file you have access to two variables [`channel`](https://github.com/asyncapi/parser-js/blob/master/API.md#Channel) and [`channelName`](https://github.com/asyncapi/parser-js/blob/master/API.md#AsyncAPIDocument+channels). Where the `channel` contains the current channel being rendered.
   - `$$message$$`, within the template-file you have access to two variables [`message`](https://github.com/asyncapi/parser-js/blob/master/API.md#Message) and [`messageName`](https://github.com/asyncapi/parser-js/blob/master/API.md#Message+uid). Where `message` contains the current message being rendered.
   - `$$schema$$`, within the template-file you have access to two variables [`schema`](https://github.com/asyncapi/parser-js/blob/master/API.md#Schema) and [`schemaName`](https://github.com/asyncapi/parser-js/blob/master/API.md#Schema+uid). Where `schema` contains the current schema being rendered. Only schemas from [Components object](https://www.asyncapi.com/docs/specifications/2.0.0/#a-name-componentsobject-a-components-object) are used. 
   - `$$everySchema$$`, within the template-file you have access to two variables [`schema`](https://github.com/asyncapi/parser-js/blob/master/API.md#Schema) and [`schemaName`](https://github.com/asyncapi/parser-js/blob/master/API.md#Schema+uid). Where `schema` contains the current schema being rendered. Every [Schema object](https://www.asyncapi.com/docs/specifications/2.0.0/#schemaObject) from the entire AsyncAPI file is used.
   - `$$objectSchema$$`, within the template-file you have access to two variables [`schema`](https://github.com/asyncapi/parser-js/blob/master/API.md#Schema) and [`schemaName`](https://github.com/asyncapi/parser-js/blob/master/API.md#Schema+uid). Where `schema` contains the current schema being rendered. All the [Schema objects](https://www.asyncapi.com/docs/specifications/2.0.0/#schemaObject) with type object is used.
   - `$$parameter$$`, within the template-file you have access to two variables [`parameter`](https://github.com/asyncapi/parser-js/blob/master/API.md#ChannelParameter) and [`parameterName`](https://github.com/asyncapi/parser-js/blob/master/API.md#Channel+parameters). Where the `parameter` contains the current parameter being rendered.
   - `$$securityScheme$$`, within the template-file you have access to two variables [`securityScheme`](https://github.com/asyncapi/parser-js/blob/master/API.md#SecurityScheme) and [`securitySchemeName`](https://github.com/asyncapi/parser-js/blob/master/API.md#Components+securitySchemes). Where `securityScheme` contains the current security scheme being rendered.

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

### React

The above way of rendering **file templates** works for both `nunjucks` and `react` render engines, but `react` also has another, more generic way to render multiple files. It is enough to return an array of `File` components in the rendering component. See the following example:

```tsx
export default function({ asyncapi }) {
  return [
    <File name={`file1.html`}>Content</File>,
    <File name={`file2.html`}>Content</File>
  ]
}
```