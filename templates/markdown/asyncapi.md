# {{asyncapi.info().title()}} {{asyncapi.info().version()}} documentation

{% if asyncapi.info().ext('x-logo') %}
![{{asyncapi.info().title()}} logo]({{asyncapi.info().ext('x-logo')}})
{% endif %}

{{ asyncapi.info().description() | safe }}

## Table of Contents

{% if asyncapi.info().termsOfService() %}
* [Terms of Service](#termsOfService)
{% endif %}
{% if asyncapi.hasServers() %}
* [Servers](#servers)
{% endif %}
{% if asyncapi.hasChannels() %}
* [Channels](#channels)
{% endif %}

{% include ".partials/content.md" %}
