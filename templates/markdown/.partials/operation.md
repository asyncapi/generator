{% from "./message.md" import message %}

{% macro operation(op, channelName) %}
### {% if op.isPublish() %} `publish`{%- endif %}{%- if op.isSubscribe() %} `subscribe`{%- endif %} {{channelName}}

#### Message

{% if op.hasMultipleMessages() %}
Accepts **one of** the following messages:

{%- for msg in op.messages() -%}
##### Message #{{loop.index}}
{{ message(msg) }}
{%- endfor -%}
{% else %}
{{- message(op.message(0)) -}}
{% endif %}
{% endmacro %}
