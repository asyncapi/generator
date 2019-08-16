{% from "./schema.md" import schema %}
{% from "./tags.md" import tags %}

{% macro operation(operation) %}
{% if operation.summary %}
{{ operation.summary | safe }}

{% endif %}
{% if operation.description %}
{{ operation.description | safe }}
{% endif %}

{% if operation.headers %}
##### Headers

{{ schema(operation.headers, 'Message Headers', hideTitle=true) }}

{% if not operation.example and operation.generatedHeadersExample %}
###### Example of headers _(generated)_

```json
{{ operation.generatedHeadersExample | safe }}
```
{% endif %}
{% endif %}

##### Payload

{{ schema(operation.message.payload, 'Message Payload', hideTitle=true) }}

{% if operation.message.payload.example %}
###### Example

```json
{{ operation.message.formattedExample | safe }}
```
{% elif operation.message.generatedPayloadExample %}
###### Example of payload _(generated)_

```json
{{ operation.message.generatedPayloadExample | safe }}
```
{% endif %}

{% if operation.tags %}
##### Tags

{{ tags(operation.tags) }}
{% endif %}
{% endmacro %}
