import * as WebsocketConnections from '../Client'
import {{ channel.publish().message(0).name() }} from '../structure/{{ channel.publish().message(0).name() | kebabCase}}'
export { { { channel.publish().message(0).name() } } as structure };

{% if channel.hasPublish() %}
{% if channel.publish().tags() | length == 0 or channel.publish().tags() | containsTag("server") %}
/**
 * {{ channel.publish().summary() }}
 * @param {% raw %}{{% endraw %}{{ channel.publish().message(0).name() }}{% raw %}}{% endraw %} {{ channel.publish().message(0).name() | firstLowerCase}}
*/
export function publish(
  {{ channel.publish().message(0).name() | firstLowerCase }}: { { channel.publish().message(0).name() } }
    ) {
  WebsocketConnections.emitMessageToClients(
    WebsocketConnections.Channel.{{ channelName | kebabCase}},
{ { channel.publish().message(0).name() | firstLowerCase } }
    );
}
{% - endif %}
{% - endif %}

{% if channel.hasSubscribe() %}
{% if channel.publish().tags() | length == 0 or channel.publish().tags() | containsTag("client") %}
export interface CallbackObject {
  cb: ({{ channel.publish().message(0).name() | firstLowerCase }}: { { channel.publish().message(0).name() } }) => void
}

/**
 * {{ channel.publish().summary() }}
 * @param {% raw %}{{% endraw %}{{ channel.publish().message(0).name() }}{% raw %}}{% endraw %} {{ channel.publish().message(0).name() | firstLowerCase}}
*/
export function subscribe(
  cb: CallbackObject
) {
  cbList.push(cb);
}
const cbList: CallbackObject[] = []
export function notify(
  {{ channel.publish().message(0).name() | firstLowerCase }}: { { channel.publish().message(0).name() } }
    ) {
  cbList.forEach((cbo: CallbackObject) => {
    cbo.cb({{ channel.publish().message(0).name() | firstLowerCase }});
});
}
{% - endif %}
{% - endif %}
