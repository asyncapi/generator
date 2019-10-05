{%- if channel.hasPublish() and channel.publish().ext('x-lambda') %}const fetch = require('node-fetch');{%- endif %}
const handler = module.exports = {};
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
handler.{{ channel.publish().id() }} = async ({message}) => {
  {%- if channel.publish().ext('x-lambda') %}
  {%- set lambda = channel.publish().ext('x-lambda') %}
  fetch('{{ lambda.url }}', {
    method: '{% if lambda.method %}{{ lambda.method }}{% else %}POST{% endif %}',
    body: JSON.stringify({{ lambda.body | toJS | indent(4) | trimLastChar | safe }}),
    {%- if lambda.headers %}
    headers: {{ lambda.headers | toJS | indent(4) | trimLastChar | safe }}
    {%- endif %}
  })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => { throw err; });
  {%-  else %}
  // Implement your business logic here...
  {%- endif %}
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
handler.{{ channel.subscribe().id() }} = async ({message}) => {
  // Implement your business logic here...
};

{%- endif %}
