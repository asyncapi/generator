{% include ".partials/info.md" %}

{% if asyncapi.hasChannels() %}
{% include ".partials/channels.md"  %}
{% endif %}
