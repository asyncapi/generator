const Router = require('hermesjs/lib/router');
const router = new Router();
const {{ channelName | camelCase }}Service = require('../services/{{ channelName | kebabCase }}');
module.exports = router;
{% if channel.hasPublish() %}
  {%- if channel.publish().summary() %}
/**
 * {{ channel.publish().summary() }}
 */
  {%- endif %}
router.use('{{ channelName | toHermesTopic }}', async (message, next) => {
  await {{ channelName | camelCase }}Service.{{ channel.publish().id() }}({message});
  next();
});

{%- endif %}
{%- if channel.hasSubscribe() %}
  {%- if channel.subscribe().summary() %}
/**
 * {{ channel.subscribe().summary() }}
 */
  {%- endif %}
router.useOutbound('{{ channelName | toHermesTopic }}', async (message, next) => {
  await {{ channelName | camelCase }}Service.{{ channel.subscribe().id() }}({message});
  next();
});

{%- endif %}
