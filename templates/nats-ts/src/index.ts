import * as WebsocketConnections from './Client';
import * as SubscribeStruct from './messages/subscribe'
// create the server
import * as Nats from 'nats';
{% - for channelName, channel in asyncapi.channels() %}
import * as {{ channelName | camelCase }} from "./channels/{{ channelName | camelCase }}";
{% - endfor %}

export default class Client {
  constructor() {

  }

  {% - for channelName, channel in asyncapi.channels() %}
{ { channelName | camelCase } } from "./channels/{{ channelName | camelCase }}";
{% - endfor %}
}
