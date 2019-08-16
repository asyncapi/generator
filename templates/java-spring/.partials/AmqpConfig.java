{% macro amqpConfig(asyncapi) %}
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

    {% for topicName, topic in asyncapi.publishTopics %}
    @Value("${amqp.exchange.{{- topic.x-service-name -}}}")
    private String {{topic.x-service-name}}Exchange;

    {% endfor %}
    {% for topicName, topic in asyncapi.subscribeTopics %}
    @Value("${amqp.queue.{{- topic.x-service-name -}}}")
    private String {{topic.x-service-name}}Queue;

    {% endfor %}

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
                {% for topicName, topic in asyncapi.publishTopics %}
                new TopicExchange({{topic.x-service-name}}Exchange, true, false){% if not loop.last %},{% endif %}
                {% endfor %}
                );
    }

    @Bean
    public Declarables queues() {
        return new Declarables(
                {% for topicName, topic in asyncapi.subscribeTopics %}
                new Queue({{topic.x-service-name}}Queue, true, false, false){% if not loop.last %},{% endif %}
                {% endfor %}
                );
    }

    // consumer

    @Autowired
    MessageHandlerService messageHandlerService;
    {% for topicName, topic in asyncapi.subscribeTopics %}

    @Bean
    public IntegrationFlow {{topic.x-service-name | camelCase}}Flow() {
        return IntegrationFlows.from(Amqp.inboundGateway(connectionFactory(), {{topic.x-service-name}}Queue))
                .handle(messageHandlerService::handle{{topic.x-service-name | upperFirst}})
                .get();
    }
    {% endfor %}

    // publisher

    @Bean
    public RabbitTemplate rabbitTemplate() {
        RabbitTemplate template = new RabbitTemplate(connectionFactory());
        return template;
    }
    {% for topicName, topic in asyncapi.publishTopics %}

    @Bean
    public MessageChannel {{topic.x-service-name | camelCase}}OutboundChannel() {
        return new DirectChannel();
    }

    @Bean
    @ServiceActivator(inputChannel = "{{topic.x-service-name | camelCase}}OutboundChannel")
    public AmqpOutboundEndpoint {{topic.x-service-name | camelCase}}Outbound(AmqpTemplate amqpTemplate) {
        AmqpOutboundEndpoint outbound = new AmqpOutboundEndpoint(amqpTemplate);
        outbound.setExchangeName({{topic.x-service-name}}Exchange);
        outbound.setRoutingKey("#");
        return outbound;
    }
    {% endfor %}
}
{% endmacro %}
