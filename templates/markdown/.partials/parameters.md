{% from "./schema.md" import schema %}

{% macro parameters(params, hideTitle=false) %}
{% if not hideTitle %}
#### Channel Parameters
{% endif %}

{% for param in params %}
{% if param.name %}
##### {{param.name}}
{% endif %}

{% if param.description %}
{{param.description | safe}}
{% endif %}

{{- schema(param.schema, param.name, hideTitle=true) -}}
{% endfor %}
{% endmacro %}
