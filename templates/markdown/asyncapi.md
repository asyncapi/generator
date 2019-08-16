# {{asyncapi.info.title}} {{asyncapi.info.version}} documentation

{% if asyncapi.info.x-logo %}
![{{asyncapi.info.title}} logo]({{asyncapi.info.x-logo}})
{% endif %}

{{ asyncapi.info.description | safe }}

## Table of Contents

{% if asyncapi.info.termsOfService %}
* [Terms of Service](#termsOfService)
{% endif %}
{% if asyncapi.servers %}
* [Servers](#servers)
{% endif %}
{% if asyncapi.channels %}
* [Channels](#channels)
{% endif %}

{% include ".partials/content.md" %}
