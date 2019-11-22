const Hermes = require('hermesjs');
const app = new Hermes();
const { cyan, gray } = require('colors/safe');
const buffer2string = require('./middlewares/buffer2string');
const string2json = require('./middlewares/string2json');
const json2string = require('./middlewares/json2string');
const logger = require('./middlewares/logger');
const errorLogger = require('./middlewares/error-logger');
const config = require('../lib/config');
{%- set protocol = asyncapi.server(params.server).protocol() %}
const {{ protocol | capitalize }}Adapter = require('hermesjs-{{protocol}}');
{%- for channelName, channel in asyncapi.channels() %}
const {{ channelName | camelCase }} = require('./routes/{{ channelName | filenamify }}.js');
{%- endfor %}

app.addAdapter({{ protocol | capitalize }}Adapter, config.{% if protocol === 'ws' %}ws{% else %}broker.{{protocol}}{% endif %});

app.use(buffer2string);
app.use(string2json);
app.use(logger);

// Channels
{% for channelName, channel in asyncapi.channels() -%}
{% if channel.hasPublish() -%}
app.use({{ channelName | camelCase }});
{% endif -%}
{% if channel.hasSubscribe() -%}
app.useOutbound({{ channelName | camelCase }});
{% endif -%}
{% endfor %}
app.use(errorLogger);
app.useOutbound(logger);
app.useOutbound(json2string);

app
  .listen()
  .then((adapters) => {
    console.log(cyan.underline(`${config.app.name} ${config.app.version}`), gray('is ready!'), '\n');
    adapters.forEach(adapter => {
      console.log('🔗 ', adapter.name(), gray('is connected!'));
    });
  })
  .catch(console.error);
