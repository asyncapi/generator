{% macro tags(tagList) %}
{% for tag in tagList %}
* {{tag.name()}}
{% endfor %}
{% endmacro %}
