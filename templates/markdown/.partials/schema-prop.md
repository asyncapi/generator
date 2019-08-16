{% macro schemaProp(prop, propName, required=false, path='') %}
<tr>
  <td>{{ path | tree }}{{ propName }} {% if required %}<strong>(required)</strong>{% endif %}</td>
  <td>
    {{ prop.type }}
    {%- if prop.anyOf -%}anyOf{%- endif -%}
    {%- if prop.oneOf %}oneOf{%- endif -%}
    {%- if prop.items.type %}({{prop.items.type}}){%- endif -%}
  </td>
  <td>{{ prop.descriptionAsHTML | safe }}</td>
  <td>{{ prop.enum | acceptedValues | safe }}</td>
</tr>
{% for pName, p in prop.anyOf %}
{{ schemaProp(p, pName, path=(propName | buildPath(path, pName))) }}
{% endfor %}
{% for pName, p in prop.oneOf %}
{{ schemaProp(p, pName, path=(propName | buildPath(path, pName))) }}
{% endfor %}
{% for pName, p in prop.properties %}
{{ schemaProp(p, pName, path=(propName | buildPath(path, pName)), required=(prop | isRequired(pName))) }}
{% endfor %}
{% for pName, p in prop.additionalProperties.properties %}
{{ schemaProp(p, pName, path=(propName | buildPath(path, pName)), required=(prop.additionalProperties | isRequired(pName))) }}
{% endfor %}
{% for pName, p in prop.items.properties %}
{{ schemaProp(p, pName, path=(propName | buildPath(path, pName)), required=(prop.items | isRequired(pName))) }}
{% endfor %}
{% endmacro %}
