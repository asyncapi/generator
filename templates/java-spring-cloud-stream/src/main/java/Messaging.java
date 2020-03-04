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
import java.util.Map;

@Configuration
public class Messaging {

	private static final String SPRING_DESTINATION_HEADER = "spring.cloud.stream.sendto.destination";
	private static final Logger log = LoggerFactory.getLogger(Messaging.class);


{% for channelName, channel in asyncapi.channels() -%}
{%- set name = [channelName, channel] | functionName %}
{%- set upperName = name | upperFirst %}
{%- set payloadClass = [channelName, channel] | payloadClass -%}
{%- set lowerPayloadName = payloadClass | lowerFirst %}
{%- set topicInfo = [channelName, channel] | topicInfo %}
	// channel: {{ channelName }}
{% for param in topicInfo.params -%}
{%- if param.enum %}
    public static enum {{ param.type }} { {{ param.enum }} }
{% endif -%}
{%- endfor -%}
{%- if channel.hasPublish() %}
	// publisher
{%- set emitterName = name + "EmitterProcessor" %}
	EmitterProcessor<Message<{{payloadClass}}>> {{emitterName}} = EmitterProcessor.create();

	@Bean
	public Supplier<Flux<Message<{{payloadClass}}>>> {{name}}Supplier() {
		return () -> {{emitterName}};
	}
{% if topicInfo.hasParams %}
	public void send{{upperName}}({{payloadClass}} payload, {{ topicInfo.functionParamList }}) {
		send{{upperName}}( payload, {{topicInfo.functionArgList}}, null);
	}

	public void send{{upperName}}({{payloadClass}} payload, {{ topicInfo.functionParamList }}, Map<String, Object> headers) {
		String topic = String.format("{{topicInfo.publishTopic}}", {{topicInfo.functionArgList}});
		MessageBuilder messageBuilder = MessageBuilder.withPayload(payload);
		messageBuilder.setHeader(SPRING_DESTINATION_HEADER, topic);

		if (headers != null) {
			headers.forEach( (k, v ) -> {messageBuilder.setHeader(k, v);});
		}

		Message<{{payloadClass}}> message = messageBuilder.build();
		log.debug("Sending a message to the topic " + topic);
		{{emitterName}}.onNext(message);
	}
{% else %}
	public void send{{upperName}}({{payloadClass}} payload) {
		send{{upperName}}(payload, null);
	}

	public void send{{upperName}}({{payloadClass}} payload, Map<String, Object> headers) {
		MessageBuilder messageBuilder = MessageBuilder.withPayload(payload);

		if (headers != null) {
			headers.forEach( (k, v ) -> {messageBuilder.setHeader(k, v);});
		}

		Message<{{payloadClass}}> message = messageBuilder.build();
		log.debug("Sending message " + message);
		{{emitterName}}.onNext(message);
	}
{% endif %}
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
		return message -> { if ({{callbackName}} != null) {{callbackName}}.accept(message); };
	}

{% endif %}
{% endfor %}

}

