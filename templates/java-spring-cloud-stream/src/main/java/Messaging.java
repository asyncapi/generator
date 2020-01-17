{# vim: set ts=4 sw=4 sts=4 noexpandtab : #}
{%- include '.partials/java-package' -%}

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import reactor.core.publisher.EmitterProcessor;
import reactor.core.publisher.Flux;

import java.util.function.Consumer;
import java.util.function.Supplier;

@Configuration
public class Messaging {

    private static final Logger log = LoggerFactory.getLogger(Messaging.class);

{% for channelName, channel in asyncapi.channels() -%}
{%- set name = channelName | camelCase %}
{%- set messageClass = [channelName, channel] | messageClass -%}
// channel: {{ channelName }} {{ name }} {{ messageClass }}

{% if channel.hasPublish() -%}
// publisher
{% endif %}

{% if channel.hasSubscribe() -%}
// subscriber
{%- set callbackName = name + "Callback" %}
	private Supplier<{{messageClass}}> {{callbackName}};
{% endif %}

{% endfor %}

}

