
{% if channel.hasPublish() %}
import {{ channel.publish().message(0).name() | camelCase }} from '../message/{{ channel.publish().message(0).name() | kebabCase}}'
{% - endif %}
{% if channel.hasSubscribe() %}
import {{ channel.subscribe().message(0).name() | camelCase }} from '../message/{{ channel.subscribe().message(0).name() | kebabCase}}'
{% - endif %}

import { Client, NatsError, Subscription, SubscriptionOptions, Payload } from 'ts-nats';
import * as utils from '../utils';

