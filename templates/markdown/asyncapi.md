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
* [Connection Details](#servers)
{{/if}}
{{#if asyncapi.topics}}
* [Topics](#topics)
{{/if}}
{{#if asyncapi.events}}
* [Events](#events)
  - [Events a client can receive](#events-receive)
  - [Events a client can send](#events-send)
{{/if}}
{{#if asyncapi.stream}}
* [Stream](#stream)
{{/if}}
{{#unless asyncapi.__noMessages}}
* [Messages](#messages)
{{/unless}}
{{#unless asyncapi.__noSchemas}}
* [Schemas](#schemas)
{{/unless}}

{{> content}}
