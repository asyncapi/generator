package com.asyncapi.streetlights.service;

import com.asyncapi.streetlights.infrastructure.Bindings;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.stereotype.Component;

@Component
public class Handlers {

{{#each asyncapi.topics as |topic |}}
  {{#if topic.publish}}
    @StreamListener(Bindings.{{topic.publish.x-operation-id}})
    public void handle_{{topic.publish.x-operation-id}}(String message) {
        System.out.println("Received: " + message);
    }
{{/if}}
{{/each}}

}
