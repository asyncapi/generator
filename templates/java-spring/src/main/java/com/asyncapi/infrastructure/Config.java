{% from ".partials/AmqpConfig.java" import amqpConfig %}
{%- from ".partials/MqttConfig.java" import mqttConfig %}

{%- set server = asyncapi.server(params.server) %}
{%- if server.protocol() === 'amqp' %}
{{- amqpConfig(asyncapi) }}
{%- endif %}
{%- if server.protocol() === 'mqtt' %}
{{- mqttConfig(asyncapi) }}
{% endif %}