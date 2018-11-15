package com.asyncapi.service;

import org.springframework.messaging.Message;
import org.springframework.stereotype.Service;

@Service
public class MessageHandlerService {

{{#each asyncapi.topics as |topic |}}
  {{#if topic.subscribe}}
    public void handle{{upperFirst topic.x-service-name}}(Message<?> message) {
        System.out.println("MQTT handler {{topic.x-service-name}}");
        System.out.println(message.getPayload());
    }
  {{/if}}

{{/each}}

}
