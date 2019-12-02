{% macro mqttConfig(asyncapi) -%}
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

    {%- for channelName, channel in asyncapi.channels() %}
    {% set channelId = channel.publish().id() if channel.hasPublish() else channel.subscribe().id() %}
    @Value("${mqtt.channel.{{channelId | camelCase}}Channel}")
    private String {{channelId | camelCase}}Channel;
    {%- endfor %}

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
    private MessageHandlerService messageHandlerService;
    {% for channelName, channel in asyncapi.channels() %}
    {%- if channel.hasSubscribe() %}
    @Bean
    public IntegrationFlow {{channel.subscribe().id() | camelCase}}Flow() {
        return IntegrationFlows.from({{channel.subscribe().id() | camelCase}}Inbound())
                .handle(messageHandlerService::{{channel | handlerMethodName}})
                .get();
    }

    @Bean
    public MessageProducerSupport {{channel.subscribe().id() | camelCase}}Inbound() {
        MqttPahoMessageDrivenChannelAdapter adapter = new MqttPahoMessageDrivenChannelAdapter("{{channel.subscribe().id() | camelCase}}Subscriber",
                mqttClientFactory(), {{channel.subscribe().id()}}Channel);
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        return adapter;
    }
    {%- endif %}
    {%- endfor %}

    // publisher
    {%- for channelName, channel in asyncapi.channels() %}
    {%- if channel.hasPublish() %}
    @Bean
    public MessageChannel {{channel.publish().id() | camelCase}}OutboundChannel() {
        return new DirectChannel();
    }

    @Bean
    @ServiceActivator(inputChannel = "{{channel.publish().id() | camelCase}}OutboundChannel")
    public MessageHandler {{channel.publish().id() | camelCase}}Outbound() {
        MqttPahoMessageHandler pahoMessageHandler = new MqttPahoMessageHandler("{{channel.publish().id() | camelCase}}Publisher", mqttClientFactory());
        pahoMessageHandler.setAsync(true);
        pahoMessageHandler.setDefaultTopic({{channel.publish().id() | camelCase}}Channel);
        return pahoMessageHandler;
    }
    {%- endif -%}
    {% endfor %}
}
{%- endmacro %}
