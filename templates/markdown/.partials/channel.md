{% from "./parameters.md" import parameters %}
{% from "./operation.md" import operation %}

{% macro channel(chan, channelName) %}
<a name="channel-{{channelName}}"></a>

### {% if chan.publish %} `publish`{%- endif %}{%- if chan.subscribe %} `subscribe`{%- endif %} {{chanName}} {%- if chan.deprecated %} (**deprecated**){% endif %} {{channelName}}

{% if chan.parameters %}
{{- parameters(chan.parameters) -}}
{% endif %}

#### Message

{% if chan.publish.oneOf %}
You can send one of the following messages:
{% endif %}
{% if chan.subscribe.oneOf %}
You can receive one of the following messages:
{% endif %}

{%- for op in chan.publish.oneOf -%}
  ##### Message #{{loop.index}}
  {{ operation(op) }}
{% else %}
  {%- if chan.publish -%}
    {{- operation(chan.publish) -}}
  {%- endif -%}
{%- endfor -%}

{% for op in chan.subscribe.oneOf -%}
  ##### Message #{{loop.index}}
  {{- operation(op) -}}
{% else %}
  {%- if chan.subscribe -%}
    {{ operation(chan.subscribe) -}}
  {%- endif -%}
{% endfor %}
{% endmacro %}
