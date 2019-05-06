## Channels

{{#each asyncapi.channels}}
{{~>channel channel=. channelName=@key ~}}
{{/each}}
