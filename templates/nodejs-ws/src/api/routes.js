const util = require('util');
const { Router } = require('express');
const { yellow } = require('../lib/colors');
{%- for channelName, channel in asyncapi.channels() -%}
{%- if channel.hasSubscribe() %}
{%- if channel.subscribe().id() === undefined -%}
{ { 'This template requires operationId to be set in every operation.' | throw }}
{%- endif %}
const {{ channelName | camelCase }}Service = require('./services/{{ channelName | kebabCase }}');
{%- endif -%}
{%- endfor %}
const router = Router();
module.exports = router;
{% for channelName, channel in asyncapi.channels() -%}
{%- if channel.hasSubscribe() %}
  {%- if channel.subscribe().summary() %}
/**
 * {{ channel.subscribe().summary() }}
 */
  {%- endif %}
router.ws('{{ channelName | pathResolve }}', async (ws, req) => {
  ws.on('message', async (msg) => {
    const path = req.path.substr(0, req.path.length - '/.websocket'.length);
    console.log(`${yellow(path)} message was received:`);
    console.log(util.inspect(msg, { depth: null, colors: true }));
    await {{ channelName | camelCase }}Service.{{ channel.subscribe().id() }}(ws, { message: msg, path, query: req.query });
  });
});

{%- endif %}
{% endfor -%}
