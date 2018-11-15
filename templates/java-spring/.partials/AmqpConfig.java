package com.asyncapi.streetlights.infrastructure;

import com.asyncapi.streetlights.service.AmqpMessageHandler;
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

    @Value("${amqp.exchange.exchange1}")
    private String exchange1;

    @Value("${amqp.queue.somequeue}")
    private String someQueue;

    @Value("${amqp.queue.somequeue2}")
    private String someQueue2;

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
    public Declarables qs() {
        return new Declarables(
                new TopicExchange(exchange1, true, false),
                new Queue(someQueue, true, false, false),
                new Binding(someQueue, Binding.DestinationType.QUEUE, exchange1, "#", null),
                new Queue(someQueue2, true, false, false));
    }

    // consumer

    @Autowired
    AmqpMessageHandler amqpMessageHandler;

    @Bean
    public IntegrationFlow amqpInFlow1() {
        return IntegrationFlows.from(Amqp.inboundGateway(connectionFactory(), someQueue))
                .transform(p -> p + ", received from AMQP")
                .handle(amqpMessageHandler::handleMessage1)
                .get();
    }

    @Bean
    public IntegrationFlow amqpInFlow2() {
        return IntegrationFlows.from(Amqp.inboundGateway(connectionFactory(), someQueue2))
                .transform(p -> p + ", received from AMQP")
                .handle(amqpMessageHandler::handleMessage2)
                .get();
    }

    // publisher

    @Bean
    public MessageChannel amqpOutboundChannel() {
        return new DirectChannel();
    }

    @Bean
    public RabbitTemplate rabbitTemplate() {
        RabbitTemplate template = new RabbitTemplate(connectionFactory());
//        template.setMessageConverter(jsonMessageConverter());
        return template;
    }

    @Bean
    @ServiceActivator(inputChannel = "amqpOutboundChannel")
    public AmqpOutboundEndpoint amqpOutbound(AmqpTemplate amqpTemplate) {
        AmqpOutboundEndpoint outbound = new AmqpOutboundEndpoint(amqpTemplate);
        outbound.setExchangeName(exchange1);
        outbound.setRoutingKey("foo"); // default exchange - route to queue 'foo'
        return outbound;
    }

}
