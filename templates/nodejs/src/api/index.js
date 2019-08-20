'use strict';

const hermes = require('hermesjs')();
const buffer2string = require('./middlewares/buffer2string');
const string2json = require('./middlewares/string2json');
const logger = require('./middlewares/logger');
{%- set protocol = asyncapi.server(params.server).protocol() %}
const {{ protocol | capitalize }}Adapter = require('./adapters/{{protocol}}');
{%- for channelName, channel in asyncapi.channels() %}
const {{ channelName | camelCase }} = require('./routes/{{ channelName | kebabCase }}.js');
{%- endfor %}

hermes.add('broker', {{ protocol | kebabCase | capitalize }}Adapter);

hermes.on('broker:ready', ({name}) => {
  console.log(`${name} is listening...`);
});

hermes.use(buffer2string);
hermes.use(string2json);
hermes.use(logger);

{%- for channelName, channel in asyncapi.channels() %}
hermes.use({{ channelName | camelCase }});
{%- endfor %}

hermes.use((err, message, next) => {
  console.error(err);
  next();
});

hermes.listen();
