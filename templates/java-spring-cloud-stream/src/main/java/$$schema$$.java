{% include '.partials/java-package' -%}
{% from ".partials/java-class" import javaClass %}
{{ javaClass(schemaName, schema.properties(), 0, false ) }}
