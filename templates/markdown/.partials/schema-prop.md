{% macro schemaProp(prop, propName, required=false, path='') %}
<tr>
  <td>{{ path | tree }}{{ propName }} {% if required %}<strong>(required)</strong>{% endif %}</td>
  <td>{{ prop.type() }}{%- if prop.anyOf() -%}anyOf{%- endif -%}{%- if prop.allOf() -%}allOf{%- endif -%}{%- if prop.oneOf() %}oneOf{%- endif -%}{%- if prop.items().type %}({{prop.items().type()}}){%- endif -%}</td>
  <td>{{ prop.description() | markdown2html | safe }}</td>
  <td>{{ prop.enum() | acceptedValues | safe }}</td>
</tr>
{% for p in prop.anyOf() %}
{% set pName %}<{{ loop.index }}>{% endset %}
{{ schemaProp(p, pName, path=(propName | buildPath(path, pName))) }}
{% endfor %}
{% for p in prop.allOf() %}
{% set pName %}<{{ loop.index }}>{% endset %}
{{ schemaProp(p, pName, path=(propName | buildPath(path, pName))) }}
{% endfor %}
{% for p in prop.oneOf() %}
{% set pName %}<{{ loop.index }}>{% endset %}
{{ schemaProp(p, pName, path=(propName | buildPath(path, pName))) }}
{% endfor %}
{% for pName, p in prop.properties() %}
{{ schemaProp(p, pName, path=(propName | buildPath(path, pName)), required=(prop | isRequired(pName))) }}
{% endfor %}
{% if prop.additionalProperties() and prop.additionalProperties().properties %}
{% for pName, p in prop.additionalProperties().properties() %}
{{ schemaProp(p, pName, path=(propName | buildPath(path, pName)), required=(prop.additionalProperties() | isRequired(pName))) }}
{% endfor %}
{% endif %}
{% if prop.items() and prop.items().properties %}
{% for pName, p in prop.items().properties() %}
{{ schemaProp(p, pName, path=(propName | buildPath(path, pName)), required=(prop.items() | isRequired(pName))) }}
{% endfor %}
{% endif %}
{% endmacro %}
