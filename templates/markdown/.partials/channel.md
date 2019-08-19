{% from "./parameters.md" import parameters %}
{% from "./operation.md" import operation %}

{% macro channel(chan, channelName) %}
<a name="channel-{{channelName}}"></a>

{% if chan.description() %}
{{ chan.description() | safe }}
{% endif %}

{% if chan.parameters() %}
{{- parameters(chan.parameters()) -}}
{% endif %}

{% if chan.hasPublish() %}
{{ operation(chan.publish(), channelName) }}
{%- endif -%}
{% if chan.hasSubscribe() %}
{{ operation(chan.subscribe(), channelName) }}
{%- endif -%}
{% endmacro %}
