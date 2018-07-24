## Messages

{{#each asyncapi.components.messages}}
{{~>message message=. messageName=@key~}}
{{/each}}
