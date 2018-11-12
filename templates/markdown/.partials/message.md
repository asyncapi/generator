### {{#if message.deprecated}} *Deprecated*{{/if}} {{messageName}}
{{#if message.summary}}
{{{message.summary}}}

{{/if}}
{{#if message.description}}
{{{message.description}}}
{{/if}}

{{#if message.headers}}
#### Headers

{{> schema schema=message.headers schemaName='Message Headers' hideTitle=true}}
{{/if}}

{{#unless message.headers.example}}
{{#if message.generatedHeadersExample}}
##### Example of headers _(generated)_

```json
{{{message.generatedHeadersExample}}}
```
{{/if}}
{{/unless}}

#### Payload

{{> schema schema=message.payload schemaName='Message Payload' hideTitle=true}}

{{#if message.payload.example}}
##### Example

```json
{{{message.formattedExample}}}
```
{{else}}
{{#if message.generatedPayloadExample}}
##### Example of payload _(generated)_

```json
{{{message.generatedPayloadExample}}}
```
{{/if}}
{{/if}}

{{#if operation.tags}}
#### Tags

{{> tags tags=operation.tags}}
{{/if}}
