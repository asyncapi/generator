{% from "./channel.md" import channel %}

## Channels

{% for channelName, chan in asyncapi.channels() %}
{{ channel(chan, channelName) -}}
{% endfor %}
