{% macro amqpConfig(asyncapi) -%}
package com.asyncapi.infrastructure;

import com.asyncapi.service.MessageHandlerService;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.amqp.dsl.Amqp;
import org.springframework.integration.amqp.outbound.AmqpOutboundEndpoint;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.integration.dsl.IntegrationFlows;
import org.springframework.messaging.MessageChannel;

@Configuration
public class Config {

    @Value("${amqp.broker.host}")
    private String host;

    @Value("${amqp.broker.port}")
    private int port;

    @Value("${amqp.broker.username}")
    private String username;

    @Value("${amqp.broker.password}")
    private String password;

    {%- for channelName, channel in asyncapi | publishChannels %}

    @Value("${amqp.exchange.{{channel.publish().id() | camelCase}}}")
    private String {{channel.publish().id() | camelCase}}Exchange;
    {%- endfor %}

    {%- for channelName, channel in asyncapi | subscribeChannels %}

    @Value("${amqp.queue.{{channel.subscribe().id() | camelCase}}}")
    private String {{channel.subscribe().id() | camelCase}}Queue;
    {%- endfor %}

    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory(host);
        connectionFactory.setUsername(username);
        connectionFactory.setPassword(password);
        connectionFactory.setPort(port);
        return connectionFactory;
    }

    @Bean
    public AmqpAdmin amqpAdmin() {
        return new RabbitAdmin(connectionFactory());
    }

    @Bean
    public Declarables exchanges() {
        return new Declarables(
                {% for channelName, channel in asyncapi | publishChannels -%}
                new TopicExchange({{channel.publish().id()}}Exchange, true, false){% if not loop.last %},{% endif %}
                {% endfor -%}
            );
    }

    @Bean
    public Declarables queues() {
        return new Declarables(
                {% for channelName, channel in asyncapi | subscribeChannels -%}
                new Queue({{channel.subscribe().id()}}Queue, true, false, false){% if not loop.last %},{% endif %}
                {% endfor -%}
            );
    }

    // consumer

    @Autowired
    private MessageHandlerService messageHandlerService;
    {%- for channelName, channel in asyncapi | subscribeChannels %}

    @Bean
    public IntegrationFlow {{channel.subscribe().id() | camelCase}}Flow() {
        return IntegrationFlows.from(Amqp.inboundGateway(connectionFactory(), {{channel.subscribe().id()}}Queue))
                .handle(messageHandlerService::{{channel | handlerMethodName}})
                .get();
    }
    {% endfor %}

    // publisher

    @Bean
    public RabbitTemplate rabbitTemplate() {
        RabbitTemplate template = new RabbitTemplate(connectionFactory());
        return template;
    }
    {%- for channelName, channel in asyncapi | publishChannels %}

    @Bean
    public MessageChannel {{channel.publish().id() | camelCase}}OutboundChannel() {
        return new DirectChannel();
    }

    @Bean
    @ServiceActivator(inputChannel = "{{channel.publish().id() | camelCase}}OutboundChannel")
    public AmqpOutboundEndpoint {{channel.publish().id() | camelCase}}Outbound(AmqpTemplate amqpTemplate) {
        AmqpOutboundEndpoint outbound = new AmqpOutboundEndpoint(amqpTemplate);
        outbound.setExchangeName({{channel.publish().id() | camelCase}}Exchange);
        outbound.setRoutingKey("#");
        return outbound;
    }
    {%- endfor %}
}
{% endmacro %}
