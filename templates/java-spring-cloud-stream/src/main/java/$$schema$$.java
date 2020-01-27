{% include '.partials/java-package' -%}
{% from ".partials/java-class" import javaClass %}
{{ javaClass(schemaName, schema, 0, false ) }}
