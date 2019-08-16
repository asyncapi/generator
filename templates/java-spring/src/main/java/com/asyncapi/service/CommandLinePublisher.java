package com.asyncapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CommandLinePublisher implements CommandLineRunner {

    @Autowired
    PublisherService publisherService;

    @Override
    public void run(String... args) {
        System.out.println("******* Sending message: *******");

        {% for topicName, topic in asyncapi.topics %}
        {% if topic.publish %}
        publisherService.publish{{topic.x-service-name | capitalize}}("Hello World from {{topic.x-service-name}}");

        {% endif %}
        {% endfor %}
        System.out.println("Message sent");
    }
}
