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

{{> schema schema=operation.payload schemaName='Message Payload' hideTitle=true}}

{{#if operation.payload.example}}
###### Example

```json
{{{operation.formattedExample}}}
```
{{else}}
{{#if operation.generatedPayloadExample}}
###### Example of payload _(generated)_

```json
{{{operation.generatedPayloadExample}}}
```
{{/if}}
{{/if}}

{{#if operation.tags}}
##### Tags

{{> tags tags=operation.tags}}
{{/if}}
