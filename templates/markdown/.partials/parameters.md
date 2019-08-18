{% from "./schema.md" import schema %}

{% macro parameters(params, hideTitle=false) %}
{% if not hideTitle %}
#### Channel Parameters
{% endif %}

{% for paramName, param in params %}
##### {{paramName}}

{% if param.description() %}
{{param.description() | safe}}
{% endif %}

{{- schema(param.schema(), paramName, hideTitle=true) -}}
{% endfor %}
{% endmacro %}
