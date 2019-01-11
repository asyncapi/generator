## <a id="events"/>Events

### <a id="events-receive"/>Events a client can receive:
{{#each asyncapi.events.receive as |event index|}}
{{#if event.x-title}}
#### {{event.x-title}} {{#if message.deprecated}} (**deprecated**){{/if}}
{{else}}
#### Event #{{index}} {{#if message.deprecated}} (**deprecated**){{/if}}
{{/if}}
{{> message message=event hideTitle=true}}
{{/each}}

### <a id="events-send"/>Events a client can send:
{{#each asyncapi.events.send as |event index|}}
{{#if event.x-title}}
#### {{event.x-title}} {{#if message.deprecated}} (**deprecated**){{/if}}
{{else}}
#### Event #{{index}} {{#if message.deprecated}} (**deprecated**){{/if}}
{{/if}}
{{> message message=event hideTitle=true}}
{{/each}}
