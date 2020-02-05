{# vim: set ts=4 sw=4 sts=4 noexpandtab : #}
{%- include '.partials/java-package' -%}

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;

@SpringBootApplication
public class Application implements CommandLineRunner {

	private static final Logger log = LoggerFactory.getLogger(Application.class);

	@Autowired
	private Messaging messaging;

	public static void main(String[] args) {
		SpringApplication.run(Application.class);
	}

	@Override
	public void run(String... args) throws Exception {
{% for channelName, channel in asyncapi.channels() -%}
{%- if channel.hasSubscribe() %}
{%- set name = [channelName, channel] | functionName %}
{%- set upperName = name | upperFirst %}
		messaging.set{{upperName}}Callback(this::receive);
{%- endif %}
{%- endfor %}

		while (true) {
{%- for channelName, channel in asyncapi.channels() -%}
{%- if channel.hasPublish() %}
{%- set name = [channelName, channel] | functionName %}
{%- set upperName = name | upperFirst %}
{%- set payloadClass = [channelName, channel] | payloadClass %}
{%- set payloadName = name + "Payload" %}
{%- set topicInfo = [channelName, channel] | topicInfo %}
			{{payloadClass}} {{payloadName}} = new {{payloadClass}}();
			messaging.send{{upperName}}( {{payloadName}}{{topicInfo.sampleArgList}} );
{% endif %}
{%- endfor %}
			Thread.sleep(1000);
		}

	}

	public void receive(Message<?> message) {
		Object payload = message.getPayload();
		log.info("Received a message: " + payload);
	}

}
