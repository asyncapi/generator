{{#unless hideTitle}}
#### Topic Parameters
{{/unless}}

{{#each params as |param|}}
{{#if param.name}}
##### {{param.name}}
{{/if}}

{{#if param.description}}
{{{param.description}}}
{{/if}}

{{~> schema schema=param.schema schemaName=param.name hideTitle=true ~}}
{{/each}}
