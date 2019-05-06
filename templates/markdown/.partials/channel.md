<a name="channel-{{channelName}}"></a>

### {{~#if channel.publish}} `publish`{{~/if}}{{~#if channel.subscribe}} `subscribe`{{~/if}} {{channelName}} {{~#if channel.deprecated}} (**deprecated**){{~/if}}

{{#if channel.parameters}}
{{~> parameters params=channel.parameters channelName=channelName ~}}
{{/if}}

#### Message

{{#if channel.publish.oneOf}}
You can send one of the following messages:
{{/if}}
{{#if channel.subscribe.oneOf}}
You can receive one of the following messages:
{{/if}}

{{~#each channel.publish.oneOf as |op index| ~}}
  ##### Message #{{inc index}}
  {{~> operation operation=op~}}
{{else}}
  {{~#if channel.publish ~}}
    {{~> operation operation=channel.publish~}}
  {{~/if~}}
{{~/each~}}

{{~#each channel.subscribe.oneOf as |op index| ~}}
  ##### Message #{{inc index}}
  {{~> operation operation=op~}}
{{else}}
  {{~#if channel.subscribe ~}}
    {{~> operation operation=channel.subscribe~}}
  {{~/if~}}
{{~/each~}}
