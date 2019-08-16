{% from ".partials/AmqpConfig.java" import amqpConfig %}
{% from ".partials/MqttConfig.java" import mqttConfig %}

{% for server in asyncapi.servers %}
  {% if server.scheme === 'amqp' %}
{{ amqpConfig(asyncapi) }}
  {% endif %}
  {% if server.scheme === 'mqtt' %}
{{ mqttConfig(asyncapi) }}
  {% endif %}
{% endfor %}
