package com.asyncapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MqttCommandLine implements CommandLineRunner {

    @Autowired
    MqttMyGateway myGateway;

    @Override
    public void run(String... args) {
        System.out.println("******* MQTT Sending message: *******");

        {{#each asyncapi.topics as |topic key|}}
        {{#if topic.publish}}
        myGateway.{{camelCase topic.publish.x-operation-id}}("Hello World from {{topic.publish.x-operation-id}}");

        {{/if}}
        {{/each}}
        System.out.println("MQTT Sent: Hello World");
    }
}
