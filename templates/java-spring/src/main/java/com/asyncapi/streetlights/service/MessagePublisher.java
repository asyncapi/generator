package com.asyncapi.streetlights.service;

import com.asyncapi.streetlights.infrastructure.Bindings;
import org.springframework.messaging.support.MessageBuilder;

public class MessagePublisher {

    private final Bindings bindings;


    public MessagePublisher(Bindings bindings) {
        this.bindings = bindings;
    }

  {{#each asyncapi.topics as |topic |}}
    {{#if topic.subscribe}}
    public void send{{topic.subscribe.x-operation-id}}(String message) {
        bindings.output{{topic.subscribe.x-operation-id}}().send(MessageBuilder.withPayload(message).build());
    }
    {{/if}}
  {{/each}}

}
