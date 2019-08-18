{% from "./schema-prop.md" import schemaProp %}

{% macro schema(schema, schemaName, hideTitle=false) %}
{% if not hideTitle %}
#### {{schemaName}}
{% endif %}

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
    {% for propName, prop in schema.properties() %}
      {{ schemaProp(prop, propName, required=(schema | isRequired(propName)), path='') }}
    {% else %}
      {{ schemaProp(schema, schemaName,  path='') }}
    {% endfor %}
  </tbody>
</table>
{% endmacro %}
