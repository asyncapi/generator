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

        
        System.out.println("Message sent");
    }
}
