const Router = require('hermesjs/lib/router');
const router = new Router();
const {{ channelName | camelCase }}Handler = require('../handlers/{{ channelName | kebabCase }}');
module.exports = router;
{% if channel.hasPublish() %}
  {%- if channel.publish().summary() %}
/**
 * {{ channel.publish().summary() }}
 */
  {%- endif %}
router.use('{{ channelName | toHermesTopic }}', async (message, next) => {
  try {
    await {{ channelName | camelCase }}Handler.{{ channel.publish().id() }}({message});
    next();
  } catch (e) {
    next(e);
  }
});

{%- endif %}
{%- if channel.hasSubscribe() %}
  {%- if channel.subscribe().summary() %}
/**
 * {{ channel.subscribe().summary() }}
 */
  {%- endif %}
router.useOutbound('{{ channelName | toHermesTopic }}', async (message, next) => {
  try {
    await {{ channelName | camelCase }}Handler.{{ channel.subscribe().id() }}({message});
    next();
  } catch (e) {
    next(e);
  }
});

{%- endif %}
