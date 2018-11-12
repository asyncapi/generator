{{#unless asyncapi.__noMessages}}
## Messages
{{/unless}}

{{#each asyncapi.components.messages}}
{{~>message message=. messageName=@key~}}
{{/each}}
