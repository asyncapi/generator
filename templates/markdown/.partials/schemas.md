{{#unless asyncapi.__noSchemas}}
## Schemas
{{/unless}}

{{#each asyncapi.components.schemas}}
  {{~>schema schema=. schemaName=@key~}}
{{/each}}
