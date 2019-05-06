{{#if operation.summary}}
{{{operation.summary}}}

{{/if}}
{{#if operation.description}}
{{{operation.description}}}
{{/if}}

{{#if operation.headers}}
##### Headers

{{> schema schema=operation.headers schemaName='Message Headers' hideTitle=true}}

{{#unless operation.example}}
{{#if operation.generatedHeadersExample}}
###### Example of headers _(generated)_

```json
{{{operation.generatedHeadersExample}}}
```
{{/if}}
{{/unless}}
{{/if}}

##### Payload

{{> schema schema=operation.message.payload schemaName='Message Payload' hideTitle=true}}

{{#if operation.message.payload.example}}
###### Example

```json
{{{operation.message.formattedExample}}}
```
{{else}}
{{#if operation.message.generatedPayloadExample}}
###### Example of payload _(generated)_

```json
{{{operation.message.generatedPayloadExample}}}
```
{{/if}}
{{/if}}

{{#if operation.tags}}
##### Tags

{{> tags tags=operation.tags}}
{{/if}}
