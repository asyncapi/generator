
{%- from "../../.partials/channel/publish.ts.njk" import publish %}
{%- from "../../.partials/channel/reply.ts.njk" import reply %}
{%- from "../../.partials/channel/request.ts.njk" import request %}
{%- from "../../.partials/channel/subscribe.ts.njk" import subscribe %}
{%- if channel.hasPublish() %}
import {{ channel.publish().message(0).uid() | camelCase }} from '../message/{{ channel.publish().message(0).uid() | kebabCase}}'
{%- endif %}
{%- if channel.hasSubscribe() %}
import {{ channel.subscribe().message(0).uid() | camelCase }} from '../message/{{ channel.subscribe().message(0).uid() | kebabCase}}'
{%- endif %}

import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import * as utils from '../utils';

{%- if channel | isRequestReply %}
  {%- if channel | isRequester %}
  {{ request(channel, channelName, asyncapi.server(params.server)) }}
  {%- endif %}
  {%- if channel | isReplier %}
  {{ reply(channel, channelName, asyncapi.server(params.server)) }}
  {%- endif %}
{%- endif %}

{%- if channel | isPubsub %}
  {%- if channel.hasSubscribe() %}
  {{ subscribe(channel, channelName, asyncapi.server(params.server)) }}
  {%- endif %}
  {%- if channel.hasPublish() %}
  {{ publish(channel, channelName, asyncapi.server(params.server)) }}
  {%- endif %}
{%- endif %}
