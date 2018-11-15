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

    {{#each asyncapi.topics as |topic key|}}
    {{#if topic.subscribe}}
    @Value("${mqtt.topic.{{~topic.x-service-name~}}Topic}")
    private String {{topic.x-service-name}}Topic;

    {{/if}}
    {{/each}}

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
    {{#each asyncapi.topics as |topic key|}}

    {{#if topic.subscribe}}
    @Bean
    public IntegrationFlow {{camelCase topic.x-service-name}}Flow() {
        return IntegrationFlows.from({{camelCase topic.x-service-name}}Inbound())
                .transform(p -> p + ", received from MQTT")
                .handle(messageHandlerService::handle{{upperFirst topic.x-service-name}})
                .get();
    }

    @Bean
    public MessageProducerSupport {{camelCase topic.x-service-name}}Inbound() {
        MqttPahoMessageDrivenChannelAdapter adapter = new MqttPahoMessageDrivenChannelAdapter("{{camelCase topic.x-service-name}}Subscriber",
                mqttClientFactory(), {{topic.x-service-name}}Topic);
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        return adapter;
    }
    {{/if}}
    {{/each}}

    // publisher
    {{#each asyncapi.topics as |topic key|}}

    {{#if topic.publish}}
    @Bean
    public MessageChannel {{camelCase topic.x-service-name}}OutboundChannel() {
        return new DirectChannel();
    }

    @Bean
    @ServiceActivator(inputChannel = "{{camelCase topic.x-service-name}}OutboundChannel")
    public MessageHandler {{camelCase topic.x-service-name}}Outbound() {
        MqttPahoMessageHandler pahoMessageHandler = new MqttPahoMessageHandler("{{camelCase topic.x-service-name}}Publisher", mqttClientFactory());
        pahoMessageHandler.setAsync(true);
        pahoMessageHandler.setDefaultTopic({{topic.x-service-name}}Topic);
        return pahoMessageHandler;
    }
    {{/if}}
    {{/each}}

}
