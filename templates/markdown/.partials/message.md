{% from "./schema.md" import schema %}
{% from "./tags.md" import tags %}

{% macro message(msg) %}
{% if msg.summary() %}
{{ msg.summary() }}

{% endif %}
{% if msg.description() %}
{{ msg.description() | safe }}
{% endif %}

{% if msg.headers() %}
##### Headers

{{ schema(msg.headers(), 'Message Headers', hideTitle=true) }}

{% if msg | getHeadersExamples %}
###### Examples of headers

{% for ex in msg | getHeadersExamples %}
```json
{{ ex | dump(2) | safe }}
```
{% endfor %}
{% else %}
###### Example of headers _(generated)_

```json
{{ msg.headers().json() | generateExample | safe }}
```
{% endif %}
{% endif %}

{% if msg.payload() %}
##### Payload

{{ schema(msg.payload(), 'Message Payload', hideTitle=true) }}

{% if msg | getPayloadExamples %}
###### Examples of payload

{% for ex in msg | getPayloadExamples %}
```json
{{ ex | dump(2) | safe }}
```
{% endfor %}
{% else %}
###### Example of payload _(generated)_

```json
{{ msg.payload().json() | generateExample | safe }}
```
{% endif %}
{% endif %}


{% if msg.hasTags() %}
##### Tags

{{ tags(msg.tags()) }}
{% endif %}
{% endmacro %}
