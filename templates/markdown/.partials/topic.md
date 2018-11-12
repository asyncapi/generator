<a name="topic-{{topicName}}"></a>

### {{~#if topic.publish}} `publish`{{~/if}}{{~#if topic.subscribe}} `subscribe`{{~/if}} {{topicName}} {{~#if topic.deprecated}} (**deprecated**){{~/if}}

{{#if topic.parameters}}
{{~> parameters params=topic.parameters topicName=topicName ~}}
{{/if}}

#### Message

{{#if topic.publish.oneOf}}
You can send one of the following messages:
{{/if}}
{{#if topic.subscribe.oneOf}}
You can receive one of the following messages:
{{/if}}

{{~#each topic.publish.oneOf as |op index| ~}}
  ##### Message #{{inc index}}
  {{~> operation operation=op~}}
{{else}}
  {{~#if topic.publish ~}}
    {{~> operation operation=topic.publish~}}
  {{~/if~}}
{{~/each~}}

{{~#each topic.subscribe.oneOf as |op index| ~}}
  ##### Message #{{inc index}}
  {{~> operation operation=op~}}
{{else}}
  {{~#if topic.subscribe ~}}
    {{~> operation operation=topic.subscribe~}}
  {{~/if~}}
{{~/each~}}
