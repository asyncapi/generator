package com.asyncapi.service;

import com.asyncapi.infrastructure.Bindings;
import org.springframework.messaging.support.MessageBuilder;

public class MessagePublisher {

    private final Bindings bindings;


    public MessagePublisher(Bindings bindings) {
        this.bindings = bindings;
    }

  {{#each asyncapi.topics as |topic |}}
    {{#if topic.subscribe}}
    public void send{{capitalize topic.subscribe.x-operation-id}}(String message) {
        bindings.output{{capitalize topic.subscribe.x-operation-id}}().send(MessageBuilder.withPayload(message).build());
    }
    {{/if}}
  {{/each}}

}
