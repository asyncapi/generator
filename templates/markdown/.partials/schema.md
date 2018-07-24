{{#unless hideTitle}}
#### {{schemaName}}
{{/unless}}

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
    {{#each schema.properties}}
      {{> schemaProp prop=. propName=@key required=(isRequired ../schema @key) path=''}}
    {{else}}
      {{> schemaProp prop=schema propName=schemaName required=(isRequired ../schema @key) path=''}}
    {{/each}}
  </tbody>
</table>

{{#if schema.formattedExample}}
##### Example

```json
{{{schema.formattedExample}}}
```
{{else}}
{{#if schema.generatedExample}}
##### Example _(generated)_

```json
{{{schema.generatedExample}}}
```
{{/if}}
{{/if}}
