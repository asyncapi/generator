# {{asyncapi.info.title}} {{asyncapi.info.version}} documentation

{{#if asyncapi.info.x-logo}}
![{{asyncapi.info.title}} logo]({{asyncapi.info.x-logo}})
{{/if}}

{{{asyncapi.info.description}}}

## Table of Contents

{{#if asyncapi.info.termsOfService}}
* [Terms of Service](#termsOfService)
{{/if}}
{{#if asyncapi.servers}}
* [Servers](#servers)
{{/if}}
{{#if asyncapi.channels}}
* [Channels](#channels)
{{/if}}

{{> content}}
