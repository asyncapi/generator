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

	private static final String SPRING_DESTINATION_HEADER = "spring.cloud.stream.sendto.destination";
	private static final Logger log = LoggerFactory.getLogger(Messaging.class);

{% for channelName, channel in asyncapi.channels() -%}
{%- set name = channelName | camelCase %}
{%- set upperName = name | upperFirst %}
{%- set messageClass = [channelName, channel] | messageClass -%}
{%- set payloadClass = [channelName, channel] | payloadClass -%}
{%- set lowerPayloadName = payloadClass | lowerFirst %}
	// channel: {{ channelName }}

{%- if channel.hasPublish() %}
	// publisher
{%- set emitterName = name + "EmitterProcessor" %}
	EmitterProcessor<Message<{{payloadClass}}>> {{emitterName}} = EmitterProcessor.create();

	@Bean
	public Supplier<Flux<Message<{{payloadClass}}>>> {{name}}Supplier() {
		return () -> {{emitterName}};
	}

	public void send{{upperName}}({{payloadClass}} payload) {
		Message<SensorReading> message = MessageBuilder
			.withPayload(payload)
			.build();
		log.debug("Sending message " + message);
		{{emitterName}}.onNext(message);
	}

{% endif %}
{%- if channel.hasSubscribe() %}
	// subscriber
{%- set callbackName = name + "Callback" %}
{%- set upperCallbackName = callbackName | upperFirst %}
	private Consumer<Message<{{payloadClass}}>> {{callbackName}};

	public void set{{upperCallbackName}}( Consumer<Message<{{payloadClass}}>> callback ) {
		{{callbackName}} = callback;
	}

	@Bean
	Consumer<Message<{{payloadClass}}>> {{name}}Consumer() {
		return message -> {{callbackName}}.accept(message);
	}

{% endif %}
{% endfor %}

}

