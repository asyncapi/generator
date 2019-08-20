const service = module.exports = {};
{% if channel.hasPublish() %}
/**
 * {{ channel.publish().summary() }}
 * @param {object} options
 * @param {object} options.message
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
service.{{ channel.publish().id() }} = async ({message}) => {
  // Implement your business logic here...
};

{%- endif %}
{%- if channel.hasSubscribe() %}
/**
 * {{ channel.subscribe().summary() }}
 * @param {object} options
 * @param {object} options.message
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
service.{{ channel.subscribe().id() }} = async ({message}) => {
  // Implement your business logic here...
};

{%- endif %}
