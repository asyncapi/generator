{% include "./info.md" %}

{% if asyncapi.hasChannels() %}
{% include "./channels.md"  %}
{% endif %}
