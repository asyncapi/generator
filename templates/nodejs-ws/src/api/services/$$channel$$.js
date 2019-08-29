const service = module.exports = {};
{% if channel.hasPublish() %}
/**
 * {{ channel.publish().summary() }}
 * @param {object} ws WebSocket connection.
 * @param {object} options
 * @param {%raw%}{{%endraw%}{{channel.publish().message(0).payload().type()}}{%raw%}}{%endraw%} options.message The message to send.
{%- if channel.publish().message(0).headers() %}
{%- for fieldName, field in channel.publish().message(0).headers().properties() %}
{{ field | docline(fieldName, 'options.message.headers') }}
{%- endfor %}
{%- endif %}
{%- if channel.publish().message(0).payload() %}
{%- for fieldName, field in channel.publish().message(0).payload().properties() %}
{{ field | docline(fieldName, 'options.message.payload') }}
{%- endfor %}
{%- endif %}
 */
service.{{ channel.publish().id() }} = async (ws, { message }) => {
  ws.send('Message from the server: Implement your business logic here.');
};

{%- endif %}
{%- if channel.hasSubscribe() %}
/**
 * {{ channel.subscribe().summary() }}
 * @param {object} ws WebSocket connection.
 * @param {object} options
 * @param {string} options.path The path in which the message was received.
 * @param {object} options.query The query parameters used when connecting to the server.
 * @param {%raw%}{{%endraw%}{{channel.subscribe().message(0).payload().type()}}{%raw%}}{%endraw%} options.message The received message.
{%- if channel.subscribe().message(0).headers() %}
{%- for fieldName, field in channel.subscribe().message(0).headers().properties() %}
{{ field | docline(fieldName, 'options.message.headers') }}
{%- endfor %}
{%- endif %}
{%- if channel.subscribe().message(0).payload() %}
{%- for fieldName, field in channel.subscribe().message(0).payload().properties() %}
{{ field | docline(fieldName, 'options.message.payload') }}
{%- endfor %}
{%- endif %}
 */
service.{{ channel.subscribe().id() }} = async (ws, { message, path }) => {
  ws.send('Message from the server: Implement your business logic here.');
};

{%- endif %}
