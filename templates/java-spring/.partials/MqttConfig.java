{% macro mqttConfig(asyncapi) %}
package com.asyncapi.infrastructure;

import com.asyncapi.service.MessageHandlerService;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.integration.dsl.IntegrationFlows;
import org.springframework.integration.endpoint.MessageProducerSupport;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.outbound.MqttPahoMessageHandler;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;
import org.springframework.util.StringUtils;

@Configuration
public class Config {

    @Value("${mqtt.broker.host}")
    private String host;

    @Value("${mqtt.broker.port}")
    private int port;

    @Value("${mqtt.broker.username}")
    private String username;

    @Value("${mqtt.broker.password}")
    private String password;

    {% for topicName, topic in asyncapi.topics %}
    @Value("${mqtt.topic.{{-topic.x-service-name-}}Topic}")
    private String {{topic.x-service-name}}Topic;

    {% endfor %}

    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[] { host + ":" + port });
        if (!StringUtils.isEmpty(username)) {
            options.setUserName(username);
        }
        if (!StringUtils.isEmpty(password)) {
            options.setPassword(password.toCharArray());
        }
        factory.setConnectionOptions(options);
        return factory;
    }

    // consumer

    @Autowired
    MessageHandlerService messageHandlerService;
    {% for topicName, topic in asyncapi.subscribeTopics %}

    @Bean
    public IntegrationFlow {{topic.x-service-name | camelCase}}Flow() {
        return IntegrationFlows.from({{topic.x-service-name | camelCase}}Inbound())
                .handle(messageHandlerService::handle{{topic.x-service-name | upperFirst}})
                .get();
    }

    @Bean
    public MessageProducerSupport {{topic.x-service-name | camelCase}}Inbound() {
        MqttPahoMessageDrivenChannelAdapter adapter = new MqttPahoMessageDrivenChannelAdapter("{{topic.x-service-name | camelCase}}Subscriber",
                mqttClientFactory(), {{topic.x-service-name}}Topic);
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        return adapter;
    }
    {% endfor %}

    // publisher
    {% for topicName, topic in asyncapi.publishTopics %}

    @Bean
    public MessageChannel {{topic.x-service-name | camelCase}}OutboundChannel() {
        return new DirectChannel();
    }

    @Bean
    @ServiceActivator(inputChannel = "{{topic.x-service-name | camelCase}}OutboundChannel")
    public MessageHandler {{topic.x-service-name | camelCase}}Outbound() {
        MqttPahoMessageHandler pahoMessageHandler = new MqttPahoMessageHandler("{{topic.x-service-name | camelCase}}Publisher", mqttClientFactory());
        pahoMessageHandler.setAsync(true);
        pahoMessageHandler.setDefaultTopic({{topic.x-service-name}}Topic);
        return pahoMessageHandler;
    }
    {% endfor %}

}
{% endmacro %}
