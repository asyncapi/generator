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

    {{#each asyncapi.publishTopics as |topic key|}}
    @Value("${amqp.exchange.{{~topic.x-service-name~}}}")
    private String {{topic.x-service-name}}Exchange;

    {{/each}}
    {{#each asyncapi.subscribeTopics as |topic key|}}
    @Value("${amqp.queue.{{~topic.x-service-name~}}}")
    private String {{topic.x-service-name}}Queue;

    {{/each}}

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
                {{#each asyncapi.publishTopics as |topic key|}}
                new TopicExchange({{topic.x-service-name}}Exchange, true, false){{#unless @last}},{{/unless}}
                {{/each}}
                );
    }

    @Bean
    public Declarables queues() {
        return new Declarables(
                {{#each asyncapi.subscribeTopics as |topic key|}}
                new Queue({{topic.x-service-name}}Queue, true, false, false){{#unless @last}},{{/unless}}
                {{/each}}
                );
    }

    // consumer

    @Autowired
    MessageHandlerService messageHandlerService;
    {{#each asyncapi.subscribeTopics as |topic key|}}

    @Bean
    public IntegrationFlow {{camelCase topic.x-service-name}}Flow() {
        return IntegrationFlows.from(Amqp.inboundGateway(connectionFactory(), {{topic.x-service-name}}Queue))
                .handle(messageHandlerService::handle{{upperFirst topic.x-service-name}})
                .get();
    }
    {{/each}}

    // publisher

    @Bean
    public RabbitTemplate rabbitTemplate() {
        RabbitTemplate template = new RabbitTemplate(connectionFactory());
        return template;
    }
    {{#each asyncapi.publishTopics as |topic key|}}

    @Bean
    public MessageChannel {{camelCase topic.x-service-name}}OutboundChannel() {
        return new DirectChannel();
    }

    @Bean
    @ServiceActivator(inputChannel = "{{camelCase topic.x-service-name}}OutboundChannel")
    public AmqpOutboundEndpoint {{camelCase topic.x-service-name}}Outbound(AmqpTemplate amqpTemplate) {
        AmqpOutboundEndpoint outbound = new AmqpOutboundEndpoint(amqpTemplate);
        outbound.setExchangeName({{topic.x-service-name}}Exchange);
        outbound.setRoutingKey("#");
        return outbound;
    }
    {{/each}}
}
