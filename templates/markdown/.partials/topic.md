<a name="topic-{{topicName}}"></a>
<h3>
{{~#if topic.deprecated}}<em>Deprecated</em>{{~/if}}
{{~#if topic.publish}}<code>publish</code>{{~/if}}
{{~#if topic.subscribe}}<code>subscribe</code>{{~/if}}
{{topicName}}
</h3>

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
  {{~> operation operation=op cssClasses='operation--indented'~}}
{{else}}
  {{~#if topic.publish ~}}
    {{~> operation operation=topic.publish~}}
  {{~/if~}}
{{~/each~}}

{{~#each topic.subscribe.oneOf as |op index| ~}}
  ##### Message #{{inc index}}
  {{~> operation operation=op cssClasses='operation--indented'~}}
{{else}}
  {{~#if topic.subscribe ~}}
    {{~> operation operation=topic.subscribe~}}
  {{~/if~}}
{{~/each~}}
